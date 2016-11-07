<?php
	header('Content-type: text/html; charset=UTF-8');

	error_reporting(E_ALL);
	ini_set('display_errors', 1);

	require 'connDB.php';	
	$conn->query('SET CHARACTER SET utf8');
	$conn->query('SET NAMES utf8');

	$rawJSON = file_get_contents('php://input');
	$JSON = json_decode($rawJSON);
	$id 				= $JSON->id;
	$empleo 			= $JSON->empleo;
	$empleo_part 		= $JSON->empleo_part;
	$export 			= $JSON->export;
	$export_part 		= $JSON->export_part;	

	$query = '
		UPDATE `sector_general_data` 
		SET 
			`empleo`			= '.$empleo.',
			`empleo_part`		= '.$empleo_part.',
			`export`			= '.$export.',
			`export_part`		= '.$export_part.'				
		WHERE id = '.$id.''; 

	$resultQuery = $conn->query($query);


	if ($resultQuery != NULL) {
		$json_string = json_encode($resultQuery, JSON_PRETTY_PRINT);				
	}else{
		die($conn->error);
	}

	echo $json_string;
