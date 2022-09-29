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