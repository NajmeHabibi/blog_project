function element_maker(text ,type ,id,className) {
        var new_p = document.createElement(type);
        var textnode = document.createTextNode(text);
        new_p.appendChild(textnode);
        new_p.classList.add(className);
        document.getElementById(id).appendChild(new_p);

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
            element_maker(title,"p","body","post");
            var body = post["body"];
            element_maker(body,"p","body","post");

            var comments = post["comments"];

            for(var CM in comments){
                var CMauthor = comments[CM]["author"];
                element_maker(CMauthor,"p","body","post");

                var CMtime_published = comments[CM]["time_published"];
                element_maker(CMtime_published,"p","body","post");

                var comment = comments[CM]["body"];
                element_maker(comment,"p","body","comment");

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