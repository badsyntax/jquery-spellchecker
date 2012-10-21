/*global describe:false, expect:false, $:false, it:false*/

describe("SpellChecker", function() {
 
  describe('Plugin setup', function() {

    it('Has a prototype object stored on the jQuery namespace', function() {
      expect(typeof $.SpellChecker).toBe('function');
    });

  });

  // describe('Text parser', function() {




  //   var spellchecker = new $.SpellChecker(null);
  //   var parser = spellchecker.parser;

  //   it('Remove all HTML tags', function() {

  //   });

  //   it('Removes all non-word characters and replaces them with a space character', function() {


  //     var spellchecker = new $.SpellChecker(null);
  //     var parser = spellchecker.parser;

  //     var text1 = 'color(yellow)';
  //     var cleanedText1 = parser.clean(text1);

  //     var text2 = 'wàéèíóòúÀÉÈÍÓÒÚ';
  //     var cleanedText2 = parser.clean(text2);

  //     expect(cleanedText1).toBe('color yellow');
  //     expect(cleanedText2).toBe('wàéèíóòúÀÉÈÍÓÒÚ');
  //   })
  // })
});

var reg = XRegExp('\\p{P}', 'g');
var o1 = XRegExp.replace("Русский. sdsd", reg, ' ');
var o2 = XRegExp.replace("yellow (red)", reg, ' ');

console.log("Русский. sdsd");

console.log(o1);
console.log(o2);
