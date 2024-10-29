#!/bin/sh
set -e

echo "Waiting for MongoDB to start..."
./wait-for db:27017 -t 120

echo "Waiting additional time for MongoDB to be ready..."
sleep 10

echo "Verifying MongoDB connection..."
max_retries=30
count=0
while [ $count -lt $max_retries ]; do
    if node db-check.js > /dev/null 2>&1; then
        echo "MongoDB is ready!"
        break
    fi
    count=$((count + 1))
    echo "Waiting for MongoDB to be fully ready... (Attempt $count/$max_retries)"
    sleep 2
done

if [ $count -eq $max_retries ]; then
    echo "Failed to connect to MongoDB after $max_retries attempts"
    exit 1
fi

echo "Running database migrations..."
if npm run db:up; then
    echo "Migrations completed successfully"
else
    echo "Migration failed!"
    exit 1
fi

echo "Starting the server..."
exec node index.js