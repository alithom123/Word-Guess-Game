

// Convert to game object later.
// var game = {};

// Overall game variables
var numWins = 0;
var numLosses = 0;
var done = false;
const numErrorsForLose = 6;
const gameModes = { playing: 1, won: 2, lost: 3 };
var gameMode = gameModes.playing;
var artistNameIndex = 0;
var artistNames = ["The Band", "Leonard Cohen", "The Grateful Dead", "Neil Young", "Talking Heads", "Carl Perkins"];
var artistName = artistNames[artistNameIndex];
var numPlays = 1;
const englishAlphabetRegex = /[A-Za-z]/;


// Each game variables
var lettersGuessed = [];
// var numGuesses = 0;  can be derived from lettersGuessed.
// var numErrors = 0;  can be derived from  lettersGuessed.

// Parse page and get 100 artist names. https://www.rollingstone.com/music/music-lists/100-greatest-artists-147446/carl-perkins-2-86720/


// Main game loop.
// while(!done) {
// }

// Put game elements into variables.
var headingElement = document.getElementById('heading');
var instructionsElement = document.getElementById('instructions');
var guessedLettersElement = document.getElementById('guessed-letters');
var artistNameElement = document.getElementById('artist-name');
var winsElement = document.getElementById('wins');
var lossesElement = document.getElementById('losses');
var winLostMessageElement = document.getElementById('win-lost-message');
var guessesRemainingElement = document.getElementById('guesses-remaining');

// Initialize Game
headingElement.textContent = "60's Band Quiz Game!";
instructionsElement.textContent = "Guess any letter to start playing.";
guessedLettersElement.textContent = "No guesses so far.";
artistNameElement.textContent = artistNameToGameString(artistName, lettersGuessed);
winsElement.textContent = "Wins: " + numWins;
lossesElement.textContent = "Losses: " + numLosses;
guessesRemainingElement.textContent = "Guesses Remaining: " + numErrorsForLose;


// Start playing game on any keypress!
document.onkeypress = function (e) { // Keypress is more for characters, whereas keyup could be any key. I think in the lecture he used document.onkeyup
    // e = e || window.event; // What does this do?
    // use e.keyCode

    var characterPressed = e.key; // Do some validation? Make sure it's not in array already.
    console.log("Key = " + characterPressed);

    if( gameMode === gameModes.won || gameMode === gameModes.lost ) {

        console.log("In won or lost mode.");

        if( gameMode === gameModes.won ) {

            artistNameElement.textContent = artistNameToGameString(artistName, lettersGuessed);
            lettersGuessed = [];
            guessedLettersElement.textContent = "Guessed Letters: " + lettersGuessed.join(",");
            winLostMessageElement.textContent = "";

        } else if ( gameMode === gameModes.lost ) {

            artistNameElement.textContent = artistNameToGameString(artistName, lettersGuessed);
            lettersGuessed = [];
            guessedLettersElement.textContent = "Guessed Letters: " + lettersGuessed.join(",");
            winLostMessageElement.textContent = "";
        }

        // Either if they have won or lost we should change the band and update.
        console.log("Let's do the math together...");
        console.log("original artistNameIndex = " + artistNameIndex);
        console.log("array length = " + artistNames.length);

        // numGuesses = 0;
        guessesRemainingElement.textContent = "Guesses Remaining: " + (numErrorsForLose - getNumErrors(artistName,lettersGuessed));
        artistNameIndex = (artistNameIndex+1) % artistNames.length;
        console.log("new artistNameIndex = " + artistNameIndex);
        artistName = artistNames[artistNameIndex];
        lettersGuessed = [];
        artistNameElement.textContent = artistNameToGameString(artistName, lettersGuessed);

        // If they have just won or loss any keypress should take them back into game mode.
        instructionsElement.textContent = "Press any key to play again.";
        gameMode = gameModes.playing;

    } else if( gameMode === gameModes.playing ) {

        // If playing game.
        console.log("In playing mode.");
        instructionsElement.textContent = "Guess another key.";
        winLostMessageElement.textContent = " ";

        // if the key was a letter while playing
        if(englishAlphabetRegex.test(e.key)) {
            console.log("Passed regex for alphabet characters.");

            //then convert it to lowercase.
            characterPressed = characterPressed.toLowerCase();

            // If they guessed a valid letter
            if(lettersGuessed.indexOf(characterPressed) === -1) {

                console.log("Entered a valid unguessed letter.");
                console.log("****numErrorsForLose = " + numErrorsForLose);
                console.log("****lettersGuessed = " + lettersGuessed);
                console.log("****artistName = " + artistName);
                console.log("****getNumErrors = " + getNumErrors(artistName,lettersGuessed));
                guessesRemainingElement.textContent = "Guesses Remaining: " + (numErrorsForLose - getNumErrors(artistName,lettersGuessed));
                // guessesRemainingElement.textContent = "Guesses Remaining: Test";

                // Add character pressed to lettersGuessed array.
                lettersGuessed.push(characterPressed);

                // Update word and guesses on screen.
                artistNameElement.textContent = artistNameToGameString(artistNames[artistNameIndex],lettersGuessed);
                // Update guessed letters.
                guessedLettersElement.textContent = "Guessed Letters: " + lettersGuessed.join(",");
                //Update guesses remaining.
                guessesRemainingElement.textContent = "Guesses Remaining: " + (numErrorsForLose - getNumErrors(artistName,lettersGuessed));


                // Check if won
                if(checkWin(artistName, lettersGuessed)) {
                    // They won. Start game over with new word.
                    // <-- code -->
                    console.log("You won!");
                    gameMode = gameModes.won;
                    numWins++;
                    winsElement.textContent = "Wins: " + numWins;
                    winLostMessageElement.textContent = "You won!";
                    instructionsElement.textContent = "Press any key to play again!";

                } else if (checkLoss(lettersGuessed, numErrorsForLose)) {
                    // The lost.
                    console.log("You lost!");
                    gameMode = gameModes.lost;
                    numLosses++;
                    lossesElement.textContent = "Losses: " + numLosses;
                    winLostMessageElement.textContent = "Sorry, you lost!";
                    instructionsElement.textContent = "Press any key to play again!";
                } else {
                    // Still playing.
                    console.log("You neither won nor lost ... you are just still playing.");
                }

            } else { // They already guessed this letter.

                    // Instruct them that they already guessed that letter.
                    // <-- code -->
                    console.log("you already tried that letter you moron!");
                    instructionsElement.textContent = "You already tried that letter ... try again!";

            }
        } else {
            console.log("Failed alphabet character check");
            // key was not a alphabet character so let them know.
            instructionsElement.textContent = "Oops! You can only enter characters A-Z. Please try again.";
            return;
        }

    }

};



/* Utility Game Functions */
function artistNameToGameString(artistName, lettersGuessed) {

    // Maybe convert to array first?
    var arrayVersionOfString = artistName.split('');
    // console.log(arrayVersionOfString);

    // Loop through letters.
    for(var i=0; i<arrayVersionOfString.length; i++) {
        // pull out single letter and convert to lowercase.
        var lowercaseLetter = arrayVersionOfString[i].toLowerCase();

        // if letter is not space then we have some work to do.
        if( lowercaseLetter !== " ") {

            // if letter is not in lettersGuessed array, then replace with '_'.
            if (lettersGuessed.indexOf(lowercaseLetter) === -1 ) {
            // else replace it with a blank underscore.
                arrayVersionOfString[i] = '_';
            }
        }
    }

    // Add spaces between every letter. Maybe wait until end.
    // Don't do ^^this^^ yet.

    // Log result.
    // console.log(arrayVersionOfString);

    // Return array converted back into string.
    var gameString = arrayVersionOfString.join("");
    console.log(gameString);
    return gameString;
}

// Get the number of incorrect guesses thus far.
function getNumErrors(artistName, lettersGuessed) {

    var numErrors = 0;
    artistName = artistName.toLowerCase();
    var arrayVersionOfString = artistName.split('');

    // Loop through letters.
    for(var i=0; i<lettersGuessed.length; i++) {
        // pull out single letter and convert to lowercase.
        var lowercaseLetter = lettersGuessed[i].toLowerCase();
        if (arrayVersionOfString.indexOf(lowercaseLetter) === -1) {
            numErrors++;
        }
    }

    return numErrors;
}


function checkWin(artistName, lettersGuessed) {
    console.log("Checking for win ...");

    // Remove spaces from string.
    artistName = artistName.replace(/\s+/g, '');

    var arrayVersionOfString = artistName.split('');
    console.log(arrayVersionOfString);
    // var won = true;

    for(var i=0; i<arrayVersionOfString.length; i++) {
        var currentChar = arrayVersionOfString[i].toLowerCase();
        console.log("currentChar = " + currentChar);
        if( lettersGuessed.indexOf(currentChar) === -1) {
            console.log("Didn't find letter " + currentChar + " so no win.");
            // won = false;
            return false;
        }
    }

    console.log("Verified win!");
    return true;
}

function checkLoss(lettersGuessed, numErrorsForLose) {
    return getNumErrors(artistName,lettersGuessed) >= numErrorsForLose;
}

function updateWins(wins) {
    console.log("In updateWins:" + wins);
    console.log(document.getElementById('wins'));
    document.getElementById("wins").textContent = "Wins: " + wins;
}
