# Use the official Node.js image as the base image
FROM node:current-alpine3.20

# Install Git
RUN apk update && \
    apk add --no-cache git

# Set the working directory inside the container
WORKDIR /usr/src/app



    
# Copy the rest of the application code to the working directory
COPY . .

RUN git config --global user.email "backendbuddy07@gmail.com" && \
    git config --global user.name "BackendBuddy07"

RUN npm install
# Expose the port the app runs on
EXPOSE 8002

# Define environment variables (these can also be set in docker-compose.yml)
ENV NODE_ENV=production

# Command to run the application
CMD ["node", "app.js"]
