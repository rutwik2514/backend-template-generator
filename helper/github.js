const { Octokit } = require('@octokit/rest');
const fs = require('fs-extra');
const path = require('path');
const dotenv = require("dotenv");


dotenv.config();

const REPO_NAME = 'TESTING_PREET_28';
const UPLOAD_FOLDER = path.resolve(__dirname, '../downloads');
// const GITHUB_TOKEN = "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"
console.log("token is", process.env.GITHUB_TOKEN);
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const createRepo = async (repoName) => {
  const { data } = await octokit.repos.createForAuthenticatedUser({
    name: repoName,
    private: true,
  });
  return data;
};

const uploadFile = async (owner, repo, filePath, content) => {
  const response = await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: filePath.replace(/\\/g, '/'),
    message: `Add ${filePath}`,
    content: Buffer.from(content).toString('base64'),
  });
  return response.data;
};

const uploadFolder = async (owner, repo, folderPath, parentDir = '') => {
  const files = await fs.readdir(folderPath);
  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const fileStat = await fs.stat(filePath);
    if (fileStat.isDirectory()) {
      await uploadFolder(owner, repo, filePath, path.join(parentDir, file));
    } else {
      const content = await fs.readFile(filePath);
      const relativePath = path.join(parentDir, file).replace(/\\/g, '/');
      await uploadFile(owner, repo, relativePath, content);
    }
  }
};

const MakeRepository = async () => {
  try {
    const repoData = await createRepo(REPO_NAME);
    console.log('Repository created:', repoData);
    // const owner = repoData.owner.login;
    // const repo = repoData.name;
    // await uploadFolder(owner, repo, UPLOAD_FOLDER);
    // console.log('Project uploaded successfully');
    return repoData.html_url
  } catch (error) {
    console.error('Error:', error);
  }
};

module.exports = { MakeRepository };