<?php

/* LEAME
Los datos en la base de datos son cantidades finita como cantidad de EMPLEO ('empleo'), o miles de dolares EXPORTADOS('export'). Tanto 'empleo' como 'export' se denominan 'categorias.'Estos se obtienen en el backend de PHP.

De estos datos se obtienen calculos intermedios para cada categoria(r1s1, r1s1_old, r1sA, rAs1, rAsA) que son necesarios para calcular los valores finales (variacion, coeficiente de especializacion, participacion) que se utilizaran en las graficas. Esto se calcula en el backend PHP, pero los valores finales se calculan en el front por simplicidad y por tiempo de desarrollo.


///////Explicacion sobre los calculos y sus resultados (En este caso se detalla el caso de que seleccione POR REGION. Para sector funciona igual, solo que se intercambia 'region' por 'sector'. Por cuestiones de legibilidad y simplicidad, se mantiene la notacion 'r1s1' para ambos casos)

//Definicion de los parámetros basicos
En el caso de la selección de una region determinada, se calculan 5 parámetros base (para ambas categorias simultaneamente) para cada sector relevante aesa región.

r1s1_old -> Corresponde al valor ANTIGUO de UN sector para UNA region. (Ésto se utiliza para calcular la variacion del 2007 hasta 2015)
r1s1 -> Corresponde al valor de UN sector para UNA region (la seleccionada)
r1sA -> Corresponde a la suma de TODOS los sectores para UNA región.
rAs1 -> Corresponde a la suma de los valores de UN sector para TODAS las regiones.
rAsA -> Corresponde a la suma total de TODOS los valores en TODO el pais (o sea, para todas las regiones)

//Definicion de resultados finales

Participación (part)-> Corresponde el porcentaje que corresponde 1 sector para el total de los sectores, en una region determinada 
				 => r1s1/r1sA

Coeficiente de especialización (coef_esp)-> Corresponde al grado de especialización de una región con respecto al pais, y es la participación de una sector a nivel region, en relación a la participación del mismo sector a nivel pais
				 => ( r1s1/r1sA ) / ( rAs1/rAsA )

Variacion (var) -> Corresponde a la variación de un cierto valor (2015) con respecto al anterior (2007), en relación al valor anterior.
				 => (r1s1 - r1s1_old) / r1s1_old

*/

	header('Content-type: text/html; charset=UTF-8');

	error_reporting(E_ALL);
	ini_set('display_errors', 1);

	require 'connDB.php';	
	$conn->query('SET CHARACTER SET utf8');
	$conn->query('SET NAMES utf8');

	//Para que tome los datos de input del POST desde el front
	$rawJSON = file_get_contents('php://input');
	$JSON = json_decode($rawJSON);
	$id = $JSON->id;
	$type = $JSON->type;
	$depth = $JSON->depth;

# [START] PreQUERY  ---- Obtiene los departamentos que corresponden a la region seleccionada	

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
		$preQueryStr->leftJoin = 'LEFT JOIN sectorTree AS t4 ON t4.parent_id = t3.child_id ';
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
		FROM '.$type.'Tree AS t1
		LEFT JOIN '.$type.'Tree AS t2 ON t2.parent_id = t1.child_id
		LEFT JOIN '.$type.'Tree AS t3 ON t3.parent_id = t2.child_id
		'.$preQueryStr->leftJoin.'
		WHERE t1.depth = 1 AND t2.depth = 2 AND t3.depth = 3 '.$preQueryStr->where.' AND t'.$depth.'.id = '.$id.'
		ORDER BY t1.child_id, t2.child_id, t3.child_id'.$preQueryStr->order.' ';

	$resultPreQuery = $conn->query($preQuery);

	$i = 0;
	while($preResult = $resultPreQuery->fetch_assoc()) {				
     	$preResults[$i] = $preResult['leafID'];
     	$i++;
    }	

    $leafIdsStr = '('. implode(',',$preResults) .')'; //string con todas las ids de los departamentos que conforman la region seleccionada

# [START] PreQUERY  ---- Obtiene los departamentos que corresponden a la region seleccionada    

# [START] QUERY 1  ---- Devuelve r1sA
	$query1 = '
			SELECT 
				'.$contraType.'_id as sub_id,
				SUM(empleo) as empleo,
				SUM(export) as export
			FROM entries
			 WHERE '.$type.'_id IN '.$leafIdsStr.'';

	$resultQuery1 = $conn->query($query1);

	$r1sA = $resultQuery1->fetch_assoc();
/*	
highlight_string("<?php\n\$data =\n" . var_export($r1sA, true) . ";\n?>");	
*/

# [END] QUERY 1

# [START] QUERY 2  ---- Devuelve rAsA
	$query2 = '
			SELECT 
				'.$contraType.'_id as sub_id,
				SUM(empleo) as empleo,
				SUM(export) as export
			FROM entries';

	$resultQuery2 = $conn->query($query2);

	$rAsA = $resultQuery2->fetch_assoc();
/*
highlight_string("<?php\n\$data =\n" . var_export($rAsA, true) . ";\n?>");	
*/

# [END] QUERY 2

# [START] QUERY 3   ---- Devuelve un array para r1s1 y rAs1
	if ($type == 'sector') {
		$jMin = 31;  	//Primer departamento
		$jMax = 556;	//Ultimo departamento
	} else { //region
		$jMin = 240;	//Primer Sector ultimo nivel
		$jMax = 537;	//Ultimo Sector ultimo nivel
	}

	$query3 = '';
	for ($j = $jMin; $j <= $jMax; $j++) { //Debido a ésto ya salen ordenados de menos a mayor
		$subQuery = '
			SELECT
				t1.sub_id, 
				t1.empleo_r1s1,
				t1.empleo_r1s1_old,
				t2.empleo_rAs1,
				t1.export_r1s1,
				t1.export_r1s1_old,
				t2.export_rAs1				
			FROM
				(SELECT 
					'.$contraType.'_id as sub_id,
					SUM(empleo) as empleo_r1s1,
					SUM(empleo_old) as empleo_r1s1_old,
					SUM(export) as export_r1s1,
					SUM(export_old) as export_r1s1_old					
				FROM entries
				 WHERE '.$type.'_id IN '.$leafIdsStr.' AND '.$contraType.'_id='.$j.') as t1
			JOIN
				(SELECT 
					'.$contraType.'_id as sub_id,  
					SUM(empleo) as empleo_rAs1,
					SUM(export) as export_rAs1					
				FROM entries
				 WHERE '.$contraType.'_id='.$j.') as t2
			ON t1.sub_id = t2.sub_id
			WHERE t1.sub_id != 0'; //Esta ultima linea es para limpiar una row que devuelve todo en NULL por razond desconocida
		$query3 = $query3 . $subQuery;
		if ($j != $jMax) {
			$query3 = $query3 . ' UNION ';
		}
	}


	$resultQuery3 = $conn->query($query3);

	$r1s1_rAs1_array = array();
	$i = 0;
	while($result3 = $resultQuery3->fetch_assoc()) {	
		//if ($result3['sub_id'] != 0) {			
	     	$r1s1_rAs1_array[$i] = $result3;
	     	$i++;
		//}
    }
/*
highlight_string("<?php\n\$data =\n" . var_export($r1s1_rAs1_array, true) . ";\n?>");    
*/

# [END] QUERY 3

# [START] Calculo de los datos obtenidos en QUERYS 1, 2 y 3

$finalResults = array();
$finalResult = array();

	for ($i=0; $i < count($r1s1_rAs1_array); $i++) { 
		$finalResult['sub_id'] = $r1s1_rAs1_array[$i]['sub_id'];
/*
		$finalResult['empleo']      	= $r1s1_rAs1_array[$i]['empleo_r1s1'];
		$finalResult['empleo_old']      = $r1s1_rAs1_array[$i]['empleo_r1s1_old'];
		$finalResult['empleo_var']      = ($r1s1_rAs1_array[$i]['empleo_r1s1'] / $r1s1_rAs1_array[$i]['empleo_r1s1_old']) - 1;
		$finalResult['empleo_part']     = $r1s1_rAs1_array[$i]['empleo_r1s1'] / $r1sA['empleo'];
		$finalResult['empleo_coef_esp'] = $finalResult['empleo_part'] / ($r1s1_rAs1_array[$i]['empleo_rAs1'] / $rAsA['empleo']);

		$finalResult['export']      	= $r1s1_rAs1_array[$i]['export_r1s1'];
		$finalResult['export_old']      = $r1s1_rAs1_array[$i]['export_r1s1_old'];
		$finalResult['export_var']      = ($r1s1_rAs1_array[$i]['export_r1s1'] / $r1s1_rAs1_array[$i]['export_r1s1_old']) - 1;
		$finalResult['export_part']     = $r1s1_rAs1_array[$i]['export_r1s1'] / $r1sA['export'];
		$finalResult['export_coef_esp'] = $finalResult['export_part'] / ($r1s1_rAs1_array[$i]['export_rAs1'] / $rAsA['export']);		
*/
		$finalResult['empleo_r1s1']     = $r1s1_rAs1_array[$i]['empleo_r1s1'];
		$finalResult['empleo_r1s1_old'] = $r1s1_rAs1_array[$i]['empleo_r1s1_old'];
		$finalResult['empleo_r1sA']     = $r1sA['empleo'];
		$finalResult['empleo_rAs1']     = $r1s1_rAs1_array[$i]['empleo_rAs1'];
		$finalResult['empleo_rAsA']     = $rAsA['empleo'];

		$finalResult['export_r1s1']     = $r1s1_rAs1_array[$i]['export_r1s1'];
		$finalResult['export_r1s1_old'] = $r1s1_rAs1_array[$i]['export_r1s1_old'];
		$finalResult['export_r1sA']     = $r1sA['export'];
		$finalResult['export_rAs1']     = $r1s1_rAs1_array[$i]['export_rAs1'];
		$finalResult['export_rAsA']     = $rAsA['export'];	

		$finalResults[$i] = $finalResult;
	}
/*
highlight_string("<?php\n\$data =\n" . var_export($finalResults, true) . ";\n?>"); 
*/

# [END] Calculo de los datos obtenidos en QUERYS 1, 2 y 3


	if ($finalResults != NULL) {
		$json_string = json_encode($finalResults, JSON_PRETTY_PRINT);				
	}else{
		die($conn->error);
	}

	echo $json_string;
