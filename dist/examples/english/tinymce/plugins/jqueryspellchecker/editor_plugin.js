/*
 * jQuery Spellchecker - TinyMCE Plugin - v0.2.4
 * https://github.com/badsyntax/jquery-spellchecker
 * Copyright (c) 2012 Richard Willis; Licensed MIT
 */

(function() {

  tinymce.create('tinymce.plugins.jQuerySpellcheckerPlugin', {

    getInfo : function() {
      return {
        longname : 'jQuery Spellchecker',
        author : 'Richard Willis',
        authorurl : 'http://badsyntax.co',
        infourl : 'https://github.com/badsyntax/jquery-spellchecker',
        version : '0.1.1'
      };
    },

    init : function(ed, url) {
      this.editor = ed;
      ed.addCommand('mcejQuerySpellCheck', $.proxy(this, '_onCheck'));
    },

    _onCheck: function() {

      var t = this;

      if (!t.spellchecker) {
        t.createSpellchecker();
        t.spellchecker.check();
        t.disableEditor();
        t.editor.controlManager.setActive('jqueryspellchecker', true);
      } else {
        t.spellchecker.destroy();
        t.spellchecker = null;
        t.enableEditor();
        t.editor.controlManager.setActive('jqueryspellchecker', false);
      }
    },

    toggleEditor: function(disabled, editable) {
      $.each(this.editor.theme.toolbarGroup.controls, function(i, controls) {
        $.each(controls.controls, function(c, control) {
          (!/jqueryspellchecker/.test(control.id)) && control.setDisabled(disabled);
        });
      });
      this.editor.getBody().setAttribute('contenteditable', editable);
    },

    disableEditor: function() {
      this.toggleEditor(true, false);
    },

    enableEditor: function() {
      this.toggleEditor(false, true);
    },

    createSpellchecker: function() {

      var t = this;
      var ed = t.editor;

      t.spellchecker = new $.SpellChecker(ed.getBody(), {
        lang: 'en',
        parser: 'html',
        webservice: {
          path: "/webservices/php/SpellChecker.php",
          driver: 'pspell'
        },
        suggestBox: {
          position: 'below',
          appendTo: 'body',
          position: this.positionSuggestBox()
        },
        getText: function() {
          return ed.getContent();
        }
      });

      t.spellchecker.on('check.success', function() {
        alert('There are no incorrectly spelt words.');
        t._onCheck();
      });
      t.spellchecker.on('check.start', function() {
        ed.setProgressState(1);
      });
      t.spellchecker.on('check.complete', function() {
        ed.setProgressState(0);
      });
      t.spellchecker.on('select.word', function(e) {
        return tinymce.dom.Event.cancel(e);
      });
      t.spellchecker.on('replace.word', function() {
        if (t.spellchecker.parser.incorrectWords.length === 0) {
          t._onCheck();
        }
      });
    },

    positionSuggestBox: function() {

      var t = this;

      return function() {

        var ed = t.editor;
        var dom = ed.dom;
        var vp = dom.getViewPort(ed.getWin());
        var word = (this.wordElement.data('firstElement') || this.wordElement)[0];

        var p1 = $(ed.getContentAreaContainer()).offset();
        var offset_top = p1.top;
        var offset_left = p1.left;

        var p2 = $(word).offset();
        var left = p2.left + offset_left;
        var top = p2.top - vp.y + offset_top + word.offsetHeight;

        this.container.css({ 
          top: top, 
          left: left 
        });
      };
    },

    createControl : function(n, cm) {
      if (n == 'jqueryspellchecker') {
        return cm.createButton(n, {
          title : 'spellchecker.desc', 
          cmd : 'mcejQuerySpellCheck', 
          scope : this
        });
      }
    }
  });

  // Register plugin
  tinymce.PluginManager.add('jqueryspellchecker', tinymce.plugins.jQuerySpellcheckerPlugin);
})();
