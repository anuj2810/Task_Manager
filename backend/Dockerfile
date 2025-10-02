FROM python:3.13-slim
WORKDIR /app
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt
COPY . /app
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8000"]