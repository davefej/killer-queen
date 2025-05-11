export class RemoteController {
    constructor(actionProvider) {
        this.actionProvider = actionProvider
    }

    setPlayer(player) {
        this.player = player
    }

    refresh() {
        const dynamics = this.actionProvider.getNext()
        this.player.setPosition(dynamics.x, dynamics.y)
        const action = dynamics.action
        if (action == 'left')
        {
            this.player.moveLeft()
        }
        else if (action == 'right')
        {
            this.player.moveRight()
        }
        else if(action == 'turn')
        {
            this.player.turn()
        }
        if (action == 'jump')
        {
            this.player.jump()
        }
    }

    needToStoreActions() {
        return false
    }
}