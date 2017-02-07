<?php 
	$conn = new mysqli('localhost','root','','gis_mproduccion');
	//$conn = new mysqli('localhost','m6000296_min_dev','Jose1234','m6000296_min_dev');
    if($conn->connect_error){
        die($conn->connect_error);
    }
?>
