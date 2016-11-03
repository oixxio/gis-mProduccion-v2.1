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
	$poblacion 			= $JSON->poblacion;
	$poblacion_part 	= $JSON->poblacion_part;
	$pbg 				= $JSON->pbg;
	$pbg_part 			= $JSON->pbg_part;
	$empleo_pub 		= $JSON->empleo_pub;
	$empleo_pub_part 	= $JSON->empleo_pub_part;
	$export 			= $JSON->export;
	$export_part 		= $JSON->export_part;	
	$export_destinos 	= "'".$JSON->export_destinos."'";
	$export_productos 	= "'".$JSON->export_productos."'";

	$query = '
		UPDATE `region_general_data` 
		SET 
			`poblacion`			= '.$poblacion.',
			`poblacion_part`	= '.$poblacion_part.',
			`pbg`				= '.$pbg.',
			`pbg_part`			= '.$pbg_part.',
			`empleo_pub`		= '.$empleo_pub.',
			`empleo_pub_part`	= '.$empleo_pub_part.',
			`export`			= '.$export.',
			`export_part`		= '.$export_part.',	
			`export_destinos`	= '.$export_destinos.',
			`export_productos`	= '.$export_productos.'					
		WHERE id = '.$id.''; 

	$resultQuery = $conn->query($query);


	if ($resultQuery != NULL) {
		$json_string = json_encode($resultQuery, JSON_PRETTY_PRINT);				
	}else{
		die($conn->error);
	}

	echo $json_string;
