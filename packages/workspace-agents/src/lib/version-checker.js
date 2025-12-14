const https = require('https');
const pkg = require('../../package.json');

/**
 * Check npm registry for newer version
 * @returns {Promise<{current: string, latest: string, available: boolean}>}
 */
async function check() {
  try {
    const latest = await fetchLatestVersion();
    return {
      current: pkg.version,
      latest,
      available: latest !== pkg.version && isNewer(latest, pkg.version)
    };
  } catch (e) {
    // Network error, skip update check silently
    return { current: pkg.version, latest: pkg.version, available: false };
  }
}

/**
 * Fetch latest version from npm registry
 * @returns {Promise<string>}
 */
function fetchLatestVersion() {
  return new Promise((resolve, reject) => {
    const req = https.get(
      'https://registry.npmjs.org/workspace-agents/latest',
      { timeout: 2000 },
      (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            resolve(json.version || pkg.version);
          } catch (e) {
            reject(e);
          }
        });
      }
    );
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('timeout'));
    });
  });
}

/**
 * Compare semver versions
 * @param {string} latest
 * @param {string} current
 * @returns {boolean}
 */
function isNewer(latest, current) {
  const l = latest.split('.').map(Number);
  const c = current.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if ((l[i] || 0) > (c[i] || 0)) return true;
    if ((l[i] || 0) < (c[i] || 0)) return false;
  }
  return false;
}

module.exports = { check, isNewer };
