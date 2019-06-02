var login=document.getElementById("loginbtn");
var username=document.getElementById("username");
var pass=document.getElementById("password");
var tasks=[];
login.addEventListener("click",function(event){
    if(username.value==""||pass.value=="")
        alert("Please insert all values");
    else{
        var ob=new Object();
        ob.username1=username.value;
        ob.pass1=pass.value;
        console.log(ob);
       var request = new XMLHttpRequest();
    var file_name = "/productlogin";
    request.open('POST',file_name);
        request.setRequestHeader("Content-Type","application/json");
    request.send(JSON.stringify(ob))
    request.addEventListener("load",function()
    {
        if(request.responseText=="1")
            window.location="/profile";
        else if(request.responseText=="-1")
        window.location="/deactivate";
        else if(request.responseText=="new")
        window.location="/usercommunities";
        else if(request.responseText=="update")
            window.location="/firstuser";
         else
                alert("Invalid username");
    }); 
    }
});