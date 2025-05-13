import { GameState } from "../game/GameState.js";
import { GameServer } from "./GameServer.js";
import { Player } from "../models/Player.js";
import { RemoteController } from "../controllers/RemoteController.js";

export class ConnectionManager {

    constructor(){
        this.gameState = GameState.getInstance()
        this.gameServer = new GameServer()
    }

    addPlayer(player){
        this.gameState.addPlayer(player)
        if(player.isLocal()){
            this.gameServer.addPlayer(player)
        }
    }

    checkAndAddRemotePlayers(spriteGroup) {
        const playersInLocalState = this.gameState.getPlayers()
        const playersInServer = this.gameServer.getPlayers()

        playersInServer.forEach(playerJson => {
            const existingPlayer = playersInLocalState.find(player => player.id === playerJson.id)
            if (!existingPlayer) {
                const player = new Player(spriteGroup, playerJson.id, new RemoteController({
                    getNext: this.createActionProvider(playerJson.id)
                }))
                this.gameState.addPlayer(player)
            }
        })
    }

    createActionProvider(playerId) {
        return () => {
            return this.gameServer.getPlayerDynamics(playerId)
        }
    }

    update() {
        for(const player of this.gameState.getPlayers()) {
            player.refresh()
            if(player.isLocal()) {
                this.gameServer.saveAction(player.getId(), player.getDynamics())
            }
        }
    }

    playerWithHighestScore() { 
        return this.gameState.players.reduce((highest, current) => {
            return current.getScore() > highest.getScore() ? current : highest;
        });
    }
}