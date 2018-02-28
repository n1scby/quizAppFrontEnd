"use strict";
(function () {

    var quizImage = document.getElementById("quiz-image");
    var questionImage = document.getElementById("question-image");

    var questionSection = document.getElementById("question-section");
    var urlParams = new URLSearchParams(window.location.search);
    var quizId = urlParams.get('quizId');

    questionSection.innerHTML = "";
    var quizTitle = document.getElementById("quiz-title");
    var quizInfo = document.getElementById("quiz-info");

    var quizUrl = "http://localhost:57904/api/quiz/" + quizId;
    var quizData;

    var questionNumber = 0;

    var submitAnswer = document.getElementById("submit-answer");
    var nextButton = document.getElementById("next-button");
    var answerResponse = document.getElementById("answer-response");
    var scoreSection = document.getElementById("score-section");
    var questionNumberSection = document.getElementById("question-number");

    var answerId = 0;
    var questionTotal = 0;
    var totalCorrect = 0;
    var questionAnswer;
    var wrongAnswer = "";


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
       //     newQuizImage.src = quizData[0].imagePath;            
            newQuizImage.classList.add("img-fluid");
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
        
        clearQuestion();

        // first question and no questions, then display message.
        if (quizData[0].questions[questionNumber] == null && questionNumber == 0) {
            questionSection.innerHTML = "Sorry, no questions to ask.";
            nextButton.disabled = true;
            return;
        }

        // no more questions - Game is over.
        if (quizData[0].questions.length == questionNumber) {
            questionSection.innerHTML = "GAME OVER";
            nextButton.disabled = true;
            questionNumberSection.innerHTML = "";
            return;
        }
        var displayQuestionNumber = questionNumber + 1;
        questionNumberSection.innerHTML = "Question: " + displayQuestionNumber;

        var newQuestionDiv = document.createElement("div");
        newQuestionDiv.innerHTML = quizData[0].questions[questionNumber].content;
        newQuestionDiv.classList.add("mb-3");
        questionSection.appendChild(newQuestionDiv);


        if (quizData[0].questions[questionNumber].image != null) {
            var newQuestionImage = document.createElement("img");
            newQuestionImage.src = "/images/" + quizData[0].questions[questionNumber].image;
      //      newQuestionImage.src = quizData[0].questions[questionNumber].imagePath;            
            newQuestionImage.classList.add("img-thumbnail");
            questionImage.appendChild(newQuestionImage);
        }

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

        submitAnswer.disabled=false;
        
     

    }

    var assignSelection = function assignSelection() {
        quizData[0].questions[questionNumber].answers.forEach(function (answer, idx, arr) {
            var newDiv = document.createElement("div");
            var newAnswerLabel = document.createElement("label");
            var newAnswerInput = document.createElement("input");
            newAnswerInput.type = "radio";
            newAnswerInput.value = answer.id;
            newAnswerInput.name = "Choice";
            newAnswerLabel.innerHTML = answer.content;
            newAnswerLabel.classList.add("pl-2");
            newDiv.appendChild(newAnswerInput);
            newDiv.appendChild(newAnswerLabel);            
            questionSection.appendChild(newDiv);
            if (answer.isCorrect == true) {
                questionAnswer = answer;
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
        quizData[0].questions[questionNumber].answers.forEach(function (answer, idx, arr) {
            if (answer.isCorrect == true) {
                questionAnswer = answer;
            }

        });

    }

   submitAnswer.addEventListener("click", function(){
        
    
    switch (quizData[0].questions[questionNumber].type) {
        
                    case "Multi":
                        verifySelection();
                        break;
                    case "TF":
                        verifySelection();
                        break;
                    case "Fill":
                        verifyFill();
                        break;
                    default:
                        verifySelection();
                        break;
        
                };


   })

   nextButton.addEventListener("click", function(){
    questionNumber++;
    nextQuestion();
   })



   var verifySelection = function verifySelection() {
       var selection = 0;
        var selections = document.getElementsByName("Choice");
        for(var i = 0; i<selections.length; i++) {
            if(selections[i].checked) {
                selection = selections[i].value;
            }
        }

        if (selection == 0) {
            answerResponse.innerHTML = "Please Make a Selection";
            return;
        }

        if (selection == questionAnswer.id) {
            outputResponseToAnswer("Correct");            
            totalCorrect++;
        } else {
            outputResponseToAnswer("Wrong");
            incorrectInfo(selection);
            
        }

        questionTotal++;
        submitAnswer.disabled=true;  //disable submit button
        

        scoreSection.innerHTML = "Score: " + totalCorrect + " / " + questionTotal; 


   }


   var verifyFill = function verifyFill() {
    var fillInAnswer = document.getElementById("answer-fill");
    
    

     if (fillInAnswer.value == "") {
         answerResponse.innerHTML = "Please Fill in an Answer";
         return;
     }

     if (fillInAnswer.value.toUpperCase() == questionAnswer.content.toUpperCase()) {
         outputResponseToAnswer("Correct");
         totalCorrect++;
     } else {
         outputResponseToAnswer("Wrong");
         checkForWrongAnswerInfo(fillInAnswer.value.toUpperCase());
     }

     submitAnswer.disabled=true;     
     questionTotal++;

     scoreSection.innerHTML = "Score: " + totalCorrect + " / " + questionTotal; 


}


    var outputResponseToAnswer = function outputResponseToAnswer(rightOrWrong){
        if (rightOrWrong == "Correct"){
            answerResponse.innerHTML = "<span id=\"correct-answer\">Correct!  " + questionAnswer.info + "</span>";
        } else 
        {           
            wrongAnswer = "<span id=\"wrong-answer\">That is not correct.  ";
        }
    }


    // Find the incorrect answer in the answers list to see if any extra info should be displayed.
    var incorrectInfo = function incorrectInfo(valueId){
        var answerInfo = quizData[0].questions[questionNumber].answers.find(function(ans){
            return ans.id == valueId;
        
        });

        if (answerInfo.info != null) {
        wrongAnswer += answerInfo.info;
        }
        
        answerResponse.innerHTML = wrongAnswer + "</span>";
    }

   
   // Check for an incorrect answer in the answers array to see if there is any info that should be displayed for a fill-in answer.
    var checkForWrongAnswerInfo = function checkForWrongAnswerInfo(valueUpCase) {
        var answerInfo = quizData[0].questions[questionNumber].answers.find(function(ans){
            return ans.content.toUpperCase() == valueUpCase;
        });
        if (answerInfo != null && answerInfo.info != null){
            wrongAnswer += answerInfo.info;
        }
        answerResponse.innerHTML = wrongAnswer + "</span>";
    }


   var clearQuestion = function clearQuestion(){
        
            while (questionSection.firstChild) {
              questionSection.removeChild(questionSection.firstChild);
             }

             answerResponse.innerHTML = "";
             questionImage.innerHTML = "";
             wrongAnswer = "";
   }

   makeRequest(quizUrl);







    })()