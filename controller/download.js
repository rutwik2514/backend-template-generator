
const downloadProject = async (req, res) => {
    try {
        // Your existing code to fetch schemas, roles, and generate files

        // Create GitHub repository and get repository URL
        const repositoryUrl = await MakeRepository();

        // Execute Git commands using child_process
        const projectDirectory = '/absolute/path/to/your/project/directory'; // Adjust this path
        const gitCommands = [
            `cd ${projectDirectory}`,
            'git init',
            `git add ../downloads/*`,
            'git commit -m "Initial commit"',
            `git remote add origin https://github.com/your_username/TESTING_PREET_1.git`, // Adjust repository URL
            'git push -u origin main', // Adjust branch name if needed
        ];

        for (const command of gitCommands) {
            const { stdout, stderr } = await execAsync(command);
            console.log('Command:', command);
            console.log('stdout:', stdout);
            console.error('stderr:', stderr);
        }

        return res.status(200).json({ message: "Files pushed to GitHub successfully", repositoryUrl });
    } catch (error) {
        console.error('Error in downloadProject:', error);
        return res.status(500).json({ message: "Something went wrong", error });
    }
};