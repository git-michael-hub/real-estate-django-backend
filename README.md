# Version Info

| Name   | Version         |
| ------ | --------------- |
| python | `Python 3.10.7` |
| pip    | `pip 24.2`      |
| node   | `v18.16.1`      |
| npm    | `9.5.1`         |

# Set-up and Configuration

`cd` to root folder of the project then create virtual environment for the packages.

```bash
python -m venv venv
```

Activate virtual environment with either:

```bash
source venv/Scripts/activate
```

or

```bash
source venv/bin/activate
```

Install dependencies for backend,

```bash
pip install -r requirements.txt
```

`cd` to backend and create `.env` file.

```bash
cd backend
touch .env
```

Configure the following attributes inside the `.env` file.

```
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

Run the backend server.

```bash
python manage.py runserver
```

In another terminal, install the dependencies for frontend and run the frontend server.

```bash
cd frontend
npm install
npm run dev
```
