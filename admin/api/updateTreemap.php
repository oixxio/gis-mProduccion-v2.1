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

	$sqlPrep = $conn->prepare("update treemap set 
				empleo_part = ?,
				export_part = ?
				where id = ?");
	$sqlPrep->bind_param("sss",$data->empleo_part,$data->export_part,$data->id);
	$status = $sqlPrep->execute();

	if ($sqlPrep->affected_rows != 0) {
		echo "200";
	}else{
		$sqlPrep = $conn->prepare("insert into treemap (
			region_id,
			sector_id,
			empleo_part,
			export_part) values(?,?,?,?)") ;
				
		$sqlPrep->bind_param("ssss",$data->region_id,
										$data->sector_id,									
										$data->empleo_part,										
										$data->export_part);
		$sqlPrep->execute();
		if ($sqlPrep->affected_rows != 0) {
			echo "200";
		}else{
			echo "403";
		}
	}
?>