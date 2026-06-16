import { loadResume } from '../src/lib/loadResume';

try {
  loadResume();
  console.log('Resume YAML is valid.');
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
