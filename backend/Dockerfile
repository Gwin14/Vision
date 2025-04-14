# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y gcc

COPY requirements.txt ./

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copia o restante do código (será sobrescrito pelo volume no compose)
COPY . .

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
