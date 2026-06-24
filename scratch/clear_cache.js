const fs = require('fs');
const path = require('path');

const targets = [
  path.join(__dirname, '..', '.next'),
  path.join(__dirname, '..', 'node_modules', '.cache'),
  path.join(__dirname, '..', 'tsconfig.tsbuildinfo'),
];

const lockPath = path.join(__dirname, '..', '.next', 'dev-server.lock');

console.log('🧹 Starting cache cleanup...');

if (fs.existsSync(lockPath)) {
  try {
    fs.unlinkSync(lockPath);
    console.log('✅ Removed stale dev-server.lock');
  } catch (e) {
    console.error('⚠️ Could not remove dev-server.lock:', e.message);
    console.log('💡 Tip: Stop any running dev server and try again.');
  }
}

targets.forEach(target => {
  if (fs.existsSync(target)) {
    try {
      fs.rmSync(target, { recursive: true, force: true });
      console.log(`✅ Successfully removed: ${path.basename(target)}`);
    } catch (e) {
      console.error(`⚠️ Could not remove ${path.basename(target)}:`, e.message);
      console.log('💡 Tip: If the dev server is running, stop it and try again.');
    }
  } else {
    console.log(`ℹ️ Already clean or missing: ${path.basename(target)}`);
  }
});

console.log('✨ Cache cleanup completed successfully.');
