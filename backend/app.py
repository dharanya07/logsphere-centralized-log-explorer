
import os
import json
import csv
import re
from io import StringIO
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LOG_FILE = os.path.join(BASE_DIR, "logs.json")

ALLOWED_EXTENSIONS = {"txt", "log", "csv"}

LOG_LEVELS = ["CRITICAL", "ERROR", "WARNING", "INFO", "DEBUG"]

# Initial sample records
SAMPLE_LOGS = [
    {"id": 1, "level": "ERROR", "service": "Payment Service",
     "source": "payment.py", "message": "Payment gateway connection failed",
     "time": "09:30:00", "timestamp": ""},
    {"id": 2, "level": "WARNING", "service": "User Service",
     "source": "user.py", "message": "User login attempts exceeded",
     "time": "09:32:00", "timestamp": ""},
    {"id": 3, "level": "INFO", "service": "Authentication",
     "source": "auth.py", "message": "User logged in successfully",
     "time": "09:35:00", "timestamp": ""},
    {"id": 4, "level": "CRITICAL", "service": "Payment Service",
     "source": "payment.py", "message": "Database connection lost",
     "time": "09:38:00", "timestamp": ""},
    {"id": 5, "level": "INFO", "service": "Notification Service",
     "source": "notify.py", "message": "Notification sent successfully",
     "time": "09:40:00", "timestamp": ""},
    {"id": 6, "level": "ERROR", "service": "Authentication",
     "source": "auth.py", "message": "Invalid authentication token",
     "time": "09:42:00", "timestamp": ""},
    {"id": 7, "level": "WARNING", "service": "User Service",
     "source": "user.py", "message": "High memory usage detected",
     "time": "09:45:00", "timestamp": ""},
    {"id": 8, "level": "INFO", "service": "Payment Service",
     "source": "payment.py", "message": "Payment processed successfully",
     "time": "09:48:00", "timestamp": ""}
]


def save_logs(logs):
    """Save all logs to the JSON file."""
    with open(LOG_FILE, "w", encoding="utf-8") as file:
        json.dump(logs, file, indent=4)


def load_logs():
    """Load existing logs without losing uploaded records."""

    if not os.path.exists(LOG_FILE):
        save_logs(SAMPLE_LOGS)
        return SAMPLE_LOGS.copy()

    try:
        with open(LOG_FILE, "r", encoding="utf-8") as file:
            data = json.load(file)

        if isinstance(data, dict):
            logs = data.get("logs", [])
        elif isinstance(data, list):
            logs = data
        else:
            logs = []

        # Remove the accidentally imported CSV header record.
        cleaned_logs = [
            log for log in logs
            if not (
                str(log.get("message", "")).strip().lower()
                == "level,service,source,message"
                and str(log.get("source", "")).lower().endswith(".csv")
            )
        ]

        if len(cleaned_logs) != len(logs):
            save_logs(cleaned_logs)

        return cleaned_logs

    except (json.JSONDecodeError, OSError):
        print("Warning: Could not read logs.json")
        return []


logs = load_logs()


def get_next_id():
    """Generate the next unique log ID."""
    if not logs:
        return 1

    return max(int(log.get("id", 0)) for log in logs) + 1


def allowed_file(filename):
    """Check supported file extensions."""
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
    )


def detect_level(message):
    """Detect severity from the beginning of a log message."""

    match = re.match(
        r"^\s*(CRITICAL|ERROR|WARNING|INFO|DEBUG)\b",
        message,
        re.IGNORECASE
    )

    if match:
        return match.group(1).upper()

    return "INFO"


def create_log(level, service, source, message, time_value=""):
    """Create a standard log record."""

    current_time = datetime.now().strftime("%H:%M:%S")

    return {
        "id": get_next_id(),
        "level": level.upper(),
        "service": service,
        "source": source,
        "message": message,
        "time": time_value or current_time,
        "timestamp": ""
    }


def process_text_file(content, filename):
    """Process TXT and LOG files."""

    new_logs = []

    for line in content.splitlines():
        line = line.strip()

        if not line:
            continue

        level = detect_level(line)

        new_logs.append(
            create_log(
                level=level,
                service=filename,
                source=filename,
                message=line
            )
        )

    return new_logs


def process_csv_file(content, filename):
    """Process CSV files while skipping their header row."""

    new_logs = []

    reader = csv.DictReader(StringIO(content))

    if not reader.fieldnames:
        return new_logs

    # Normalize column names.
    field_map = {
        str(field).strip().lower(): field
        for field in reader.fieldnames
        if field is not None
    }

    # Check whether the CSV contains recognizable headers.
    has_headers = any(
        name in field_map
        for name in ["level", "message", "service", "source"]
    )

    if not has_headers:
        return process_text_file(content, filename)

    for row in reader:
        normalized = {
            str(key).strip().lower(): value
            for key, value in row.items()
            if key is not None
        }

        message = str(normalized.get("message") or "").strip()

        if not message:
            continue

        level = str(
            normalized.get("level") or detect_level(message)
        ).strip().upper()

        if level not in LOG_LEVELS:
            level = detect_level(message)

        service = str(
            normalized.get("service") or filename
        ).strip()

        source = str(
            normalized.get("source") or filename
        ).strip()

        time_value = str(
            normalized.get("time")
            or normalized.get("timestamp")
            or ""
        ).strip()

        new_logs.append(
            create_log(
                level=level,
                service=service,
                source=source,
                message=message,
                time_value=time_value
            )
        )

    return new_logs


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "LogSphere Backend is running",
        "status": "online",
        "version": "1.0.0"
    })


@app.route("/api/logs", methods=["GET"])
def get_logs():
    """Retrieve logs with optional severity and search filters."""

    level = request.args.get("level", "ALL").upper()
    search = request.args.get("search", "").lower()

    filtered_logs = logs.copy()

    if level != "ALL":
        filtered_logs = [
            log for log in filtered_logs
            if log.get("level", "").upper() == level
        ]

    if search:
        filtered_logs = [
            log for log in filtered_logs
            if search in " ".join([
                str(log.get("level", "")),
                str(log.get("service", "")),
                str(log.get("source", "")),
                str(log.get("message", ""))
            ]).lower()
        ]

    return jsonify({
        "count": len(filtered_logs),
        "logs": filtered_logs
    })


@app.route("/api/stats", methods=["GET"])
def get_stats():
    """Return dashboard statistics."""

    return jsonify({
        "total": len(logs),
        "error": sum(1 for log in logs if log.get("level") == "ERROR"),
        "critical": sum(1 for log in logs if log.get("level") == "CRITICAL"),
        "warning": sum(1 for log in logs if log.get("level") == "WARNING"),
        "info": sum(1 for log in logs if log.get("level") == "INFO"),
        "debug": sum(1 for log in logs if log.get("level") == "DEBUG")
    })


@app.route("/api/upload", methods=["POST"])
def upload_logs():
    """Upload and process TXT, LOG, or CSV files."""

    global logs

    if "file" not in request.files:
        return jsonify({
            "error": "No file selected"
        }), 400

    uploaded_file = request.files["file"]

    if not uploaded_file.filename:
        return jsonify({
            "error": "Please select a file"
        }), 400

    filename = secure_filename(uploaded_file.filename)

    if not allowed_file(filename):
        return jsonify({
            "error": "Only TXT, LOG, and CSV files are supported"
        }), 400

    try:
        content = uploaded_file.read().decode("utf-8-sig")

        if not content.strip():
            return jsonify({
                "error": "The uploaded file is empty"
            }), 400

        extension = filename.rsplit(".", 1)[1].lower()

        if extension == "csv":
            new_logs = process_csv_file(content, filename)
        else:
            new_logs = process_text_file(content, filename)

        if not new_logs:
            return jsonify({
                "error": "No valid log records found in the file"
            }), 400

        logs.extend(new_logs)
        save_logs(logs)

        return jsonify({
            "message": "Logs uploaded successfully",
            "uploaded": len(new_logs),
            "total": len(logs),
            "logs": new_logs
        }), 200

    except UnicodeDecodeError:
        return jsonify({
            "error": "File must use UTF-8 text encoding"
        }), 400

    except Exception as error:
        return jsonify({
            "error": str(error)
        }), 500


@app.route("/api/logs", methods=["DELETE"])
def clear_logs():
    """Delete all stored log records."""

    global logs

    logs = []
    save_logs(logs)

    return jsonify({
        "message": "All logs cleared successfully",
        "total": 0
    })


if __name__ == "__main__":
    print("Starting LogSphere Backend")
    print("Server: http://localhost:5000")
    print("API: http://localhost:5000/api/logs")

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=False
    )
