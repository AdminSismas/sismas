const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Setting up git scripts...');

// --- 1. Set File Permissions ---
console.log('\nStep 1: Setting up git scripts permissions...');
const scriptsDir = __dirname;
const scripts = ['git-merge-develop.sh', 'git-pull-develop.sh'];

scripts.forEach((script) => {
  const scriptPath = path.join(scriptsDir, script);
  try {
    fs.chmodSync(scriptPath, '755');
    console.log(`  ✓ Set permissions for ${script}`);
  } catch (error) {
    console.error(`  ✗ Failed to set permissions for ${script}:`, error.message);
  }
});

// --- 2. Configure Git Aliases ---
console.log('\nStep 2: Configuring git aliases...');

const aliases = {
  pd: `!"sh scripts/git/git-pull-develop.sh"`,
  md: `!"sh scripts/git/git-merge-develop.sh"`
};

for (const [alias, command] of Object.entries(aliases)) {
  const gitCommand = `git config alias.${alias} ${command}`;
  try {
    execSync(gitCommand);
    console.log(`  ✓ Configured alias 'git ${alias}'`);
  } catch (error) {
    console.error(`  ✗ Failed to configure alias 'git ${alias}':`, error.message);
    console.error('  Please ensure Git is installed and accessible in your system\'s PATH.');
  }
}


console.log('\nGit scripts setup completed!');
console.log('You can now use the git aliases: git pd and git md');