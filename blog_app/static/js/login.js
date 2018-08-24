
window.onload = function (ev) {
    var submitButton = document.getElementById("submitButton");
    submitButton.onclick = function () {
        var Xml = new XMLHttpRequest();
        Xml.onreadystatechange = function (ev2) {
            if(this.status == 200 && this.readyState == 4){
                var result = JSON.parse(this.responseText);
                if("success" in result) {
                    window.location.replace(result["success"]);
                }
                else {
                    alert(this.responseText);
                }
            }
        };
        Xml.open("POST","/user_login/",true);
        Xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        var Password = document.getElementById("Password").value;
        var UserName = document.getElementById("UserName").value;
        var postVars = "username=" + UserName + "&password=" + Password;
        Xml.send(postVars.toString());
    };


};
