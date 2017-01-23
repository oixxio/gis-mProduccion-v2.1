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
	$data = json_decode($rawJSON);

	$sqlPrep = $conn->prepare("update sector_general_data set 				
				empleo = ?,
				empleo_part = ?,
				export = ?,
				export_part = ? 
				where id = ?");
	$sqlPrep->bind_param("sssss",$data->empleo,$data->empleo_part,$data->export,$data->export_part,$data->id);
	$sqlPrep->execute();

	if ($sqlPrep->affected_rows != 0) {
		echo "200";
	}else{
		$sqlPrep = $conn->prepare("insert into sector_general_data (
			id,
			empleo,
			empleo_part,			
			export,
			export_part) values(?,?,?,?,?)") ;
				
		$sqlPrep->bind_param("sssss",$data->id,$data->empleo,$data->empleo_part,$data->export,$data->export_part);
		$sqlPrep->execute();
		if ($sqlPrep->affected_rows != 0) {
			echo "200";
		}else{
			echo "403";
		}
	}
?>