#!/bin/sh

# Start the Flask app in the background
python app.py &

# Wait for the app to be ready
while ! curl -s http://localhost:5000/ > /dev/null; do
    echo "Waiting for app to be ready..."
    sleep 1
done

# Initialize the database
curl -s http://localhost:5000/createdb

# Keep the container running by following the app's output
tail -f /dev/null