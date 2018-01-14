<?php namespace SpellChecker\Driver;

/**
 * Spellchecker Enchant driver class
 * !! Enchant needs to be installed, as well as a back-end service (PSpell, HSpell, etc.) !!
 *
 * @package    jQuery Spellchecker (https://github.com/badsyntax/jquery-spellchecker)
 * @author     Richard Willis
 * @copyright  (c) Richard Willis
 * @license    https://github.com/badsyntax/jquery-spellchecker/blob/master/LICENSE-MIT
 */
class Enchant extends \SpellChecker\Driver
{
	protected $_default_config = array(
		'lang' => 'en'
	);

	protected $broker;
	protected $dictionary;

	public function __construct($config = array())
	{
		parent::__construct($config);

		if (!function_exists('enchant_broker_init'))
		{
			throw new \Exception('Enchant library not found.');
		}

		$this->broker = enchant_broker_init();
		if (!enchant_broker_dict_exists($this->broker, $this->_config['lang']))
		{
			throw new \Exception('Enchant dictionary not found for lang: ' . $this->_config['lang']);
		}

		$this->dictionary = enchant_broker_request_dict($this->broker, $this->_config['lang']);
	}

	public function __destruct()
	{
		if (isset($this->dictionary))
			enchant_broker_free_dict($this->dictionary);

		if (isset($this->broker))
			enchant_broker_free($this->broker);
	}

	protected function get_word_suggestions($word)
	{
		return enchant_dict_suggest($this->dictionary, $word);
	}

	protected function is_incorrect_word($word)
	{
		return !enchant_dict_check($this->dictionary, $word);
	}
}