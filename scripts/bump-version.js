#!/usr/bin/env node

/**
 * Bumps the app version across package.json, Android, and iOS.
 *
 * Usage: bun run version:set 2.3
 *
 * - Sets the version string in package.json, build.gradle, and project.pbxproj
 * - Auto-increments the build number (versionCode / CURRENT_PROJECT_VERSION)
 */

const fs = require('fs');
const path = require('path');

const newVersion = process.argv[2];
if (!newVersion) {
  console.error('Usage: bun run version:set <version>');
  console.error('Example: bun run version:set 2.3');
  process.exit(1);
}

const root = path.resolve(__dirname, '..');

// 1. Update package.json
const pkgPath = path.join(root, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const oldVersion = pkg.version;
pkg.version = newVersion;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
console.log(`package.json: ${oldVersion} → ${newVersion}`);

// 2. Update Android build.gradle
const gradlePath = path.join(root, 'android/app/build.gradle');
let gradle = fs.readFileSync(gradlePath, 'utf8');

const codeMatch = gradle.match(/versionCode\s+(\d+)/);
const oldCode = codeMatch ? parseInt(codeMatch[1], 10) : 0;
const newCode = oldCode + 1;

gradle = gradle.replace(/versionCode\s+\d+/, `versionCode ${newCode}`);
gradle = gradle.replace(/versionName\s+"[^"]*"/, `versionName "${newVersion}"`);
fs.writeFileSync(gradlePath, gradle, 'utf8');
console.log(`Android: versionName "${newVersion}", versionCode ${oldCode} → ${newCode}`);

// 3. Update iOS project.pbxproj
const pbxPath = path.join(root, 'ios/zero.xcodeproj/project.pbxproj');
let pbx = fs.readFileSync(pbxPath, 'utf8');

const buildMatch = pbx.match(/CURRENT_PROJECT_VERSION\s*=\s*(\d+)/);
const oldBuild = buildMatch ? parseInt(buildMatch[1], 10) : 0;
const newBuild = oldBuild + 1;

pbx = pbx.replace(/MARKETING_VERSION\s*=\s*[^;]+;/g, `MARKETING_VERSION = ${newVersion};`);
pbx = pbx.replace(/CURRENT_PROJECT_VERSION\s*=\s*\d+;/g, `CURRENT_PROJECT_VERSION = ${newBuild};`);
fs.writeFileSync(pbxPath, pbx, 'utf8');
console.log(`iOS: MARKETING_VERSION ${newVersion}, CURRENT_PROJECT_VERSION ${oldBuild} → ${newBuild}`);

console.log('\nDone!');
