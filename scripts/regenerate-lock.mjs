import { execSync } from 'child_process';
import { existsSync } from 'fs';

try {
  console.log('Regenerating pnpm-lock.yaml...');
  execSync('pnpm install --no-frozen-lockfile', { 
    cwd: '/vercel/share/v0-project',
    stdio: 'inherit',
    timeout: 120000
  });
  
  if (existsSync('/vercel/share/v0-project/pnpm-lock.yaml')) {
    console.log('SUCCESS: pnpm-lock.yaml regenerated');
  } else {
    console.log('ERROR: lockfile was not created');
  }
} catch (e) {
  console.error('Error:', e.message);
}
