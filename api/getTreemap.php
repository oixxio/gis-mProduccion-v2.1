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
	$rawJSON = file_get_contents('php://input');
	$JSON = json_decode($rawJSON);
	$id = $JSON->id;
	$type = $JSON->type;
	$depth = $JSON->depth;

	if ($type == 'region') {
		$contraType = 'sector';
		$treeDepth = 3;
	} else {
		$contraType = 'region';
		$treeDepth = 4;
	}

	$preQueryStr = new stdClass();
	//PRE-Query para obtener la lista de ids de departamentos descendientes de la region seleccionada
	if ($type == 'sector') {
		$preQueryStr->select = ', t4.id, t4.nombre as lev4 ';
		$preQueryStr->leftJoin = 'LEFT JOIN sectortree AS t4 ON t4.parent_id = t3.child_id ';
		$preQueryStr->where = 'AND t4.depth = 4 ';
		$preQueryStr->order = ', t4.child_id ';
	} else {
		$preQueryStr->select = '';
		$preQueryStr->leftJoin = '';
		$preQueryStr->where = '';
		$preQueryStr->order = '';		
	}
	$preQuery = '
		SELECT
		    t'.$treeDepth.'.id as leafID,
			t1.id,
			t1.nombre as lev1,
			t2.id,
			t2.nombre as lev2,
			t3.id,
			t3.nombre as lev3
			'.$preQueryStr->select.'
		FROM '.$type.'tree AS t1
		LEFT JOIN '.$type.'tree AS t2 ON t2.parent_id = t1.child_id
		LEFT JOIN '.$type.'tree AS t3 ON t3.parent_id = t2.child_id
		'.$preQueryStr->leftJoin.'
		WHERE t1.depth = 1 AND t2.depth = 2 AND t3.depth = 3 '.$preQueryStr->where.' AND t'.$depth.'.id = '.$id.'
		ORDER BY t1.child_id, t2.child_id, t3.child_id'.$preQueryStr->order.' ';

	$resultPreQuery = $conn->query($preQuery);

	while($preResult = $resultPreQuery->fetch_assoc()) {				
     	$preResults[$i] = $preResult['leafID'];
     	$i++;
    }	

    $leafIdsStr = '('. implode(',',$preResults) .')'; //string con todas las ids de los departamentos que conforman la region seleccionada


	//Query para los datos del treemap
	$query = '
		SELECT f.id, f.'.$contraType.'_id as sub_id, f.nodeName, f.color, f.parentID, f.depth, s.empleo_part, s.export_part
		 FROM (SELECT
		        t1.id,
		        t1.'.$contraType.'_id ,
		        t2.nombre as nodeName,
		        t2.color,
		        t2.parent_id_absolute as parentID,
		        t2.depth,
		        t1.empleo_part,
		        t1.export_part
		        FROM treemap as t1
		        INNER JOIN '.$contraType.'Tree as t2 ON t1.'.$contraType.'_id = t2.id
		        WHERE '.$type.'_id IN '.$leafIdsStr.'
		        ORDER BY id) AS f
		 JOIN (SELECT '.$contraType.'_id,
                       SUM(empleo_part) AS empleo_part,
                       SUM(export_part) AS export_part
		         FROM treemap
		         WHERE '.$type.'_id IN '.$leafIdsStr.'
		        GROUP BY '.$contraType.'_id
		      ) AS s
		 ON f.'.$contraType.'_id = s.'.$contraType.'_id
		 GROUP BY f.'.$contraType.'_id';

	$resultQuery = $conn->query($query);

	$i = 0;

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