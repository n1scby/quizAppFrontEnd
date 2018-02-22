"use strict";
(function () {

    var quizImage = document.getElementById("quiz-image");

    var questionSection = document.getElementById("question-section");
    var urlParams = new URLSearchParams(window.location.search);
    var quizId = urlParams.get('quizId');

    questionSection.innerHTML = '<h2>' + quizId + '</h2>';
    var quizTitle = document.getElementById("quiz-title");
    var quizInfo = document.getElementById("quiz-info");

    var quizUrl = "http://localhost:57904/api/quiz/" + quizId;
    var quizData;

    var questionNumber = 0;

    var submitAnswer = document.getElementById("submit-answer");
    var nextButton = document.getElementById("next-button");
    var answerResponse = document.getElementById("answer-response");

    var answerId = 0;


    var httpRequest;


    var makeRequest = function makeRequest(url) {
        httpRequest = new XMLHttpRequest();

        if (!url) {
            alert("No URL was specified.");
            return false;
        }

        if (!httpRequest) {
            console.log("Error creating XMLHttp Object");
            alert("Unable to create the AJAX request. ");
            return false;
        }

        httpRequest.onreadystatechange = getData;
        httpRequest.open("GET", url);
        httpRequest.send();
    };

    var getData = function getData() {
        console.log(httpRequest.readyState + " : " + httpRequest.status);
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                // console.log("Got Data: " + httpRequest.responseText);
                splitData(httpRequest.responseText);
                outputQuizInfo();
            } else {
                alert("Request Failed." + httpRequest.status);
            }
        }
    }


    var requestData = function requestData() {

        makeRequest(url);
    }


    var splitData = function splitData(data) {
        quizData = JSON.parse(data);

    }

    var outputQuizInfo = function outputQuizInfo() {

        quizTitle.innerHTML = quizData[0].name;
        quizInfo.innerHTML = quizData[0].about;
        if (quizData[0].image != null) {
            var newQuizImage = document.createElement("img");
            newQuizImage.src = "/images/" + quizData[0].image;
            newQuizImage.classList.add("img-responsive");
            quizImage.appendChild(newQuizImage);
        }

        nextQuestion();


        //   quizResponse.forEach(function(quizRes, idx, arr){

        //     questionSection.innerHTML=quizResponse[0].questions[0].content;


        //  newGif.classList.add("m-2");
        //      newListElement.appendChild(newAnchor);
        //      quizList.appendChild(newListElement);

        //  });

    }




    var nextQuestion = function nextQuestion() {
        if (questionNumber == 0 && quizData[0].questions[questionNumber] == null) {
            questionSection.innerHTML = "Sorry, no questions to ask.";
            return;
        }

        var newQuestionDiv = document.createElement("div");
        newQuestionDiv.innerHTML = quizData[0].questions[questionNumber].content;
        questionSection.appendChild(newQuestionDiv);

        switch (quizData[0].questions[questionNumber].type) {

            case "Multi":
                assignSelection();
                break;
            case "TF":
                assignSelection();
                break;
            case "Fill":
                assignFill();
                break;
            default:
                assignSelection();
                break;

        };
     

    }

    var assignMulti = function assignSelection() {
        quizData[0].questions[questionNumber].answers.forEach(function (answer, idx, arr) {
            var newAnswerLabel = document.createElement("label");
            var newAnswerInput = document.createElement("input");
            newAnswerInput.type = "radio";
            newAnswerInput.value = answer.id;
            newAnswerInput.name = "Choice";
            newAnswerLabel.innerHTML = answer.content;
            questionSection.appendChild(newAnswerLabel);
            questionSection.appendChild(newAnswerInput);
            if (answer.isCorrect == true) {
                answerId = answer.id;
            }


        });
    }

    // var assignMulti = function assignTF(tfValue) {
    //         var newAnswerLabel = document.createElement("label");
    //         var newAnswerInput = document.createElement("input");
    //         newAnswerInput.type = "radio";
    //         newAnswerInput.name = "Choice";
    //         newAnswerInput.id = tfValue;
    //         newAnswerLabel.innerHTML = TFValue;
    //         questionSection.appendChild(newAnswerLabel);
    //         questionSection.appendChild(newAnswerInput);
           
        
    // }

    var assignFill = function assignFill() {
        var newAnswerInput = document.createElement("input");
        newAnswerInput.type = "text";
        newAnswerInput.id = "answer-fill";
        questionSection.appendChild(newAnswerInput);
    }

   submitAnswer.addEventListener("click", function(){
        
    
    switch (quizData[0].questions[questionNumber].type) {
        
                    case "Multi":
                        verifyMulti();
                        break;
                    case "TF":
                        verifyTF();
                        break;
                    case "Fill":
                        verifyFill();
                        break;
                    default:
                        verifyMulti();
                        break;
        
                };


   })

   nextButton.addEventListener("click", function(){
    questionNumber++;
    nextQuestion();
   })

   var verifyMulti = function verifySelection() {
       var selection = 0;
        var selections = document.getElementsByName("Choice");
        for(var i = 0; i<selections.length; i++) {
            if(selections[i].checked) {
                selection = selection[i].value;
            }
        }

        if (selection == 0) {
            answerResponse.innerHTML = "Please Make a Selection";
            return;
        }

        if (selection == answerId) {
            answerResponse.innerHTML = "Correct!";
            totalCorrect++;
        } else {
            answer.Response.innerHTML = "Wrong!";
        }

        questionTotal++;


   }

   makeRequest(quizUrl);







    })()