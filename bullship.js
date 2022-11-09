//intitalize interactable elements
let gameWindow = document.getElementById("gameWindow");
let reset = document.getElementById("reset");

const gameInstance = {

  // game state variables
  size: null, // the integer side lengths of the board
  gameMode: null, // integer representing the game mode, either classic or bullship. might remove later if deciding to remove classic mode
  shotsRemaining: null, // once this reaches zero the player may no longer fire
  hitsRemaining: null, // onces this reaches zero the player wins. maybe replace with less lazy end condition, such as checking the status of each ship
  board: [], // 2D array of coordinate objects representing each tile on the board
  ships: [], // all our ships that we need to fit on the board
  hitShips: [], // indices of ships that have been hit, in the order they were hit
  availabilityMap: { // represents ranges of empty space for ships to populate
    vertical: [],
    horizontal: []
  },
  mapDeltas: [], // stack used to store the changes of the availibility map so we can backtrack to an earlier state without storing an entire copy in memory
  lastBestConfiguration: { //used to track where our last best ship layout is so we arent required to try layouts that we have already tried and know will not work
    score: null,
    shipsLayout: []
  },

  /**
   * @param {element} gameWindow - div element id where the game is drawn, default value = "gameWindow"
   * @param {int} size - (8 <= n <= 24) sets the n*n the board size
   * @param {int} gameMode (0 <= n <= 1) 0 = classic, 1 = bullship
   */
  newGame: function({size, gameMode}){

    //bound size between 8 and 24
    this.size = Math.min(Math.max(8, size), 24);

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
    let tileSize = 8000 / (11 * this.size + 1); // original equation: tileSize = (800 - ((size + 1) * gapSize)) / size;
    let gapSize = tileSize / 10;

    //create board object with the correct size
    this.board = Array.from(Array(this.size), () => Array(this.size).fill(0).map(() => new Tile(null)));

    // create the grid
    for (let rowVal = 0; rowVal < this.size; rowVal++) {
      //calculate y offset
      let dY = gapSize + rowVal * (tileSize + gapSize);

      for (let colVal = 0; colVal < this.size; colVal++) {
        //calculate x offset
        let dX = gapSize + colVal * (tileSize + gapSize);

        //add tile to DOM
        let tile = document.createElement("div");
        gameWindow.appendChild(tile);

        //initialize tile and place on game board
        tile.id = "tile-" + (rowVal * this.size + colVal);
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
    let tileType = this.board[xPos][yPos].type;
    tileType = (tileType == undefined) ? this.determineTileType(xPos, yPos) : tileType;

    switch (tileType){
        case 1: // you hit water! make tile white and mark as a miss
            tile.style.background = "white";
            this.board[xPos][yPos].type = 3;
            break;
        case 2: // you hit a ship! make tile red, mark as a hit, and decrease hits remaining
            tile.style.background = "red";
            this.board[xPos][yPos].type = 4;
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

  // should only be possible in bullship mode
  determineTileType: function(xPos, yPos){
    console.log(`determining tile type for tile (${xPos},${yPos})`);
    
    isHit = false; //obviously will not be hardcoded false forever, just for testing/integration purposes

    return (isHit) ? 2 : 1;
  },

  updateMap: function(){

  },

  undoUpdate: function(){

  }
};

const placeShipsOnBoard = (board, ships) => {
  return board;
}

const placeShipOnBoard = (board, ship) => {
  // TODO: calculate score of ship location to determine whether to place it here or not.
  // Score could be based on how tight the ship fits into the location. A tighter fit is better since it wastes less space for other ships. Tightness would need to depend on how many shots have been fired, otherwise the score will suck at first.

  if (ship.anchorPoints) {

  } else {

  }

  return board;
}

/**
 * Finds a location to place the ship.
 * @param {array} board the game board.
 * @param {Ship} ship the ship to place.
 * @returns the score the ship placement receives.
 */
const placeShip = (board, ship)  => {
  let score = 0;

  let x = y = 0;

  while (y < board.length - ship.length) {
    while (x < board[x].length - ship.length) {
      if (!board[x][y].hit) {
        let hit = false;
    
        for (let i = x + ship.length; x < i && !hit; i--) {
          hit = board[i][y].hit;
        }
    
        if (!hit) {
          // TODO: place ship.
          ship.place(board[x][y], direction.X);
    
          // TODO: calculate score.
        } else {
          // Continue searching from the next spot without a hit.
          x = i;
        }
      }

      x++;
    }

    x = 0;
    y++;
  }

  return score;
}

const fillContainer = (container, ships) => {
  
}

function Container(size) {
  this.size = size;
  this.ships = [];

  /**
   * Fills the container with as many of the provided ships as will fit in the order they are provided.
   * @param {Array.<Ship>} ships the ships to fill the container with.
   */
  this.fill = (ships) => {
    ships.forEach((ship, index) => {
      if (this.addShip(ship) && this.remainingSpace() > 0) {
        this.fill(ships.slice(index + 1));
      }
    });
  }

  /**
   * Adds the specified ship to the container if it's possible to do so.
   * @param {Ship} ship the ship to add to the container.
   * @returns whether the ship was added or not.
   */
  this.addShip = (ship) => {
    if (this.canAddShip(ship.length)) {
      this.ships.push(ship);

      return true;
    }

    return false;
  }

  /**
   * Determines whether a ship will fit in the container or not.
   * @param {number} length the length of the ship to add to the container.
   * @returns whether the ship can be added to the container or not.
   */
  this.canAddShip = (length) => {
    return length <= this.remainingSpace();
  }

  /**
   * Determines the amount of space remaining in the container.
   * @returns amount of space remaining in the container.
   */
  this.remainingSpace = () => {
    return this.size - this.ships.length;
  }
}

//start new game on classic mode 8*8
const gameSettings = {size: 8, gameMode: 1};
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
 function Tile(type) {
    this.ship = null; // the index of the ship that this tile contains, if any
    this.type = type; // whether this tile is a hit, miss, ship, water, or undefined. maybe make an enum?
    this.slot = { // where empty slots containing this tile exist in the availibility map, if anywhere
      vertical: [],
      horizontal: [2, 0]
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
