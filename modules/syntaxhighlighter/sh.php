<?php 
include_once 'geshi/geshi.php';

chdir("../fs");

$filename = "";

if($xml = simplexml_load_file('config/fs.xml'))
{
	foreach($xml->xpath("//File") as $File)
	{
		$arr = $File->attributes();

		if($arr['src'] == $_GET['file'])
			$filename = $arr['src'];
	}
}

if($filename == "")
{
	echo "file not found";
	exit(1);
}

chdir("../..");

if(!file_exists($filename))
{
	echo "file not found";
	exit(1);
}

$file = fopen($filename, "r");

if($file != FALSE)
{
	$source = fread($file, filesize($filename));
	fclose($file);
}
else
	exit(1);

if($source != "")
{
	$geshi = new GeSHi($source, $_GET['lang']);
	$geshi->enable_line_numbers(GESHI_NORMAL_LINE_NUMBERS);
	echo $geshi->parse_code();
}

?>
