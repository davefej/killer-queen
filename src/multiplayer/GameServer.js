import { Player } from '../models/Player.js'
import { LocalStorage } from '../multiplayer/LocalStorage.js'

export class GameServer {
   

    constructor() {
        this.server = new LocalStorage()
    }

    addPlayer(player) {
        const playerJson = player.json()
        this.server.addToCollection('players', playerJson)
    }

    getPlayers() {
        return this.server.getCollection('players') || []
    }

    getPlayerDynamics(playerId) {
        return this.server.getCollection(`action_${playerId}`)
    }

    saveAction(playerId, dynamics) {
        this.server.updateCollection(`action_${playerId}`, dynamics) 
    }
}