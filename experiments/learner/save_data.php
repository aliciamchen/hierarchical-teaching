<?php
$post_data = json_decode(file_get_contents('php://input'), true);
// post data has attributes filename and filedata
// the directory "data" must be writable by the server
$name = "../data/pilot_5_data/{$post_data['filename']}.json";
$data = $post_data['filedata'];
// write the file to disk
file_put_contents($name, $data);
?>