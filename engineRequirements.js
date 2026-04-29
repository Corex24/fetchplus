/**
 * Runtime Engine Requirements Check
 * Validates that the Node.js version meets minimum requirements
 */

const nodeVersion = parseInt(process.versions.node.split('.')[0], 10);
const requiredVersion = 18;

if (nodeVersion < requiredVersion) {
  console.error(
    `\n❌ FetchPlus requires Node.js ${requiredVersion}.0.0 or higher.\n` +
    `   Current version: ${process.versions.node}\n` +
    `   Please upgrade Node.js: https://nodejs.org/\n`
  );
  process.exit(1);
}

console.log(`✅ Node.js version check passed (${process.versions.node})`);
