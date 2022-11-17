//set up game state so we can build and test the undo/redo stack by itself

//////////
//0 0 0(1)0 0 0 0
//0 0(1)0 0 0 0 0
//0 0/1\0 0 0 0 0
//0 0|1|0 0 0 0 0
//0 0\1/0 0 0 0 0
//0 0 0 0 0 0(1)0
//0 0(1)0 0 0 0 0
//0 0 0 0 0 0 0 0

gameInstance.placeOnMap(3, 0, 1, 0, 3)
gameInstance.placeOnMap(2, 1, 1, 0, 3)
gameInstance.placeOnMap(6, 5, 1, 0, 3)
gameInstance.placeOnMap(2, 6, 1, 0, 3)
gameInstance.placeOnMap(2, 2, 3, 0, 3)

console.log(gameInstance.board)

// gameInstance.availabilityMap = { // represents ranges of empty space for ships to populate
//     vertical: [

//     ],
//     horizontal: [

//     ]
// };

// gameInstance.mapDeltas = [
    
// ]