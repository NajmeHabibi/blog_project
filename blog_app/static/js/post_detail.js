function element_maker(text ,type ,id,className) {
        var new_p = document.createElement(type);
        if(text != ""){
            var textnode = document.createTextNode(text);
            new_p.appendChild(textnode);
        }
        new_p.classList.add(className);
        document.getElementById(id).appendChild(new_p);
        return new_p;
    }

var url = window.location.href;
url = url.replace("post_detail", "get_post");

window.onload = function (ev) {
    var XML = new XMLHttpRequest();
    var post;
    XML.onreadystatechange = function () {
        if(XML.status == 200 && XML.readyState == 4){
            post = JSON.parse(this.response);
            var title = post["title"];
            element_maker(title,"p","body","titlePost");
            var body = post["body"];
            element_maker(body,"p","body","bodyPost");

            var comments = post["comments"];

            for(var CM in comments){
                var div = element_maker("","div","body","postComments");

                var CMauthor = comments[CM]["author"];
                var authorP = element_maker(CMauthor,"p","body","authorPostComment");
                div.appendChild(authorP);
                var CMtime_published = comments[CM]["time_published"];
                var CMtime_publishedP = element_maker(CMtime_published,"p","body","timePostComment");
                div.appendChild(CMtime_publishedP);
                var comment = comments[CM]["body"];
                var commentP = element_maker(comment,"p","body","comment");
                div.appendChild(commentP);
            }
        }
    };
    XML.open("GET", url, true);
    XML.send();

    var sendButton=document.getElementById("sendButton");
    sendButton.onclick = function (ev2) {
        var sendXML = new XMLHttpRequest();
        sendXML.onreadystatechange = function (ev3) {
            if (this.readyState == 4 && this.status == 200){
                alert(this.response);
            }
        };
        sendXML.open("POST","/add_comment/",true);
        sendXML.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        var text = document.getElementById("commentTextarea").value;
        var comment = "text="+text+"&post_id="+post["id"];
        sendXML.send(comment.toString());
    }
};