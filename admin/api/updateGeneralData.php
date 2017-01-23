<?php 
	header('Content-type: text/html; charset=UTF-8');

	error_reporting(E_ALL);
	ini_set('display_errors', 1);

	require 'connDB.php';	
	$conn->query('SET CHARACTER SET utf8');
	$conn->query('SET NAMES utf8');

	$results = [""];

	//Para que tome los datos de input del POST desde el front
	$rawJSON = file_get_contents('php://input');
	$JSON = json_decode($rawJSON);
	$data = $JSON->data;
	$type = $JSON->type;

	$sqlPrep = $conn->prepare("update region_general_data set 
				poblacion = ?,
				poblacion_part = ?,
				pbg = ?,
				pbg_part = ?,
				empleo_pub = ?,
				empleo_pub_part = ?,
				export = ?,
				export_part = ?,
				export_destinos = ?,
				export_productos = ? 
				where id = ?");
	$sqlPrep->bind_param("sssssssssss",$data->poblacion,$data->poblacion_part,$data->pbg,$data->pbg_part,$data->empleo_pub,$data->empleo_pub_part,$data->export,$data->export_part,$data->export_destinos,$data->export_productos,$data->id);
	$sqlPrep->execute();

	if ($sqlPrep->affected_rows != 0) {
		echo "200";
	}else{
		$sqlPrep = $conn->prepare("insert into region_general_data (
			id,
			poblacion,
			poblacion_part,
			pbg,
			pbg_part,
			empleo_pub,
			empleo_pub_part,
			export,
			export_part,
			export_destinos,
			export_productos) values(?,?,?,?,?,?,?,?,?,?,?)") ;
				
		$sqlPrep->bind_param("sssssssssss",$data->id,$data->poblacion,$data->poblacion_part,$data->pbg,$data->pbg_part,$data->empleo_pub,$data->empleo_pub_part,$data->export,$data->export_part,$data->export_destinos,$data->export_productos);
		$sqlPrep->execute();
		if ($sqlPrep->affected_rows != 0) {
			echo "200";
		}else{
			echo "403";
		}
	}
?>