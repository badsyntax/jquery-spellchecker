<?php
/**
 * Spellchecker request class
 *
 * @package    jQuery Spellchecker (https://github.com/badsyntax/jquery-spellchecker)
 * @author     Richard Willis
 * @copyright  (c) Richard Willis
 * @license    https://github.com/badsyntax/jquery-spellchecker/blob/master/LICENSE-MIT
 */

namespace SpellChecker;

class Request {

	public function __construct()
	{
		if (!self::post())
		{
			return;
		}
		$this->driver = self::post('driver');
		$this->action = self::post('action');
		$this->lang = self::post('lang');
		$this->execute_action();
	}

	public function execute_action()
	{
		$class = '\SpellChecker\Driver\\' . ucfirst(strtolower($this->driver));
		$driver = new $class(array('lang' => $this->lang));
		$driver->{$this->action}();
	}

	public static function post($key = NULL)
	{
		if ($key === NULL)
		{
			return $_POST;
		}
		if (!$_POST)
		{
			return '';
		}
		return isset($_POST[$key]) ? $_POST[$key] : '';
	}
}