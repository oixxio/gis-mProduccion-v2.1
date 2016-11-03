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
			t1.region_id,
			t4.nombre as parent_name,
			t2.nombre as region_nombre,
			t3.child_id as sector_ciiu,
			t1.sector_id,
			t3.nombre as sector_nombre,
			t1.empleo,
			t1.empleo_old,
			t1.export,
			t1.export_old
		FROM entries as t1
		LEFT JOIN regionTree as t2 ON t2.id = t1.region_id
		LEFT JOIN regionTree as t4 ON t2.parent_id_absolute = t4.id
		LEFT JOIN sectorTree as t3 ON t3.id = t1.sector_id
		ORDER BY t4.nombre, t2.nombre'; 

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
