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
            controls: 0,
            enablejsapi: 1,
            modestbranding: 1,
        },
        events: {
            'onReady': function (params) { },
            'onStateChange': function (params) { },
        },
    });
}
setInterval(function () {
    document.title = player.getVideoData().title;
}, 1000);

// 動画の切り替え
$('.input').on('change', function (value) {
    // TODO: value がYoutube Video URLの形式だったらその動画に遷移
    // TODO: そうでなければ単語検索
});