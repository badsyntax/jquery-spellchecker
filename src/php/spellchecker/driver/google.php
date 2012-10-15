<?php
/**
 * Spellchecker Google driver class
 * !! Curl is required to use the google spellchecker API !!
 *
 * @package    jQuery Spellchecker (https://github.com/badsyntax/jquery-spellchecker)
 * @author     Richard Willis
 * @copyright  (c) Richard Willis
 * @license    https://github.com/badsyntax/jquery-spellchecker/blob/master/LICENSE-MIT
 */

class SpellChecker_Driver_Google extends Spellchecker_Driver
{
  protected $_default_config = array(
    'lang' => 'en'
  );

  public function get_suggestions()
  {
    $word = urldecode($_POST['word']);

    $suggestions = array();

    $matches = $this->get_matches($word);

    if (isset($matches[0][4]) AND trim($matches[0][4]) !== '')
    {
      $suggestions = explode("\t", $matches[0][4]);
    }

    $this->send_data(NULL, $suggestions);
  }

  public function get_incorrect_words()
  {
    $text = urldecode($_POST['text']);

    $words = $this->get_matches($text);

    $incorrect_words = array();

    foreach($words as $word)
    {
      $incorrect_words[] = substr($text, $word[1], $word[2]);
    }

    $this->send_data('success', $incorrect_words);
  }

  public function add_to_dictionary() {}

  private function get_matches($text)
  {
    $xml_response = '';
    $url = 'https://www.google.com/tbproxy/spell?lang='.$this->_config['lang'];

    $body = '<?xml version="1.0" encoding="utf-8" ?>';
    $body .= '<spellrequest textalreadyclipped="0" ignoredups="0" ignoredigits="1" ignoreallcaps="1">';
    $body .= '<text>'.$text.'</text></spellrequest>';

    if (!function_exists('curl_init')) {
      exit('Curl is not available');
    }

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL,$url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
    $xml_response = curl_exec($ch);
    curl_close($ch);

    // grab and parse content, remove google XML formatting
    $matches = array();
    preg_match_all('/<c o="([^"]*)" l="([^"]*)" s="([^"]*)">([^<]*)<\/c>/', $xml_response, $matches, PREG_SET_ORDER);

    // note: google will return encoded data, no need to encode ut8 characters
    return $matches;
  }
}