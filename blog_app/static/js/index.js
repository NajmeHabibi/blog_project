window.onload=function (ev) {
    function element_maker(text ,type ,id,className) {
        var new_p = document.createElement(type);
        var textnode = document.createTextNode(text);
        new_p.appendChild(textnode);
        new_p.classList.add(className);
        document.getElementById(id).appendChild(new_p);
        return new_p;
    }

    function a_maker(href ,text,type ,id,className) {
        var new_a = document.createElement("a");
        var textnode = document.createTextNode(text);
        new_a.appendChild(textnode);
        new_a.href=href;
        var new_p=element_maker("",type ,id,className);
        new_p.appendChild(new_a);
    }

    var XMl = new XMLHttpRequest();
    XMl.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var res = JSON.parse(this.response);
            var posts = res["posts"];
            for(var idx in posts) {

                var title = posts[idx]["title"];
                element_maker(title ,"p","post","titlePost");

                var body = posts[idx]["body"];
                element_maker(body,"p","post","bodyPost");

                var post_id = posts[idx]["id"];
                a_maker("/post_detail/" + post_id + "/","more","p","post","CMBody");

                var comments = posts[idx]["comments"];
                for(var CM in comments){
                    var CMauthor = comments[CM]["author"];
                    element_maker(CMauthor,"p","post","name");
                    var CMtime_published = comments[CM]["time_published"];
                    element_maker(CMtime_published,"p","post","time");
                    var comment = comments[CM]["body"];
                    element_maker(comment,"p","post","CMBody")

                }
            }
        }
    };
    XMl.open("GET", "/get_posts/", true);
    XMl.send();

    var loginButtonInIndexHTML = document.getElementById("loginButtonInIndexHTML");
    loginButtonInIndexHTML.onclick = function() {
        window.open("/user_login/");
    };

    var logoutButton = document.getElementById("logOutButtonInIndexHTML");
    logoutButton.onclick = function () {
        var logout = new XMLHttpRequest();
        logout.onreadystatechange = function () {
            if(this.readyState == 4 && this.status == 200){
                alert("logout");
            }
        };
       logout.open("GET","/user_logout/",true);
       logout.send();
    };

    var signupButton = document.getElementById("signupButtonInIndexHTML");
    signupButton.onclick = function () {
        window.open("");
    }
};


