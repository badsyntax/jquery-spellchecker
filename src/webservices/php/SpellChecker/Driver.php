<?php namespace SpellChecker;

/**
 * Spellchecker driver class
 *
 * @package    jQuery Spellchecker (https://github.com/badsyntax/jquery-spellchecker)
 * @author     Richard Willis
 * @copyright  (c) Richard Willis
 * @license    https://github.com/badsyntax/jquery-spellchecker/blob/master/LICENSE-MIT
 */
abstract class Driver {

	protected $_config = array();

	protected $_default_config = array();

	public function __construct($config = array())
	{
		$this->_config = array_merge($this->_default_config, array_filter($config));
	}

	protected function send_data($data, $outcome = null)
	{
		return ($outcome === null) ? $data : compact('outcome', 'data');
	}

	public function get_suggestions($inputs = array())
	{
		$word = isset($inputs['word']) ? $inputs['word'] : '';
		$response = empty($word) ? array() : $this->get_word_suggestions($word = trim($word));

		// remove original word from the results
		if ($response) {
			$response = array_diff($response, array($word));
		}

		return $this->send_data($response);
	}

	public function get_incorrect_words($inputs = array())
	{
		$texts = isset($inputs['text']) ? (array)$inputs['text'] : array();

		$callback = array($this, '_get_incorrect_words');
		$response = array_map($callback, $texts);

		return $this->send_data($response, 'success');
	}

	protected function _get_incorrect_words($text)
	{
		if (empty($text))
			return array();

		$words = array_unique(preg_split('/\s+/u', trim($text)));
		$callback = array($this, 'check_word');
		return array_values(array_filter($words, $callback));
	}

	protected function check_word($word)
	{
		$result = $this->is_incorrect_word($word);

		// word can contains hyphens
		if ($result && count($words = preg_split('/[-_]+/', $word)) > 1) {
			if ($this->is_incorrect_word(implode('', $words))) {
				foreach ($words as $w) {
					if ($this->is_incorrect_word($w))
						return true;
				}
			}

			return false;
		}

		return $result;
	}

	abstract protected function get_word_suggestions($word);

	abstract protected function is_incorrect_word($word);
}