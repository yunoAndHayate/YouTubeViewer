var config = require('config');
var video_ids = ['M7lc1UVf-VE'];

var gui = require('nw.gui');
var win = gui.Window.get();
// win.showDevTools();

// YouTube Javascript SDK の読み込み
var tag = document.createElement('script');
tag.src = 'https://www.youtube.com/iframe_api';
document.getElementsByTagName('body')[0].appendChild(tag);

// 動画プレイヤーの生成
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        videoId: getNowPlayingVideo(),
        playerVars: {
            rel: 0,
            enablejsapi: 1,
            modestbranding: 1,
        },
        events: {
            'onReady': function (params) { },
            'onStateChange': function (e) {
                if (e.data <= 0 /* END or ERROR */) onVideoEnd();
                if (e.data == 1 || e.data == 3 /* PLAYING */) {}
                if (e.data == 2 /* PAUSE */) {}
            },
        },
    });

    // inputに初期値を設定
    $('#movie-name').val('https://www.youtube.com/watch?v=' + getNowPlayingVideo());

    // 動画の切り替え
    $('#movie-name').on('change', function () {
        // value がYoutube Video URLの形式だったらその動画に遷移
        match = $(this).val().match(/(\/embed\/|watch\?v=([^&]+))/);
        if (match && match[2]) {
            video_ids = [];
            addHistory(match[2]);
            loadVideo();
        }
        // TODO: そうでなければ単語検索
        else {
            console.log('search video!');

        }
    });
    // inputへフォーカス時に全選択
    $('#movie-name').on('focus', function () {
        $(this).select();
    });

    // 最前面表示の切り替え
    $('#move-front').on('change', function () {
        win.setAlwaysOnTop($(this).is(':checked'));
    });


    // 動画の再生が完了したら、次の動画を検索して再生する
    function onVideoEnd() {
        var request = gapi.client.youtube.search.list({
            part: 'id',
            relatedToVideoId: video_ids,
            relevanceLanguage: 'ja',
            type: 'video',
            videoEmbeddable: true,
        });

        request.execute(function (response) {
            // 直近で再生していない動画に遷移する
            response.result['items'].shift(); // 最初を捨てる
            response.result['items'].some(element => { // 値を返すまで続くforEachみたいなの
                if (video_ids.indexOf(element['id']['videoId']) == -1) {
                    addHistory(element['id']['videoId']);
                    loadVideo();
                    return 1;
                }
            });
        });
    }
}

// YouTubeAPI の client library を初期化
gapi.load('client', function () {
    gapi.client.init({
        'apiKey': config.get('NODE_YOUTUBE_API_KEY'),
        'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
    });
});

// 再生履歴に動画を追加。履歴は5つまで保存
function addHistory(new_video_id) {
    video_ids.push(new_video_id);
    video_ids = video_ids.slice(-5);
    console.log(video_ids);
}
function getNowPlayingVideo() {
    return video_ids[video_ids.length -1];
}
function loadVideo() {
    console.log('change video to ' + getNowPlayingVideo() + ' !');
    player.loadVideoById(getNowPlayingVideo());
}