var path = require('path')

console.log(path.resolve('src/utils'))
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