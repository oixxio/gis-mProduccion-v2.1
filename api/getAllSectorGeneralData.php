<?php
	header('Content-type: text/html; charset=UTF-8');

	error_reporting(E_ALL);
	ini_set('display_errors', 1);

	require 'connDB.php';	
	$conn->query('SET CHARACTER SET utf8');
	$conn->query('SET NAMES utf8');


	$query = '
		SELECT distinct
			t1.id,
			t4.nombre as parent_name,
			t2.nombre as sector_nombre,
			t2.child_id as sector_ciiu,
			t2.depth as depth,
			t1.empleo,
			t1.empleo_part,
			t1.export,
			t1.export_part
		FROM sector_general_data as t1
		LEFT JOIN sectorTree as t2 ON t2.id = t1.id
		LEFT JOIN sectorTree as t4 ON t2.parent_id_absolute = t4.id
		ORDER BY t2.depth,t2.child_id,t4.nombre,t2.nombre'; 

	$resultQuery = $conn->query($query);

	$i=0;
	$results = [""];
	while($result = $resultQuery->fetch_assoc()) {				
     	$results[$i] = $result;
     	$i++;
    }

	if ($results != NULL) {
		$json_string = json_encode($results, JSON_PRETTY_PRINT);				
	}else{
		die($conn->error);
	}

	echo $json_string;
