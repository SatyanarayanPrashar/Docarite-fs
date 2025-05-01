# Use official Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install pipenv
RUN pip install pipenv

# Copy Pipenv files
COPY Pipfile Pipfile.lock ./

# Install dependencies
RUN pipenv install --deploy --system

# Copy rest of the code
COPY . .

# Set environment variables (if needed)
ENV PYTHONUNBUFFERED=1

# Run uvicorn app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
