<?php
/**
 * Spellchecker class
 * https://github.com/badsyntax/jquery-spellchecker
 *
 * @package    jQuery Spellchecker
 * @category   Core
 * @author     Richard Willis
 * @copyright  (c) Richard Willis
 * @license    MIT
 */

class SpellChecker_Driver_Google extends Spellchecker_Driver
{


}

//  private function google() {
  
//    foreach($_REQUEST as $key => $value) {
//      $$key = html_entity_decode(urldecode(stripslashes(trim($value))));
//    }

//    // return badly spelt words from a chunk of text  
//    if (isset($text)) {
//      $words = array();
//      foreach($matches = $this->getGoogleMatches($text) as $word) {
//        // position & length of badly spelt word
//        $word = substr($text, $word[1], $word[2]);
//        if (!in_array($word, $words)){
//          $words[] = $word;
//        }

//      }
//      exit(json_encode($words));
//    }
//    // return suggestions for a specific word
//    else if (isset($suggest)) {
//      $matches = 
//      $this->getGoogleMatches($suggest) and
//      $matches[0][4] and 
//      exit(json_encode(explode("\t", $matches[0][4]))) or
//      exit(json_encode(array()));
//    } 
//  }
  
//  private function getGoogleMatches($str) {
//    $url = 'https://www.google.com';
//    $path = '/tbproxy/spell?lang='.$this->lang.'&hl=en';

//    // setup XML request
//    $xml = '<?xml version="1.0" encoding="utf-8" ';
//    $xml .= '<spellrequest textalreadyclipped="0" ignoredups="0" ignoredigits="1" ignoreallcaps="1">';
//    $xml .= '<text>'.$str.'</text></spellrequest>';

//    // setup headers to be sent
//    $header  = "POST {$path} HTTP/1.0 \r\n";
//    $header .= "MIME-Version: 1.0 \r\n";
//    $header .= "Content-type: text/xml; charset=utf-8 \r\n";
//    $header .= "Content-length: ".strlen($xml)." \r\n";
//    $header .= "Request-number: 1 \r\n";
//    $header .= "Document-type: Request \r\n";
//    $header .= "Connection: close \r\n\r\n";
//    $header .= $xml;

//    // response data
//    $xml_response = '';

//    // use curl if it exists
//    if (function_exists('curl_init')) {
//      $ch = curl_init();
//      curl_setopt($ch, CURLOPT_URL,$url);
//      curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
//      curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $header);
//      curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
//      $xml_response = curl_exec($ch);
//      curl_close($ch);
//    } else {
//      exit;
//    }

//    // grab and parse content, remove google XML formatting
//    $matches = array();
//    preg_match_all('/<c o="([^"]*)" l="([^"]*)" s="([^"]*)">([^<]*)<\/c>/', $xml_response, $matches, PREG_SET_ORDER);

//    // note: google will return encoded data, no need to encode ut8 characters
//    return $matches;
//  }