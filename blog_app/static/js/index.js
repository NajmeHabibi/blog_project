function element_maker(text ,type ,id,className) {
    var new_p = document.createElement(type);
    if(text != ""){
        var textnode = document.createTextNode(text);
        new_p.appendChild(textnode);
    }
    if(className!=""){
        new_p.classList.add(className);
    }
    if(id != "")
    document.getElementById(id).appendChild(new_p);
    return new_p;
}

function a_maker(href ,text,type ,id,className,linkId) {
    var new_a = document.createElement("a");
    var textnode = document.createTextNode(text);
    new_a.appendChild(textnode);
    new_a.className += className+"";
    new_a.href=href;
    if(linkId == "all"){
       new_a.className = new_a.className.replace("hideLink","showLink");
    }
    new_a.id = linkId ;
    var new_p=element_maker("",type ,id,"");
    new_p.appendChild(new_a);
    return new_p;
}

window.onload=function (ev) {

    var searchBTN = document.getElementById("searchBTN");
    var searchXML = new XMLHttpRequest();
    searchBTN.onclick = function (ev2) {
          searchXML.onreadystatechange = function (ev2) {
            if(this.status == 200 && this.readyState == 4){
                var res = JSON.parse(this.response);
                var to_be_deleted = document.getElementById("post");
                to_be_deleted.innerHTML = '';
                makePost(res);
                console.log(res);

            }
         };
          var searchinput = document.getElementById("searchInput").value;
          searchXML.open("GET","/search_in_posts/?stream="+searchinput,true);
          searchXML.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
          searchXML.send();
    };


    getPostsByCategory("all");

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
        window.open("user_signup");
    };

    var categoryXML =  new XMLHttpRequest();
    categoryXML.onreadystatechange = function (ev2) {
        if (this.status == 200 &&  this.readyState == 4){
            var res = JSON.parse(this.response);
            var ul = document.getElementById("categoryUL");
            DFS(res,ul);
        }

    };
    categoryXML.open("GET","/get_categories/",true);
    categoryXML.send();
};


function DFS(res , ulTag ) {
    var ul = document.createElement("ul");
    ulTag.appendChild(ul);
    ul.className += "list-group";
    for (var key in res) {
        if (res.hasOwnProperty(key)) {
            var li = a_maker("",key,"li","","list-group-item list-group-item-action categoryLinks hideLink",key);
            ul.appendChild(li);
            var a = document.getElementById(key);
            a.addEventListener("click" , function (e) {
                e.preventDefault();
                var to_be_deleted = document.getElementById("post");
                to_be_deleted.innerHTML = '';
                getPostsByCategory(this.innerText);
                var current = document.getElementsByClassName("linkActive");
                if (current.length > 0 ) {
                    current[0].className = current[0].className.replace(" linkActive", "");
                }
                if(this.id != "all"){
                    var current1 = document.getElementsByClassName("linkActive");
                    if (current1.length > 0 ) {
                        hideElements(res,current1);
                    }
                }
                this.className += " linkActive";

                for(var x in res[this.id]){
                    this.className +=" open";
                    if (res[this.id].hasOwnProperty(x)) {
                        var link = document.getElementById(x);
                        link.className = link.className.replace(" hideLink", "");
                    }
                }
            })
        };
        console.log(key, res[key]);
        DFS(res[key],li);
    }
}

function hideElements(res,current) {
    // for(var x in current){
    //     alert(current[x].id);
    // }
        alert(res[current[0].id]);
        for (var x in res[current[0].id]) {
            alert("done");
            if (res[current[0].id].hasOwnProperty(x)) {
                var link = document.getElementById(x);
                link.className +=link.className.replace(" "," hideLink");
                hideElements(res[link]);
            }
        }
    }


function getPostsByCategory(category) {
    var XMl = new XMLHttpRequest();
    XMl.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var res = JSON.parse(this.response);
            var posts = res["posts"];
            makePost(posts);
        }
    };
    XMl.open("GET", "/get_posts/?category=" + category, true);
    XMl.send();
}

function makePost(posts) {
    for(var idx in posts) {
        var title = posts[idx]["title"];
        element_maker(title ,"p","post","titlePost");

        var category = posts[idx]["category"];
        element_maker("Category: "+category ,"p","post","categoryPost");

        var body = posts[idx]["body"];

        var bodyTag = element_maker(body,"p","post","bodyPost");
        if(posts[idx].hasOwnProperty("seen_words")){
            var seenWords = posts[idx]["seen_words"];
            for(var word in seenWords){
                highlight(seenWords[word] ,bodyTag);
            }
        }
        if(posts[idx].hasOwnProperty("unseen_words")){
            var unseenWords = posts[idx]["unseen_words"];
            var unseenWordsString = "";
            for(var word in unseenWords){
                unseenWordsString +="  "+unseenWords[word];
            }
            var word = element_maker(unseenWordsString,"p","post","unseenWords");
            var x = "<span >" + " Missing:   " + "</span>" + word.innerHTML;
            word.innerHTML = x ;
        }

        var post_id = posts[idx]["id"];
        a_maker("/post_detail/" + post_id + "/","more","p","post","btn-danger btn moreLink");
    }
}

function highlight(text ,inputText) {
    var innerHTML = inputText.innerHTML;
    var index = innerHTML.indexOf(text);
    var words = "";
    var bool = false;
    while (index>= 0) {
        if(index != 0 && (index + text.length) != innerHTML.length) {
            if (!isAlpha(innerHTML.substring(index - 1, index)) && !isAlpha(innerHTML.substring(index + text.length, index + text.length + 1))) {
                if (!bool) bool = true;
                words += innerHTML.substring(0, index) + "<span class='highlight'>" + innerHTML.substring(index, index + text.length) + "</span>";
            } else {
                words += innerHTML.substring(0, index + text.length);
            }
        }else if(index == 0 && (index + text.length) != innerHTML.length){
            if ( !isAlpha(innerHTML.substring(index + text.length, index + text.length + 1))) {
                if (!bool) bool = true;
                words += innerHTML.substring(0, index) + "<span class='highlight'>" + innerHTML.substring(index, index + text.length) + "</span>";
            } else {
                words += innerHTML.substring(0, index + text.length);
            }
        }else if(index != 0 && (index + text.length) == innerHTML.length){
            if (!isAlpha(innerHTML.substring(index - 1, index))) {
                if (!bool) bool = true;
                words += innerHTML.substring(0, index) + "<span class='highlight'>" + innerHTML.substring(index, index + text.length) + "</span>";
            } else {
                words += innerHTML.substring(0, index + text.length);
            }

        }else {
             if (!bool) bool = true;
             words += innerHTML.substring(0, index) + "<span class='highlight'>" + innerHTML.substring(index, index + text.length) + "</span>";
        }
      innerHTML = innerHTML.substring(index + text.length);
      index = innerHTML.indexOf(text);
    }
    if(bool){
        inputText.innerHTML = words + innerHTML;
    }
}

 function isAlpha(ch){

    return (ch >= "A" && ch <= "z");
}