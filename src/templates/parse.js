const ignore = require('./_ignore');
const getName = require('./_parsers/_getName');
const parse = require('./_parsers/parse');
const inf = require('./_infobox');

const templates = Object.assign({},
  require('./wikipedia'),
  require('./identities'),
  require('./dates'),
  require('./formatting'),
  require('./geo'),
  require('./language'),
  require('./money'),
  require('./sports'),
  require('./science'),
  require('./math'),
  require('./politics'),
  require('./misc')
);
// console.log(Object.keys(templates).length + ' Templates!');

//this gets all the {{template}} strings and decides how to parse them
const parseTemplate = function(tmpl, wiki, data) {
  let name = getName(tmpl);
  //Faz a chamada da função ignoreTemplates
  ignoreTemplates(ignore,name,tmpl,wiki);
  //Chamada da função formTemplates
  formTemplates(templates,name,tmpl,data,wiki);
  //Faz a chamada da função infoTemplates
  infoTemplates(inf,name,data,wiki);
  //chama citeTemplates
  citeTemplates(name,tmpl,data,wiki);
  //chama fallbackTemplates
  fallbackTemplates(tmpl,data,wiki);
  
};
module.exports = parseTemplate;

//Função para tratar as correpondencias vindo de ./ignore.js
function ignoreTemplates(ignore,name,tmpl,wiki){
  //we explicitly ignore these templates
  if (ignore.hasOwnProperty(name) === true) {
    wiki = wiki.replace(tmpl, '');
    return wiki;
  }
}

//Função para tratar os templates
function formTemplates(templates,name,tmpl,data,wiki){
   //match any known template forms (~1,000!)
  if (templates.hasOwnProperty(name) === true) {
    let str = templates[name](tmpl, data);
    wiki = wiki.replace(tmpl, str);
    return wiki;
  }
}
//Função para tratar os infobox 
function infoTemplates(inf,name,data,wiki){
   // {{infobox settlement...}}
  if (inf.isInfobox(name) === true) {
    let obj = parse(tmpl, data, 'raw');
    let infobox = inf.format(obj);
    data.templates.push(infobox);
    wiki = wiki.replace(tmpl, '');
    return wiki;
  }
}
//Trata as citações 
function citeTemplates(name,tmpl,data,wiki){
   //cite book, cite arxiv...
  if (/^cite [a-z]/.test(name) === true) {
    let obj = parse(tmpl, data);
    data.templates.push(obj);
    wiki = wiki.replace(tmpl, '');
    return wiki;
  }//
}
//Verifica se objeto é diferente de null e depois os dados de tmpl
function fallbackTemplates(tmpl,data,wiki){
  //fallback parser
  let obj = parse(tmpl);
  if (obj !== null && Object.keys(obj).length > 0) {
    data.templates.push(obj);
    
    let matches = tmpl.match(/\{\{(\w{3,})\s/g)
    if (matches != undefined){
      let inicio = matches[0];
      let novo = tmpl.replace(inicio, '');
      novo = novo.replace(/(\{|\})/gm, '');
      wiki = wiki.replace(tmpl, novo)
      return wiki;
    }
  }
  wiki = wiki.replace(tmpl, '');
  return wiki;
}