function playMusic(ad=null,url="",data='') {
    fetch(url, {
        cache: "reload",
        method: 'POST',
        body: 'data='+data,
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        }
    }).then((res) => {
        return res.body.getReader();
    }).then((reader) => {
        let i = 0;
        let BF = new Uint8Array(0);
        getMediaSource(ad).then((obj) => {
            pushChunk(reader, i, obj, BF);
        }).catch((error) => {
            console.error('Error', error);
        });
    }).catch((error) => {
        console.error('Error', error);
    });
}

function pushChunk(reader, i, obj, BF) {
    return reader.read().then((result) => {
        if (result.done) {
            sourceBuffer.addEventListener('updateend', () => {
                obj.mds.endOfStream();
                // console.log('Load Done');
                return;
            });
            sourceBuffer.appendBuffer(BF.buffer);
        } else {
            // console.log('Load : ', i);
            let tempBuffer = new Uint8Array(BF.length + result.value.length);
            // 1. 复制原来积累下来的Buffer
            for (let i = 0; i < BF.length; i++) {
                tempBuffer[i] = BF[i];
            }
            // 2. 添加新读取的Buffer
            for (let i = 0, j = BF.length; j < tempBuffer.length; i++, j++) {
                tempBuffer[j] = result.value[i];
            }
            // 将合并后的结果赋值给Buffer,删除tempBuffer
            BF = tempBuffer;
            tempBuffer = null;
            i++;
            dealData(BF, obj.sbf).then((res) => {
                // 测试断点1
                if (typeof res === 'string') {
                    // 数据已添加到媒体源，清空缓冲区
                    // console.log('数据已添加到媒体源，清空缓冲区', res);
                    BF = new Uint8Array(0);
                    pushChunk(reader, i, obj, BF);
                } else {
                    // 合并数据
                    pushChunk(reader, i, obj, BF);
                }
            });
        }
    }).catch((error) => {
        console.log('Error: ', error);
    });
}

function dealData(data, sourceBuffer) {
    // 测试断点2
    // 设置缓冲区大小为256kb，数据满了之后再添加到媒体元素中，否则继续接收数据, data 为 Uint8Array 数组
    // if(data.byteLength>256*1024){
    //     // 添加数据
    // }else{
    //     //继续接受数据并合并结果
    // }
    return new Promise(function(resolve, reject) {
        // 缓冲区大小 128K
        if (data.byteLength >= 128 * 1024) {
            sourceBuffer.addEventListener('updateend', () => {
                resolve('updateend');
            });
            sourceBuffer.appendBuffer(data.buffer);
        } else {
            resolve(data);
        }
        
        // // 不设置缓冲
        // sourceBuffer.addEventListener('updateend', () => {
        //     resolve('updateend');
        // });
        // sourceBuffer.appendBuffer(data.buffer);
    })
}

// 此函数仅执行一次，添加Audio元素和返回 MediaSource和对应SourceBuffer
// obj.mds = mediaSource; obj.sbf = sourceBuffer;
function getMediaSource(el) {
    return new Promise(function(resolve, reject) {
        let mediaSource = new MediaSource();
        let obj = {};

        mediaSource.addEventListener('sourceopen', () => {
            sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
            obj.mds = mediaSource;
            obj.sbf = sourceBuffer;
            resolve(obj);
        });
        el.src = window.URL.createObjectURL(mediaSource);
    });
}