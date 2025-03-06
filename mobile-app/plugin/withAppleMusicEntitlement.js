// plugin/withAppleMusicEntitlements.js
const {
  createRunOncePlugin,
  withEntitlementsPlist
} = require('@expo/config-plugins');

const pkg = require('../package.json');

function setAppleMusicEntitlements(config) {
  return withEntitlementsPlist(config, config => {
    if (!config.modResults) return config;
    config.modResults['com.apple.developer.music-user-token'] = true;
    return config;
  });
}

function withAppleMusicEntitlements(config) {
  config = setAppleMusicEntitlements(config);
  return config;
}

module.exports = createRunOncePlugin(
  withAppleMusicEntitlements,
  'with-apple-music-entitlements',
  pkg.version
);
