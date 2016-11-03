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
			t2.nombre as region_nombre,
			t2.depth as depth,
			t1.poblacion,
			t1.poblacion_part,
			t1.pbg,
			t1.pbg_part,
			t1.empleo_pub,
			t1.empleo_pub_part,
			t1.export,
			t1.export_part,
			t1.export_destinos,
			t1.export_productos 
		FROM region_general_data as t1
		LEFT JOIN regionTree as t2 ON t2.id = t1.id
		LEFT JOIN regionTree as t4 ON t2.parent_id_absolute = t4.id
		ORDER BY t2.depth,t4.nombre, t2.nombre'; 

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
