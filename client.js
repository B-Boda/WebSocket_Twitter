var sock = new WebSocket('ws://localhost:8081');
var output = document.getElementById("output_area");

function add_div_with_class (className,content) {
    let newDiv = document.createElement("div");
    newDiv.classList.add(className);
    if (content!==null) {
        newDiv.insertAdjacentHTML("afterbegin",content);
    }
    return newDiv;
}

// 接続
sock.addEventListener('open', function (e) {
    console.log('Socket Connected');
});

// サーバーからデータを受け取る
sock.addEventListener('message', function (e) {
    console.log(e.data);
    obj = JSON.parse(e.data);
    tweetDiv = add_div_with_class("tweets",null);
    names = add_div_with_class("names",null);
    names.insertAdjacentHTML("afterbegin", "<span class='username'>"+obj.username+"</span>"+"<span class='displayname'>@"+obj.screenname+"</span>");
    tweetDiv.appendChild(names);
    if (obj.head!=="") {
        tweetDiv.appendChild(add_div_with_class("head",obj.head));
    }
    tweetDiv.appendChild(add_div_with_class("text",obj.text.replace(/\n/g, "<br>")));
    output.insertBefore(tweetDiv,output.firstChild);
    //output.insertAdjacentHTML("afterbegin", "<div class='tweets'>" + obj.username + "<br>" + obj.text + "</div>");
});