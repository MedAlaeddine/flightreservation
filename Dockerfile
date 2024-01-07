# Use an official Node.js runtime as a base image
FROM node:21-bookworm-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Bundle the source code inside the Docker image
COPY . .

# Make port 50052 available outside this container
EXPOSE 50052

# Run flightMicroService.js when the container launches
CMD ["node", "microservices/flightMicroService.js"]