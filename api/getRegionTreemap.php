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
	$regionId = (int) file_get_contents('php://input');

	$query = '
		SELECT
		t1.id,
		t1.sector_id as sub_id,
		t2.nodeName,
		t2.color,
		t2.parentID,
		t2.depth,
		t1.empleo_part,
		t1.export_part
		FROM gis_mproduccion.region_treemap as t1
		INNER JOIN gis_mproduccion.sectorTreeView as t2 ON t1.sector_id = t2.nodeID
		WHERE region_id = '.$regionId.'
		ORDER BY id';

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