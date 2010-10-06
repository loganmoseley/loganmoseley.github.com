<html>
<body>

<form action="phptest.php" method="post">
Phrase: <input type="text" name="phrase" />
Num phrases: <input type="text" name="repeat" />
<input type="submit" value="Submit" />
</form>

Welcome !<br />
This box contains "<?php echo $_POST["phrase"]; ?>" <?php echo (integer)$_POST["repeat"]; ?> times.<p/>


<?php
	print("<input type=\"text\" readonly=\"readonly\" value=\"");
	
	$i = 0;
	while ($i < (integer) $_POST["repeat"]){
		echo $_POST["phrase"];
		$i++;
	}
	
	print("\" />");
?>


</body>
</html> 