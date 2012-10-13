/*global describe:false, expect:false, $:false, it:false*/

describe("SpellChecker", function() {
 
  describe('Plugin setup', function() {

    it('Has a prototype object stored on the jQuery dollar namespace', function() {
      expect(typeof $.SpellChecker).toBe('function');
    });

    it('Has a jquery fn constructor', function() {
      expect(typeof $.fn.spellchecker).toBe('function');
    });

    it('Allows jquery methods to be chained', function() {
      var x = $('body').spellchecker();
      expect(x instanceof jQuery).toBe(true);
    });
  });
});