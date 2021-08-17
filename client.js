var sock = new WebSocket('ws://localhost:8081');
var output = document.getElementById("output_area");

function add_div_with_class (className,content) {
    let newDiv = document.createElement("div");
    newDiv.classList.add(className);
    if (content!==null) {
        newDiv.insertAdjacentHTML("afterbegin",content);
    };
    return newDiv;
};

function show_name (status) {
    let name;
    let screen_name;
    if ("retweeted_status" in status) {
        name = status.retweeted_status.user.name;
        screen_name = "@" + status.retweeted_status.user.screen_name;
    } else {
        name = status.user.name;
        screen_name = "@" + status.user.screen_name;
    };
    return {"name":name, "screen_name":screen_name};
}

function full_text (status) {
    let text;
    if ("retweeted_status" in status) {
        if ("extended_tweet" in status.retweeted_status) {
            text = status.retweeted_status.extended_tweet.full_text;
        } else {
            text = status.retweeted_status.text;
        };
    } else if ("extended_tweet" in status) {
        text = status.extended_tweet.full_text;
    } else {
        text = status.text;
    };
    return text;
};

// 接続
sock.addEventListener('open', function (e) {
    console.log('Socket Connected');
});

sock.addEventListener("error", function(e) {
    console.log(e);
    output.insertBefore(add_div_with_class("err","<i class=\"fas fa-exclamation-circle\"></i>WebSocket Connection Failed"),output.firstChild);
});

// サーバーからデータを受け取る
sock.addEventListener('message', function (e) {
    console.log(e.data);
    obj = JSON.parse(e.data);

    // とりあえず枠だけ作って
    tweetDiv = add_div_with_class("tweets",null);
    // RTのときHN
    if ("retweeted_status" in obj) {
        tweetDiv.appendChild(add_div_with_class("rt_status", "<i class=\"fas fa-retweet\"></i>" + obj.user.name + " retweeted"));
    };
    // HNつけて
    names = add_div_with_class("names",null);
    names.insertAdjacentHTML("afterbegin", "<span class='username'>"+show_name(obj).name+"</span>"+"<span class='displayname'>"+show_name(obj).screen_name+"</span>");
    tweetDiv.appendChild(names);
    // 内容入れて
    tweetDiv.appendChild(add_div_with_class("text",full_text(obj).replace(/\n/g, "<br>")));
    output.insertBefore(tweetDiv,output.firstChild);
});