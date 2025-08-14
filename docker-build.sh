#!/bin/bash

# Build script for Instituto Asa Docker image

echo "🐳 Building Instituto Asa Docker image..."

# Build the Docker image
docker build -t instituto-asa:latest .

echo "✅ Docker image built successfully!"
echo "📦 Image name: instituto-asa:latest"
echo ""
echo "To run the container:"
echo "docker run -p 3000:80 instituto-asa:latest"
echo ""
echo "To run with docker-compose:"
echo "docker-compose up -d"