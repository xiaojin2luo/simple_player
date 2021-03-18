var audio = document.querySelector('#audio'),
    dw = document.querySelector('#dw'),
    prevBtn = document.querySelector('#prev'),
    playBtn = document.querySelector('#play'),
    nextBtn = document.querySelector('#next'),
    downloadBtn = document.querySelector('#download'),
    songList = document.querySelector('#song-list'),
    playProgress = document.querySelector('#play-progress'),
    listenBtn = document.querySelector('#listen');
// 
var isListenPart = true,
    currentSongId = 0,
    data = {},
    playList = [];

// 下载
downloadBtn.onclick = () => {
    dw.click();
}
// 点击列表
document.querySelector('#song-list').addEventListener('click', (e) => {
    for (let i = 0; i < playList.length; i++) {
        if (playList[i] == e.target.getAttribute('data-title')) {
            currentSongId = i;
            break;
        }
    }
    // 播放
    data['title'] = playList[currentSongId];
    playMusic(audio, './api/api.php', JSON.stringify(data));
});

// 初始化
// 可以播放时
audio.oncanplay = () => {
    dw.href = './src/' + playList[currentSongId] + '.mp3';
    audio.play();
    for (let i = 0; i < playList.length; i++) {
        if (currentSongId == i) {
            // 点击到的变红
            songList.children[i].style.color = '#F00';
            // 滚动到可是区域
            if (Math.abs(songList.children[i].getBoundingClientRect().y) > (window.innerHeight - 64)) {
                songList.children[i].scrollIntoView();
            }
        } else {
            // 恢复白色
            songList.children[i].style.color = '#FFF';
        }
    }
}
// 出错时
audio.onerror = () => {
    console.log('play error & pass:', currentSongId);
    setTimeout(() => {
        // 列表循环
        (currentSongId + 1 >= playList.length) ? currentSongId = 0 : currentSongId++;
        data['title'] = playList[currentSongId];
        playMusic(audio, './api/api.php', JSON.stringify(data));
    }, 50)
}
// 播放结束
audio.onended = () => {
    console.log('play end:', currentSongId);
    setTimeout(() => {
        // 列表循环
        (currentSongId + 1 >= songList.length) ? currentSongId = 0 : currentSongId++;
        data['title'] = playList[currentSongId];
        playMusic(audio, './api/api.php', JSON.stringify(data));
    }, 50)
}
// 内容加载完成
window.onload = () => {
    for (let i = 0; i < songList.children.length; i++) {
        playList.push(songList.children[i].getAttribute('data-title'));
    }
    data['listenpart'] = isListenPart;
    data['title'] = playList[currentSongId];
    // 自动播放
    playMusic(audio, './api/api.php', JSON.stringify(data));
}

// 暂停
play.onclick = () => {
    if (audio.paused) {
        audio.play();
        play.innerHTML = "暂停";
    } else {
        audio.pause();
        play.innerHTML = "播放";
    }
}
// 切换模式
listenBtn.onclick = () => {
    isListenPart = !isListenPart;
    if (isListenPart) {
        listenBtn.innerHTML = '30S';
    } else {
        listenBtn.innerHTML = '全长';
    }
    data['listenpart'] = isListenPart;
}
// 上一曲
prevBtn.onclick = () => {
    if (currentSongId > 0) {
        currentSongId--;
    } else {
        currentSongId = playList.length - 1;
    }
    data['title'] = playList[currentSongId];
    playMusic(audio, './api/api.php', JSON.stringify(data));
}
// 下一曲
nextBtn.onclick = () => {
    if (currentSongId < (playList.length - 1)) {
        currentSongId++;
    } else {
        currentSongId = 0;
    }
    data['title'] = playList[currentSongId];
    playMusic(audio, './api/api.php', JSON.stringify(data));
}
// 显示进度条
audio.onplaying = () => {
    showProgress();
}
function showProgress() {
    // 正在播放
    // console.log('play to',((audio.currentTime/audio.duration)*100).toFixed(0));
    playProgress.value = ((audio.currentTime / audio.duration) * 100).toFixed(0);
    if (!audio.paused) {
        setTimeout(showProgress, 500);
    }
}