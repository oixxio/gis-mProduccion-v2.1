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
	$user = $JSON->user;
	$event = $JSON->event;

	$sqlPrep = $conn->prepare("insert into change_log values (
				null,
				?,
				null,
				?)");
	$sqlPrep->bind_param("ss",$user,$event);
	$status = $sqlPrep->execute();

	if ($sqlPrep->affected_rows != 0) {
		echo "200";
	}else{
		die($conn->error);
	}
?>