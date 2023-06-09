// Get the element with id "time"
const timeValue = document.getElementById("time");

// Initialize variables
let seconds = 0;
let minutes = 0;
let interval;
let movesCount = 0;
let score = 0;
let movesLeft = "";
let gameStarted = false;
let timeLeft =240;

// Function to start the timer
const startTimer = () => {
    // Set interval to run a function every second
    interval = setInterval(() => {
        // Check if the timer is up
        if (timeLeft <= 0) {
            // If time is up, clear the interval and display the game lost message
            clearInterval(interval);
            displayGameLostMessage();
            return;
        }

        // Decrement the time left by 1 (1 second)
        timeLeft--;
        //Calling the updateTime function to update the time
        updateTime();
    }, 1000);
};

//Function to display time
const updateTime = () => {
    // Calculate the minutes and seconds from the timeLeft value
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    // Format the seconds and minutes values with leading zeros if necessary
    const secondsValue = seconds < 10 ? `0${seconds}` : seconds;
    const minutesValue = minutes < 10 ? `0${minutes}` : minutes;
    // Updating the text of the timeValue with the new formatted time
    timeValue.textContent = `${minutesValue}:${secondsValue}`;
};

// Function for counting the moves
const incrementMoves = () => {
    // Incrementing the moves
    movesCount++;
    // Get the element with id "moves-count" 
    const movesElement = document.getElementById("moves-count");
    //updating the MovesElement with the new moves
    movesElement.innerHTML = `<span>Moves:</span> ${movesCount}`;
};

// Function for counting the score
const incrementScore = () => {
    // Incrementing the score
    score++;
    // Get the element with id "score"
    const scoreElement = document.getElementById("score");
    //updating the ScoreElement with the new score
    scoreElement.innerHTML = `<span>Score:</span> ${score}`;
};

// When the DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Geting all the elements with class "tile"
    const tiles = document.querySelectorAll('.tile');
    // Getting all the element with class "gameboard"
    const gameboard = document.querySelector('.gameboard');
    // This is an empty array for storing the flipped tiles
    let flippedTiles = [];

    //Calling a function that randomly shuffles the tiles
    shuffleTiles(gameboard, tiles);

    // We are adding event listeners to each tile
    tiles.forEach(tile => {
        // Adding the "disabled" class to each tile (for the tiles to not be clickable)
        tile.classList.add('disabled');
        // Adding a click event listener to each tile
        tile.addEventListener('click', () => {
            // Checking if the tile is already flipped and if the number of tiles is less than 2
            if (!tile.classList.contains('flipped') && flippedTiles.length < 2) {
                // Flip the tile and add it to the flippedTiles array
                tile.classList.add('flipped');
                flippedTiles.push(tile);

                // Checking if two tiles are flipped
                if (flippedTiles.length === 2) {

                    //If two tiles are flipped we are calling the incrementMoves function 
                    incrementMoves();
                    // Set a timeout to check if the flipped tiles match after a delay of 1 second
                    setTimeout(() => {
                        //checking if the tiles are matched with the function checkMatch()
                        checkMatch();
                        // Reset the flippedTiles array after checking the match
                        flippedTiles = [];
                    }, 1000); //The delay check for tile match
                }
            }
        });

    });

    // Getting the element with id "start-button"
    const startButton = document.getElementById("start-button");
    // Adding a click event listener to the start button
    startButton.addEventListener('click', () => {
        // Updating the gamestarted variable to true
        gameStarted = true;
        //Calling the functions shuffleTiles() to randomize the tiles
        shuffleTiles(gameboard, tiles);
        //Calling function startTime to start the timer
        startTimer();
        //Removing the disabled class from the tiles so they can be clickable
        tiles.forEach(tile => {
            tile.classList.remove('disabled');
        });
    });

    // Function to check if the flipped tiles match
    const checkMatch = () => {
        const [firstTile, secondTile] = flippedTiles;
        const firstValue = firstTile.dataset.cardValue;
        const secondValue = secondTile.dataset.cardValue;

        //checking if the values of the first and second tile are the same
        if (firstValue === secondValue) {
            // If the values of the flipped tiles are the same, then mark them as matched
            firstTile.classList.add('matched');
            secondTile.classList.add('matched');
            // Increment the score
            incrementScore();

            // Get all matched tiles
            const matchedTiles = document.querySelectorAll('.matched');
            //checking if the matched tiles are the same with all the tiles
            if (matchedTiles.length === tiles.length) {
                // If they are the same , display the game won message
                displayGameWonMessage();
            }
        } else {
            //If the valuees of the tiles don't match then flip them back
            firstTile.classList.remove('flipped');
            secondTile.classList.remove('flipped');
        }
    };
});

// Function to shuffle the tiles
const shuffleTiles = (gameboard, tiles) => {
    for (let i = tiles.length - 1; i > 0; i--) {
        // Generating a random index
        const j = Math.floor(Math.random() * (i + 1));
        // Swapping the positions of tiles at indices i and j
        gameboard.insertBefore(tiles[j], tiles[i]);
    }
};

// Function to display the game won message
const displayGameWonMessage = () => {
    // Getting the elements for the game won message 
    const message = document.getElementById('MessageWon');
    const closeButton = document.getElementsByClassName('close')[0];
    const playAgainBtn = document.getElementById('playAgain');

    // Update the moves and time in the message
    const movesElement = document.getElementById("message-moves");
    movesElement.textContent = `Moves Made: ${movesCount}`;

    //making the seconds to be minutes when the game won message shows
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeElement = document.getElementById("message-time");
    timeElement.textContent = `Time: ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

    // Stopping the timer when the user won and displaying the game won message
    clearInterval(interval);
    message.style.display = 'block';

    // Adding a click event listener to the close button so the message can be closed
    closeButton.addEventListener('click', () => {
        message.style.display = 'none';
    });

    //Adding a event listener to the play again button so the pages reloads when clicked
    playAgainBtn.addEventListener('click', () => {
        location.reload();
    });
};

// Function to display the game lost message
const displayGameLostMessage = () => {
    // Getting the elements for the game lost message 
    const message = document.getElementById('MessageLost');
    const closeButton = document.getElementsByClassName('Close')[0];


    const playAgainBtn = document.getElementById('PlayAgain');
    // Update the moves and time in the message
    const MovesElement = document.getElementById("Message-moves");
    MovesElement.textContent = `Moves Made: ${movesCount}`;

    //making the seconds to be minutes when the game won message shows
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeElement = document.getElementById("message-time");
    timeElement.textContent = `Time: ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;


    // Stopping the timer when the user won and displaying the game won message
    clearInterval(interval);
    message.style.display = 'block';

    // Adding a click event listener to the close button so the message can be closed
    closeButton.addEventListener('click', () => {
        message.style.display = 'none';
    });

    //Adding a event listener to the play again button so the pages reloads when clicked
    playAgainBtn.addEventListener('click', () => {
        location.reload();
    });
};