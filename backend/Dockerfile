# syntax=docker/dockerfile:1
FROM python:3.10

WORKDIR /app/prreviewer

# Install pipenv
RUN pip install pipenv

# Copy Pipfile and Pipfile.lock from backend dir (where Dockerfile is)
COPY Pipfile Pipfile.lock /app/

# Install dependencies using Pipenv
RUN pipenv install --deploy --ignore-pipfile

# Copy your Django project
COPY . .

# Set default command to run the Django dev server
CMD ["pipenv", "run", "python", "prreviewer/manage.py", "runserver", "0.0.0.0:8000"]
