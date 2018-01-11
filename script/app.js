// buttons
var onePlayer = document.getElementById('one-player');
var twoPlayer = document.getElementById('two-player');
var selectX = document.getElementById('pick-x');
var selectO = document.getElementById('pick-o');
var goBack = document.getElementById('go-back');
var reset = document.getElementById('reset');
var playAgain = document.getElementById('play-again');

// screens
var mainMode = document.getElementById('main-mode');
var selectMode = document.getElementById('select-mode');
var chooseXorO = document.getElementById('pick-x-or-o');

// player teams, for two player
var p1Turn = true;
var p1Team;
var p2Team;
var twoPlayerMode = true;

// one player mode ai logic
var p2Title = document.getElementById('p2-title'); //to change 'player 2' to 'computer'
var firstMove = true; // only used if the computer goes first (only first turn)
var gameOver = false; // to stop computer from going after player wins
var canWin = false;
var computerHasMatch = false;
var winningSpotOpen = false;
var canBlock = false;
var cancelComputersTurn;

// main game logic
var tiles = document.getElementsByClassName('selectBox'); 
var p1Score = 0;
var p2Score = 0;

// html text
var winText = document.getElementById('player-won');
var drawText = document.getElementById('draw-message');
var p1ScoreHolder = document.getElementById('player-one-score');
var p2ScoreHolder = document.getElementById('player-two-score');
var p1TurnCard = document.getElementById('p1-turn');
var p2TurnCard = document.getElementById('p2-turn');
var p1Color = 'white';
var p2Color = '#00000099';

// listeners
reset.addEventListener('click', handleReset);
playAgain.addEventListener('click', handlePlayAgain);
onePlayer.addEventListener('click', handleOnePlayer);
twoPlayer.addEventListener('click', handleTwoPlayer);
selectX.addEventListener('click', handleX);
selectO.addEventListener('click', handleO);
goBack.addEventListener('click', handleGoBack);

for (var i = 0; i < tiles.length; i++) {
    tiles[i].addEventListener('click', handleSelectBox);

}

// hide and reveal elements
function changeScreen(toHide, toReveal) {
    for (var i = 0; i < toHide.length; i++) {
        toHide[i].classList.add('hide'); 

    }
    
    for (var i = 0; i < toReveal.length; i++) {
        toReveal[i].classList.remove('hide'); 
    
    }

}

// print
function print(team, item, color) {
    item.textContent = team;
    item.style.color = color;
    item.setAttribute('disabled', 'true');
    
    if(p1Turn) {
        changeScreen([p1TurnCard], [p2TurnCard]);

    } else {      
        changeScreen([p2TurnCard], [p1TurnCard]);

    }

}

// var playersTurn;

// select game mode, first screen
function handleOnePlayer () {
    twoPlayerMode = false;
    changeScreen([selectMode], [chooseXorO]);
    
}

function handleTwoPlayer () {
    changeScreen([selectMode], [chooseXorO]);

}

// player one x's or o'x, second screen
function handleX () {
    p1Team = 'X';
    p2Team = 'O';
    
    if(twoPlayerMode) {
        runTwoPlayer();
    
    } else {   
        runOnePlayer();

    }
    
}

function handleO () {
    p1Team = 'O';
    p2Team = 'X';

    if(twoPlayerMode) {
        runTwoPlayer();
    
    } else {   
        runOnePlayer();
    
    }
    
}

function handleGoBack () { // go back
    changeScreen([chooseXorO], [selectMode]);
    handleReset();
    
}


function runTwoPlayer () {   
    changeScreen([chooseXorO], [mainMode, p1TurnCard]);
    
}

function runOnePlayer () {   
    changeScreen([chooseXorO], [mainMode]);
    p2Title.textContent = 'Computer:';
    p1Turn= ranNumBetweenRange(0, 1);
    
    if(p1Turn === 0) {
        changeScreen([], [p2TurnCard]);
        computersMove();
        
    } else {
        changeScreen([], [p1TurnCard]);
        playersMove();

    }

}

// create random number between range for ai
function ranNumBetweenRange(min, max) {
    var x = Math.floor(Math.random()*(max-min+1)+min);
    return x;

}

// check if spot is open
function open(index) {
    var x = tiles[index].textContent === '';
    return x;

}

// computer ai
// check if computer can win
function checkIfWinningSpotOpen(possibleWins) {
    for(var i = 0; i < possibleWins.length; i++) {
        var match = possibleWins[i][0] === 2;
        var p1Open = tiles[possibleWins[i][1]].textContent === '';
        var p2Open = tiles[possibleWins[i][2]].textContent === '';
        var p3Open = tiles[possibleWins[i][3]].textContent === '';
        
        if(match) {
            if(p1Open) {
                return [true, possibleWins[i][1]];
                
            }

            if(p2Open) {
                return [true, possibleWins[i][2]];

            }

            if(p3Open) {
                return [true, possibleWins[i][3]];
                
            } 
            
        } 

    }
    return false;

}


function checkIfCanWin(team) {
    var cc = [
        scenario(0,1,2, team),
        scenario(3,4,5, team),
        scenario(6,7,8, team),
        scenario(0,3,6, team),
        scenario(1,4,7, team),
        scenario(2,5,8, team),
        scenario(0,4,8, team),
        scenario(2,4,6, team) 
    ]
    
    computerHasMatch = cc[0][0] === 2||cc[1][0] === 2||cc[2][0] === 2||cc[3][0] === 2||cc[4][0] === 2||cc[5][0] === 2||cc[6][0] === 2||cc[7][0] === 2;
    winningSpotOpen = checkIfWinningSpotOpen(cc)[0];

    if(computerHasMatch) {
        if(winningSpotOpen) {
            return [true, checkIfWinningSpotOpen(cc)[1]]; 

        } else {
            return false;
            
        }
   
    } else {
        return false;

    }

}



function computersMove() {
    lockAll();

    if(gameOver) {
        return;
    
    }      

    changeScreen([p1TurnCard], [p2TurnCard]);
    
    p2TurnCard.textContent = "Computers turn";
    canWin = checkIfCanWin(p2Team);
    canBlock = checkIfCanWin(p1Team);

    
    cancelComputersTurn = setTimeout(function() {

        
        if (firstMove) {
            firstMove = false;
            let cornersAndCenterIndexes = [0, 2, 4, 6, 8];
            let randomCornerOrCenter = tiles[cornersAndCenterIndexes[ranNumBetweenRange(0, 4)]];
            
            print(p2Team, randomCornerOrCenter, p2Color);
            
        } else if (canWin[0]) {
            print(p2Team, tiles[canWin[1]], p2Color);

        } else if (canBlock[0]) {
            print(p2Team, tiles[canBlock[1]], p2Color);
            
        } else {
            // take random position
            let openSpots = [];
            let openIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8];
            for (var i = 0; i < 9; i++) {
                if(open(openIndexes[i])) {
                    openSpots.push(openIndexes[i]);
                }
            }

            let randomSpotIndex = openSpots[ranNumBetweenRange(0, openSpots.length-1)];
            print(p2Team, tiles[randomSpotIndex], p2Color);
                 
        }

        checkForWin();
        p1Turn = true;
        playersMove();
        
    }, 800); 

}

// players move (1 player)
function playersMove() {
    if(gameOver) {
        return;

    }

    firstMove = false;
    changeScreen([p2TurnCard], [p1TurnCard]);
    
    p1TurnCard.textContent = 'Your turn';

    for (var i = 0; i < 9; i++) {
        if(open(i)) {
            tiles[i].removeAttribute('disabled');

       }
       
    }
    
}


// lock
function lockAll() {
    for (var i = 0; i < tiles.length; i++) {
        tiles[i].disabled = true;

    }
    
}

function unlockAll() {
    for (var i = 0; i < tiles.length; i++) {
        tiles[i].removeAttribute("disabled");

    }

}

function clearTiles() {
    for (var i = 0; i < tiles.length; i++) {
        tiles[i].textContent = '';
        
    }

}

// reset
function handleReset() {
    clearTimeout(cancelComputersTurn);
    p2TurnCard.textContent = 'Go player 2';
    p1TurnCard.textContent = 'Go player 1';
    p2Title.textContent = 'Player 2:';
    gameOver = false;
    firstMove = true;
    twoPlayerMode = true;
    p1Turn = true;
    p1Score = 0;
    p2Score = 0;
    p2ScoreHolder.textContent = 0;
    p1ScoreHolder.textContent = 0;
    unlockAll();
    clearTiles();
    changeScreen([winText, mainMode, playAgain, drawText, p1TurnCard, p2TurnCard], [selectMode]);
    
}

function handlePlayAgain() {
    gameOver = false;
    firstMove = true;
    
    if(twoPlayerMode) {
        p1Turn = true;
        changeScreen([], [p1TurnCard]);
        
    }

    
    unlockAll();
    clearTiles();
    changeScreen([winText, playAgain, drawText], []);
    
    if(!twoPlayerMode) {
        runOnePlayer();

    } 

}


function handleSelectBox () {
    if (twoPlayerMode) {
        if (p1Turn) {
            print(p1Team, this, p1Color);
            checkForWin();
            p1Turn = false;
            
        } else if(p1Turn === false) {
            print(p2Team, this, p2Color);
            checkForWin();
            p1Turn = true;
            
        }

    } else {
        if(gameOver) {
            return;

        }

        if(p1Turn) {
            print(p1Team, this, p1Color);
            checkForWin();
            computersMove();
            p1Turn = false;

        } 
      
    }

}

function scenario (p1, p2, p3, type) {
    // x is number of matches
    var x = 0;

    if(tiles[p1].textContent === type) {
        x += 1;

    }  

    if(tiles[p2].textContent === type) {
        x += 1;

    }

    if(tiles[p3].textContent === type) {
        x += 1;

    }  

    var a = [x, p1, p2, p3];

    return a;

}
        


// check for win
function checkForWin () {
    var wins = [scenario(0,1,2,'X')[0], // x wins
                scenario(3,4,5,'X')[0],
                scenario(6,7,8,'X')[0],
                scenario(0,3,6,'X')[0],
                scenario(1,4,7,'X')[0],
                scenario(2,5,8,'X')[0],
                scenario(0,4,8,'X')[0],
                scenario(2,4,6,'X')[0], 
                scenario(0,1,2,'O')[0], // o wins
                scenario(3,4,5,'O')[0],
                scenario(6,7,8,'O')[0],
                scenario(0,3,6,'O')[0],
                scenario(1,4,7,'O')[0],
                scenario(2,5,8,'O')[0],
                scenario(0,4,8,'O')[0],
                scenario(2,4,6,'O')[0]]; 

    // draw message

    var draw = true;
    var win = (function() {
        for(var i = 0; i < wins.length; i++) {
            if(wins[i] === 3 && i <= 7) {
                return [true, 'X'];
                
            
            } else if (wins[i] === 3 && i >= 8) {
                return [true, 'O'];
            
            }

        }
        return false;
    }());

    for (var i = 0; i < tiles.length; i++) {
        var spotTaken = tiles[i].textContent === 'O' || tiles[i].textContent === 'X';
        
        if (!spotTaken) {
            draw = false;
    
        }        

    }


    if(win[0]) {
        if(twoPlayerMode) {
                displayWin(!p1Turn, p1Team +  "'s Win!");
                console.log('won 2p mode');
        
        } else {
            if(p1Team === win[1]) { // p1 won
                displayWin(p1Turn, 'You Won!');
        
            } else {
                displayWin(p1Turn, 'Computer Won!'); //computer won
            
            }

        }


    } else if (draw) {
        displayWin(false, 'Draw', true);

    }
    
}


function displayWin(turn, whatToSay, wasDraw) {
    var p1Won = p1Turn;
    var p2Won = !p1Turn;    
    
    gameOver = true;            
    winText.textContent = whatToSay;
        if(p1Won && whatToSay !== 'Draw') {
            console.log('p1 suposedly won');
            p1ScoreHolder.textContent = p1Score + 1;
            p1Score += 1;
            
        } else if(p2Won && whatToSay !== 'Draw') {
            p2ScoreHolder.textContent = p2Score + 1;
            p2Score += 1;
            console.log('p2 suposedly won');
            
        } else if(wasDraw) {
            changeScreen([p1TurnCard, p2TurnCard], [drawText, playAgain]);
            lockAll();
            return;

        }

    lockAll();
    changeScreen([p1TurnCard, p2TurnCard], [winText, playAgain]);
    
}

