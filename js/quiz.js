"use strict";
(function(){

    var quizList = document.getElementById("quiz-list");
    var quizUrl = "http://localhost:57904/api/quiz";
    var quizArray = [];
    

    var httpRequest;

    
        var makeRequest = function makeRequest(url){
            httpRequest = new XMLHttpRequest();
    
            if(!url){
                alert("No URL was specified.");
                return false;
            }
    
            if (!httpRequest){
                console.log("Error creating XMLHttp Object");
                alert("Unable to create the AJAX request. ");
                return false;
            }
    
            httpRequest.onreadystatechange = getData;
            httpRequest.open("GET", url);
            httpRequest.send();
        };
    
        var getData = function getData(){
            console.log(httpRequest.readyState + " : " + httpRequest.status);
            if(httpRequest.readyState === XMLHttpRequest.DONE){
                if(httpRequest.status === 200){
                    // console.log("Got Data: " + httpRequest.responseText);
                    outputQuizList(httpRequest.responseText);
                }else{
                    alert("Request Failed." + httpRequest.status);
                }
            }
        }


        var requestData = function requestData(){
                
               makeRequest(url);
            }
        
       
         
       
       var outputQuizList = function outputQuizList(data){
           var quizResponse = JSON.parse(data);
       
           // insert the response into the first positin of the array (newest is first)
           quizArray.push(quizResponse);
    
           quizArray.forEach(function(quizRes, idx, arr){
               var newListElement = document.createElement("li");
               var newAnchor = document.createElement("a");
               newAnchor.href = "quiz.html";
               newListElement.textContent=quizRes.Name;

               
             //  newGif.classList.add("m-2");
               newListElement.appendChild(newAnchor);
               quizList.appendChild(newListElement);
       
           });
           
       }

       makeRequest(quizUrl);
       



})()
