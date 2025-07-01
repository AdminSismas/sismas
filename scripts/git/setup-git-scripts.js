const fs = require('fs');
const path = require('path');

console.log('Setting up git scripts permissions...');

// Git scripts directory (current directory since we're already in scripts/git/)
const scriptsDir = __dirname;

// Give execution permissions to git scripts
const scripts = ['git-merge-develop.sh', 'git-pull-develop.sh'];

scripts.forEach(script => {
  const scriptPath = path.join(scriptsDir, script);
  try {
    fs.chmodSync(scriptPath, '755');
    console.log(`✓ Set permissions for ${script}`);
  } catch (error) {
    console.error(`✗ Failed to set permissions for ${script}:`, error.message);
  }
});

console.log('Git scripts setup completed!');
console.log('You can now use the git aliases: git pd and git merge-develop');
