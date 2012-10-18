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

  abstract public function get_suggestions();

  abstract public function get_incorrect_words();

  abstract public function add_to_dictionary();
}