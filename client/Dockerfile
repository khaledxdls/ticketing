# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json .

# Install dependencies
RUN npm install

# Copy application code
COPY . .


# Start application
CMD ["npm", "run", "dev"]