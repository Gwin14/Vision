from pathlib import Path
import environ

# Inicializando o django-environ
env = environ.Env()
environ.Env.read_env()  # Lê o arquivo .env

# Configurações do Notion
NOTION_CLIENT_ID = env.str("NOTION_CLIENT_ID")
NOTION_CLIENT_SECRET = env.str("NOTION_CLIENT_SECRET")
NOTION_REDIRECT_URI = env.str("NOTION_REDIRECT_URI")

# settings.py
MICROSOFT_AUTH = {
    'CLIENT_ID': env.str("MICROSOFT_CLIENT_ID"),
    'CLIENT_SECRET': env.str("MICROSOFT_CLIENT_SECRET"),
    'REDIRECT_URI': env.str("MICROSOFT_REDIRECT_URI"),
    'SCOPES': ['User.Read', 'Files.Read'],
    'AUTHORITY': 'https://login.microsoftonline.com/common'
}

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env.str("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["*"]

CORS_ALLOW_CREDENTIALS = True  # Permite credenciais (cookies, autenticação)
CORS_ALLOW_ALL_ORIGINS = True

# Ou, se precisar permitir múltiplas portas locais para testes:
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^http://localhost:\d+$",
]

# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "notionoauth",
    "microsoftauth",
    'rest_framework',
    'drf_spectacular',
    'drf_spectacular_sidecar',  # Opcional, para incluir o Swagger UI
    'corsheaders',  # Add this line
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# CORS settings
CORS_ALLOW_ALL_ORIGINS = True  # Allow all origins for development

ROOT_URLCONF = "backend.urls"

REST_FRAMEWORK = {
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

SPECTACULAR_SETTINGS = {
    'TITLE': 'Meu Projeto Django',
    'DESCRIPTION': 'API do meu projeto Django com documentação Swagger.',
    'VERSION': '1.0.0',
   # 'SERVE_INCLUDE_SCHEMA': False,  # Evita expor o schema diretamente
}

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "backend.wsgi.application"

# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": env.str("DATABASE_NAME"),
    }
}

# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = "static/"

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
