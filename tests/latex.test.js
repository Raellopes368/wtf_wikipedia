const test = require('tape');
const wtf = require('./lib');
const tidy = require('./lib/tidy').latex;

test('basic-latex', t => {
  let have = wtf('that cat is [[a]] cool dude')
    .sentences(0)
    .latex();
  let want = 'that cat is \\href{./A}{a} cool dude';
  t.equal(tidy(have), tidy(want), 'link');

  have = wtf('that cat is [[ab cd]] cool dude')
    .sentences(0)
    .latex();
  want = 'that cat is \\href{./Ab_cd}{ab cd} cool dude';
  t.equal(tidy(have), tidy(want), 'link-blank');

  have = wtf('that cat is [http://www.wikiversity.org ab cd] cool dude')
    .sentences(0)
    .latex();
  want = 'that cat is \\href{http://www.wikiversity.org}{ab cd} cool dude';
  t.equal(tidy(have), tidy(want), 'link-external');

  //   // Image simple
  have = wtf(`My image [File:my_image.png]`)
    .images(0)
    .latex();
  want =
    '\\begin{figure}\n\\includegraphics[width=\\linewidth]{https://wikipedia.org/wiki/Special:Redirect/file/My_image.png?width=300}\n\\caption{my image}\n\\end{figure}';
  t.equal(tidy(have), tidy(want), 'image');
  t.end();
});

test('latex-formatting', t => {
  //1 tick
  let have = wtf(`i 'think' so`)
    .sentences(0)
    .latex();
  let want = `i 'think' so`;
  t.equal(tidy(have), tidy(want), 'one-tick');
  //
  //   //2 ticks
  have = wtf(`i ''think'' so`)
    .sentences(0)
    .latex();
  want = 'i \\textit{think} so';
  t.equal(tidy(have), tidy(want), 'italic');

  //3 ticks
  have = wtf(`i '''think''' so`)
    .sentences(0)
    .latex();
  want = 'i \\textbf{think} so';
  t.equal(tidy(have), tidy(want), 'bold');

  //4 ticks
  have = wtf(`i ''''think'''' so`)
    .sentences(0)
    .latex();
  want = "i \\textbf{'think'} so";
  t.equal(tidy(have), tidy(want), 'four-tick');

  //5 ticks
  have = wtf(`i '''''think''''' so`)
    .sentences(0)
    .latex();
  want = 'i 	\\textbf{\\textit{think}} so';
  t.equal(tidy(have), tidy(want), 'five-tick');
  t.end();
});

// test('latex-lists', t => {
//itemize
//   var have = wtf(`==My Section==
// Leading text
// * First item
// *Second Item
// Closing remark`).latex();
//   var want = '\\begin{itemize} \\item First item \\item Second Item\n\\end{itemize} % BEGIN Paragraph\n==My Section==\nLeading text\nClosing remark\n% END Paragraph';
//   t.equal(tidy(have), tidy(want), 'itemize');
//
//Nested itemize
// have = wtf(`==My Section==
// Intro text
// * first item
// ** first subitem of item
// ** second subitem of item
// * second item
// Final remarks`).latex();
//
// want = `section{My Section}
//   Leading text
//   egin{itemize}
//     item First item
//     egin{itemize}
//       item first subitem of item
//       item second subitem of item
//     end{itemize}
//     item Second item
//   end{itemize}
//   Final remarks`;
// t.equal(tidy(have), tidy(want), 'nested-itemize');
//
// //Nested enumerate in itemize
// have = wtf(`Intro text
//   * first item
//   *# first subitem of item
//   *# second subitem of item
//   * second item
//   Final remarks`).html();
// want = `section{My Section}
//   Leading text
//   egin{itemize}
//   item First item
//   egin{enumerate}
//     item first subitem of item
//     item second subitem of item
//   end{enumerate}
//   item Second item
//   end{itemize}
//   Final remarks`;
// t.equal(tidy(have), tidy(want), 'nested-itemize-enumerate');

//   t.end();
// });
