# Use an official Node.js runtime as a parent image
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /app


# Install dependencies

# Copy the remaining frontend application code to the working directory
COPY . .

RUN npm install


# Build the React app for production
RUN npm run build

# Expose port 80 to the outside world
EXPOSE 3000

# Set environment variable to indicate production mode (optional)
ENV NODE_ENV=production

# Command to run the production server
CMD ["npm", "start"]
