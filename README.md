# LogSphere – Centralized Log Explorer

A web-based centralized log monitoring and analysis system that helps users upload, explore, search, filter, and visualize application log data through an interactive dashboard.

## 🌐 Live Demo

- **Frontend:** https://logsphere-centralized-log-explorer.vercel.app/
- **Backend API:** https://logsphere-backend-44qa.onrender.com
- **GitHub Repository:** https://github.com/dharanya07/logsphere-centralized-log-explorer

## 📌 Project Overview

LogSphere is a centralized log exploration platform designed to simplify application log monitoring and analysis.

Applications generate large amounts of log data. Manually checking multiple log files can be time-consuming and difficult.

LogSphere provides a single dashboard where users can upload log files, explore log records, identify errors, and understand system activity through visual statistics.

## 🎯 Project Objectives

- Provide centralized log monitoring.
- Simplify log file analysis.
- Identify different log severity levels.
- Allow users to search and filter log records.
- Display log statistics through interactive charts.
- Make log monitoring easier and more efficient.

## ✨ Features

- **Centralized Dashboard:** View important log statistics in one place.
- **Log File Upload:** Upload `.txt`, `.log`, and `.csv` files.
- **Log Explorer:** View and explore processed log records.
- **Search and Filtering:** Find specific log entries easily.
- **Severity Classification:** Categorize logs into INFO, WARNING, ERROR, CRITICAL, and DEBUG.
- **Statistics Cards:** Display total logs and severity counts.
- **Interactive Charts:** Visualize log distribution using pie charts and bar charts.
- **Auto Refresh:** Refresh displayed log information.
- **Docker Support:** Run application services using containers.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| Python | Backend programming |
| Flask | Backend API development |
| React.js | Frontend development |
| Vite | Frontend build tool |
| JavaScript | Application functionality |
| HTML5 | Page structure |
| CSS3 | User interface styling |
| Recharts | Data visualization |
| JSON | Log data storage |
| Docker | Containerization |
| Docker Compose | Multi-container management |
| Nginx | Frontend serving and API proxy |
| Git & GitHub | Version control |
| Render | Backend deployment |
| Vercel | Frontend deployment |

## 🏗️ System Architecture

```text
             USER
               |
               v
       REACT FRONTEND
         (Vite)
               |
               v
        FLASK REST API
               |
       +-------+-------+
       |       |       |
       v       v       v
    UPLOAD   SEARCH   STATS
       |       |       |
       +-------+-------+
               |
               v
         JSON STORAGE
               |
               v
       DASHBOARD RESULTS
        /           \
       v             v
   PIE CHART      BAR CHART
```

## 📂 Project Structure

```text
Centralized-Log-Explorer/
│
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── logs/
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── assets/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── .gitignore
└── README.md
```

*Note: The structure above is a representative overview. Adjust file names and folders if your actual repository differs.*

## ⚙️ Installation and Setup

### Prerequisites

Install the following tools:

- Python 3.12 or later
- Node.js and npm
- Git
- Docker Desktop (for containerized setup)

### 1. Clone the Repository

```bash
git clone https://github.com/dharanya07/logsphere
