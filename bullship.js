
var gameWindow = document.getElementById("gameWindow");
var board;

newGame(8, 8);

function newGame(width, height, gameType){
    // clear board
    // reset gamewindow
    gameWindow.innerHTML = "";
    // reset ships and game progress

    if(width > 0 && height > 0){
        // TODO: place ships along the grid, or don't if doing impossible mode

        // create the gui
        for(var row = 0; row < height; row++){
            for(var col = 0; col < width; col++){

            }
        }
    }
}