const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
let cards, interval;
let [firstCard, secondCard] = [false, false];

const items = [
    { name: "bird", image: "images/bird.png" },
    { name: "cat", image: "images/cat.png" },
    { name: "chameleon", image: "images/chameleon.png" },
    { name: "chicken", image: "images/chicken.png" },
    { name: "dog", image: "images/dog.png" },
    { name: "fish", image: "images/fish.png" },
    { name: "rabbit", image: "images/rabbit.png" },
    { name: "rat", image: "images/rat.png" },
    { name: "snake", image: "images/snake.png" },
    { name: "spider", image: "images/spider.png" },
    { name: "turtle", image: "images/turtle.png" },
    { name: "hamster", image: "images/hamster.png" },
];

let seconds = 0;
let minutes = 0;

let movesCount = 0;
let winCount = 0;

const showTime = () => {
    seconds += 1;
    
    if(seconds >= 60){
        minutes += 1;
        seconds = 0;
    }
    
    let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
    let minutesValue = minutes < 10 ? `0${minutes}` : minutes;

    timeValue.innerHTML = `<span>Time: </span>${minutesValue}:${secondsValue}`;
};

const increaseMove = () => {
    movesCount += 1;
    
    moves.innerHTML = `<span>Moves: </span>${movesCount}`;
};

const generateRandomCards = (size = 4) => {
    let tempArray = [...items];
    let cardValues = [];
    
    size = (size * size) / 2;
    
    for(let i = 0; i < size; i++){
        const randomIndex = Math.floor(Math.random() * tempArray.length);
        cardValues.push(tempArray[randomIndex]);
        
        tempArray.splice(randomIndex, 1);
    }
    
    return cardValues;
};

const generateMatrix = (cardValues, size = 4) => {
    gameContainer.innerHTML = "";
    cardValues = [...cardValues, ...cardValues];
    cardValues.sort(() => Math.random() - 0.5);
    for(let i = 0; i < size * size; i++){
        gameContainer.innerHTML += `
        <div class="card-container" data-card-value="${cardValues[i].name}">
            <div class="card-before">?</div>
            <div class="card-after">
                <img src="${cardValues[i].image}" class="image" width="90"/>
            </div>
        </div>
        `;
    }
    
    gameContainer.style.gridTemplateColumns = `repeat(${size}, auto)`;
    
    cards = document.querySelectorAll(".card-container");
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            onCardClicked(card);
        });
    });
};

function onCardClicked(card){
    if (!card.classList.contains('matched')) {
        card.classList.add("flipped");
        if (!firstCard) {
            firstCard = card;
            firstCardValue = card.getAttribute('data-card-value');
        } else {
            increaseMove();
            secondCard = card;
    
            let secondCardValue = card.getAttribute('data-card-value');
            if (firstCardValue === secondCardValue) {
                firstCard.classList.add('matched');
                secondCard.classList.add('matched');
                firstCard = false;
    
                winCount += 1;
    
                if (winCount === Math.floor(items.length / 2)) {
                    result.innerHTML = `
                                        <h2>You won</h2>
                                        <h4>Moves: ${movesCount}</h4>
                                    `;
    
                    stopGame();
                }
            } else {
                let [tempFirst, tempSecond] = [firstCard, secondCard];
                firstCard = false;
                secondCard = false;
                let delay = setTimeout(() => {
                    tempFirst.classList.remove('flipped');
                    tempSecond.classList.remove('flipped');
                }, 900);
            }
        }
    }
}

const initialize = () => {
    result.innerText = "";
    winCount = 0;
    let cardValues = generateRandomCards();
    generateMatrix(cardValues);
    moves.innerHTML = `<span>Moves: </span>${movesCount}`;
};

startButton.addEventListener('click', () => {
    resetGame();
    interval = setInterval(showTime, 1000);
});

stopButton.addEventListener('click', stopGame);

function stopGame(){
    seconds = 0;
    minutes = 0;
    showStartScreen();
    clearInterval(interval);
}

function showStartScreen(){
    controls.classList.remove('hide');
    stopButton.classList.add('hide');
    startButton.classList.remove('hide');
}

function showGameScreen(){
    controls.classList.add('hide');
    stopButton.classList.remove('hide');
    startButton.classList.add('hide');
}

function resetGame(){
    movesCount = 0;
    winCount = 0;
    seconds = 0;
    minutes = 0;
    
    showGameScreen();
    initialize();
}