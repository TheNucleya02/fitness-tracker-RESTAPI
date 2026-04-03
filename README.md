# 🍃 CorpWellness — Corporate Fitness Tracker

> A full-stack corporate wellness platform that helps employees log daily activity, track personal stats, compete on a company-wide leaderboard, and access company-approved workout plans.

**Frontend** → Deployed on [Netlify](corpwell.netlify.app) &nbsp;|&nbsp; **Backend API** → Deployed on [Render]([https://render.com](https://fitness-tracker-restapi.onrender.com/docs/))

---

## 📸 Overview

CorpWellness is a split-architecture web application:

- **Frontend** — Pure HTML, CSS, and vanilla JavaScript served as static files via Netlify
- **Backend** — Django REST Framework API with JWT authentication, backed by PostgreSQL

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure login & registration with access/refresh tokens
- 📊 **Daily Activity Logging** — Log steps taken, sleep hours, and active time per day
- 🏆 **Company Leaderboard** — See how you rank against colleagues by total steps
- 🏋️ **Workout Library** — Browse company-approved beginner & intermediate workouts
- 📄 **Swagger API Docs** — Auto-generated interactive API documentation at `/docs/`
- 🌐 **CORS-configured** — Properly scoped to your Netlify frontend domain

---

## 🗂️ Project Structure

```
fitness-tracker/
├── frontend/               # Static frontend (deployed to Netlify)
│   ├── index.html          # Main dashboard
│   ├── login.html          # Login & registration page
│   ├── style.css           # Global styles
│   └── app.js              # All frontend logic (auth, API calls, UI)
│
├── users/                  # Custom User app
│   ├── models.py           # Custom User model (email-based auth)
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
│
├── activities/             # Daily Activity tracking app
│   ├── models.py           # DailyActivity model (steps, sleep, active time)
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
│
├── workout/                # Workout library app
│   ├── models.py           # Workout model (name, type, video, image)
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
│
├── fitness_traker/         # Django project config
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
│
├── requirements.txt
├── manage.py
└── .env                    # Local environment variables (not committed)
```

---

## 🔌 API Endpoints

Base URL: `https://https://fitness-tracker-restapi.onrender.com/docs/`

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/token/` | Obtain JWT access & refresh tokens |
| `POST` | `/api/token/refresh/` | Refresh an expired access token |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/users/user/` | List all users |
| `POST` | `/users/user/` | Register a new user |
| `PUT` | `/users/user/` | Update user profile |
| `GET` | `/users/user/<id>/` | Retrieve a specific user |
| `DELETE` | `/users/user/<id>/` | Delete a user |

### Activities
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/activities/activity/` | List all activities |
| `POST` | `/activities/activity/` | Log a new daily activity |
| `PUT` | `/activities/activity/` | Update an activity |
| `GET` | `/activities/activity/<id>/` | Retrieve a specific activity |
| `DELETE` | `/activities/activity/<id>/` | Delete an activity |

### Workouts
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/workouts/workout/` | List all workouts |
| `POST` | `/workouts/workout/` | Create a new workout |
| `GET` | `/workouts/workout/<id>/` | Retrieve a specific workout |
| `DELETE` | `/workouts/workout/<id>/` | Delete a workout |

### Docs
| Endpoint | Description |
|----------|-------------|
| `/docs/` | Swagger UI — interactive API documentation |
| `/admin/` | Django admin panel |

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Django 5.x | Web framework |
| Django REST Framework | API layer |
| Simple JWT | JWT-based authentication |
| drf-yasg | Swagger/OpenAPI documentation |
| django-cors-headers | CORS management |
| WhiteNoise | Static file serving |
| PostgreSQL | Production database |
| dj-database-url | Database URL parsing |
| Gunicorn | WSGI production server |

### Frontend
| Technology | Purpose |
|------------|---------|
| HTML5 | Structure |
| Vanilla CSS | Styling (glassmorphism dark theme) |
| Vanilla JavaScript | API calls, auth, dynamic UI |

### Deployment
| Service | What it hosts |
|---------|--------------|
| Netlify | Frontend static files |
| Render | Django REST API |
| PostgreSQL (Render) | Production database |

---

## ⚙️ Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/fitness-tracker.git
cd fitness-tracker
```

### 2. Create and activate a virtual environment
```bash
python -m venv venv
source venv/bin/activate        # macOS/Linux
venv\Scripts\activate           # Windows
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Set up environment variables

Create a `.env` file in the project root:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=                    # Leave blank to use local SQLite
FRONTEND_URL=                    # Leave blank to allow all origins locally
```

### 5. Run migrations and start the server
```bash
python manage.py migrate
python manage.py createsuperuser  # optional
python manage.py runserver
```

The API will be available at `http://127.0.0.1:8000`.

### 6. Run the frontend locally

Open `frontend/login.html` directly in your browser, or serve it with any static server:

```bash
cd frontend
npx serve .
```

---

## 🚀 Deployment

### Backend — Render

1. Connect your GitHub repo to [Render](https://render.com)
2. Create a new **Web Service** with the following settings:
   - **Build Command:** `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
   - **Start Command:** `gunicorn fitness_traker.wsgi:application`
3. Add the following environment variables in Render's dashboard:

| Key | Value |
|-----|-------|
| `SECRET_KEY` | Your Django secret key |
| `DEBUG` | `False` |
| `ALLOWED_HOSTS` | `your-render-domain.onrender.com` |
| `DATABASE_URL` | Your PostgreSQL connection string |
| `FRONTEND_URL` | `https://your-app.netlify.app` |

### Frontend — Netlify

1. Connect your GitHub repo to [Netlify](https://netlify.com)
2. Set **Publish directory** to `frontend`
3. No build command needed — it's pure static HTML
4. Deploy!

> Make sure the `API_BASE_URL` constant in `frontend/app.js` points to your live Render URL.

---

## 🔒 Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `SECRET_KEY` | ✅ | Django secret key |
| `DEBUG` | ✅ | `True` for dev, `False` for production |
| `ALLOWED_HOSTS` | ✅ | Comma-separated list of allowed hosts |
| `DATABASE_URL` | ✅ (prod) | PostgreSQL connection string |
| `FRONTEND_URL` | ✅ (prod) | Your Netlify app URL (for CORS) |

---

## 📋 Data Models

### `User`
- `username` (max 10 chars, unique)
- `email` (unique, used for login)
- `first_name`, `last_name`
- `phonenumber`
- `bio`, `profile_picture`
- `certification`, `specialization`

### `DailyActivity`
- `user` → FK to User
- `date`
- `steps_taken`
- `sleep_hours`
- `time_spent` (active duration)

### `Workout`
- `name`, `description`
- `type` → `beginner` or `intermediate`
- `video_file`, `image`
- `duration` (in seconds)
- `user` → FK to trainer/creator

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">Built with 💚 for healthier workplaces</p>
