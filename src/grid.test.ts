import { ShipClasses, ShipClass, Orientations, Orientation, XNumbers, XNumber, YLetters, YLetter, Coordinate, GameGrid, EnemyGameGrid, Ship, FireSelection } from './model';
import {
    DuplicatePlacementError,
    DuplicateFireSelectionError,
    ShipOverlapError,
    ShipPlacementOutOfGridError
} from './errors';
import { CreateGameGrid } from './gamegrid';

describe('Game Grid', () => {
    describe('Can place ship', () => {
        const shipClasses = () => ShipClasses.all().map(shipClass => [shipClass]);
        it.each(shipClasses())
        ('places %p in top left corner horizontal', (shipClass: ShipClass) => {
            expectShipClassInTopLeftCorner(createGameGrid(), shipClass, Orientations.HORIZONTAL);
        })

        it.each(shipClasses())
        ('places %p in top left corner vertical', (shipClass: ShipClass) => {
            expectShipClassInTopLeftCorner(createGameGrid(), shipClass, Orientations.VERTICAL);
        })

        it.each(shipClasses())
        ('places %p in top right corner horizontal', (shipClass: ShipClass) => {
            expect(() => expectShipClassInTopRightCorner(createGameGrid(), shipClass, Orientations.HORIZONTAL))
                .toThrowError(ShipPlacementOutOfGridError);
        })

        it.each(shipClasses())
        ('places %p in top right corner vertical', (shipClass: ShipClass) => {
            expectShipClassInTopRightCorner(createGameGrid(), shipClass, Orientations.VERTICAL);
        })

        it.each(shipClasses())
        ('places %p in bottom right corner horizontal', (shipClass: ShipClass) => {
            expect(() => expectShipClassInBottomRightCorner(createGameGrid(), shipClass, Orientations.HORIZONTAL))
                .toThrowError(ShipPlacementOutOfGridError);
        })

        it.each(shipClasses())
        ('places %p in bottom right corner vertical', (shipClass: ShipClass) => {
            expect(() => expectShipClassInBottomRightCorner(createGameGrid(), shipClass, Orientations.VERTICAL))
                .toThrowError(ShipPlacementOutOfGridError);
        })

        it.each(shipClasses())
        ('places %p in bottom left corner horizontal', (shipClass: ShipClass) => {
            expectShipClassInBottomLeftCorner(createGameGrid(), shipClass, Orientations.HORIZONTAL);
        })

        it.each(shipClasses())
        ('places %p in bottom left corner vertical', (shipClass: ShipClass) => {
            expect(() => expectShipClassInBottomLeftCorner(createGameGrid(), shipClass, Orientations.VERTICAL))
                .toThrowError(ShipPlacementOutOfGridError);
        })

        it.each(shipClasses())
        ('%p cannot be placed twice', (shipClass: ShipClass) => {
            expectDuplicatePlacementToThrowError(createGameGrid(), shipClass);
        })

        it.each(shipClasses())
        ('Vertical %p cannot be placed outside grid', (shipClass) => {
            expectVerticalShipPlacementOutsideBoardToFail(createGameGrid(), shipClass)
        })

        it.each(shipClasses())
        ('Horizontal %p cannot be placed outside grid', (shipClass) => {
            expectHorizontalShipPlacementOutsideBoardToFail(createGameGrid(), shipClass)
        })
    });

    describe('ships cannot overlap', () => {
        test('overlaps with same top left coordinate but different orientations', () => {
            expect(() => {
                let gameGrid = createGameGrid();
                gameGrid = gameGrid.placeShip({
                    shipClass: ShipClasses.SUBMARINE,
                    orientation: Orientations.HORIZONTAL,
                    topLeftCoordinate: topRow(XNumbers.ONE)
                })
                gameGrid.placeShip({
                    shipClass: ShipClasses.DESTROYER,
                    orientation: Orientations.VERTICAL,
                    topLeftCoordinate: topRow(XNumbers.ONE)
                })
            }).toThrowError(ShipOverlapError)
        })

        test('overlaps with same top left coordinate and both horizontal orientations', () => {
            expect(() => {
                createGameGrid()
                    .placeShip({
                        shipClass: ShipClasses.SUBMARINE,
                        orientation: Orientations.HORIZONTAL,
                        topLeftCoordinate: topRow(XNumbers.ONE)
                    })
                    .placeShip({
                        shipClass: ShipClasses.DESTROYER,
                        orientation: Orientations.HORIZONTAL,
                        topLeftCoordinate: topRow(XNumbers.ONE)
                    })
            }).toThrowError(ShipOverlapError)
        })

        test('overlaps with same top left coordinate and both vertical orientations', () => {
            expect(() => {
                createGameGrid()
                    .placeShip({
                        shipClass: ShipClasses.SUBMARINE,
                        orientation: Orientations.HORIZONTAL,
                        topLeftCoordinate: topRow(XNumbers.ONE)
                    })
                    .placeShip({
                        shipClass: ShipClasses.DESTROYER,
                        orientation: Orientations.HORIZONTAL,
                        topLeftCoordinate: topRow(XNumbers.ONE)
                    })
            }).toThrowError(ShipOverlapError)
        })

        test('overlaps with two vertical ships and new ship is overlapping bottom of current ship', () => {
            expect(() => {
                let gameGrid = createGameGrid();
                gameGrid = gameGrid.placeShip({
                    shipClass: ShipClasses.SUBMARINE,
                    orientation: Orientations.VERTICAL,
                    topLeftCoordinate: topRow(XNumbers.ONE)
                })
                gameGrid.placeShip({
                    shipClass: ShipClasses.DESTROYER,
                    orientation: Orientations.VERTICAL,
                    topLeftCoordinate: {
                        x: XNumbers.ONE,
                        y: YLetters.B
                    }
                })
            }).toThrowError(ShipOverlapError)
        })

        test('overlaps with two vertical ships and new ship is overlapping top of current ship', () => {
            expect(() => {
                let gameGrid = createGameGrid();
                gameGrid = gameGrid.placeShip({
                    shipClass: ShipClasses.SUBMARINE,
                    orientation: Orientations.VERTICAL,
                    topLeftCoordinate: {
                        x: XNumbers.ONE,
                        y: YLetters.B
                    }
                })
                gameGrid.placeShip({
                    shipClass: ShipClasses.DESTROYER,
                    orientation: Orientations.VERTICAL,
                    topLeftCoordinate: topRow(XNumbers.ONE)
                })
            }).toThrowError(ShipOverlapError)
        })

        test('overlaps with two horizontal ships and new ship is overlapping right of current ship', () => {
            expect(() => {
                let gameGrid = createGameGrid();
                gameGrid = gameGrid.placeShip({
                    shipClass: ShipClasses.SUBMARINE,
                    orientation: Orientations.HORIZONTAL,
                    topLeftCoordinate: topRow(XNumbers.ONE)
                })
                gameGrid.placeShip({
                    shipClass: ShipClasses.DESTROYER,
                    orientation: Orientations.HORIZONTAL,
                    topLeftCoordinate: topRow(XNumbers.TWO)
                })
            }).toThrowError(ShipOverlapError)
        })

        test('overlaps with two horizontal ships and new ship is overlapping left of current ship', () => {
            expect(() => {
                let gameGrid = createGameGrid();
                gameGrid = gameGrid.placeShip({
                    shipClass: ShipClasses.SUBMARINE,
                    orientation: Orientations.HORIZONTAL,
                    topLeftCoordinate: topRow(XNumbers.TWO)
                })
                gameGrid.placeShip({
                    shipClass: ShipClasses.DESTROYER,
                    orientation: Orientations.HORIZONTAL,
                    topLeftCoordinate: topRow(XNumbers.ONE)
                })
            }).toThrowError(ShipOverlapError)
        })

        test('overlaps with vertical current ship and horizontal new ship is overlapping', () => {
            expect(() => {
                let gameGrid = createGameGrid();
                gameGrid = gameGrid.placeShip({
                    shipClass: ShipClasses.SUBMARINE,
                    orientation: Orientations.VERTICAL,
                    topLeftCoordinate: topRow(XNumbers.ONE)
                })
                gameGrid.placeShip({
                    shipClass: ShipClasses.DESTROYER,
                    orientation: Orientations.HORIZONTAL,
                    topLeftCoordinate: {
                        x: XNumbers.ONE,
                        y: YLetters.B
                    }
                })
            }).toThrowError(ShipOverlapError)
        })

        test('should not overlap in horizontal orientation with current ship to the left', () => {
            let gameGrid = createGameGrid();
            gameGrid = gameGrid.placeShip({
                shipClass: ShipClasses.SUBMARINE,
                orientation: Orientations.HORIZONTAL,
                topLeftCoordinate: topRow(XNumbers.ONE)
            })
            gameGrid.placeShip({
                shipClass: ShipClasses.DESTROYER,
                orientation: Orientations.HORIZONTAL,
                topLeftCoordinate: topRow(XNumbers.FOUR)
            })
        })

        test('should not overlap in horizontal orientation with current ship to the right', () => {
            let gameGrid = createGameGrid();
            gameGrid = gameGrid.placeShip({
                shipClass: ShipClasses.SUBMARINE,
                orientation: Orientations.HORIZONTAL,
                topLeftCoordinate: topRow(XNumbers.FOUR)
            })
            gameGrid.placeShip({
                shipClass: ShipClasses.DESTROYER,
                orientation: Orientations.HORIZONTAL,
                topLeftCoordinate: topRow(XNumbers.ONE)
            })
        })

        test('should not overlap in vertical orientations with current ship above', () => {
            let gameGrid = createGameGrid();
            gameGrid = gameGrid.placeShip({
                shipClass: ShipClasses.SUBMARINE,
                orientation: Orientations.VERTICAL,
                topLeftCoordinate: {
                    x: XNumbers.ONE,
                    y: YLetters.A
                }
            })
            gameGrid.placeShip({
                shipClass: ShipClasses.DESTROYER,
                orientation: Orientations.VERTICAL,
                topLeftCoordinate: {
                    x: XNumbers.ONE,
                    y: YLetters.D
                }
            })
        })

        test('should not overlap in vertical orientations with current ship below', () => {
            let gameGrid = createGameGrid();
            gameGrid = gameGrid.placeShip({
                shipClass: ShipClasses.SUBMARINE,
                orientation: Orientations.VERTICAL,
                topLeftCoordinate: {
                    x: XNumbers.ONE,
                    y: YLetters.D
                }
            })
            gameGrid.placeShip({
                shipClass: ShipClasses.DESTROYER,
                orientation: Orientations.VERTICAL,
                topLeftCoordinate: {
                    x: XNumbers.ONE,
                    y: YLetters.A
                }
            })
        })
    })

    test('should hit a ship', () => {
        let gameGrid = createGameGridWithShipInTopLeftCorner(ShipClasses.PATROL_BOAT, Orientations.HORIZONTAL);
        gameGrid = fire(gameGrid, { x: XNumbers.ONE, y: YLetters.A });

        const ship = gameGrid.getAllShips()[0]

        expect(ship.damage()).toStrictEqual([{x: XNumbers.ONE, y: YLetters.A}]);
    })

    test('should sink a ship', () => {
        let gameGrid = createGameGridWithShipInTopLeftCorner(ShipClasses.PATROL_BOAT, Orientations.HORIZONTAL);

        gameGrid = sinkShip(gameGrid, ShipClasses.PATROL_BOAT, Orientations.HORIZONTAL, { x: XNumbers.ONE, y: YLetters.A });
        const ship = gameGrid.getAllShips()[0]

        expect(ship.damage().sort()).toStrictEqual([
            {x: XNumbers.ONE, y: YLetters.A},
            {x: XNumbers.TWO, y: YLetters.A}
        ].sort());
        expect(ship.isSunk()).toBe(true);
    })

    test('should miss the ship', () => {
        let gameGrid = createGameGridWithShipInTopLeftCorner(ShipClasses.PATROL_BOAT, Orientations.HORIZONTAL);

        const willMissPatrolBoatAtTopLeftHorizontal = (x: XNumber, y: YLetter) => {
            return y !== YLetters.A && (x !== XNumbers.ONE || x !== XNumbers.TWO);
        }
        XNumbers.all().forEach(x => {
            YLetters.all().forEach(y => {
                if (willMissPatrolBoatAtTopLeftHorizontal(x, y)) {
                    gameGrid = fire(gameGrid, { x, y})
                }
            })
        })

        const ship = gameGrid.getAllShips()[0]

        expect(ship.damage()).toStrictEqual([]);
        expect(gameGrid.isAllShipsSunk()).toBe(false);
    })

    test('should declare all ships sunk', () => {
        let gameGrid = createGameGridWithShipInTopLeftCorner(ShipClasses.PATROL_BOAT, Orientations.HORIZONTAL);

        gameGrid = sinkShip(gameGrid, ShipClasses.PATROL_BOAT, Orientations.HORIZONTAL, { x: XNumbers.ONE, y: YLetters.A });

        expect(gameGrid.isAllShipsSunk()).toBe(true);
    })

    test('should not allow duplicate fire selections', () => {
        let gameGrid = createGameGridWithShipInTopLeftCorner(ShipClasses.PATROL_BOAT, Orientations.HORIZONTAL);

        expect(() => {
            const fireSelection = { x: XNumbers.ONE, y: YLetters.A};
            gameGrid = fire(gameGrid, fireSelection);
            fire(gameGrid, fireSelection)
        }).toThrowError(DuplicateFireSelectionError);
    })
})

describe.skip('Enemy Grid', () => {

    test('should see miss on emeny grid', () => {
        let enemyGameGrid = createEnemyGameGridWithShipInTopLeftCorner(ShipClasses.PATROL_BOAT, Orientations.HORIZONTAL);

        enemyGameGrid = fireAtEnemy(enemyGameGrid, { x: XNumbers.TWO, y: YLetters.A });

        expect(enemyGameGrid.getFireSelections()).toBe([{ x: YLetters.B, y: YLetters.A, hit: false }]);
    })

    test('should see no sunk ships on enemy grid', () => {
        const enemyGameGrid = createEnemyGameGridWithShipInTopLeftCorner(ShipClasses.PATROL_BOAT, Orientations.HORIZONTAL);

        expect(enemyGameGrid.getSunkShips()).toBe([]);
    })

    test('should see hit on enemy grid', () => {
        let enemyGameGrid = createEnemyGameGridWithShipInTopLeftCorner(ShipClasses.PATROL_BOAT, Orientations.HORIZONTAL);

        enemyGameGrid = fireAtEnemy(enemyGameGrid, { x: XNumbers.ONE, y: YLetters.A });

        expect(enemyGameGrid.getFireSelections()).toBe([{ x: XNumbers.ONE, y: YLetters.A, hit: true }]);
    })

    test('should see sunk ship on enemy grid', () => {
        let enemyGameGrid = createEnemyGameGridWithShipInTopLeftCorner(ShipClasses.PATROL_BOAT, Orientations.HORIZONTAL);

        enemyGameGrid = sinkEnemyShip(enemyGameGrid, ShipClasses.PATROL_BOAT, Orientations.HORIZONTAL, { x: XNumbers.ONE, y: YLetters.A });

        expect(enemyGameGrid.getSunkShips()).toBe([{
            shipClass: ShipClasses.PATROL_BOAT,
            orientation: Orientations.HORIZONTAL,
            topLeftCorner: { x: XNumbers.ONE, y: YLetters.A }
        }]);
    })

    test('should see all ships sunk on enemy grid', () => {
        let enemyGameGrid = createEnemyGameGridWithShipInTopLeftCorner(ShipClasses.PATROL_BOAT, Orientations.HORIZONTAL);

        enemyGameGrid = sinkEnemyShip(enemyGameGrid, ShipClasses.PATROL_BOAT, Orientations.HORIZONTAL, { x: XNumbers.ONE, y: YLetters.A });

        expect(enemyGameGrid.getSunkShips()).toBe(true);
    })

    test('should not allow duplicate fire selections on enemy grid', () => {
        let enemyGameGrid = createEnemyGameGridWithShipInTopLeftCorner(ShipClasses.PATROL_BOAT, Orientations.HORIZONTAL);

        expect(() => {
            enemyGameGrid = fireAtEnemy(enemyGameGrid, { x: XNumbers.ONE, y: YLetters.A });
            fireAtEnemy(enemyGameGrid, { x: XNumbers.ONE, y: YLetters.A });
        }).toThrowError(DuplicateFireSelectionError)
    })
})

function sinkShip(gameGrid: GameGrid, shipClass: ShipClass, orientation: Orientation, topLeftCoordinate: Coordinate): GameGrid {
    if (orientation === Orientations.VERTICAL) {
        for (let y = 0; y < shipClass.size; y++) {
            gameGrid = fire(gameGrid, { x: topLeftCoordinate.x, y: YLetters.all()[y] })
        }
    } else /* orientation === Orientations.HORIZONTAL */ {
        for (let x = 0; x < shipClass.size; x++) {
            gameGrid = fire(gameGrid, { x: XNumbers.all()[x], y: topLeftCoordinate.y })
        }
    }

    return gameGrid;
}

function sinkEnemyShip(enemyGameGrid: EnemyGameGrid, shipClass: ShipClass, orientation: Orientation, topLeftCoordinate: Coordinate): EnemyGameGrid {
    if (orientation === Orientations.HORIZONTAL) {
        const allYLetters = YLetters.all();
        for (let i = 0; i < shipClass.size; i++) {
            enemyGameGrid = fireAtEnemy(enemyGameGrid, { x: topLeftCoordinate.x, y: allYLetters[i] })
        }
    } else {
        const allXNumbers = XNumbers.all();
        for (let i = 0; i < shipClass.size; i++) {
            enemyGameGrid = fireAtEnemy(enemyGameGrid, { x: allXNumbers[i], y: topLeftCoordinate.y })
        }
    }

    return enemyGameGrid;
}

function createGameGridWithShipInTopLeftCorner(shipClass: ShipClass, orientation: Orientation): GameGrid {
    return createGameGrid().placeShip({
        shipClass,
        orientation,
        topLeftCoordinate: {
            x: XNumbers.ONE,
            y: YLetters.A
        }
    })
}

function createGameGrid(): GameGrid {
    return CreateGameGrid();
}

function fire(gameGrid: GameGrid, fireSelection: Coordinate): GameGrid {
    return gameGrid.fire(fireSelection);
}

function createEnemyGameGridWithShipInTopLeftCorner(shipClass: ShipClass, orientation: Orientation): EnemyGameGrid {
    class MockEnemyGameGrid implements EnemyGameGrid {
        fire(fireSelection: Coordinate): EnemyGameGrid {
            return this;
        }
        getFireSelections(): FireSelection[] {
            return [];
        }
        getSunkShips(): Ship[] {
            return [];
        }
    }

    return new MockEnemyGameGrid();
}

function fireAtEnemy(enemyGameGrid: EnemyGameGrid, fireSelection: Coordinate): EnemyGameGrid {
    return enemyGameGrid;
}

function expectVerticalShipPlacementOutsideBoardToFail(gameGrid: GameGrid, shipClass: ShipClass) {
    for (let y = YLetters.size - shipClass.size + 1; y < YLetters.size; y++) {
        expect(() => gameGrid.placeShip({
            shipClass: shipClass,
            orientation: Orientations.VERTICAL,
            topLeftCoordinate: {
                x: XNumbers.ONE,
                y: YLetters.all()[y]
            }
        })).toThrowError(ShipPlacementOutOfGridError)
    }
}

function expectHorizontalShipPlacementOutsideBoardToFail(gameGrid: GameGrid, shipClass: ShipClass) {
    for (let x = XNumbers.size - shipClass.size + 1; x < XNumbers.size; x++) {
        expect(() => gameGrid.placeShip({
            shipClass: shipClass,
            orientation: Orientations.HORIZONTAL,
            topLeftCoordinate: {
                x: XNumbers.all()[x],
                y: YLetters.A
            }
        })).toThrowError(ShipPlacementOutOfGridError)
    }
}

function expectShipClassInTopLeftCorner(gameGrid: GameGrid, shipClass: ShipClass, orientation: Orientation) {
    gameGrid = placeInTopLeftCorner(gameGrid, shipClass, orientation);

    expect(JSON.stringify(gameGrid.getAllShips()[0])).toStrictEqual(JSON.stringify({
        shipClass: shipClass,
        orientation: orientation,
        topLeftCoordinate: topRow(XNumbers.ONE),
        damage: () => [],
        isSunk: () => false
    }));
}

function expectShipClassInTopRightCorner(gameGrid: GameGrid, shipClass: ShipClass, orientation: Orientation) {
    gameGrid = placeInTopRightCorner(gameGrid, shipClass, orientation);

    expect(JSON.stringify(gameGrid.getAllShips()[0])).toStrictEqual(JSON.stringify({
        shipClass: shipClass,
        orientation: orientation,
        topLeftCoordinate: topRow(XNumbers.TEN),
        damage: () => [],
        isSunk: () => false
    }));
}

function expectShipClassInBottomRightCorner(gameGrid: GameGrid, shipClass: ShipClass, orientation: Orientation) {
    gameGrid = placeInBottomRightCorner(gameGrid, shipClass, orientation);

    expect(JSON.stringify(gameGrid.getAllShips()[0])).toStrictEqual(JSON.stringify({
        shipClass: shipClass,
        orientation: orientation,
        topLeftCoordinate: bottomRow(XNumbers.TEN),
        damage: () => [],
        isSunk: () => false
    }));
}

function expectShipClassInBottomLeftCorner(gameGrid: GameGrid, shipClass: ShipClass, orientation: Orientation) {
    gameGrid = placeInBottomLeftCorner(gameGrid, shipClass, orientation);

    expect(JSON.stringify(gameGrid.getAllShips()[0])).toStrictEqual(JSON.stringify({
        shipClass: shipClass,
        orientation: orientation,
        topLeftCoordinate: bottomRow(XNumbers.ONE),
        damage: () => [],
        isSunk: () => false
    }));
}

function expectDuplicatePlacementToThrowError(gameGrid: GameGrid, shipClass: ShipClass) {
    expect(() => {
        gameGrid = placeInTopLeftCorner(gameGrid, shipClass, Orientations.VERTICAL);
        placeInTopLeftCorner(gameGrid, shipClass, Orientations.VERTICAL);
    }).toThrow(DuplicatePlacementError);
}

function expectOverlappingPlacementToThrowError(gameGrid: GameGrid) {
    expect(() => {
        gameGrid = placeInTopLeftCorner(gameGrid, ShipClasses.PATROL_BOAT, Orientations.VERTICAL);
        placeInTopLeftCorner(gameGrid, ShipClasses.SUBMARINE, Orientations.HORIZONTAL);
    }).toThrow(ShipOverlapError);
}

function placeInTopLeftCorner(gameGrid: GameGrid, shipClass: ShipClass, orientation: Orientation): GameGrid {
    return gameGrid.placeShip({
        shipClass: shipClass,
        orientation: orientation,
        topLeftCoordinate: topRow(XNumbers.ONE)
    });
}

function placeInTopRightCorner(gameGrid: GameGrid, shipClass: ShipClass, orientation: Orientation): GameGrid {
    return gameGrid.placeShip({
        shipClass: shipClass,
        orientation: orientation,
        topLeftCoordinate: topRow(XNumbers.TEN)
    });
}

function placeInBottomRightCorner(gameGrid: GameGrid, shipClass: ShipClass, orientation: Orientation): GameGrid {
    return gameGrid.placeShip({
        shipClass: shipClass,
        orientation: orientation,
        topLeftCoordinate: bottomRow(XNumbers.TEN)
    });
}

function placeInBottomLeftCorner(gameGrid: GameGrid, shipClass: ShipClass, orientation: Orientation): GameGrid {
    return gameGrid.placeShip({
        shipClass: shipClass,
        orientation: orientation,
        topLeftCoordinate: bottomRow(XNumbers.ONE)
    });
}

function topRow(x: XNumber): Coordinate {
    return { x, y: YLetters.A };
}

function bottomRow(x: XNumber): Coordinate {
    return { x, y: YLetters.J };
}
