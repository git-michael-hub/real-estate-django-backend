// CLONE THE REPOSITORY:

git clone --single-branch --branch authentication https://github.com/git-michael-hub/real-estate-django-backend.git

// CD TO ROOT FOLDER OF PROJECT

// CREATE VIRTUAL ENVIRONMENT FOR PACKAGES

python -m venv venv

source venv/Scripts/activate

// INSTALL DEPENDENCIES FOR BACKEND

pip install -r requirements.txt

// CD TO BACKEND AND CREATE A .env FILE

cd backend

touch .env

// CONFIGURE THE FOLLOWING ATTRIBUTES INSIDE THE .env

DEBUG=

SECRET_KEY=

ALLOWED_HOSTS=

CORS_ALLOWED_ORIGINS=

EMAIL_HOST=

EMAIL_PORT=

EMAIL_HOST_USER=

EMAIL_HOST_PASSWORD=

EMAIL_USE_TLS=

// RUN THE BACKEND SERVER AND CD BACK TO MAIN FOLDER

python manage.py runserver

cd ..

// INSTALL DEPENDENCIES FOR FRONTEND AND RUN FRONTEND SERVER

cd frontend

npm install

npm run dev
