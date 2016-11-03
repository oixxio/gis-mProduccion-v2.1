<?php
	header('Content-type: text/html; charset=UTF-8');

	error_reporting(E_ALL);
	ini_set('display_errors', 1);

	require 'connDB.php';	
	$conn->query('SET CHARACTER SET utf8');
	$conn->query('SET NAMES utf8');

	$rawJSON = file_get_contents('php://input');
	$JSON = json_decode($rawJSON);
	$region_id 		= $JSON->region_id;
	$sector_id 		= $JSON->sector_id;
	$empleo 		= $JSON->empleo;
	$empleo_old 	= $JSON->empleo_old;
	$export 		= $JSON->export;
	$export_old 	= $JSON->export_old;

	$query = '
		INSERT INTO `entries`(`region_id`, `sector_id`, `empleo`, `empleo_old`, `export`, `export_old`) 
		VALUES ('.$region_id.','.$sector_id.','.$empleo.','.$empleo_old.','.$export.','.$export_old.')'; 

	$resultQuery = $conn->query($query);


	if ($resultQuery != NULL) {
		$json_string = json_encode($resultQuery, JSON_PRETTY_PRINT);				
	}else{
		die($conn->error);
	}

	echo $json_string;
