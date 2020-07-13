var config = require('config');
var video_id = 'M7lc1UVf-VE';

// YouTube Javascript SDK の読み込み
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.getElementsByTagName("body")[0].appendChild(tag);

// 動画プレイヤーの生成
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        videoId: video_id,
        playerVars: {
            rel: 0,
            enablejsapi: 1,
            modestbranding: 1,
        },
        events: {
            'onReady': function (params) { },
            'onStateChange': function (e) {
                if (e.data == 0 /* END */) onVideoEnd();
            },
        },
    });

    // inputに初期値を設定
    $(".input").val("https://www.youtube.com/watch?v=" + video_id);

    // 動画の切り替え
    $('.input').on('change', function () {
        // value がYoutube Video URLの形式だったらその動画に遷移
        video_id = $(this).val().match(/(\/embed\/|watch\?v=([^&]+))/);
        if (video_id && video_id[2]) {
            console.log('change video to ' + video_id[2] + ' !');

            player.loadVideoById(video_id[2]);
        }
        // TODO: そうでなければ単語検索
        else {
            console.log('search video!');

        }
    });
    // inputへフォーカス時に全選択
    $('.input').on('focus', function () {
        $(this).select();
    });


    // 動画の再生が完了したら、次の動画を検索して再生する
    function onVideoEnd() {
        var request = gapi.client.youtube.search.list({
            part: 'id',
            relatedToVideoId: video_id,
            relevanceLanguage: 'ja',
            type: 'video',
            videoEmbeddable: true,
        });

        request.execute(function (response) {
            // 現在再生している動画と違う動画に遷移する
            response.result['items'].shift(); // 最初を捨てる
            response.result['items'].some(element => { // 値を返すまで続くforEachみたいなの
                if (video_id != element['id']['videoId']) {
                    console.log(response.result['items']);
                    player.loadVideoById(element['id']['videoId']);
                    return video_id = element['id']['videoId'];
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