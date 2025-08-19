const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Starting DB push wrapper script...');

try {
  // Read and parse the .env file
  const envPath = path.resolve(__dirname, './.env');
  const envFileContent = fs.readFileSync(envPath, 'utf-8');
  const dbUrlLine = envFileContent.split('\n').find(line => line.startsWith('DATABASE_URL='));
  const dbUrl = dbUrlLine?.split('=')[1].replace(/"/g, '');

  if (!dbUrl) {
    throw new Error('DATABASE_URL not found in .env file');
  }

  // Set the environment variable for the child process
  process.env.DATABASE_URL = dbUrl;
  console.log('DATABASE_URL has been set for the child process.');

  // Execute the prisma db push command
  console.log('Executing "npx prisma db push"...');
  execSync('npx prisma db push --schema=./prisma/schema.prisma', { stdio: 'inherit' });
  
  console.log('Prisma db push completed successfully.');

} catch (error) {
  console.error('Error in db-push-wrapper.js:', error.message);
  process.exit(1);
}
