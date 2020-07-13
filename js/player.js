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
            'onStateChange': function (params) { },
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

}