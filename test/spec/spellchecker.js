/*global describe:false, expect:false, $:false, it:false*/

describe("SpellChecker", function() {
 
  describe('Plugin setup', function() {
    it('Has a prototype object stored on the jQuery namespace', function() {
      expect(typeof $.SpellChecker).toBe('function');
    });
  });

  describe('Text parser', function() {

    it('Removes punctuation from text', function() {

      var spellchecker = new $.SpellChecker(null);
      var parser = spellchecker.parser;

      var text1 = 'Hello, this is a-test. How are you today?';
      var text2 = '  ...Hello, here\'s a-test. How are you today?';
      var cleaned1 = parser.clean(text1);
      var cleaned2 = parser.clean(text2);

      expect(cleaned1).toBe('Hello this is a-test How are you today');
      expect(cleaned2).toBe('Hello here\'s a-test How are you today');
    });

    it('Removes numbers from text', function() {

      var spellchecker = new $.SpellChecker(null);
      var parser = spellchecker.parser;

      var text1 = 'Hello, 123, this is a-test. \'456\' How are you today?';
      var cleaned1 = parser.clean(text1);

      expect(cleaned1).toBe('Hello this is a-test How are you today');
    });

    it('Removes punctuation and numbers from Unicode text', function() {

      var spellchecker = new $.SpellChecker(null);
      var parser = spellchecker.parser;

      var text1 = 'Γεια, αυτό είναι ένα-δοκιμή. Πώς είστε σήμερα;'; // greek
      var text2 = 'Здравствуйте, это-тест. Как вы сегодня?'; // russian
      var text3 = 'مرحبا، وهذا هو الاختبار. كيف حالك اليوم؟'; // arabic
      var text4 = 'הלו, זה מבחן. מה שלומך היום?'; // hebrew
      var text5 = 'Hola, esta es una prueba. ¿Cómo estás hoy?'; // spanish
      var text6 = '你好，这是一个测试。你今天怎么样呢？'; // chinese (simplified)
      var text7 = 'Bonjour, ceci est un test-. Comment allez-vous aujourd\'hui?'; // french
      var text8 = 'Aynı, labda - çalıştığım? \"quote\". Föö bär, we\'re @test to0 ÅÄÖ - 123 ok? kthxbai?'; // random
      var text9 = 'नमस्कार, यह एक परीक्षण है. आज तुम कैसे हो?'; // hindi
      var text10 = 'Halló, ez egy-teszt. Hogy van ma?'; // hungarian

      var cleaned1 = parser.clean(text1);
      var cleaned2 = parser.clean(text2);
      var cleaned3 = parser.clean(text3);
      var cleaned4 = parser.clean(text4);
      var cleaned5 = parser.clean(text5);
      var cleaned6 = parser.clean(text6);
      var cleaned7 = parser.clean(text7);
      var cleaned8 = parser.clean(text8);
      var cleaned9 = parser.clean(text9);
      var cleaned10 = parser.clean(text10);

      expect(cleaned1).toBe('Γεια αυτό είναι ένα-δοκιμή Πώς είστε σήμερα');
      expect(cleaned2).toBe('Здравствуйте это-тест Как вы сегодня');
      expect(cleaned3).toBe('مرحبا وهذا هو الاختبار كيف حالك اليوم');
      expect(cleaned4).toBe('הלו זה מבחן מה שלומך היום');
      expect(cleaned5).toBe('Hola esta es una prueba Cómo estás hoy');
      expect(cleaned6).toBe('你好，这是一个测试。你今天怎么样呢');  // FIXME: is this correct?
      expect(cleaned7).toBe('Bonjour ceci est un test Comment allez-vous aujourd\'hui');
      expect(cleaned8).toBe('Aynı labda çalıştığım quote Föö bär we\'re test to0 ÅÄÖ ok kthxbai');
      expect(cleaned9).toBe('नमस्कार यह एक परीक्षण है आज तुम कैसे हो');
      expect(cleaned10).toBe('Halló ez egy-teszt Hogy van ma');
    });
  });  
});