import { LocalStoreage } from "./LocalStorage.js";

export class ConnectionManager {

    constructor(){
        this.players = []
        this.persister = LocalStoreage
    }

    persistPlayer(player){
        const serializedPlayer = player.serialize()
        this.players.push(serializedPlayer)
        const players = this.getPlayers()
        players.push(serializedPlayer)
        this.storePlayers(players)
        this.me = player.id
    }

    getPlayers(){
        return this.persister.getCollection('players') || []
    }

    storePlayers(players) {
        this.persister.updateCollection('players', players)
    }

    newPlayers() {
        const allPlayers = this.getPlayers()
        const existingPlayerIds = this.players.map(player => player.id);
        const newPlayers = allPlayers
            .filter(playerData => !existingPlayerIds.includes(playerData.id))
            .map(playerData => {
            return {
                ...playerData,
                actionProvider: {
                    getNext: this.createActionProvider(playerData.id)
                }
            }
        })
        this.players.push(...newPlayers);
        return newPlayers;
    }

    createActionProvider(playerId) {
        return () => {
            return this.getDynamicsFromStorage(playerId)
        }
    }

    getDynamicsFromStorage(playerId) {
        return this.persister.getCollection(`action_${playerId}`)
    }

    storeAction(player) {
        this.saveActionToStorage(player.getId(), player.getDynamics())
    }

    saveActionToStorage(playerId, dynamics) {
        this.persister.updateCollection(`action_${playerId}`, dynamics) 
    }
}