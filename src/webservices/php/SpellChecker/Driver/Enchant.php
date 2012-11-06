<?php
/**
 * Spellchecker Enchant driver class
 * !! Enchant needs to be installed, as well as a back-end service (pspell, hspell etc) !!
 *
 * @package    jQuery Spellchecker (https://github.com/badsyntax/jquery-spellchecker)
 * @author     Richard Willis
 * @copyright  (c) Richard Willis
 * @license    https://github.com/badsyntax/jquery-spellchecker/blob/master/LICENSE-MIT
 */

namespace SpellChecker\Driver;

class Enchant extends \SpellChecker\Driver
{
	protected $_default_config = array(
		'lang' => 'en'
	);

	public function __construct($config = array())
	{
		parent::__construct($config);

		if (!function_exists('enchant_broker_init'))
		{
			exit('Enchant library not found');
		}

		$this->broker = enchant_broker_init();
		$this->dictionary = enchant_broker_request_dict($this->broker, $this->_config['lang']);

		if (!enchant_broker_dict_exists($this->broker, $this->_config['lang']))
		{
			exit('Enchant dictionary not found for lang: ' . $this->_config['lang']);
		}
	}

	public function get_word_suggestions($word = NULL)
	{
		return enchant_dict_suggest($this->dictionary, $word);
	}

	public function check_word($word = NULL)
	{
		return !enchant_dict_check($this->dictionary, $word);
	}
}