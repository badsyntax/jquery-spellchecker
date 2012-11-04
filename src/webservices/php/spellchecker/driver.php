<?php
/**
 * Spellchecker driver class
 *
 * @package    jQuery Spellchecker (https://github.com/badsyntax/jquery-spellchecker)
 * @author     Richard Willis
 * @copyright  (c) Richard Willis
 * @license    https://github.com/badsyntax/jquery-spellchecker/blob/master/LICENSE-MIT
 */

abstract class SpellChecker_Driver {

  protected $_config = array();

  protected $_default_config = array();

  public function __construct($config = array())
  {
    $this->_config = array_merge($this->_default_config, $config);
  }

  public function send_data($outcome, $data) {

    $response = $data;

    if ($outcome !== NULL)
    {
      $response = new StdClass();
      $response->outcome = $outcome;
      $response->data = $data;
    }

    header('Content-type: application/json');

    echo json_encode($response);
  }

  public function get_suggestions()
  {
    $word = $_POST['word'];

    $this->send_data(NULL, $this->get_word_suggestions($word));
  }

  public function get_incorrect_words()
  {
    $texts = (array) $_POST['text'];

    $response = array();

    foreach($texts as $text)
    {
      $words = explode(' ', $text);

      $incorrect_words = array();

      foreach($words as $word)
      {
        if (!$this->check_word($word))
        {
          $incorrect_words[] = $word;
        }
      }

      $response[] = $incorrect_words;
    }

    $this->send_data('success', $response);
  }

  abstract public function get_word_suggestions($word = NULL);

  abstract public function check_word($word = NULL);
}