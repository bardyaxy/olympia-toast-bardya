const chokidar = require('chokidar');
const { spawn } = require('child_process');

const watchPaths = [
  'scripts/**/*.js',
  'styles/**/*.css',
  'includes/**/*.html',
  'img/**/*',
  '*.html',
  'webpack.config.js',
];

function runBuild() {
  const proc = spawn('node', ['scripts/build.js'], { stdio: 'inherit' });
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
