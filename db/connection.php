<?php
$config = parse_ini_file("config.ini", true);

$host = $config["database"]["host"];
$port = $config["database"]["port"];
$dbname = $config["database"]["dbname"];
$user = $config["database"]["user"];
$password = $config["database"]["password"];

$conn = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$password");

if (!$conn) {
    echo "Failed to connect: " . pg_last_error();
    exit;
}