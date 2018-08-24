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
    XML.onreadystatechange = function () {

        if(XML.status == 200 && XML.readyState == 4){
            var post = JSON.parse(this.response);

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
};