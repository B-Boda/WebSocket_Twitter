var sock = new WebSocket('ws://localhost:8081');
var output = document.getElementById("output_area");

function add_div_with_class (className,content) {
    let newDiv = document.createElement("div");
    newDiv.classList.add(className);
    if (content !== null) {
        newDiv.insertAdjacentHTML("afterbegin",content);
    };
    return newDiv;
};

function show_name(status) {
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

function full_text(status) {
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
    if (status.in_reply_to_screen_name !== null) {
        let index = text.indexOf(" ");
        text = text.slice(index + 1);
    };
    return text;
};

function create_img(url, className) {
    elem = document.createElement("img");
    elem.src = url;
    elem.classList.add(className);
    return elem;
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
    //console.log(e.data);
    obj = JSON.parse(e.data);
    console.log(obj.entities.media);

    // frame
    tweetDiv = add_div_with_class("tweets",null)
    tweetBody = add_div_with_class("tweet_body",null);
    contentDiv = add_div_with_class("contents",null);
    // check if rt
    if ("retweeted_status" in obj) {
        tweetDiv.appendChild(add_div_with_class("rt_status", "<i class=\"fas fa-retweet\"></i>" + obj.user.name + " retweeted"));
    };
    // generate names
    names = add_div_with_class("names",null);
    names.insertAdjacentHTML("beforeend", "<span class='username'>"+show_name(obj).name+"</span>"+"<span class='displayname'>"+show_name(obj).screen_name+"</span>");
    contentDiv.appendChild(names);
    // reply
    if (obj.in_reply_to_screen_name != null) {
        contentDiv.appendChild(add_div_with_class("reply_status", "<i class=\"fas fa-reply\"></i>@"+obj.in_reply_to_screen_name));
    };
    // text
    contentDiv.appendChild(add_div_with_class("text",full_text(obj).replace(/\n/g, "<br>")));
    // profile image
    if ("retweeted_status" in obj) {
        tweetBody.appendChild(create_img(obj.retweeted_status.user.profile_image_url,"profile_img"));
    }else{
        tweetBody.appendChild(create_img(obj.user.profile_image_url,"profile_img"));
    };
    // attatched image
    if ("retweeted_status" in obj) {
        if ("media" in obj.retweeted_status.entities) {
            for (img of obj.retweeted_status.entities.media) {
                contentDiv.appendChild(create_img(img.media_url));
            }
        }
    }else{
        if ("media" in obj.entities) {
            console.log(obj.entities.media[0]);
            for (img of obj.entities.media) {
                contentDiv.appendChild(create_img(img.media_url));
            }
        }
    };
    // finalize
    tweetBody.appendChild(contentDiv);
    tweetDiv.appendChild(tweetBody);
    output.insertBefore(tweetDiv,output.firstChild);
});