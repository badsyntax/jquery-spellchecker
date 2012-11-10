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

namespace SpellChecker\Driver;

class Google extends \SpellChecker\Driver
{
	protected $_default_config = array(
		'lang' => 'en'
	);

	public function get_word_suggestions($word = NULL)
	{
		$matches = $this->get_matches($word);

		$suggestions = array();

		if (isset($matches[0][3]) AND trim($matches[0][3]) !== '')
		{
			$suggestions = explode("\t", $matches[0][3]);
		}

		return $suggestions;
	}

	public function get_incorrect_words()
	{
		$texts = (array) \SpellChecker\Request::post('text');

		$response = array();

		foreach($texts as $text)
		{    
			$words = $this->get_matches($text);

			$incorrect_words = array();

			foreach($words as $word)
			{
				$incorrect_words[] = mb_substr($text, $word[0], $word[1], 'utf-8');
			}

			$response[] = $incorrect_words;
		}

		$this->send_data('success', $response);
	}

	public function check_word($word = NULL) {}

	private function get_matches($text)
	{
		$xml_response = '';
		$url = 'https://www.google.com/tbproxy/spell?lang='.$this->_config['lang'];

		$body = '<?xml version="1.0" encoding="utf-8" ?>';
		$body .= '<spellrequest textalreadyclipped="0" ignoredups="0" ignoredigits="1" ignoreallcaps="0">';
		$body .= '<text>'.$text.'</text></spellrequest>';

		if (!function_exists('curl_init'))
		{
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

		$xml = simplexml_load_string($xml_response);

		$matches = array();

		foreach($xml->c as $word)
		{
			$matches[] = array(
				(int) $word->attributes()->o,
				(int) $word->attributes()->l,
				(int) $word->attributes()->s,
				(string) $word
			);
		}

		return $matches;
	}
}
