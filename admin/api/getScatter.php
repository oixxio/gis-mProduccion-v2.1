<?php
	header('Content-type: text/html; charset=UTF-8');

	error_reporting(E_ALL);
	ini_set('display_errors', 1);

	require 'connDB.php';	
	$conn->query('SET CHARACTER SET utf8');
	$conn->query('SET NAMES utf8');

	$results = [""];
	$i=0;

	//Para que tome los datos de input del POST desde el front
	$rawJSON = file_get_contents('php://input');
	$JSON = json_decode($rawJSON);
	$region_id = $JSON->region_id;
	$sector_id = $JSON->sector_id;
	
	$query = '
		SELECT
		*
		FROM scatter
		WHERE region_id = '.$region_id.' AND sector_id = '.$sector_id;

	$resultQuery = $conn->query($query);

	while($result = $resultQuery->fetch_assoc()) {				
     	$results[$i] = $result;
     	$i++;
    }

	if ($results[0] != NULL) {
		$json_string = json_encode($results, JSON_PRETTY_PRINT);				
	}else{
		die($conn->error);
	}

	echo $json_string;