const { Octokit } = require('@octokit/rest');
const fs = require('fs-extra');
const path = require('path');
const dotenv = require("dotenv");
dotenv.config();



const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

let REPO_FINAL_NAME;
// Function to generate a unique repository name
const generateUniqueRepoName = (baseName) => {
  const timestamp = new Date().toISOString().replace(/[:.-]/g, ''); // Remove colons, periods, and dashes
  return `${baseName}_${timestamp}`;
};


const createRepo = async (repoName) => {
  console.log("creating repo", repoName);
  console.log("token is", process.env.GITHUB_TOKEN)
  const { data } = await octokit.repos.createForAuthenticatedUser({
    name: repoName,
    private: false,
  });
  return data;
};

const MakeRepository = async () => {
  try {
    const REPO_NAME = await generateUniqueRepoName('BACKENDBUDDY');
    // REPO_FINAL_NAME=REPO_NAME;
    const repoData = await createRepo(REPO_NAME);
    console.log('Repository created:', repoData);
    return {repoName:REPO_NAME,githubUrl:repoData.html_url};
  } catch (error) {
    console.error('Error:', error);
  }
};

module.exports = { MakeRepository, REPO_FINAL_NAME };
