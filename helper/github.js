const { Octokit } = require('@octokit/rest');
const fs = require('fs-extra');
const path = require('path');
const dotenv = require("dotenv");
dotenv.config();

const REPO_NAME = 'FINAL_TEST_YOU';
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const createRepo = async (repoName) => {
  console.log("creating repo", repoName);
  const { data } = await octokit.repos.createForAuthenticatedUser({
    name: repoName,
    private: false,
  });
  return data;
};


const MakeRepository = async () => {
  try {
    const repoData = await createRepo(REPO_NAME);
    console.log('Repository created:', repoData);
    return repoData.html_url
  } catch (error) {
    console.error('Error:', error);
  }
};

module.exports = { MakeRepository, REPO_NAME };