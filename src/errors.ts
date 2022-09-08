export class DuplicatePlacementError extends Error {
    constructor() {
        super('Duplicate placement detected!')

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, DuplicatePlacementError.prototype)
    }
}

export class DuplicateFireSelectionError extends Error {
    constructor() {
        super('Duplicate fire selection detected!')

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, DuplicateFireSelectionError.prototype)
    }
}

export class ShipOverlapError extends Error {
    constructor() {
        super('Overlap ship placement detected!')

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ShipOverlapError.prototype)
    }
}

export class ShipPlacementOutOfGridError extends Error {
    constructor() {
        super('Ship placement outside Grid detected!')

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ShipPlacementOutOfGridError.prototype)
    }
}
