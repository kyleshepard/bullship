//intitalize interactable elements
let gameWindow = document.getElementById("gameWindow");
let reset = document.getElementById("reset");

const gameInstance = {

  /**
   * @param {element} gameWindow - div element id where the game is drawn, default value = "gameWindow"
   * @param {int} size - (8 <= n <= 24) sets the n*n the board size
   * @param {int} gameMode (0 <= n <= 1) 0 = classic, 1 = bullship
   */
  newGame: function({size, gameMode}){

    //bound size between 8 and 24
    size = Math.min(Math.max(8, size), 24);

    //default to classic if gamemode is invalid
    this.gameMode = gameMode < 0 || gameMode > 1 ? 0 : gameMode;

    // reset gamewindow
    gameWindow.innerHTML = "";

    // reset ships and game progress
    this.board = [];
    this.shotsRemaining = 24; //hardcoded until basic game logic finished
    this.hitsRemaining = 9; // ^ ditto ^

    // calculate tile and gap size
    // hardcoded gap size does not scale well, use algebra to get this equation, where gap to tile width ratio is 1:10
    let tileSize = 8000 / (11 * size + 1); // original equation: tileSize = (800 - ((size + 1) * gapSize)) / size;
    let gapSize = tileSize / 10;

    // create the grid
    for (let rowVal = 0; rowVal < size; rowVal++) {
      //calculate y offset
      let dY = gapSize + rowVal * (tileSize + gapSize);

      for (let colVal = 0; colVal < size; colVal++) {
        //calculate x offset
        let dX = gapSize + colVal * (tileSize + gapSize);

        //add tile to DOM
        let tile = document.createElement("div");
        gameWindow.appendChild(tile);

        //initialize tile and place on game board
        tile.id = "tile-" + (rowVal * size + colVal);
        tile.className = "tile";
        tile.setAttribute("yPos", rowVal);
        tile.setAttribute("xPos", colVal);
        tile.style.top = Math.round(dY) + "px";
        tile.style.left = Math.round(dX) + "px";
        tile.style.width = Math.round(tileSize) + "px";
      }
    }

    if (this.gameMode == 0) {
      //if classic mode
      // TODO: place ships programmatically

      //right now, we are hardcoding 3 ships of sizes 2, 3, and 4 like the Windwaker battleship minigame
      // 0 = undetermined, 1 = water, 2 = ship, 3 = miss, 4 = hit
      this.board = [
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 2, 2, 2, 2, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 2, 1, 1, 1, 1, 1, 1],
        [1, 2, 1, 1, 1, 2, 1, 1],
        [1, 1, 1, 1, 1, 2, 1, 1],
        [1, 1, 1, 1, 1, 2, 1, 1],
      ];
    } else {
      // create an n*n 2d array of undetermined tiles (value 0)
      this.board = Array.from(Array(size), () => Array(size).fill(0));
    }
  },

  fireAt: function(tile){

    if(this.shotsRemaining < 1){
        if(this.hitsRemaining > 0) alert("You lose! :(");

        return;
    }

    // get x and y positions from custom html attributes
    let xPos = tile.getAttribute("xPos");
    let yPos = tile.getAttribute("yPos");

    // get tile type (i.e. undetermined, water, ship, miss, or hit)
    // if undetermined (only possible in bullship mode), try to find a configuration that results in a miss
    let tileType = this.board[yPos][xPos];
    tileType = (tileType == 0) ? determineTileType(xPos, yPos) : tileType;

    switch (tileType){
        case 1: // you hit water! make tile white and mark as a miss
            tile.style.background = "white";
            this.board[yPos][xPos] = 3;
            break;
        case 2: // you hit a ship! make tile red, mark as a hit, and decrease hits remaining
            tile.style.background = "red";
            this.board[yPos][xPos] = 4;
            this.hitsRemaining--;
            break;
        default: // you shot a tile that you have already shot! just act like it didnt happen
            return;
    }

    this.shotsRemaining--;
    console.log(`${this.shotsRemaining} shots remaining, ${this.hitsRemaining} hits needed to win`);

    if(this.hitsRemaining == 0) alert("You win! :)");
  },

  determineHit: function(hitShips, unhitShips, availabilityMap, fireX, fireY){
    //
  },

  // should only be possible in bullship mode
  determineTileType: function(xPos, yPos){
    alert(`determining tile type for tile (${xPos},${yPos})`);
    
    isHit = determineHit(hitShips, unhitShips, availabilityMap, xPos, yPos);
    
    if (isHit){
        handleBullshipHit();
    }

    return (isHit) ? 2 : 1;
  }
};

//start new game on classic mode 8*8
let gameSettings = {size: 8, gameMode: 0};
gameInstance.newGame(gameSettings);

// TODO: fix reset function
reset.addEventListener("click", function(){
    gameInstance.newGame(gameSettings);
})

gameWindow.addEventListener("click", (e)=>{
    //make sure it is a tile and not the game board itself
    if(e.target !== e.currentTarget){
        //use "_self" instead of "this" so we dont grab the event handler object
        gameInstance.fireAt(e.target);
    }
});