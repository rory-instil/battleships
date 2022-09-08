import { Coordinate, GameGrid, Ship, ShipPlacement, XNumber, YLetter, XNumbers, YLetters, Orientations } from "./model"
import {validateFireSelection, validateShipPlacement} from "./rules"

interface GameGridCoordinate {
    x: XNumber,
    y: YLetter,
    hasBeenSelected: boolean,
}

type GameGridCoordinates = GameGridCoordinate[][]

export function CreateGameGrid(): GameGrid {
    return new GameGridImpl(undefined, undefined, undefined)
}

class GameGridImpl implements GameGrid {

    private gameGridCoordinates: GameGridCoordinates
    private ships: ShipPlacement[]

    constructor(gameGridCoordinates?: GameGridCoordinates, fireSelection?: Coordinate, ships?: ShipPlacement[]) {
        if (gameGridCoordinates) {
            this.gameGridCoordinates = this.updateGameGrid(gameGridCoordinates, fireSelection)
        } else {
            this.gameGridCoordinates = this.generateGameGrid((x, y) => false)
        }
        this.ships = ships ?? []
    }

    updateGameGrid(gameGridCoordinates: GameGridCoordinates, fireSelection?: Coordinate): GameGridCoordinate[][] {
        const isAlreadySelected = (x: XNumber, y: YLetter): boolean => {
            return gameGridCoordinates[y.index][x.index].hasBeenSelected
        }

        const isFireSelectionCoordinate = (x: XNumber, y: YLetter): boolean => {
            return !!fireSelection
                && fireSelection.x === x
                && fireSelection.y === y
        }

        return this.generateGameGrid((x: XNumber, y: YLetter): boolean => {
            return isAlreadySelected(x, y) || isFireSelectionCoordinate(x, y)
        })
    }

    generateGameGrid(isFireSelectionCoordinates: (x: XNumber, y: YLetter) => boolean) {
        const gameGridCoordinates = new Array<Array<GameGridCoordinate>>(10)

        YLetters.all().forEach((y, yIndex) => {
            const row = new Array<GameGridCoordinate>(10)
            XNumbers.all().forEach((x, xIndex) => {
                row[xIndex] = {
                    'x': x,
                    'y': y,
                    hasBeenSelected: isFireSelectionCoordinates(x, y)
                }
            })
            gameGridCoordinates[yIndex] = row
        })

        return gameGridCoordinates
    }

    hasBeenSelected(x: number, y: number): boolean {
        return this.gameGridCoordinates[y][x].hasBeenSelected
    }

    isShipSunk(ship: ShipPlacement): boolean {
        if (ship.orientation === Orientations.VERTICAL) {
            for (let y = ship.topLeftCoordinate.y.index; y < ship.shipClass.size; y++) {
                if (!this.hasBeenSelected(ship.topLeftCoordinate.x.index, y)) {
                    return false
                }
            }
            return true
        } else /* ship.orientation === Orientation.HORIZONTAL */ {
            for (let x = ship.topLeftCoordinate.x.index; x < ship.shipClass.size; x++) {
                if (!this.hasBeenSelected(x, ship.topLeftCoordinate.y.index)) {
                    return false
                }
            }
            return true
        }
    }

    shipDamage(ship: ShipPlacement): Coordinate[] {
        const damage = new Array<Coordinate>()
        if (ship.orientation === Orientations.VERTICAL) {
            for (let y = ship.topLeftCoordinate.y.index; y < ship.shipClass.size; y++) {
                if (this.hasBeenSelected(ship.topLeftCoordinate.x.index, y)) {
                    damage.push({
                        x: ship.topLeftCoordinate.x,
                        y: YLetters.getFromIndex(y)
                    })
                }
            }
        } else /* ship.orientation === Orientation.HORIZONTAL */ {
            for (let x = ship.topLeftCoordinate.x.index; x < ship.shipClass.size; x++) {
                if (this.hasBeenSelected(x, ship.topLeftCoordinate.y.index)) {
                    damage.push({
                        x: XNumbers.getFromIndex(x),
                        y: ship.topLeftCoordinate.y
                    })
                }
            }
        }

        return damage
    }

    placeShip(shipPlacement: ShipPlacement): GameGrid {
        validateShipPlacement(shipPlacement, this.ships)
        return new GameGridImpl(this.gameGridCoordinates, undefined, [...this.ships, shipPlacement])
    }

    getAllFireSelectionCoordinates(): Coordinate[] {
        return this.gameGridCoordinates
            .flatMap(gameGridCoordinate => gameGridCoordinate)
            .filter(gameGridCoordinate => gameGridCoordinate.hasBeenSelected)
            .map(gameGridCoordinate => {
                const coordinate: Coordinate = {
                    x: gameGridCoordinate.x,
                    y: gameGridCoordinate.y
                }
                return coordinate
            })
    }

    fire(fireSelection: Coordinate): GameGrid {
        validateFireSelection(fireSelection, this.getAllFireSelectionCoordinates())
        return new GameGridImpl(this.gameGridCoordinates, fireSelection, this.ships)
    }

    getAllShips(): Ship[] {
        return this.ships.map(ship => {
            return {
                shipClass: ship.shipClass,
                orientation: ship.orientation,
                isSunk: () => this.isShipSunk(ship),
                damage: () => this.shipDamage(ship),
                topLeftCoordinate: ship.topLeftCoordinate
            }
        })
    }

    isAllShipsSunk(): boolean {
        const allShips = this.getAllShips()
        for (const item of allShips) {
            if (!item.isSunk()) {
                return false
            }
        }
        return true
    }

}
