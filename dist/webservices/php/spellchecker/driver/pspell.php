<?php
/**
 * Spellchecker PSpell driver class
 * !! Aspell and PHP Pspell are required !!
 *
 * @package    jQuery Spellchecker (https://github.com/badsyntax/jquery-spellchecker)
 * @author     Richard Willis
 * @copyright  (c) Richard Willis
 * @license    https://github.com/badsyntax/jquery-spellchecker/blob/master/LICENSE-MIT
 */

class SpellChecker_Driver_PSpell extends Spellchecker_Driver
{

  protected $_default_config = array(
    'dictionary' => 'pspell/dictionary',
    'lang' => 'en'
  );

  public function __construct($config = array())
  {
    parent::__construct($config);

    $this->pspell_link = pspell_new($this->_config['lang'], '', '', 'utf-8');
  }

  public function get_suggestions()
  {
    $word = $_POST['word'];

    $suggestions = pspell_suggest($this->pspell_link, $word);

    $this->send_data(NULL, $suggestions);
  }

  public function get_incorrect_words()
  {
    $text = $_POST['text'];

    $words = explode(' ', $text);

    $incorrect_words = array();

    foreach($words as $word)
    {
      if (!pspell_check($this->pspell_link, $word))
      {
        $incorrect_words[] = $word;
      }
    }

    $this->send_data('success', $incorrect_words);
  }

  public function add_to_dictionary()
  {
    $pspell_config = pspell_config_create('en');

    pspell_config_personal($pspell_config, $this->pspell_personal_dictionary) or die('can\'t find pspell dictionary');

    $this->pspell_link = pspell_new_config($pspell_config);

    pspell_add_to_personal($this->pspell_link, strtolower($addtodictionary)) or die('You can\'t add a word to the dictionary that contains any punctuation.');
    pspell_save_wordlist($this->pspell_link);

    $this->send_data('success');
  }

}