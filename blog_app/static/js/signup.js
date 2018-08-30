window.onload = function () {
    var signUp_BTN=document.getElementById("signUp_BTN");
    signUp_BTN.onclick = function () {
        var XML = new XMLHttpRequest();
        XML.onreadystatechange = function () {
            if(this.readyState == 4 && this.status == 200 ){
                var result = JSON.parse(this.responseText);
                if ("error" in result) {
                    alert(this.response);
                }
                else {
                    window.location.replace(result["success"]);
                }
            }
        };
        XML.open("POST","/user_signup/",true);
        XML.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        var username = document.getElementById("nameSignUp").value;
        var password = document.getElementById("passwordSignUp").value;
        var repeatPass = document.getElementById("confirm").value;
        if(password === repeatPass) {
            var text = "username=" + username + "&password1=" + password + "&password2=" + repeatPass;
            XML.send(text);
        }else {
            alert("try again");
        }
    };
};