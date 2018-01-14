<?php namespace SpellChecker;

/**
 * Spellchecker request class
 *
 * @package    jQuery Spellchecker (https://github.com/badsyntax/jquery-spellchecker)
 * @author     Richard Willis
 * @copyright  (c) Richard Willis
 * @license    https://github.com/badsyntax/jquery-spellchecker/blob/master/LICENSE-MIT
 */
class Request {

	public function __construct($inputs = array(), $response = 'static::send_response', $config = array())
	{
		if (empty($inputs))
			$inputs = $_POST;

		if (empty($inputs['action']))
			return;

		$data = static::execute_action($inputs, $config);
		call_user_func($response, $data);
	}

	public static function execute_action($inputs = array(), $config = array())
	{
		$driver = isset($inputs['driver']) ? $inputs['driver'] : 'PSpell';
		$lang = isset($inputs['lang']) ? $inputs['lang'] : 'en';

		$class = '\SpellChecker\Driver\\' . ucfirst(strtolower($driver));
		$driver = new $class(array_merge($config, compact('lang')));

		return $driver->{$inputs['action']}($inputs);
	}

	public static function send_response($data)
	{
		header('Content-type: application/json');

		echo json_encode($data);
	}
}