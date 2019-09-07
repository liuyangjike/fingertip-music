var path = require('path')

module.exports = {
  parser: '@typescript-eslint/parser',
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@', './src']
        ],
        extensions: ['.ts', 'tsx', '.js', '.jsx', '.json']
      }
    }
  }
}