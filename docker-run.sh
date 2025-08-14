#!/bin/bash

# Run script for Instituto Asa Docker container

echo "🚀 Starting Instituto Asa application..."

# Stop any existing container
docker stop instituto-asa 2>/dev/null || true
docker rm instituto-asa 2>/dev/null || true

# Run the new container
docker run -d \
  --name instituto-asa \
  -p 3000:80 \
  --restart unless-stopped \
  instituto-asa:latest

echo "✅ Application started successfully!"
echo "🌐 Access the application at: http://localhost:3000"
echo ""
echo "To check logs:"
echo "docker logs -f instituto-asa"
echo ""
echo "To stop the application:"
echo "docker stop instituto-asa"