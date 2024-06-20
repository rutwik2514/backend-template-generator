# Use the official Node.js image as the base image
FROM node:current-alpine3.20


# Set the working directory inside the container
WORKDIR /usr/src/app




# Copy the rest of the application code to the working directory
COPY . .

RUN npm install
# Expose the port the app runs on
EXPOSE 8003

# Define environment variables (these can also be set in docker-compose.yml)
ENV NODE_ENV=production

# Command to run the application
CMD ["node", "app.js"]
