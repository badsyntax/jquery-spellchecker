<?php
/**
 * Spellchecker PSpell driver class
 * !! Aspell and PHP Pspell are required !!
 *
 * @package    jQuery Spellchecker (https://github.com/badsyntax/jquery-spellchecker)
 * @author     Richard Willis
 * @copyright  (c) Richard Willis
 * @license    https://github.com/badsyntax/jquery-spellchecker/blob/master/LICENSE-MIT
 */

namespace SpellChecker\Driver;

class PSpell extends \SpellChecker\Driver
{
	protected $_default_config = array(
		'dictionary' => 'pspell/dictionary',
		'lang' => 'en'
	);

	public function __construct($config = array())
	{
		parent::__construct($config);

		$this->pspell_link = pspell_new($this->_config['lang'], '', '', 'utf-8');
	}

	public function get_word_suggestions($word = NULL)
	{
		return pspell_suggest($this->pspell_link, $word);
	}

	public function check_word($word = NULL)
	{
		return !pspell_check($this->pspell_link, $word);
	}
}