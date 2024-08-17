Clone the repository:

```bash
git clone --single-branch --branch authentication https://github.com/git-michael-hub/real-estate-django-backend.git
```

CD to root folder of the project
Then create virtual environment for packages

```bash
python -m venv venv
source venv/Scripts/activate
```

Install dependencies for backend

```bash
pip install -r requirements.txt
```

CD to backend and create .env file

```bash
cd backend
touch .env
```

Configure the following attributes inside .env

```bash
DEBUG=

SECRET_KEY=

ALLOWED_HOSTS=

CORS_ALLOWED_ORIGINS=

EMAIL_HOST=

EMAIL_PORT=

EMAIL_HOST_USER=

EMAIL_HOST_PASSWORD=

EMAIL_USE_TLS=
```

Run the backend server

```bash
python manage.py runserver
```

In another terminal,
Install the dependencies for frontend and run the frontend server

```bash
cd frontend
npm install
npm run dev
```
