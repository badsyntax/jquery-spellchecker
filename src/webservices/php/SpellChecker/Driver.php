<?php
/**
 * Spellchecker driver class
 *
 * @package    jQuery Spellchecker (https://github.com/badsyntax/jquery-spellchecker)
 * @author     Richard Willis
 * @copyright  (c) Richard Willis
 * @license    https://github.com/badsyntax/jquery-spellchecker/blob/master/LICENSE-MIT
 */

namespace SpellChecker;

abstract class Driver {

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
			$response = new \StdClass();
			$response->outcome = $outcome;
			$response->data = $data;
		}

		header('Content-type: application/json');

		echo json_encode($response);
	}

	public function get_suggestions()
	{
		$word = Request::post('word');

		$this->send_data(NULL, $this->get_word_suggestions($word));
	}

	public function get_incorrect_words()
	{
		$texts = (array) Request::post('text');
		$callback = array($this, '_get_incorred_words');
		$response = array_map($callback, $texts);

		$this->send_data('success', $response);
	}

	public function _get_incorred_words($text)
	{
		$words = explode(' ', $text);
		$callback = array($this, 'check_word');
		return array_values(array_filter($words, $callback));
	}

	abstract public function get_word_suggestions($word = NULL);

	abstract public function check_word($word = NULL);
}