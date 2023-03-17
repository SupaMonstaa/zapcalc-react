// craco.config.js (in root)
const path = require('path');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  }
};
