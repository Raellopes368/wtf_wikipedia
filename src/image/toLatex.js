//
const toLatex = function(image) {
  let alt = image.alt();
  var out = '\\begin{figure}';
  out += '\n\\includegraphics[width=\\linewidth]{' + image.thumb() + '}';
  out += '\n\\caption{' + alt + '}';
  out += '\n\\end{figure}';
  return out;
};
module.exports = toLatex;
