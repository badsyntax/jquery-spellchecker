<?php namespace SpellChecker\Driver;

/**
 * Spellchecker PSpell driver class
 * !! ASpell and PHP PSpell are required !!
 *
 * @package    jQuery Spellchecker (https://github.com/badsyntax/jquery-spellchecker)
 * @author     Richard Willis
 * @copyright  (c) Richard Willis
 * @license    https://github.com/badsyntax/jquery-spellchecker/blob/master/LICENSE-MIT
 */
class PSpell extends \SpellChecker\Driver
{
	protected $_default_config = array(
		'encoding' => 'utf-8',
		'dictionary' => 'pspell/dictionary',
		'lang' => 'en'
	);

	protected $pspell_link;

	public function __construct($config = array())
	{
		parent::__construct($config);

		if (!function_exists('pspell_new')) {
			throw new \Exception('PSpell library not found.');
		}

		if (isset($this->_config['dictionary']) && is_dir($dir = $this->_config['dictionary'])) {
			$conf = pspell_config_create($this->_config['lang'], null, null, $this->_config['encoding']);

			// if the ASpell dictionaries that you want are not installed,
			// copy the ASpell dictionaries and set the path to the dictionaries here
			pspell_config_data_dir($conf, $dir);
			pspell_config_dict_dir($conf, $dir);

			$this->pspell_link = pspell_new_config($conf);
		} else {
			$this->pspell_link = pspell_new($this->_config['lang'], null, null, $this->_config['encoding']);
		}

		if ($this->pspell_link === false) {
			throw new \Exception('PSpell dictionary not found for lang: ' . $this->_config['lang']);
		}
	}

	protected function get_word_suggestions($word)
	{
		return pspell_suggest($this->pspell_link, $word);
	}

	protected function is_incorrect_word($word)
	{
		return !pspell_check($this->pspell_link, $word);
	}
}