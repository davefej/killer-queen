import { Player } from '../models/Player.js'

export class GameState {

    static instance = null
    static getInstance() {
        if (!GameState.instance) {
            GameState.instance = new GameState()
        }
        return GameState.instance
    }
    
    constructor() {
        this.players = []
    }

    addPlayer(player) {
        if (this.players.some(p => p.id === player.id)) {
            throw new Error(`Player with id ${player.id} already exists`);
        }
        this.players.push(player)
    }

    createAndAddPlayer(id, controller) {
        const player = new Player(this.playerGroup, id, controller)
        this.addPlayer(player)
    }

    getPlayers() {
        return this.players
    }


}