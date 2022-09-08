export type ShipClass = {
    name: string,
    size: number
};

export const ShipClasses = {
    CARRIER: {
        name: 'carrier',
        size: 5
    } as ShipClass,
    BATTLESHIP: {
        name: 'battleship',
        size: 4
    } as ShipClass,
    DESTROYER: {
        name: 'destroyer',
        size: 3
    } as ShipClass,
    SUBMARINE: {
        name: 'submarine',
        size: 3
    } as ShipClass,
    PATROL_BOAT: {
        name: 'patrol boat',
        size: 2
    } as ShipClass,
    all: () => [
        ShipClasses.CARRIER,
        ShipClasses.BATTLESHIP,
        ShipClasses.DESTROYER,
        ShipClasses.SUBMARINE,
        ShipClasses.PATROL_BOAT,
    ],
}

export type Orientation = 'horizontal' | 'vertical';

export const Orientations = {
    HORIZONTAL: 'horizontal' as Orientation,
    VERTICAL: 'vertical' as Orientation,
    all: () => [
        Orientations.HORIZONTAL,
        Orientations.VERTICAL
    ],
};

export interface YLetter {
    name: string,
    index: number
}

export const YLetters = {
    A: {
        name: 'a',
        index: 0
    },
    B: {
        name: 'b',
        index: 1
    },
    C: {
        name: 'c',
        index: 2
    },
    D: {
        name: 'd',
        index: 3
    },
    E: {
        name: 'e',
        index: 4
    },
    F: {
        name: 'f',
        index: 5
    },
    G: {
        name: 'g',
        index: 6
    },
    H: {
        name: 'h',
        index: 7
    },
    I: {
        name: 'i',
        index: 8
    },
    J: {
        name: 'j',
        index: 9
    },
    all: () => [
        YLetters.A,
        YLetters.B,
        YLetters.C,
        YLetters.D,
        YLetters.E,
        YLetters.F,
        YLetters.G,
        YLetters.H,
        YLetters.I,
        YLetters.J,
    ],
    size: 10,
    getFromIndex: (index: number): YLetter => {
        function instanceOfYLetter(object: any): object is YLetter {
            return 'index' in object;
        }
        for (const value of Object.values(YLetters)) {
            if (instanceOfYLetter(value) && value.index === index) {
                return value;
            }
        }
        throw new Error(`Failed to find Letter for index ${index}`)
    }
}

export interface XNumber {
    name: string,
    index: number
}

export const XNumbers = {
    ONE: {
        name: 'one',
        index: 0
    },
    TWO: {
        name: 'two',
        index: 1
    },
    THREE: {
        name: 'three',
        index: 2
    },
    FOUR: {
        name: 'four',
        index: 3
    },
    FIVE: {
        name: 'five',
        index: 4
    },
    SIX: {
        name: 'six',
        index: 5
    },
    SEVEN: {
        name: 'seven',
        index: 6
    },
    EIGHT: {
        name: 'eight',
        index: 7
    },
    NINE: {
        name: 'nine',
        index: 8
    },
    TEN: {
        name: 'ten',
        index: 9
    },
    all: () => [
        XNumbers.ONE,
        XNumbers.TWO,
        XNumbers.THREE,
        XNumbers.FOUR,
        XNumbers.FIVE,
        XNumbers.SIX,
        XNumbers.SEVEN,
        XNumbers.EIGHT,
        XNumbers.NINE,
        XNumbers.TEN,
    ],
    getFromIndex: (index: number): YLetter => {
        function instanceOfXNumber(object: any): object is XNumber {
            return 'index' in object;
        }
        for (const value of Object.values(XNumbers)) {
            if (instanceOfXNumber(value) && value.index === index) {
                return value;
            }
        }
        throw new Error(`Failed to find Number for index ${index}`)
    },
    size: 10,
}

export type Coordinate = { x: XNumber, y: YLetter };

export interface Ship {
    shipClass: ShipClass,
    orientation: Orientation
    isSunk: () => boolean,
    damage: () => Coordinate[],
}

export interface ShipPlacement {
    shipClass: ShipClass,
    orientation: Orientation,
    topLeftCoordinate: Coordinate
}

export interface GameGrid {
    placeShip: (shipPlacement: ShipPlacement) => GameGrid,
    fire: (fireSelection: Coordinate) => GameGrid,
    getAllShips: () => Ship[]
    isAllShipsSunk: () => boolean
}

export interface FireSelection {
    x: XNumber,
    y: YLetter,
    hit: boolean
}

export interface EnemyGameGrid {
    fire: (fireSelection: Coordinate) => EnemyGameGrid,
    getFireSelections: () => FireSelection[]
    getSunkShips: () => Ship[]
}
