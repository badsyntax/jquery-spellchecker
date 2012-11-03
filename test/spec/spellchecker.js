/*global describe:false, expect:false, $:false, it:false, spyOn:false, beforeEach:false, afterEach:false*/

describe("SpellChecker", function() {

  describe('Dependancies', function() {
    it('Has jQuery', function() {
      expect(window.jQuery).not.toBe('undefined');
    });
  });

  describe('Plugin setup', function() {
    it('Has a prototype object stored on the jQuery namespace', function() {
      expect(typeof $.SpellChecker).toBe('function');
    });
  });

  describe('Plugin destroy', function() {

    it('Destroys the suggestBox and incorrectWords box elements', function(){
      var a = $('<a id="test1" />').appendTo('body');
      var spellchecker = new $.SpellChecker(a);
      spellchecker.destroy();
      expect($('.spellchecker-suggestbox').length).toBe(0);
      expect($('.spellchecker-incorrectwords').length).toBe(0);
      a.remove();
    });
  });

  describe('Plugin construction', function() {

    var spellchecker, a, parser;

    beforeEach(function () {
      a = $('<a id="test1" />').appendTo('body');
      spellchecker = new $.SpellChecker(a, {
        parser: 'text'
      });
      parser = spellchecker.parser;
    });

    afterEach(function() {
      spellchecker.destroy();
      a.remove();
    });

    it('Sets an element propery as a jQuery instance', function() {
      expect(spellchecker.elements.jquery).not.toBe(undefined);
      expect(spellchecker.elements.length).toBe(1);
      expect(spellchecker.elements[0]).toBe(a[0]);
    });

    it('Sets the element \'spellcheck\' attribute', function() {
      expect(a.attr('spellcheck')).toBe('false');
    });

    it('Creates instances of suggestBox and incorrectWords objects', function() {
      expect(typeof spellchecker.suggestBox).toBe('object');
      expect(typeof spellchecker.incorrectWords).toBe('object');
    });
  });

  describe('Config', function() {

    it('Sets config on construction', function() {
      var a = $('<a id="test1" />').appendTo('body');
      var spellchecker = new $.SpellChecker(a, {
        testProp: true
      });
      expect(spellchecker.config.testProp).toBe(true);
      spellchecker.destroy();
      a.remove();
    });

    it('Does a deep merge of config values', function() {
      var a = $('<a id="test1" />').appendTo('body');
      var spellchecker = new $.SpellChecker(a, {
        incorrectWords: {
          newProp: true
        }
      });
      expect(spellchecker.config.incorrectWords.newProp).toBe(true);
      expect(spellchecker.config.incorrectWords.container).not.toBe(undefined);
      spellchecker.destroy();
      a.remove();
    });
  });

  describe('Events', function() {

    var spellchecker, a, parser;

    beforeEach(function () {
      a = $('<a id="test1" />').appendTo('body');
      spellchecker = new $.SpellChecker(a, {
        parser: 'text'
      });
      parser = spellchecker.parser;
    });

    afterEach(function() {
      spellchecker.destroy();
      a.remove();
    });

    it('Extends the events util', function(){
      expect(typeof spellchecker.on).toBe('function');
    });

    it('Creates a handlers object to store the handlers on construction', function() {
      expect(typeof spellchecker._handlers).toBe('object');
    });

    it('Assigns a new jQuery callbacks list object to the list of handlers', function() {
      spellchecker.on('test', function(){});
      expect(typeof spellchecker._handlers.test).toBe('object');
      expect(typeof spellchecker._handlers.test.add).toBe('function');
    });

    it('Executes the handler when triggering an event', function() {
      var events = { handler: function() {} };
      spyOn(events, 'handler');
      spellchecker.on('test', events.handler);
      spellchecker.trigger('test');
      expect(events.handler).toHaveBeenCalled();
    });

    it('Executes the handler with custom event data', function() {
      var events = { handler: function() {} };
      var data = { prop: true };
      spyOn(events, 'handler');
      spellchecker.on('test', events.handler);
      spellchecker.trigger('test', data);
      expect(events.handler).toHaveBeenCalledWith(data);
    });

    it('Routes DOM events to custom events', function() {
      var events = { handler: function() {} };
      spyOn(events, 'handler');
      spellchecker.on('test2', events.handler);
      var a = $('<a />');
      a.on('click', spellchecker.handler('test2'));
      a.trigger('click');
      expect(events.handler).toHaveBeenCalled();
    });

  });

  describe('Suggest box', function() {
    
    var spellchecker, a, parser;

    beforeEach(function () {
      a = $('<a id="test1" />').appendTo('body');
      spellchecker = new $.SpellChecker(a, {
        parser: 'text'
      });
      parser = spellchecker.parser;
    });

    afterEach(function() {
      spellchecker.destroy();
      a.remove();
    });

    it('Creates the suggest box container element and appends it to the body', function() {
      expect($('.spellchecker-suggestbox').length).toBe(1);
    });

    it('Adds words to the box', function() {
      var words = [
        'word1',
        'word2',
        'word3'
      ]; 
      spellchecker.suggestBox.addWords(words);
      var children = spellchecker.suggestBox.container.find('.words').children();
      expect(children.length).toBe(3);
      expect(children.eq(0).text()).toBe('word1');
    });
  });

  describe('Text parser', function() {

    var spellchecker, a, parser;

    beforeEach(function () {
      a = $('<a id="test1" />').appendTo('body');
      spellchecker = new $.SpellChecker(a, {
        parser: 'text'
      });
      parser = spellchecker.parser;
    });

    afterEach(function() {
      spellchecker.destroy();
      a.remove();
    });

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

  describe('Public methods', function() {
    
    it('Replaces a word in a DOM tree', function() {
      a = $('<a id="test1">he<span>llo</span></a>').appendTo('body');
      spellchecker = new $.SpellChecker(a, {
        parser: 'html'
      });
      spellchecker.replaceWord('hello', 'test', a);
      expect(a.text()).toBe('test');
      spellchecker.destroy();
      a.remove();
    });

    it('Replaces a word in a textarea', function() {
      a = $('<textarea>hello</textarea>').appendTo('body');
      spellchecker = new $.SpellChecker(a, {
        parser: 'text'
      });
      spellchecker.replaceWord('hello', 'test', a);
      expect(a.val()).toBe('test');
      spellchecker.destroy();
      a.remove();
    });
  })
});