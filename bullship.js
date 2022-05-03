
var gameWindow = document.getElementById("gameWindow");
var board;

newGame(8, "standard");

function newGame(size, gameType){
    // clear board
    // reset gamewindow
    gameWindow.innerHTML = "";
    // reset ships and game progress

    if(size > 0){

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
                tile.style.top = Math.round(dY) + "px";
                tile.style.left = Math.round(dX) + "px";
                tile.style.width = Math.round(tileSize) + "px";
            }
        }
    }

    if (gameType != "bullship"){
        // TO DO: place ships
    }
}