#!/bin/bash

# Define variables
REPO_NAME="TESTING_PREET_27"
GITHUB_TOKEN="your_github_token_here"
UPLOAD_FOLDER="../downloads"  # Adjust as per your folder structure

# Navigate to the project directory
cd C:\Users\Rutwik\Desktop\New folder\Dev\Backend-template-generator\Project_Service\controller

# Initialize Git repository if not already initialized
if [ ! -d ".git" ]; then
    git init
fi

# Add all files in UPLOAD_FOLDER
git add $UPLOAD_FOLDER/*

# Commit changes with a message
git commit -m "Initial commit"

# Add remote origin (replace with your GitHub repository URL)
git remote add origin https://github.com/your_username/$REPO_NAME.git

# Push to GitHub (using your GitHub token for authentication)
git push -u origin main  # Adjust branch name if needed (e.g., master)

echo "Files pushed to GitHub successfully"
