# 📝 To-Do App — React + Django

A simple full-stack To-Do application with a React (Vite) frontend and Django REST API backend.

---

## 📁 Project Structure

```
todo-app/
├── todo-app.code-workspace   ← Open this in VS Code!
├── README.md
│
├── backend/                  ← Django project
│   ├── manage.py
│   ├── requirements.txt
│   ├── backend/              ← Django config
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   └── todos/                ← Django app
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       ├── urls.py
│       └── admin.py
│
└── frontend/                 ← React (Vite) project
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── index.css
        ├── App.jsx
        └── App.css
```

---

## 🚀 Quick Start

### Step 1 — Open in VS Code
Double-click `todo-app.code-workspace` or run:
```bash
code todo-app.code-workspace
```

---

### Step 2 — Set up Django Backend

Open a terminal in the `backend/` folder:

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
source venv/bin/activate        # Mac/Linux
# venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# (Optional) Create admin user
python manage.py createsuperuser

# Start Django server
python manage.py runserver
```

✅ API is live at: **http://localhost:8000/api/todos/**
🔧 Admin panel at: **http://localhost:8000/admin/**

---

### Step 3 — Set up React Frontend

Open a **new terminal** in the `frontend/` folder:

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

✅ App is live at: **http://localhost:3000**

---

## 🔌 API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/todos/` | List all todos |
| POST | `/api/todos/` | Create a new todo |
| GET | `/api/todos/{id}/` | Get a single todo |
| PATCH | `/api/todos/{id}/` | Update (toggle) a todo |
| DELETE | `/api/todos/{id}/` | Delete a todo |

### Example POST body:
```json
{
  "title": "Buy groceries",
  "completed": false
}
```

---

## ✨ Features

- ✅ Add tasks (press Enter or click Add)
- ✅ Mark tasks complete / incomplete
- ✅ Delete tasks
- ✅ Live progress counter
- ✅ Error handling if backend is offline
- ✅ Clean dark UI

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite |
| Backend | Django 4, Django REST Framework |
| Database | SQLite (built-in, no setup needed) |
| CORS | django-cors-headers |
