import { build } from '../scripts/build';
import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { test, before, after } from 'node:test';

const rootDir = path.join(__dirname, '..');

before(() => {
  build(rootDir);
});

after(() => {
  fs.rmSync(path.join(rootDir, 'dist'), { recursive: true, force: true });
});

test('generated pages exist', () => {
  for (const page of ['index.html', 'about.html', 'resources.html']) {
    const file = path.join(rootDir, 'dist', page);
    assert.ok(fs.existsSync(file), `${page} exists`);
  }
});

test('html references built assets', () => {
  const html = fs.readFileSync(
    path.join(rootDir, 'dist', 'index.html'),
    'utf8',
  );
  const cssMatch = html.match(/assets\/[\w.-]+\.css/);
  const jsMatch = html.match(/assets\/[\w.-]+\.js/);
  assert.ok(cssMatch && jsMatch, 'asset references found');
  const cssFile = path.join(rootDir, 'dist', cssMatch[0]);
  const jsFile = path.join(rootDir, 'dist', jsMatch[0]);
  assert.ok(fs.existsSync(cssFile), 'css file exists');
  assert.ok(fs.existsSync(jsFile), 'js file exists');
});

test('creates asset manifest', () => {
  const manifestPath = path.join(rootDir, 'dist', 'asset-manifest.json');
  assert.ok(fs.existsSync(manifestPath), 'manifest exists');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  assert.ok(manifest['styles/main.css'], 'css entry present');
  assert.ok(manifest['scripts/app.js'], 'js entry present');
});
