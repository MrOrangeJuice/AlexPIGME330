<?PHP
	// Grab search term, limit, and offset
	$term = "mario";
	$limit = "20";
	if(array_key_exists('term', $_GET)){
		$term = $_GET['term'];
	}
	if(array_key_exists('limit', $_GET)){
		$limit = $_GET['limit'];
	}
    $URL = "https://www.giantbomb.com/api/search/?api_key=f322956077296a291c6fd24042861b647304831a&format=json&query=$term&limit=$limit&resources=game";
    header('content-type:application/json');      // tell the requestor that this is JSON
    header("Access-Control-Allow-Origin: *");     // turn on CORS
    echo file_get_contents($URL);
?>