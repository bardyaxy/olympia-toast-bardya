import chokidar from 'chokidar';
import { spawn } from 'child_process';

const watchPaths = [
  'scripts/**/*.{js,ts}',
  'styles/**/*.css',
  'includes/**/*.html',
  'img/**/*',
  '*.html',
  'webpack.config.js',
];

function runBuild() {
  const proc = spawn(
    process.execPath,
    ['-r', 'ts-node/register', 'scripts/build.ts'],
    {
      stdio: 'inherit',
    },
  );
  proc.on('close', (code) => {
    if (code !== 0) {
      console.error(`Build exited with code ${code}`);
    }
  });
}

runBuild();

const watcher = chokidar.watch(watchPaths, {
  ignored: ['dist/**', 'node_modules/**'],
  ignoreInitial: true,
});

watcher.on('all', (event, path) => {
  console.log(`${event} ${path} - rebuilding...`);
  runBuild();
});

console.log('Watching for changes. Press Ctrl+C to exit.');
