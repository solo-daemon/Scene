# Use the official Node.js 20.18.0 image as the base
FROM node:20.18.0

# Set the working directory to /app
WORKDIR /app

# Copy the package*.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Install the dependencies for development
RUN npm install
# Expose the port for the development server
EXPOSE 3000

# Set the command to run the development server
CMD ["npm", "run", "dev"]