const wtf = require('./src/index');
// const wtf = require('./builds/wtf_wikipedia.min');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');
// let doc = readFile('BBDO');

let p = wtf
  .fetch('Taylor%20Swift', 'en', {
    'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>'
  })
  .then(res => {
    console.log(res.json());
  });
