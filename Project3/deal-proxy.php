<?PHP
	// Grab search term
	// ufc1gbjzmwd11aseekaw4h4bvsytze
	$term = "portal";
	if(array_key_exists('term', $_GET)){
		$term = $_GET['term'];
	}
	$URL = "https://www.cheapshark.com/api/1.0/games?title=$term";
    header("Access-Control-Allow-Origin: *");     // turn on CORS
    echo file_get_contents($URL);
?>