let question = document.querySelector(".question");
let questionInside = document.querySelector(".question-inside");
let scoreResult = document.querySelector(".score");
let quizGameDiv = document.querySelector(".quiz-game-div");
let highScoreResult = document.querySelector(".high-score");
let countryFlag = document.querySelector(".country-image");
let quizQuestion = document.querySelector(".quiz-question");
let userForm = document.querySelector(".form");
let joinButton = document.querySelector(".join");
let user = document.querySelector(".user-name");
let qustionSection = document.querySelector(".question-section");

let variants = ["A", "B", "C", "D"];
let questions = ["Which country does this flag to?", "is the capital of ..."];
let score = 0;

const BASE_URL = "https://restcountries.com/v3.1/all";

// Join Quiz
userForm.addEventListener("submit", function (e) {
    e.preventDefault()
    if (user.value.trim().length == 0) {
        alert("Enter Your Name");
    }
    else {
        userForm.style.display = "none";
        quizGameDiv.style.display = "block";
        document.querySelector(".player-name").innerText += user.value;

        getData();

        if (localStorage.getItem(user.value)) {
            highScoreResult.innerText = `High Score:${localStorage.getItem(user.value)}`;
        } else {
            highScoreResult.innerText = `High Score:0`;
        }
    }
})



function getData() {
    fetch(BASE_URL)
        .then(res => res.json())
        .then(data => {
            fill(data);
        })
}

function fill(data) {
    quizQuestion.innerHTML = "";

    let randomCountriesArray=[];

    let selectedCountry;
    let randomNumber = Math.floor(Math.random() * questions.length);  
    let randomQuestion = questions[randomNumber]; 
    questionInside.innerText = randomQuestion;

    let selectedCountryIndex = Math.floor(Math.random() * 4);

    for (let i = 0; i < 4; i++) {

        let randomNumberCountry = Math.floor(Math.random() * data.length);
        while(randomCountriesArray.includes(randomNumberCountry)){
            randomNumberCountry = Math.floor(Math.random() * data.length);
        }
        randomCountriesArray.push(randomNumberCountry)

        let randomCountry = data[randomNumberCountry];

        let chooseButton = document.createElement("button");
        chooseButton.classList.add("choose-button");
        chooseButton.value = randomCountry.name.common;
        let variantSpan = document.createElement("span");
        variantSpan.innerText = variants[i];
        let answerSpan = document.createElement("span");
        answerSpan.innerText = randomCountry.name.common;

        chooseButton.appendChild(variantSpan);
        chooseButton.appendChild(answerSpan);
        quizQuestion.appendChild(chooseButton);

        if (i == selectedCountryIndex) {
            selectedCountry = randomCountry;
        }

        chooseButton.addEventListener("click", function () {
            checkAnswer(this, selectedCountry)
        })

    }

    //fill question
    if (randomNumber == 0) {
        countryFlag.src = selectedCountry.flags.svg;
        countryFlag.style.display = "block";
        document.querySelector(".capital-name").innerText = "";
    } else {
        document.querySelector(".capital-name").innerText = selectedCountry.capital;
        countryFlag.style.display = "none";
    }
}


// check answer
function checkAnswer(chooseButton, selectedCountry) {
    let findTrueAnswer = Array.from(document.querySelectorAll(".choose-button"));
    let trueAnswer = findTrueAnswer.filter(q => q.value == selectedCountry.name.common)[0];

    if (chooseButton.value == selectedCountry.name.common) {
        chooseButton.style.background = "green";
        let iconTrue = '<i class="fa fa-check" style="font-size:20px"></i>';
        chooseButton.innerHTML += (iconTrue);

        score++;
        scoreResult.innerText = `Score:${score}`;

        let nextQuestion = document.createElement("button");
        nextQuestion.classList.add("next-question");
        nextQuestion.innerText = "Next";
        quizQuestion.appendChild(nextQuestion);
        nextQuestion.addEventListener("click", function () {
            getData();
        })

    } else {
        let iconFalse = '<i class="fa fa-close" style="font-size:20px"></i>';
        chooseButton.innerHTML += (iconFalse);
        chooseButton.style.background = "red";

        let iconTrue = '<i class="fa fa-check" style="font-size:20px"></i>';
        trueAnswer.innerHTML += (iconTrue);
        trueAnswer.style.background = "green";
        trueAnswer.style.color = "white";
        localStorageScore();

        //Quiz ended
        setTimeout(function () {
            quizEnded();
        }, 1000)


    }

    chooseButton.style.color = "white";
    findTrueAnswer.map(q => q.classList.add("pointer-event"));
}

function quizEnded() {
    quizQuestion.innerHTML = "";
    questionInside.innerHTML = "";
    document.querySelector(".capital-name").innerText = "";
    countryFlag.style.display = "none";
    question.style.border = "none";

    let endDiv = document.createElement("div");
    endDiv.classList.add("ended");

    let trophyImg = document.createElement("img");
    trophyImg.classList.add("trophy");
    trophyImg.src = "./assets/trophy.png";
    endDiv.appendChild(trophyImg);

    let showResult = document.createElement("h3");
    showResult.innerText = "Results";
    endDiv.appendChild(showResult);

    let showResultInner = document.createElement("span");
    showResultInner.classList.add("show-result")
    showResultInner.innerHTML = `You got <span> ${score} </span> correct answers`;
    endDiv.appendChild(showResultInner);

    let againButton = document.createElement("button");
    againButton.classList.add("again-button");
    againButton.innerText = "Try Again";
    endDiv.appendChild(againButton);

    againButton.addEventListener('click', function () {
        score=0;
        scoreResult.innerText = `Score:${score}`;
        localStorageScore();
        endDiv.remove();
        getData();
    })

    qustionSection.appendChild(endDiv);
}

function localStorageScore() {
    if (localStorage.getItem(user.value)) {
        if (localStorage.getItem(user.value) < score) {
            localStorage.setItem(user.value, score);
            highScoreResult.innerText = `High Score:${localStorage.getItem(user.value)}`;
        }
    } else {
        localStorage.setItem(user.value, score);
        highScoreResult.innerText = `High Score:${localStorage.getItem(user.value)}`;
    }
}