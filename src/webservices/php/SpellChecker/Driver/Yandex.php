<?php
/**
 * Spellchecker Yandex driver class
 * !! Curl is required to use Yandex spellchecker API !!
 */

namespace SpellChecker\Driver;

class Yandex extends \SpellChecker\Driver
{
	protected $_default_config = array(
		'lang' => 'ru,en'
	);
	
	const IGNORE_UPPERCASE = 1;
	const IGNORE_DIGITS = 2; // ignore words with digits
	const IGNORE_URLS = 4;
	const FIND_REPEAT_WORDS = 8;
	const IGNORE_LATIN = 16;
	const NO_SUGGEST = 32;
	const FLAG_LATIN = 128;
	const IGNORE_CAPITALIZATION = 512;
	
	public function get_incorrect_words()
	{
		$texts = (array) \SpellChecker\Request::post('text');
		$options = self::IGNORE_DIGITS + self::IGNORE_URLS;

		$xml = $this->check_texts($texts, $options + self::NO_SUGGEST);
		
		$response = array();
		foreach ($xml->SpellResult as $result)
		{
			$words = array();
			foreach ($result->error as $error)
			{
				$words[] = (string) $error->word[0];
			}
			$response[] = $words;
		}

		$this->send_data('success', $response);
	}

	public function get_word_suggestions($word = NULL)
	{
		$xml = $this->check_texts(array($word), 0);
		
		$suggestions = array();
		$result = $xml->SpellResult[0];
		foreach ($result->error as $error)
		{
			foreach ($error->s as $s)
			{
				$suggestions[] = (string) $s;
			}
			break;
		}
		
		return $suggestions;
	}

	public function check_word($word = NULL) {}
	
	private function check_texts($texts, $options)
	{
		$url = 'http://speller.yandex.net/services/spellservice/checkTexts';
		
		$body  = 'lang=' . urlencode($this->_config['lang']);
		$body .= '&options=' . $options;
		foreach ($texts as $text)
		{
			$body .= "&text=" . urlencode($text);
		}

		if (!function_exists('curl_init'))
		{
			exit('Curl is not available');
		}

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
		$xml_response = curl_exec($ch);
		curl_close($ch);

		return simplexml_load_string($xml_response);
	}
}
