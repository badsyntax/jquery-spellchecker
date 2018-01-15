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

require_once '../../../vendor/autoload.php';

header('Access-Control-Allow-Origin: *');
new \SpellChecker\Request();