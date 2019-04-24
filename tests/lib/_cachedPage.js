let fs = require('fs');
let path = require('path');
let wtf = require('../../src/index');

function from_file(page, options) {
  let file = '../cache/' + page + '.txt';
  file = path.join(__dirname, file);
  let str = fs.readFileSync(file, 'utf-8');
  return wtf(str, options);
}
module.exports = from_file;
