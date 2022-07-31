var baseURL = "https://codequotient.com/api/";
var editor = document.getElementById("textarea");
var languageSelector = document.getElementById("langSelect");
var button = document.getElementById("btn");
var output = document.getElementById("outputHeading");

//Variables for sending to server
var sendlangID;
var sendCode;

button.addEventListener("click" , function(){
    
    var selectLanguage = languageSelector.value;
    //Prepare Id
    switch(selectLanguage)
    {
        case "C" :
            sendlangID = "7";
            break;
        case "C++" :
            sendlangID = "77";
            break;
        case "Java" :
            sendlangID = "8";
            break;
        case "Python" :
            sendlangID = "0";
            break;
        case "JavaScript" :
            sendlangID = "4";
            break;
        default:
            sendlangID = "4";
    }
    //Prepare Code
    sendCode = editor.value;
    sendToServer();
});

function getResult(codeId)
{
    var url = baseURL + "codeResult/" + codeId;
    var request = new XMLHttpRequest();
    request.open("GET" , url);
    request.send();

    request.addEventListener("load" , function(){
        var response = JSON.parse(request.responseText);
        var data = JSON.parse(response.data);
        if(data.status === "Pending")
        {
            getResult(codeId);
        }
       else if(data.errors!==""){
           output.innerHTML = data.errors; 
       }
       else{
           output.innerHTML = data.output; 
       }
    })
}

function sendToServer()
{
    var url = baseURL + "executeCode";
    var obj = {
        code : sendCode,
        langId : sendlangID
    };
    //Ajax request
    var request = new XMLHttpRequest();
    request.open("POST" , url);
    request.setRequestHeader("Content-Type" , "application/json");
    request.send(JSON.stringify(obj));

    //Response from Server
    request.addEventListener("load" , function(){
        var response = JSON.parse(request.responseText);
        if("codeId" in response){
            var codeId = response.codeId;
            getResult(codeId);
        }
        else{
         alert("Something went wrong!");
        }
    });
}
