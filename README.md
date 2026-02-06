# 🏋️ Fitness Tracker API

A comprehensive Django REST Framework-based Fitness Tracking API that allows users to track their daily activities, workouts, and manage their fitness profiles. This project includes JWT authentication, Swagger documentation, and a clean API structure.

![Django](https://img.shields.io/badge/Django-5.0-green)
![Python](https://img.shields.io/badge/Python-3.10-blue)
![REST Framework](https://img.shields.io/badge/DRF-3.14-orange)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Database Setup](#-database-setup)
- [Running the Server](#-running-the-server)
- [API Documentation](#-api-documentation)
- [API Endpoints](#-api-endpoints)
  - [Users](#users)
  - [Workouts](#workouts)
  - [Activities](#activities)
- [Authentication](#-authentication)
- [Media Files](#-media-files)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- 🔐 **User Authentication** - Custom user model with JWT support
- 👤 **Profile Management** - Users can manage their profiles with pictures and certifications
- 🏃 **Workout Tracking** - Create and manage workout routines with video/image support
- 📊 **Daily Activity Tracking** - Track time spent, sleep hours, and steps
- 📚 **API Documentation** - Interactive Swagger UI documentation
- 🎥 **Media Support** - Upload and serve workout videos and images
- 🔒 **Permission Control** - Role-based access to different endpoints
- 🌐 **CORS Support** - Cross-origin resource sharing enabled

---

## 🛠 Tech Stack

- **Backend Framework**: Django 5.0
- **REST API**: Django REST Framework 3.14
- **Authentication**: djangorestframework-simplejwt 5.3.0
- **Documentation**: drf-yasg (Swagger/OpenAPI)
- **Database**: SQLite3 (default), PostgreSQL support via dj-database-url
- **Image Processing**: Pillow 10.0+
- **Environment Management**: django-environ
- **CORS**: django-cors-headers
- **Server**: Gunicorn (production)

---

## 📁 Project Structure

```
fitness-tracker/
├── db.sqlite3                 # SQLite database file
├── manage.py                   # Django management script
├── requirements.txt            # Python dependencies
├── README.md                   # This file
├── fitness_traker/             # Main Django project configuration
│   ├── __init__.py
│   ├── settings.py            # Django settings
│   ├── urls.py                # Main URL routing
│   ├── asgi.py                # ASGI configuration
│   └── wsgi.py                # WSGI configuration
├── users/                      # Users application
│   ├── models.py              # Custom User model
│   ├── views.py               # User viewsets
│   ├── urls.py                # User API endpoints
│   ├── serializers.py         # User serializers
│   ├── admin.py               # Admin configuration
│   └── migrations/            # Database migrations
├── workout/                    # Workout application
│   ├── models.py              # Workout model
│   ├── views.py               # Workout viewsets
│   ├── urls.py                # Workout API endpoints
│   ├── serializers.py         # Workout serializers
│   ├── admin.py               # Admin configuration
│   └── migrations/            # Database migrations
├── activities/                 # Activities application
│   ├── models.py              # DailyActivity model
│   ├── views.py               # Activity viewsets
│   ├── urls.py                # Activity API endpoints
│   ├── serializers.py         # Activity serializers
│   ├── admin.py               # Admin configuration
│   └── migrations/            # Database migrations
├── templates/                  # HTML templates
│   └── index.html             # Main template
├── media/                      # User-uploaded files
│   ├── default.jpg
│   ├── images/                # Workout images
│   └── videos/                # Workout videos
└── static/                     # Static files (CSS, JS, etc.)
```

---

## 🚀 Installation

### Prerequisites

- Python 3.10 or higher
- pip (Python package manager)
- Virtual environment (recommended)

### Step-by-Step Installation

1. **Clone the repository** (if not already done):
```bash
git clone <repository-url>
cd fitness-tracker
```

2. **Create a virtual environment**:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**:
```bash
pip install -r requirements.txt
```

4. **Create .env file** (optional, for production):
```bash
cp .env.example .env
# Edit .env with your configuration
```

---

## ⚙️ Configuration

### Key Settings

The project uses `django-environ` for environment variable management. Key configurations in `settings.py`:

```python
# Security Settings
SECRET_KEY = 'your-secret-key-here'
DEBUG = True  # Set to False in production
ALLOWED_HOSTS = ['*']  # Configure for production

# Database Configuration
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Custom User Model
AUTH_USER_MODEL = 'users.User'

# REST Framework Configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}

# CORS Settings
CORS_ALLOW_ALL_ORIGINS = True

# Media Files
MEDIA_URL = 'media/'
MEDIA_ROOT = BASE_DIR / 'media'
```

### Environment Variables

Create a `.env` file in the project root:

```env
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
```

---

## 🗄️ Database Setup

1. **Run migrations**:
```bash
python manage.py migrate
```

2. **Create superuser** (admin access):
```bash
python manage.py createsuperuser
```

3. **Verify database**:
```bash
python manage.py showmigrations
```

---

## 🏃 Running the Server

### Development Server
```bash
python manage.py runserver
```

The server will start at `http://localhost:8000/`

### Production Server (using Gunicorn)
```bash
gunicorn fitness_traker.wsgi:application
```

---

## 📚 API Documentation

### Swagger UI
Access the interactive API documentation at:
```
http://localhost:8000/docs/
```

### ReDoc (Alternative Documentation)
```
http://localhost:8000/redoc/
```

---

## 🔗 API Endpoints

### 👥 Users

| Method | Endpoint | Description | Permissions |
|--------|----------|-------------|-------------|
| GET | `/users/user/` | List all users | Public |
| POST | `/users/user/` | Create new user | Public |
| GET | `/users/user/{id}/` | Get user details | Public |
| PUT | `/users/user/{id}/` | Update user | Authenticated |
| DELETE | `/users/user/{id}/` | Delete user | Authenticated |

#### User Model Fields:
```json
{
    "id": "integer",
    "username": "string (unique, max 10)",
    "email": "string (unique)",
    "password": "string (write-only)",
    "phonenumber": "string (max 10)",
    "first_name": "string (max 50)",
    "last_name": "string (max 50)",
    "bio": "text",
    "profile_picture": "image",
    "certification": "string (max 50)",
    "specialization": "string (max 50)",
    "is_staff": "boolean",
    "is_active": "boolean",
    "date_joined": "datetime"
}
```

---

### 🏋️ Workouts

| Method | Endpoint | Description | Permissions |
|--------|----------|-------------|-------------|
| GET | `/workouts/workout/` | List all workouts | Public |
| POST | `/workouts/workout/` | Create workout | Authenticated |
| GET | `/workouts/workout/{id}/` | Get workout details | Public |
| PUT | `/workouts/workout/{id}/` | Update workout | Authenticated |
| DELETE | `/workouts/workout/{id}/` | Delete workout | Authenticated |

#### Workout Model Fields:
```json
{
    "id": "integer",
    "name": "string (max 100)",
    "description": "text",
    "type": "choice ['beginner', 'intermediate']",
    "video_file": "file (optional)",
    "image": "image (optional)",
    "duration": "float (seconds)",
    "user": "integer (FK to User)",
    "created_at": "datetime",
    "updated_at": "datetime"
}
```

#### Workout Types:
- `beginner` - Beginner level workouts
- `intermediate` - Intermediate level workouts

---

### 📊 Daily Activities

| Method | Endpoint | Description | Permissions |
|--------|----------|-------------|-------------|
| GET | `/activities/activity/` | List all activities | Public |
| POST | `/activities/activity/` | Create activity | Public |
| GET | `/activities/activity/{id}/` | Get activity details | Public |
| PUT | `/activities/activity/{id}/` | Update activity | Public |
| DELETE | `/activities/activity/{id}/` | Delete activity | Public |

#### DailyActivity Model Fields:
```json
{
    "id": "integer",
    "user": "integer (FK to User)",
    "date": "date",
    "time_spent": "duration",
    "sleep_hours": "decimal (max 4 digits, 2 decimal places)",
    "steps_taken": "integer",
    "created_at": "datetime",
    "updated_at": "datetime"
}
```

---

## 🔐 Authentication

### JWT Authentication

This project uses `djangorestframework-simplejwt` for JWT authentication.

#### Obtain Token
```bash
POST /api/token/
Content-Type: application/json

{
    "username": "your_username",
    "password": "your_password"
}
```

#### Refresh Token
```bash
POST /api/token/refresh/
Content-Type: application/json

{
    "refresh": "your_refresh_token"
}
```

#### Using the Token

Include the token in the Authorization header:
```
Authorization: Bearer <your_access_token>
```

### Permission Classes

- **Workouts**: 
  - GET (list/retrieve): AllowAny
  - POST/PUT/DELETE: IsAuthenticated

- **Users & Activities**: AllowAny (configurable)

---

## 📁 Media Files

### Upload Directories

| Type | Directory | Settings |
|------|-----------|----------|
| Profile Pictures | `media/profile_pics/` | `profile_pics/` |
| Workout Images | `media/images/` | `images/` |
| Workout Videos | `media/videos/` | `videos/` |

### Serving Media Files

In development, media files are served automatically. For production, configure your web server (Nginx/Apache):

```nginx
location /media/ {
    alias /path/to/fitness-tracker/media/;
}
```

---

## 🧪 Testing

### Run Tests
```bash
python manage.py test
```

### Check Code Style
```bash
flake8
```

---

## 📦 Deployment

### Production Checklist

1. Set `DEBUG = False` in settings
2. Configure `ALLOWED_HOSTS`
3. Use a production database (PostgreSQL recommended)
4. Set up HTTPS/SSL
5. Configure static and media file serving
6. Set strong `SECRET_KEY`
7. Use environment variables for sensitive data

### Example Production Setup

```bash
# Install production dependencies
pip install gunicorn psycopg2-binary

# Run with Gunicorn
gunicorn fitness_traker.wsgi:application --bind 0.0.0.0:8000
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [drf-yasg Documentation](https://drf-yasg.readthedocs.io/)
- [Simple JWT](https://django-rest-framework-simplejwt.readthedocs.io/)

---

## 📞 Support

For support and questions, please open an issue in the repository.

---

**Happy Fitness Tracking! 🏃‍♂️💪
