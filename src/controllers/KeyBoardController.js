export class KeyBoardController {
    
    constructor( controlKeys) {
        this.controlKeys = controlKeys;
    }
    
    setPlayer(player) {
        this.player = player
    }

    refresh() {
        if (this.controlKeys.left.isDown)
        {
            this.lastAction = 'left'
            this.player.moveLeft()
        }
        else if (this.controlKeys.right.isDown)
        {
            this.lastAction = 'right'
            this.player.moveRight()
        }
        else
        {
            this.lastAction = 'turn'
            this.player.turn()
        }
        if (this.controlKeys.up.isDown && this.player.isOnGround())
        {
            this.lastAction = 'jump'
            this.player.jump()
        }
    }

    getLastAction() {
        return this.lastAction
    }

    needToStoreActions() {
        return true
    }
}