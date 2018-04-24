<div align="center">
  <a href="https://www.codacy.com/app/spencerkelly86/wtf_wikipedia">
    <img src="https://api.codacy.com/project/badge/grade/e84f69487c9348ba9cd8e31031a05a4f" />
  </a>
  <a href="https://npmjs.org/package/wtf_wikipedia">
    <img src="https://img.shields.io/npm/v/wtf_wikipedia.svg?style=flat-square" />
  </a>
  <a href="https://www.codacy.com/app/spencerkelly86/wtf_wikipedia">
    <img src="https://api.codacy.com/project/badge/Coverage/e84f69487c9348ba9cd8e31031a05a4f" />
  </a>
  <div>wikipedia markup parser</div>
  <sub>
    by
    <a href="https://spencermountain.github.io/">Spencer Kelly</a> and
    <a href="https://github.com/spencermountain/wtf_wikipedia/graphs/contributors">
      many contributors
    </a>
  </sub>
</div>
<p></p>

<div align="center">
  <b>wtf_wikipedia</b> turns wikipedia's markup language into <b>JSON</b>,
  <div>so getting data from wikipedia is easier.</div>
  <h2 align="center">Don't do this at home.</h2>
  <sup>really!</sup>
</div>
Wikipedia's custom markup is among the strangest and most illicit data formats you can find.
* en-wikipedia has 1.5m custom templates (as of 2018)
* don't ignore the [egyptian hieroglyphics syntax](https://en.wikipedia.org/wiki/Help:WikiHiero_syntax).
* or confuse [Birth_date_and_age](https://en.wikipedia.org/wiki/Template:Birth_date_and_age) with [Birth-date_and_age](https://en.wikipedia.org/wiki/Template:Birth-date_and_age).
* or the [partial-implementation of inline-css](https://en.wikipedia.org/wiki/Help:HTML_in_wikitext),
* the nesting of syntax-similar templates,
* the unexplained [hashing scheme](https://commons.wikimedia.org/wiki/Commons:FAQ#What_are_the_strangely_named_components_in_file_paths.3F) of image paths
* custom encoding of unicode, whitespace, and punctuation
* [right-to-left](https://www.youtube.com/watch?v=xpumLsaAWGw) values in left-to-right templates.

**wtf_wikipedia** supports many recursive template shenanigans, depreciated and obscure template
variants, and illicit wiki-esque shorthands. It will try it's best, and fail in reasonable ways.

Making your own parser is never a good idea, but this library aims to be the most comprehensive and straight-forward way to get specific data out of wikipedia.


# OK go
```bash
npm install wtf_wikipedia
```

```javascript
var wtf = require('wtf_wikipedia');

wtf.fetch('Whistling').then(doc => {
  doc.categories();
  //['Oral communication', 'Vocal music', 'Vocal skills']

  doc.sections('As communication').plaintext();
  // A traditional whistled language named Silbo Gomero..

  doc.images(0).thumb();
  //https://upload.wikimedia.org..../300px-Duveneck_Whistling_Boy.jpg

  doc.sections('See Also').links().map(l => l.page)
  //['Slide whistle','Hand flute','Bird vocalization'...]
});
```
or on the client-side!
```html
<script src="https://unpkg.com/wtf_wikipedia@latest/builds/wtf_wikipedia.min.js"></script>
<script>
  //(follows Radiohead redirect)
  wtf.fetch('On a Friday', 'en', function(err, doc) {
    let infobox = doc.infobox(0).data
    infobox['current_members'].links().map(l => l.page);
    //['Thom Yorke', 'Jonny Greenwood', 'Colin Greenwood'...]
  });
</script>
```
# What it does

* Detects and parses **redirects** and **disambiguation** pages
* Parse **infoboxes** into a formatted key-value object
* Handles recursive templates and links- like [[.. [[...]] ]]
* **Per-sentence** plaintext and link resolution
* Parse and format internal links
* creates
  [image thumbnail urls](https://commons.wikimedia.org/wiki/Commons:FAQ#What_are_the_strangely_named_components_in_file_paths.3F)
  from **File:XYZ.png** filenames
* Properly resolve {{CURRENTMONTH}} and {{CONVERT ..}} type templates
* Parse **images**, files, and **categories**
* converts 'DMS-formatted' (59°12\'7.7"N) geo-coordinates to lat/lng
* parses citation metadata
* Eliminate xml, latex, css, table-sorting, and 'Egyptian hierogliphics' cruft

its a combination of [instaview](https://en.wikipedia.org/wiki/User:Pilaf/InstaView),
[txtwiki](https://github.com/joaomsa/txtwiki.js), and uses the inter-language data from
[Parsoid javascript parser](https://www.mediawiki.org/wiki/Parsoid).

## But what about...

### Parsoid:

Wikimedia's [Parsoid javascript parser](https://www.mediawiki.org/wiki/Parsoid) is the official wikiscript parser. It
reliably turns wikiscript into HTML, but not valid XML.

To use it for data-mining, you'll' need to:

```
parsoid(wikiscript) -> pretend DOM -> screen-scraping
```

but getting structured data this way (say, sentences or infobox data), is a complex + weird process still. This library
has 'borrowed' a lot of stuff from the parsoid project❤️

### XML datadumps:

This library is built to work well with [dumpster-dive](https://github.com/spencermountain/dumpster-dive),
letting you parse a whole wikipedia dump on a laptop in a couple minutes.

# API

### **wtf(wikiText)**
turns wikimedia markup into a handy Document object

```javascript
import wtf from 'wtf_wikipedia'
wtf("==In Popular Culture==\n*harry potter's wand\n* the simpsons fence");
// Document {plaintext(), html(), latex()...}
```

### **wtf.fetch(title, [lang_or_wikiid], [options], [callback])**
retrieves raw contents of a mediawiki article from the wikipedia action API.

This method supports **errback** callback form, or returns a [Promise object](https://spring.io/understanding/javascript-promises) if one is missing.

to call non-english wikipedia apis, add it as the second paramater, identified by its
[dbname](http://en.wikipedia.org/w/api.php?action=sitematrix&format=json)

```javascript
wtf.fetch('Toronto', 'de', function(doc) {
  doc.plaintext();
  //Toronto ist mit 2,6 Millionen Einwohnern..
});
```
you may also pass the wikipedia page id as parameter instead of the page title:

```javascript
wtf.fetch(64646, 'de').then(console.log).catch(console.log)
```
the fetch method follows redirects.

### **doc.plaintext()**
returns only nice text of the article
```js
var wiki =
  "[[Greater_Boston|Boston]]'s [[Fenway_Park|baseball field]] has a {{convert|37|ft}} wall.<ref>{{cite web|blah}}</ref>";
var text = wtf(wiki).plaintext();
//"Boston's baseball field has a 37ft wall."
```
### other outputs:
* **doc.html()**
* **doc.markdown()**
* **doc.latex()**

### Document methods:
* **doc.isRedirect()** - *boolean*
* **doc.isDisambiguation()** - *boolean*
* **doc.categories()**
* **doc.sections()**
* **doc.sentences()**
* **doc.images()**
* **doc.links()**
* **doc.tables()**
* **doc.citations()**
* **doc.infoboxes()**
* **doc.coordinates()**

### Section methods:
(a section is any content between **==these kind==** of headers)
* **sec.indentation()**
* **sec.sentences()**
* **sec.links()**
* **sec.tables()**
* **sec.templates()**
* **sec.lists()**
* **sec.interwiki()**
* **sec.images()**
* **sec.index()**
* **sec.nextSibling()**
* **sec.lastSibling()**
* **sec.children()**
* **sec.parent()**
* **sec.remove()**

<!--
## **.custom({})**

if you're trying to parse a weird template, or an obscure wiki syntax somewhere, this library supports a customization
step, where you can pass-in random parsers to run, before your result is generated.

```js
var str = `{{myTempl|cool data!}} Whistling is a sport in some countries...`;
wtf.custom({
  mine: str => {
    let m = str.match(/^\{\{myTempl\|(.+?)\}\}$/);
    if (m) {
      return m[1];
    }
  }
});
wtf.parse(str);
//{title:'Whistling', custom: {mine:['cool data!']} }
```

this way, you can extend the library with your own regexes, and all that. -->

## **CLI**
if you're scripting this from the shell, or from another language, install with a `-g`, and then run:

```shell
$ wtf_wikipedia George Clooney --plaintext
# George Timothy Clooney (born May 6, 1961) is an American actor ...

$ wtf_wikipedia Toronto Blue Jays --json
# {text:[...], infobox:{}, categories:[...], images:[] }
```

### Good practice:
The wikipedia api is [pretty welcoming](https://www.mediawiki.org/wiki/API:Etiquette#Request_limit) though recommends three things, if you're going to hit it heavily -
* 1️⃣ pass a `Api-User-Agent` as something so they can use to easily throttle bad scripts
* 2️⃣ bundle multiple pages into one request as an array
* 3️⃣ run it serially, or at least, [slowly](https://www.npmjs.com/package/slow).
```js
wtf.fetch(['Royal Cinema', 'Aldous Huxley'], 'en', {
  'Api-User-Agent': 'spencermountain@gmail.com'
}).then((docList) => {
  let allLinks = docList.map(doc => doc.links());
  console.log(allLinks);
});
```

# Contributing
Never-ender projects like these are only good with many-hands, and I try to be a friendly maintainer. (promise!)
[Join in](./Contributing.md)

MIT
