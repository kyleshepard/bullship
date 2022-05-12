
var gameWindow = document.getElementById("gameWindow");
var reset = document.getElementById("reset");
var board;
var currentGameMode;

newGame(8, "classic");

function newGame(size, gameMode){
    
    if(size <= 0) return

    // clear board
    // reset gamewindow
    gameWindow.innerHTML = "";
    // reset ships and game progress

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

    if (gameMode != "bullship"){
        // TODO: place ships

    }

    currentGameMode = gameMode;
}

reset.addEventListener("click", function(){
    newGame(8, "classic")
})

gameWindow.addEventListener("click", function(e){
    //make sure it is a tile and not the game board itself
    if(e.target !== e.currentTarget){
        // alert("test!")
        var xPos = e.target.getAttribute("xPos");
        var yPos = e.target.getAttribute("yPos");

        if(currentGameMode == "bullship"){

        } else {
            e.target.style.background = "red";
        }

        // alert(xPos + ", " + yPos);
    }
});