<!DOCTYPE html>
<html lang="hmn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>苗族音乐试听 & 下载</title>
    <link rel="stylesheet" href="./static/index.css">
    <script src="./static/player-extension.js"></script>
</head>
<body>
    <!-- 头部 -->
    <header id="header">
        <h2 id="web-title">苗族音乐试听 & 下载</h2>
    </header>
    <!-- 中间内容 -->
    <section id="main-section">
        <div>
            <ol id="song-list">
                <?php
                error_reporting(0);
                    $start = 0;
                    $length = 200;
                    $to = $start + $length;
                    chdir(__DIR__);
                    $files = scandir('./src/');
                    array_shift($files);
                    array_shift($files);
                    $html = '';
                    chdir(__DIR__);
                    for ($i = $start; $i < $to; $i++) {
                        if (is_file('./src/'.$files[$i])) {
                            $file = explode('.', $files[$i])[0];
                            $html .= "<li data-title=\"{$file}\">" . base64_decode(str_replace('#', '/', $file)) . "</li>";
                        }else{
                            break;
                        }
                    }
                    echo $html;
                ?>
            </ol>
        </div>
    </section>
    <!-- 底部控件 -->
    <footer id="footer">
        <!-- 播放器 -->
        <audio id="audio" preload="none" src="#"></audio>
        <!-- 下载器 -->
        <a id="dw" hidden download href="#"></a>
        <progress id="play-progress" max="100" value="50"></progress>
        <br>
        <button id="prev">上一曲</button>
        <button id="play">播放</button>
        <button id="next">下一曲</button>
        <button id="download">下载</button>
        <button id="listen">试听</button>
    </footer>
</body>
<script src="./static/index.js"></script>
</html>