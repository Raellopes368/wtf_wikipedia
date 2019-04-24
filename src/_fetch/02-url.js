const site_map = require('../_data/site_map');
const isUrl = /^https?:\/\//;

function isArray(arr) {
  return arr.constructor.toString().indexOf('Array') > -1;
}

// lets parse an unknown url with a regex... ¯\_(ツ)_/¯
const parseURL = function(str) {
  //grab the title from the path
  let arr = str.split('/');
  let page = arr[arr.length - 1];
  page = page.replace(/[/?#].*/, '');
  //grab the 'wikiUrl' from the domain
  let domain = str.match(/https?:\/\/(.*?)\//) || [];
  domain = domain[1] || '';
  //grab the lang from the subdomain
  let lang = domain.match(/(.*?)\./) || [];
  lang = lang[1];
  if (lang) {
    domain = domain.replace(/.*?\./, '');
  }
  return {
    page: page,
    domain: domain,
    lang: lang
  };
};

//construct a lookup-url for the wikipedia api
const makeUrl = function(title, lang, options) {
  let lookup = 'titles';
  let domain = options.domain;
  //support one, or many pages
  let pages = [];
  if (isArray(title) === false) {
    pages = [title];
  } else {
    pages = title;
  }

  //support numbers as pageids
  //assume number strings are titles (like '1984')
  if (typeof pages[0] === 'number') {
    lookup = 'pageids';
  } else if (isUrl.test(pages[0]) === true) {
    //support url as input - 'http://en.wikibooks.com/w/Toronto'
    pages = pages.map(page => {
      if (isUrl.test(page) === true) {
        const url = parseURL(page);
        page = url.page || page;
        domain = url.domain || domain;
        lang = url.lang || lang;
      }
      page = encodeURIComponent(page);
      return page;
    });
  }
  pages = pages.filter(p => p !== '');

  //set default language (sorry!)
  lang = lang || 'en';

  //start builing up the url
  let url = `https://${lang}.${domain || 'wikipedia.org'}/w/api.php`;
  //build domains from the language
  if (!domain && site_map[lang]) {
    url = site_map[lang] + '/w/api.php';
  }
  //some off-brand wikis don't use the /w/ path..
  if (domain && !/wiki/.test(domain)) {
    url = `https://${lang}.${domain}/api.php`;
  }
  //overwrite anything with this explicit param
  if (options.wikiUrl) {
    url = options.wikiUrl;
  }
  //we use the 'revisions' api here, instead of the Raw api, for its CORS-rules..
  url += '?action=query&prop=revisions&rvprop=content&maxlag=5&rvslots=main&format=json';
  if (!options.wikiUrl) {
    url += '&origin=*';
  }
  if (options.follow_redirects !== false) {
    url += '&redirects=true';
  }
  pages = pages.join('|');
  url += '&' + lookup + '=' + pages;
  return url;
};

module.exports = makeUrl;
