<?php
/**
 * Spellchecker class
 *
 * @package    jQuery Spellchecker (https://github.com/badsyntax/jquery-spellchecker)
 * @author     Richard Willis
 * @copyright  (c) Richard Willis
 * @license    https://github.com/badsyntax/jquery-spellchecker/blob/master/LICENSE-MIT
 */

ini_set('display_errors', 1);

class SpellChecker {

	public function __construct()
	{
		$driver = $_POST['driver'];
		$action = $_POST['action'];
		$lang = $_POST['lang'];

		if (!$driver)
		{
			exit('Driver not found in request');
		}
		if (!$action)
		{
			exit('Action not found in request');
		}
		if (!$lang)
		{
			exit('Lang not found in request');
		}

		$this->load_driver($driver, $lang);
		$this->execute_action($action);
	}

	public function load_driver($driver = NULL, $lang = NULL)
	{
		$base_driver_path = 'spellchecker/driver.php';
		$driver_path = 'spellchecker/driver/'.strtolower($driver).'.php';

		if (!file_exists($driver_path))
		{
			exit('Driver does not exist on file system');
		}

		require_once $base_driver_path;
		require_once $driver_path;

		$driver_class = 'Spellchecker_Driver_'.ucfirst($driver);

		$this->driver = new $driver_class(array(
			'lang' => $lang
		));
	}

	public function execute_action($action = NULL)
	{
		if (!method_exists($this->driver, $action))
		{
			exit('Action does not exist on driver');
		}

		$this->driver->{$action}();
	}
}

$_POST AND new SpellChecker();