<?php
$post_data = json_decode(file_get_contents('php://input'), true);
// the directory "data" must be writable by the server
$name = "../full_sample/".$post_data['filename'].".json";
$data = $post_data['filedata'];
// write the file to disk
file_put_contents($name, $data);
?>