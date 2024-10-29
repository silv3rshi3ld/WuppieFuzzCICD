#!/bin/sh
set -e

echo "Making scripts executable..."
chmod +x ./wait-for

echo "Waiting for MongoDB to start..."
./wait-for db:27017 -t 60

echo "Waiting additional time for MongoDB to be ready..."
sleep 5

echo "Migrating the database..."
npm run db:up

echo "Waiting for migrations to complete..."
sleep 5

echo "Starting the server..."
npm start