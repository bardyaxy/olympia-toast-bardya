import { fingerprintImages } from '../scripts/build';
import fs from 'fs';
import path from 'path';
import os from 'os';
import assert from 'assert';
import { test } from 'node:test';

// Unit test for fingerprintImages

test('fingerprintImages hashes image filenames', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fingerprint-'));
  const srcDir = path.join(tmp, 'src');
  const destDir = path.join(tmp, 'dest');
  fs.mkdirSync(srcDir);
  fs.mkdirSync(destDir);

  const filePath = path.join(srcDir, 'logo.png');
  fs.writeFileSync(filePath, 'content');

  const map = fingerprintImages(srcDir, destDir);
  const hashed = map['img/logo.png'];
  assert.ok(hashed, 'returns hashed mapping');
  const hashedName = hashed.split('/')[1];
  const hashedPath = path.join(destDir, hashedName);
  assert.ok(fs.existsSync(hashedPath), 'hashed file created');
});
