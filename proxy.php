<?php
$url = $_SERVER['REQUEST_URI'];

$pattern = "/\/proxy.php\?tile=([0-9]{1,3}\/[0-9]{1,5}\/[0-9]{1,8})/";
preg_match($pattern, $url, $matches);


header('Content-Type: image/png');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
//header("Access-Control-Max-Age: 1000");
//header("Access-Control-Allow-Headers: X-Requested-With, Content-Type, Origin, Cache-Control, Pragma, Authorization, Accept, Accept-Encoding");
//header("Access-Control-Allow-Methods: PUT, POST, GET, OPTIONS, DELETE");
if (count($matches) > 0) {
  $url = 'http://andi-mini/osm/'.$matches[1].".png";
  readfile($url);
} 
 