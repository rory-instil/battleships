import _ from "lodash";
import {Coordinate, Orientations, ShipPlacement, XNumbers, YLetters} from "./model";
import {
    DuplicateFireSelectionError,
    DuplicatePlacementError,
    ShipOverlapError,
    ShipPlacementOutOfGridError
} from "./errors";

export function validateShipPlacement(ship: ShipPlacement, currentShips: ShipPlacement[]) {
    validateUniqueShipPlacement(ship, currentShips);
    validateShipPlacementIsInBoard(ship);
    validateShipDoesNotOverlap(ship, currentShips);
}

function validateUniqueShipPlacement(ship: ShipPlacement, currentShips: ShipPlacement[]) {
    if (currentShips.find(currentShip => _.isEqual(currentShip, ship))) {
        throw new DuplicatePlacementError();
    }
}

function validateShipPlacementIsInBoard(ship: ShipPlacement) {
    if (ship.orientation === Orientations.VERTICAL) {
        if (YLetters.all().length - ship.topLeftCoordinate.y.index < ship.shipClass.size) {
            throw new ShipPlacementOutOfGridError();
        }
    } else /* ship.orientation === Orientations.HORIZONTAL */ {
        if (XNumbers.all().length - ship.topLeftCoordinate.x.index < ship.shipClass.size) {
            throw new ShipPlacementOutOfGridError();
        }
    }
}

function validateShipDoesNotOverlap(newShip: ShipPlacement, currentShips: ShipPlacement[]) {
    const shipOverlaps = currentShips.find(currentShip => {
        if (currentShip.topLeftCoordinate === newShip.topLeftCoordinate) {
            return true;
        }

        if (newShip.orientation === Orientations.VERTICAL) {
            if (currentShip.orientation === Orientations.HORIZONTAL) {
                const leftOfNewShip = newShip.topLeftCoordinate.x.index;
                const rightOfNewShip = rightOfShip(newShip);

                return leftOfNewShip <= currentShip.topLeftCoordinate.x.index && rightOfNewShip >= currentShip.topLeftCoordinate.x.index;
            } else if (currentShip.topLeftCoordinate.x === newShip.topLeftCoordinate.x) {
                const topOfCurrentShip = currentShip.topLeftCoordinate.y.index;
                const bottomOfCurrentShip = bottomOfShip(currentShip)

                const topOfNewShip = newShip.topLeftCoordinate.y.index;
                const bottomOfNewShip = bottomOfShip(newShip)

                const overlapsOnTop = topOfCurrentShip <= bottomOfNewShip;
                const overlapsOnBottom = bottomOfCurrentShip >= topOfNewShip;

                return overlapsOnTop && overlapsOnBottom;
            }
        } else /* newShip.orientation === Orientations.HORIZONTAL */ {
            if (currentShip.orientation === Orientations.VERTICAL) {
                const leftOfNewShip = newShip.topLeftCoordinate.x.index;
                const rightOfNewShip = rightOfShip(newShip);
                return leftOfNewShip <= currentShip.topLeftCoordinate.x.index && rightOfNewShip >= currentShip.topLeftCoordinate.x.index;
            } else if (currentShip.topLeftCoordinate.y === newShip.topLeftCoordinate.y) {
                const leftOfCurrentShip = currentShip.topLeftCoordinate.x.index;
                const rightOfCurrentShip = rightOfShip(currentShip);

                const leftOfNewShip = newShip.topLeftCoordinate.x.index;
                const rightOfNewShip = rightOfShip(newShip);

                const overlapsOnLeft = leftOfCurrentShip <= rightOfNewShip;
                const overlapsOnRight = rightOfCurrentShip >= leftOfNewShip;

                return overlapsOnLeft && overlapsOnRight;
            }
        }
    })

    if (shipOverlaps) {
        throw new ShipOverlapError();
    }
}

function rightOfShip(ship: ShipPlacement) {
    return ship.topLeftCoordinate.x.index + ship.shipClass.size - 1;
}

function bottomOfShip(ship: ShipPlacement) {
    return ship.topLeftCoordinate.y.index + ship.shipClass.size - 1;
}

export function validateFireSelection(fireSelection: Coordinate, currentFireSelections: Coordinate[]) {
    if (currentFireSelections.find(currentFireSelection => _.isEqual(currentFireSelection, fireSelection))) {
        throw new DuplicateFireSelectionError();
    }
}