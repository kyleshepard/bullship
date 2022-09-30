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
        console.log("No shots remaining")
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
    else if (this.hitsRemaining > 0 && this.shotsRemaining < 1) alert(("You lose! :("))
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
const gameSettings = {size: 8, gameMode: 0};
gameInstance.newGame(gameSettings);

// TODO: fix reset function
reset.addEventListener("click", function(){
    gameInstance.newGame(gameSettings);
});

gameWindow.addEventListener("click", (e)=>{
    //make sure it is a tile and not the game board itself
    if(e.target !== e.currentTarget){
        //use "_self" instead of "this" so we dont grab the event handler object
        gameInstance.fireAt(e.target);
    }
});

/**
 * A position on the board.
 * @param {number} x position on the x-axis.
 * @param {number} y position on the y-axis.
 */
 function Coordinate(x, y) {
    /** Position on the x-axis. */
    this.x = x;
    /** Position on the y-axis. */
    this.y = y;
    /** Whether the position has been fired upon or not. */
    this.hit = false;
    /** The ship occupying this position. */
    this.ship = null;

    this.toString = () => {
        return `(${this.x}, ${this.y})`;
    }

    /**
     * Places a ship at this position if it's allowed.
     * @param {Ship} ship the ship to place in this position.
     * @returns whether the ship was allowed to be placed at this position or not.
     */
    this.occupy = (ship) => {
        // TODO: validate ship can be placed in this position and, if so, add the ship to this position.

        return false;
    }
}

/** Axis on the board. */
const direction = {
    /** X-axis. */
    X: true,
    /** Y-axis. */
    Y: false
}

/**
 * A target capable of occupying space and moving on the board.
 * @param {number} length number of spaces the ship occupies on the board.
 */
function Ship(length) {
    this.length = length;
    this.from = null;
    this.direction = null;
    this.anchorPoints = [];

    /**
     * Whether or not it's possible to place the ship at the given location in the given direction.
     * @param {Coordinate} coordinate position on the board that will be occupied by the ship.
     * @param {boolean} direction whether the ship will extend along the x-axis or the y-axis.
     * @returns whether the ship placement is possible or not.
     */
    this.canPlace = (coordinate, direction) => {
        // TODO: check to make sure coordinate is possible given anchor points.
        // TODO: check to make sure direction is possible given anchor points.
        // TODO: implement loop to check whether all coordinates ship will occupy have not yet been hit and are not already occupied by another ship.
        return false;
    }

    /**
     * Places the ship at the given location in the given direction unless it's not possible.
     * @param {Coordinate} coordinate position on the board that will be occupied by the ship.
     * @param {boolean} direction whether the ship will extend along the x-axis or the y-axis.
     * @returns whether the ship placement was successful or not.
     */
    this.place = (coordinate, direction) => {
        if (this.canPlace(coordinate, direction)) {
            this.from = coordinate;
            this.direction = direction;

            // TODO: implement loop that updates coordinates ship will occupy with reference to current ship.

            return true;
        }

        return false;
    }

    /**
     * Locks the ship to a specific position on the board so that it must always occupy that position.
     * @param {Coordinate} coordinate position to lock the ship to.
     * @returns whether the ship could be successfully anchored or not.
     */
    this.anchor = (coordinate) => {
        // TODO: add coordinate to anchor array. Validate that the array isn't already longer than the length and that the coordinate makes sense given the ship's current position.

        return false;
    }
}
