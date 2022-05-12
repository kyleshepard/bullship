//html objects
var gameWindow = document.getElementById("gameWindow");
var reset = document.getElementById("reset");

//game state
var board;
var currentGameMode;
var shotsRemaining;
var hitsRemaining;

//start new game on classic mode 8*8
newGame(8, 0);

/**
 * 
 * @param {int} size - (8 <= n <= 24) sets the n*n the board size 
 * @param {int} gameMode (0 <= n <= 1) 0 = classic, 1 = bullship
 */
function newGame(size, gameMode){
    
    //bound size between 8 and 24
    size = Math.min(Math.max(8, size), 24);

    //default to classic if gamemode is invalid
    gameMode = (gameMode < 0 || gameMode > 1) ? 0 : gameMode;

    // reset gamewindow
    gameWindow.innerHTML = "";

    // reset ships and game progress
    board = [];
    shotsRemaining = 24; //hardcoded until basic game logic finished
    hitsRemaining = 9; // ^ ditto ^

    // calculate tile and gap size
    // hardcoded gap size does not scale well, use algebra to get this equation, where gap to tile width ratio is 1:10
    tileSize = 8000 / (11 * size + 1); // original equation: tileSize = (800 - ((size + 1) * gapSize)) / size;
    gapSize = tileSize / 10;
    
    // create the grid
    for(var rowVal = 0; rowVal < size; rowVal++){

        //calculate y offset
        dY = gapSize + (rowVal * (tileSize + gapSize));

        for(var colVal = 0; colVal < size; colVal++){

            //calculate x offset
            dX = gapSize + (colVal * (tileSize + gapSize));

            //add tile to DOM
            var tile = document.createElement("div");
            gameWindow.appendChild(tile);

            //initialize tile and place on game board
            tile.id = "tile-" + ((rowVal * size) + colVal);
            tile.className = "tile";
            tile.setAttribute("yPos", rowVal);
            tile.setAttribute("xPos", colVal);
            tile.style.top = Math.round(dY) + "px";
            tile.style.left = Math.round(dX) + "px";
            tile.style.width = Math.round(tileSize) + "px";
        }
    }

    if (gameMode == 0){ //if classic mode
        // TODO: place ships programmatically

        //right now, we are hardcoding 3 ships of sizes 2, 3, and 4 like the Windwaker battleship minigame
        // 0 = water, 1 = ship, 2 = miss, 3 = hit
        board = [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 1, 1, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0]
        ];
    }

    currentGameMode = gameMode ?? "classic";
}

reset.addEventListener("click", function(){
    newGame(8, 0)
})

gameWindow.addEventListener("click", function(e){
    //make sure it is a tile and not the game board itself
    if(e.target !== e.currentTarget){
        // alert("test!")
        var xPos = e.target.getAttribute("xPos");
        var yPos = e.target.getAttribute("yPos");

        if(currentGameMode == 1){
            alert("bullship mode not implemented yet!")
        } else {
            var tileHit = board[yPos][xPos];
            switch (tileHit){
                case 0:
                    e.target.style.background = "white";
                    board[yPos][xPos] = 2;
                    break;
                case 1:
                    e.target.style.background = "red";
                    board[yPos][xPos] = 3;
                    break;
                default:
                    alert("bruh")
            }
        }
    }
});