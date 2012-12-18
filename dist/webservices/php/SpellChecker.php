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

require_once 'SplClassLoader.php';

$classLoader = new SplClassLoader('SpellChecker', 'SpellChecker');
$classLoader->setIncludePathLookup(true);
$classLoader->register();

new \SpellChecker\Request();