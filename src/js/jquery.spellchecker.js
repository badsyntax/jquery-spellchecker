/*
 * jQuery Spellchecker
 * https://github.com/badsyntax/jquery-spellchecker
 *
 * Copyright (c) 2012 Richard Willis
 * Licensed under the MIT license.
 */

(function($){

  var defaultConfig = {
    engine: {
      path: 'spellchecker.php',
      driver: {
        type: 'PSpell',
        lang: 'en',
      },
    },
    local: {
      requestError: 'There was an error processing the request.',
      ignoreWord: 'Ignore word',
      ignoreAll: 'Ignore all',
      ignoreForever: 'Add to dictionary',
      loading: 'Loading...'
    },
    suggestBox: {
      numWords: 5,
      position: 'above'
    },
    incorrectWords: {
      container: 'body' //selector
    }
  };

  /* Util
   *************************/

  if (!Function.prototype.bind) {
    Function.prototype.bind = function(scope) {
      return $.proxy(this, scope);
    };
  }

  var inherits = function(_sub, _super) {
    function F() {}
    F.prototype = _super.prototype;
    _sub.prototype = new F();
    _sub.prototype.constructor = _sub;
  };

  /* Events
   *************************/

  var Events = function(){
    this.handlers = {};
  };

  Events.prototype = {
    on: function(name, handler) {
      if (!this.handlers[name]) {
        this.handlers[name] = [handler];
      } else {
        this.handlers[name].push(handler);
      }
    },
    trigger: function(name) {
      var handlers = this.handlers[name];
      if (!this.handlers) {
        return;
      }
      var args = Array.prototype.slice.call(arguments, 1);
      $.each(handlers, function(i, handler) {
        handler.apply(this, args);
      }.bind(this));
    },
    handler: function(name) {
      return function(e) {
        this.trigger(name, e);
      }.bind(this);
    }
  };

  /* Base box
   *************************/

  var Box = function(config) {
    Events.call(this);
    this.config = config;
    this.createBox();
    this.bindEvents();
  };
  inherits(Box, Events);

  Box.prototype.onSelectWord = function(e) {
    e.stopPropagation();
    var element = $(e.currentTarget);
    var word = $.trim(element.text());
    this.trigger('select.word', e, word, element);
  };

  /* Incorrect words box
   *************************/

  var IncorrectWordsBox = function(config) {
    Box.apply(this, arguments);
  };
  inherits(IncorrectWordsBox, Box);

  IncorrectWordsBox.prototype.bindEvents = function() {
    this.container.on('click', 'a', this.onSelectWord.bind(this));
  };

  IncorrectWordsBox.prototype.createBox = function() {
    this.container = $([
      '<div class="spellchecker-incorrectwords">',
      '</div>'
    ].join('')).appendTo(this.config.incorrectWords.container);
  };

  IncorrectWordsBox.prototype.addWords = function(words) {

    var html = $.map(words, function(word) {
      return '<a href="#">' + word + '</a>';
    }).join('');

    this.container.html(html).show();
  };

  var IncorrectWordsInline = function(config, parser) {
    Events.call(this);
    this.config = config;
    this.parser = parser;
  };
  inherits(IncorrectWordsInline, Events);

  IncorrectWordsInline.prototype.addWords = function(words) {
    this.parser.highlightWords(words);
  };

  var Parser = function() {
    this.text = this.getText();
  };

  Parser.prototype.highlightWords = function() {

  };

  Parser.prototype.replaceWord = function(word, replacement) {

  };


  /* Suggest box
   *************************/

  var SuggestBox = function(config) {
    Box.apply(this, arguments);
  };
  inherits(SuggestBox, Box);

  SuggestBox.prototype.bindEvents = function() {
    this.container.on('click', this.onContainerClick.bind(this));
    $('html').on('click.spellchecker', this.onWindowClick.bind(this));
    this.container.on('click.spellchecker', '.ignore-word', this.handler('ignore.word'));
    this.container.on('click.spellchecker', '.ignore-all', this.handler('ignore.all'));
    this.container.on('click.spellchecker', '.ignore-forever', this.handler('ignore.forever'));
    this.container.on('click.spellchecker', '.spellchecker-suggestbox-words a', this.onSelectWord.bind(this));
  };

  SuggestBox.prototype.createBox = function() {

    var local = this.config.local;

    this.container = $([
      '<div class="spellchecker-suggestbox">',
      ' <div class="spellchecker-suggestbox-footer">',
      '   <a href="#" class="ignore-word">' + local.ignoreWord + '</a>',
      '   <a href="#" class="ignore-all">' + local.ignoreAll + '</a>',
      '   <a href="#" class="ignore-forever">' + local.ignoreForever + '</a>',
      ' </div>',
      '</div>'
    ].join('')).appendTo('body');

    this.words = $([
      '<div class="spellchecker-suggestbox-words">',
      '</div>'
    ].join('')).prependTo(this.container);

    this.loading = $([
      '<div class="loading">',
      this.config.local.loading,
      '</div>'
    ].join(''));

    this.footer = this.container.find('.spellchecker-suggestbox-footer').hide();
  };

  SuggestBox.prototype.addWords = function(words) {
    
    var html = $.map(words, function(word) {
      return '<a href="#">' + word + '</a>';
    }).slice(0, this.config.suggestBox.numWords).join('');

    if (!html) {
      html = '<em>(No suggestions)</em>';
    }

    this.words.html(html);
  };

  SuggestBox.prototype.loadSuggestedWords = function(getWords, word, wordElement) {

    this.wordElement = wordElement;
    this.load(true);
    this.position(wordElement);

    getWords(word, this.onGetWords.bind(this));
  };

  SuggestBox.prototype.load = function(show) {
    this.open();
    this.words.html(show ? this.loading : '');
  };

  SuggestBox.prototype.position = function(element) {

    element = $(element);

    var offset = element.offset();
    var left = offset.left;
    var positionAbove = (offset.top - this.container.height()) + "px";
    var positionBelow = (offset.top + element.outerHeight());
    var top = (this.config.suggestBox.position === 'above') ? positionAbove : positionBelow;

    this.container.css({ top: top, left: left });
  };

  SuggestBox.prototype.open = function() {
    this.container.fadeIn(100);
  };

  SuggestBox.prototype.close = function() {
    this.container.fadeOut(100);
  };

  SuggestBox.prototype.onGetWords = function(words) {
    this.load(false);
    this.addWords(words);
    this.footer.show();
    this.position(this.wordElement);
  };

  SuggestBox.prototype.onContainerClick = function(e) {
    e.stopPropagation();
  };

  SuggestBox.prototype.onWindowClick = function(e) {
    this.close();
  };

  /* Spellchecker driver
   *************************/

  var Driver = function(config) {

    this.config = config;

    this.defaultConfig = {
      type: 'POST',
      dataType: 'json',
      cache: false,
      data: {
        lang: this.config.engine.driver.lang,
        driver: this.config.engine.driver.type
      },
      error: function() {
        alert(this.config.local.requestError);
      }.bind(this)
    };
  };

  Driver.prototype.makeRequest = function(config) {
    
    var defaultConfig = $.extend(true, {}, this.defaultConfig);

    return $.ajax($.extend(true, defaultConfig, config));
  };

  Driver.prototype.checkWords = function(text, callback) {

    var url = [
      this.config.engine.path,
      this.config.engine.driver.type,
      'get_incorrect_words'
    ].join('/');

    return this.makeRequest({
      url: url,
      data: {
        text: text
      },
      success: callback
    });
  };

  Driver.prototype.getSuggestedWords = function(word, callback) {

    var url = [
      this.config.engine.path,
      this.config.engine.driver.type,
      'get_suggestions'
    ].join('/');

    return this.makeRequest({
      url: url,
      data: {
        word: word
      },
      success: callback
    });
  };

  /* Spellchecker drivers
   *************************/

  var Drivers = {};

  Drivers.PSpell = function(path, lang) {
    Driver.apply(this, arguments);
  };
  inherits(Drivers.PSpell, Driver);


  /* Spellchecker
   *************************/

  var SpellChecker = function(element, config) {

    Events.call(this);

    this.element = $(element);
    this.config = $.extend(true, defaultConfig, config);

    this.setupDriver();
    this.setupSuggestBox();
    this.setupIncorrectWordsBox();
    this.bindEvents();
  };
  inherits(SpellChecker, Events);

  SpellChecker.prototype.setupDriver = function() {
    this.driver = new Drivers[this.config.engine.driver.type](this.config);
  };

  SpellChecker.prototype.setupSuggestBox = function() {
    this.suggestBox = new SuggestBox(this.config);
  };

  SpellChecker.prototype.setupIncorrectWordsBox = function() {
    if (this.config.parser === 'html') {
      this.incorrectWords = new IncorrectWordsInline(this.confg);
    } else {
      this.incorrectWords = new IncorrectWordsBox(this.config);
    }
  };

  SpellChecker.prototype.bindEvents = function() {

    this.on('check.success', this.onCheckSuccess.bind(this));
    this.on('check.fail', this.onCheckFail.bind(this));

    this.suggestBox.on('ignore.word', this.onIgnoreWord.bind(this));
    this.suggestBox.on('ignore.all', this.onIgnoreAll.bind(this));
    this.suggestBox.on('ignore.forever', this.onIgnoreForever.bind(this));
    this.suggestBox.on('select.word', this.onSuggestedWordSelect.bind(this));
    
    this.incorrectWords.on('select.word', this.onIncorrectWordSelect.bind(this));
  };

  /* Pubic API methods */

  SpellChecker.prototype.getWordsFromText = function(text) {

    var tagExpression = '<[^>]+>';
    var punctuationExpression = '^[^a-zA-Z\\u00A1-\\uFFFF]|[^a-zA-Z\\u00A1-\\uFFFF]+[^a-zA-Z\\u00A1-\\uFFFF]|[^a-zA-Z\\u00A1-\\uFFFF]$|\\n|\\t|\\s{2,}';

    text = $.trim(text);

    text = text.replace(new RegExp(tagExpression, 'g'), ''); // strip any html tags
    text = text.replace(new RegExp(punctuationExpression, 'g'), ' '); // strip any punctuation

    return text;
  };

  SpellChecker.prototype.check = function() {

    // var text = this.textParser.getText();
    var text = this.element.val();

    var text = this.element.val();
    var words = this.getWordsFromText(text);

    this.driver.checkWords(words, this.onCheckWords.bind(this));
  };

  SpellChecker.prototype.showSuggestedWords = function(word, element) {
    var getWords = this.driver.getSuggestedWords.bind(this.driver);
    this.suggestBox.loadSuggestedWords(getWords, word, element);
  };

  SpellChecker.prototype.replaceWordInText = function(text, oldWord, newWord) {
    return text
      .replace(
        new RegExp("([^a-zA-Z\\u00A1-\\uFFFF]?)(" + oldWord + ")([^a-zA-Z\\u00A1-\\uFFFF]?)", "g"),
        '$1' + newWord + '$3'
      )
      .replace(
        new RegExp("^(" + oldWord + ")([^a-zA-Z\\u00A1-\\uFFFF])", "g"),
        newWord + '$2'
      )
      .replace(
        new RegExp("([^a-zA-Z\\u00A1-\\uFFFF])(" + oldWord + ")$", "g"),
        '$1' + newWord
      );
  };

  SpellChecker.prototype.replaceWord = function(newWord) {

    var oldText = this.element.val();
    var oldWord = this.badWord;
    var newText = this.replaceWordInText(oldText, oldWord, newWord);

    this.element.val(newText);
  };

  /* Event handlers */

  SpellChecker.prototype.onCheckWords = function(data) {
    var badWords = data.data;
    var outcome = badWords.length ? 'fail' : 'success';
    this.trigger('check.' + outcome, badWords);
  };

  SpellChecker.prototype.onCheckSuccess = function() {
  };

  SpellChecker.prototype.onCheckFail = function(badWords) {
    this.incorrectWords.addWords(badWords);
  };

  SpellChecker.prototype.onSuggestedWordSelect = function(e, word, element) {
    e.preventDefault();
    this.replaceWord(word, element);
    this.suggestBox.close();
  };

  SpellChecker.prototype.onIgnoreWord = function() {
    alert('Ignore word');
  };

  SpellChecker.prototype.onIgnoreAll = function() {
    alert('Ignore all');
  };

  SpellChecker.prototype.onIgnoreForever = function() {
    alert('Ignore forever');
  };

  SpellChecker.prototype.onIncorrectWordSelect = function(e, word, element) {
    e.preventDefault();
    this.badWord = word;
    this.showSuggestedWords(word, element);
  };

  $.SpellChecker = SpellChecker;

}(jQuery));