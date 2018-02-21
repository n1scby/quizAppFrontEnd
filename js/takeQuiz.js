"use strict";
(function(){

var quizImage = document.getElementById("quiz-image");

var questionSection = document.getElementById("question-section");   
var urlParams = new URLSearchParams(window.location.search);
var quizId = urlParams.get('quizId');

questionSection.innerHTML = '<h2>'+quizId+'</h2>';
var quizTitle = document.getElementById("quiz-title");
var quizInfo = document.getElementById("quiz-info");

var quizUrl = "http://localhost:57904/api/quiz/" + quizId;
var questions = [];


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
    
   
     
   
   var outputQuizInfo = function outputQuizInfo(data){
       var quizResponse = JSON.parse(data);
       quizTitle.innerHTML = quizResponse[0].name;
       quizInfo.innerHTML = quizResponse[0].about;
   
    //   quizResponse.forEach(function(quizRes, idx, arr){
          
        questionSection.innerHTML=quizResponse[0].questions[0].content;

           
         //  newGif.classList.add("m-2");
     //      newListElement.appendChild(newAnchor);
     //      quizList.appendChild(newListElement);
   
     //  });
       
   }

   makeRequest(quizUrl);
   






})()