/*
 * jQuery Spellchecker - CKeditor Plugin - v0.2.2
 * https://github.com/badsyntax/jquery-spellchecker
 * Copyright (c) 2012 Richard Willis; Licensed MIT
 */

CKEDITOR.plugins.add('jqueryspellchecker', {

	init: function( editor ) {

		var pluginName = 'jqueryspellchecker';
		
    editor.addCommand( pluginName, CKEDITOR.plugins.jQuerySpellChecker );

    editor.ui.addButton('jQuerySpellChecker', {
      label: 'SpellCheck',
      icon: 'spellchecker',
      command: pluginName
  	});
	}
});

CKEDITOR.plugins.jQuerySpellChecker = {
	exec: function( editor ) {
		this.toggleSpellChecker(editor);
	},
	canUndo: false,
	readOnly: 1,
	toggleSpellChecker: function(editor) {

    this.editor = editor;

    if (!this.spellchecker) {
			editor.setReadOnly(true);
      this.createSpellchecker();
      this.spellchecker.check();
    } else {
			editor.setReadOnly(false);
      this.spellchecker.destroy();
      this.spellchecker = null;
    }

		editor.commands.jqueryspellchecker.toggleState();
	},
  createSpellchecker: function() {

    var t = this;
    var ed = t.editor;

    t.spellchecker = new $.SpellChecker(ed.document.$.body, {
      lang: 'en',
      parser: 'html',
      webservice: {
        path: "/php/spellchecker.php",
        driver: 'pspell'
      },
      suggestBox: {
        position: 'below',
        appendTo: 'body',
        position: this.positionSuggestBox()
      }
    });

    t.spellchecker.on('check.success', function() {
      alert('There are no incorrectly spelt words.');
      t.exec();
    });
    t.spellchecker.on('replace.word', function() {
      if (t.spellchecker.parser.incorrectWords.length === 0) {
        t.exec();
      }
    });
  },
  positionSuggestBox: function() {

    var t = this;

    return function() {

      var ed = t.editor;
      var word = (this.wordElement.data('firstElement') || this.wordElement)[0];

      var p1 = $(ed.container.$).find('iframe').offset();
      var p2 = $(ed.container.$).offset();
      var p3 = $(word).offset();

      var left = p3.left + p2.left;
      var top = p3.top + p2.top + (p1.top - p2.top) + word.offsetHeight;

      this.container.css({ 
        top: top, 
        left: left 
      });
    };
  },
};