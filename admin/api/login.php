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

	$sqlPrep = $conn->prepare("select nombre,apellido from users where email = ? && password = ?");
	$sqlPrep->bind_param("ss",$JSON->email,$JSON->password);
	$sqlPrep->execute();
	$result = $sqlPrep->get_result();

	echo json_encode($result->fetch_assoc(), JSON_PRETTY_PRINT);

?>