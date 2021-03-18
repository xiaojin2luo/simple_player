<?php
##################################################################
#
#       音乐试听，完整收听
#       20191013 1033 luoxiaojin
#
##################################################################
// error_reporting(0);
$data = isset($_POST['data'])?trim($_POST['data']):'';
if (!$data) {
    die('404');
}
$BASE_DIR = "../src/";
$AUDIO_EXTENSION_NAME = ".mp3";
$data = json_decode($data, true);
chdir(__DIR__);
$source = $BASE_DIR.$data['title'].$AUDIO_EXTENSION_NAME;
if (is_file($source)) {
    if ($data['listenpart'] == 'true') {
        // listen part
        $file = fopen($source, 'rb');
        $file_size = filesize($source);
        // 30s 高潮试听
        $start = $file_size*0.33;
        $length = $file_size*0.12;
        fseek($file, $start);
        echo fread($file, $length);
        fclose($source);
    } else {
        // listen all
        // 方法1
        echo file_get_contents($source);
    }
}
