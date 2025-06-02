export class Player {
    
    constructor(group, id, controller) {
        this.group = group
        this.scene = group.scene;
        this.controller = controller
        this.init()
        this.score = 0
        this.id = id || crypto.randomUUID().substring(0, 4)
        this.name = this.id
    }

    init(){
        const initPos = this.initialXPosition()
        const player = this.scene.playerGroup.create(initPos.x, initPos.y, 'dude');
        player.setBounce(0.2)
        player.setCollideWorldBounds(true)
        this.initAnimations()
        this.sprite = player
        player.wrapper = this
        this.controller.setPlayer(this)
    }

    initialXPosition() {
        return {
            x: this.randomIntFromInterval(5,45)*10,
            y: 450
        }
    }

    initAnimations() {
        const anims = this.scene.anims
        anims.create({
            key: 'left',
            frames: anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        })

        anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        anims.create({
            key: 'right',
            frames: anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
    }

    moveRight() {
        this.sprite.setVelocityX(160);
        this.sprite.anims.play('right', true);
    }

    moveLeft() {
        this.sprite.setVelocityX(-160);
        this.sprite.anims.play('left', true);
    }

    turn() {
        this.sprite.setVelocityX(0);
        this.sprite.anims.play('turn');
    }

    isOnGround() {
        return this.sprite.body.touching.down
    }

    jump() {
        this.sprite.setVelocityY(-330);
    }

    getSprite() {
        return this.sprite
    }

    getId() {
        return this.id
    }

    starCollected() {
        this.updateScore(10)
    }

    updateScore(num) {
        this.score += num;
        if(this.scoreListener){
            this.scoreListener(this.getScoreText())
        }
    }

    getScoreText() {
        return `${this.name} score: ${this.score}`
    }

    hitBomb() {
        this.getSprite().setTint(0xff0000);
        this.getSprite().anims.play('turn');
        this.delayClearTint()
    }

    refresh() {
        this.controller.refresh()
    }

    setScoreListener(callback) {
        this.scoreListener = callback
        callback(this.getScoreText())
    }

    randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    jumpedOnOther(){
        this.updateScore(10)
        this.getSprite().setTint("0x00ff00")
        this.delayClearTint()
    }

    otherJumpedOnMe(){
        this.updateScore(-10)
        this.getSprite().setTint("0x770000")
        this.delayClearTint()
        this.reSpawn()
    }

    delayClearTint(){
        const sprite = this.getSprite()
        setTimeout(() => {
            sprite.clearTint();
        }, 1000)
    }

    reSpawn() {
        const sprite = this.getSprite()
        const initPos = this.initialXPosition()
        sprite.disableBody(true, true)
        setTimeout(() => {
            sprite.enableBody(true, initPos.x, initPos.y, true, true);
        }, 2000)
    }

    getName() {
        return this.name
    }

    getScore() {
        return this.score
    }

    json() {
        return {
            id: this.id,
            name: this.name
        }
    }

    isLocal()  {
        return this.controller.needToStoreActions()
    }

    isRemote() {
        return !this.isLocal()
    }

    getLastAction() {
        return this.controller.getLastAction()
    }

    getDynamics() {
        return {
            x: this.sprite.x,
            y: this.sprite.y,
            action: this.getLastAction()
        }
    }

    setPosition(x, y) { 
        this.sprite.setPosition(x, y)
    }

}