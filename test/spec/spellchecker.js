/*global describe:false, expect:false, $:false, it:false*/

describe('Dependancies', function() {
  it('Has jQuery', function() {
    expect(window.jQuery).not.toBe('undefined');
  });
});

describe("SpellChecker", function() {
 
  describe('Plugin setup', function() {
    it('Has a prototype object stored on the jQuery namespace', function() {
      expect(typeof $.SpellChecker).toBe('function');
    });
  });

  describe('Text parser', function() {

    var spellchecker = new $.SpellChecker(null, {
      parser: 'text'
    });

    var parser = spellchecker.parser;

    it('Removes punctuation from text', function() {

      var text1 = 'Hello, this is a-test. How are you today?';
      var text2 = '  ...Hello, here\'s a-test. How are you today?';
      var cleaned1 = parser.clean(text1);
      var cleaned2 = parser.clean(text2);

      expect(cleaned1).toBe('Hello this is a-test How are you today');
      expect(cleaned2).toBe('Hello here\'s a-test How are you today');
    });

    it('Removes numbers from text', function() {

      var text1 = 'Hello, 123, this is a-test. \'456\' How are you today?';
      var cleaned1 = parser.clean(text1);

      expect(cleaned1).toBe('Hello this is a-test How are you today');
    });

    it('Removes punctuation and numbers from Unicode text', function() {

      var tests = {
         // greek
        'Γεια, αυτό είναι ένα-δοκιμή. Πώς είστε σήμερα;': 
        'Γεια αυτό είναι ένα-δοκιμή Πώς είστε σήμερα',
         // russian
        'Здравствуйте, это-тест. Как вы сегодня?': 
        'Здравствуйте это-тест Как вы сегодня',
         // arabic
        'مرحبا، وهذا هو الاختبار. كيف حالك اليوم؟': 
        'مرحبا وهذا هو الاختبار كيف حالك اليوم',
         // hebrew
        'הלו, זה מבחן. מה שלומך היום?': 
        'הלו זה מבחן מה שלומך היום',
         // spanish
        'Hola, esta es una prueba. ¿Cómo estás hoy?': 
        'Hola esta es una prueba Cómo estás hoy',
         // chinese (simplified)
        '你好，这是一个测试。你今天怎么样呢？': 
        '你好，这是一个测试。你今天怎么样呢',
         // french
        'Bonjour, ceci est un test-. Comment allez-vous aujourd\'hui?': 
        'Bonjour ceci est un test Comment allez-vous aujourd\'hui',
         // random
        'Aynı, labda - çalıştığım? \"quote\". Föö bär, we\'re @test to0 ÅÄÖ - 123 ok? kthxbai?': 
        'Aynı labda çalıştığım quote Föö bär we\'re test to0 ÅÄÖ ok kthxbai',
         // hindi
        'नमस्कार, यह एक परीक्षण है. आज तुम कैसे हो?': 
        'नमस्कार यह एक परीक्षण है आज तुम कैसे हो',
         // hungarian
        'Halló, ez egy-teszt. Hogy van ma?': 
        'Halló ez egy-teszt Hogy van ma',
         // japanese
        'こんにちは、これは、テストです。元気ですか？': 
        'こんにちは、これは、テストです。元気ですか',
         // finnish
        'Hei, tämä on-testi. Miten voit tänään?': 
        'Hei tämä on-testi Miten voit tänään',
         // italian
        'Ciao, questo è un test. Come stai oggi?': 
        'Ciao questo è un test Come stai oggi',
         // korean
        '안녕하세요 테스트입니다. 안녕하세요?': 
        '안녕하세요 테스트입니다 안녕하세요',
         // portuguese
        'Olá, este é um teste. Como você está hoje?': 
        'Olá este é um teste Como você está hoje'
      };

      for(var key in tests) {
        expect(parser.clean(key)).toBe(tests[key]);
      }
    });

    it('Replaces a word multiple times in a string of text', function() {
      var text = 'Hello, are you ok? Would you like some coke? No thanks, I am ok!';
      var replaced = parser.replaceWordInText(text, 'ok', 'good');
      expect(replaced).toBe('Hello, are you good? Would you like some coke? No thanks, I am good!');
    });

    it('Replaces a Unicode word multiple times in a string of text', function() {
      var text = 'Привет, ты в порядке? Хотели бы Вы немного кокса? Нет, спасибо, я в порядке!';
      var replaced = parser.replaceWordInText(text, 'порядке', 'хорошо');
      expect(replaced).toBe('Привет, ты в хорошо? Хотели бы Вы немного кокса? Нет, спасибо, я в хорошо!');
    });
  });  
});