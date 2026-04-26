#  To-Do App — React + Django

A simple full-stack To-Do application with a React (Vite) frontend and Django REST API backend.

---

##  Project Structure

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

##  Quick Start

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

 API is live at: **http://localhost:8000/api/todos/**
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

 App is live at: **http://localhost:3000**

---

## 🔌 API Endpoints

All `/api/todos/` endpoints require a token in the `Authorization` header:

```
Authorization: Token <your-token>
```

### Auth

| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/auth/register/` | Create an account, returns `{ token, username }` |
| POST | `/api/auth/login/` | Exchange credentials for a token |
| POST | `/api/auth/logout/` | Invalidate the caller's token |

### Todos (per-user, scoped by token)

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/todos/` | List the authenticated user's todos |
| POST | `/api/todos/` | Create a new todo |
| GET | `/api/todos/{id}/` | Get a single todo |
| PATCH | `/api/todos/{id}/` | Partial update (e.g. toggle `completed`) |
| PUT | `/api/todos/{id}/` | Full update |
| DELETE | `/api/todos/{id}/` | Delete a todo |

### Example: register → create todo

```bash
# 1. Register and capture the token
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"alicepass123"}' \
  | python3 -c "import json,sys; print(json.load(sys.stdin)['token'])")

# 2. Use it on the protected endpoints
curl -X POST http://localhost:8000/api/todos/ \
  -H "Authorization: Token $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy groceries"}'
```

---

## 🧪 Postman

A ready-to-import collection lives at [`postman_collection.json`](postman_collection.json).

1. In Postman: **Import** → select `postman_collection.json`.
2. Run **Auth → Register** (or **Login**). The test script auto-captures the returned `token` into a collection variable.
3. All other requests reuse that token via the collection-level `Authorization` header — run them in any order.
4. **Todos → Create todo** also auto-captures the new `id` into `{{todo_id}}`, so the retrieve / update / delete requests work without manual edits.

---

##  Features

- ✅ Token-based authentication (register / login / logout)
- ✅ Per-user todos — every request is scoped to the authenticated user via a `User → Todo` foreign key
- ✅ Add tasks (press Enter or click Add)
- ✅ Mark tasks complete / incomplete
- ✅ Delete tasks
- ✅ Live progress counter
- ✅ Postman collection for endpoint validation
- ✅ Clean dark UI

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite |
| Backend | Django 4, Django REST Framework |
| Auth | DRF `TokenAuthentication` (`rest_framework.authtoken`) |
| Database | SQLite (built-in, no setup needed) |
| CORS | django-cors-headers |
