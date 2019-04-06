const wtf = require('./src/index')
// const wtf = require('./builds/wtf_wikipedia.min');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
// var doc = await wtf.fetch('महात्मा_गांधी', 'hi');
// var doc = await wtf.random();
// console.log(doc.text());
// })();

// let doc = readFile('BBDO');
// console.log(doc.infoboxes(0).data);

// wtf.fetch('Горбатая_гора', 'ru', function(err, doc) {
//   console.log(doc.sections('Сюжет').sentences().map((s) => s.text()));
// });

let str = `


{{Infobox country
| conventional_long_name = Kingdom of Spain
| native_name = {{native name|es|Reino de España}}
| common_name = Spain
| name = {{collapsible list
|titlestyle                  = background:transparent;line-height:normal;font-size:84%;
* {{lang-oc|Reiaume d'Espanha}}, {{IPA-oc|reˈjawme ðesˈpaɲɔ|IPA}}}}}}
|{{Infobox |subbox=yes |bodystyle=font-size:80%;font-weight:normal;
|rowclass1 =mergedrow |label1=[[Catalan language|Catalan]]: |data1={{lang|ca|Regne d'Espanya}}
|rowclass2 = mergedrow |label2=[[Basque language|Basque]]: |data2={{lang|eu|Espainiako Erresuma}}
|rowclass3 = mergedrow |label3=[[Galician language|Galician]]: |data3={{lang|gl|Reino de España}}
|rowclass4 = mergedrow |label4=[[Occitan language|Occitan]]: |data4={{lang|oc|Reiaume d'Espanha}}
}}
}}
| national_motto = woohoo
}}

this actual text
`
console.log(wtf(str).text())
