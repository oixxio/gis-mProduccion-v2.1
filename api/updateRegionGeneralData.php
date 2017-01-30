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
	$export_destino1 	= "'".$JSON->export_destino1."'";
	$export_producto1 	= "'".$JSON->export_producto1."'";
	$export_destino2 	= "'".$JSON->export_destino2."'";
	$export_producto2 	= "'".$JSON->export_producto2."'";
	$export_destino3 	= "'".$JSON->export_destino3."'";
	$export_producto3 	= "'".$JSON->export_producto3."'";

	$query = '
		UPDATE `region_general_data` 
		SET 
			`poblacion`			= '.$poblacion.',
			`poblacion_part`	= '.$poblacion_part.',
			`pbg`				= '.$pbg.',
			`pbg_part`			= '.$pbg_part.',
			`informalidad`		= '.$informalidad.',
			`pobreza`			= '.$pobreza.',
			`salario_prom`		= '.$salario_prom.',
			`cantidad_emp`		= '.$cantidad_emp.',
			`cantidad_emp_exp`	= '.$cantidad_emp_exp.',
			`empleo_pub`		= '.$empleo_pub.',
			`empleo_pub_part`	= '.$empleo_pub_part.',
			`export`			= '.$export.',
			`export_part`		= '.$export_part.',	
			`export_destino1`	= '.$export_destino1.',
			`export_producto1`	= '.$export_producto1.',
			`export_destino2`	= '.$export_destino2.',
			`export_producto2`	= '.$export_producto2.',
			`export_destino3`	= '.$export_destino3.',
			`export_producto3`	= '.$export_producto3.'					
		WHERE id = '.$id.''; 

	$resultQuery = $conn->query($query);


	if ($resultQuery != NULL) {
		$json_string = json_encode($resultQuery, JSON_PRETTY_PRINT);				
	}else{
		die($conn->error);
	}

	echo $json_string;

