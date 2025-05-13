import {Player} from '../models/Player.js'
import {
    handlePlatformPlayersCollision,
    handlePlatformStarsCollision,
    handlePlayerStarsCollision,
    handleBombPlatformCollision,
    handleBombPlayerCollision,
    handlePlayersCollision
} from '../game/CollisionHandler.js'
import { ConnectionManager } from '../multiplayer/ConnectionManager.js';
import { KeyBoardController } from '../controllers/KeyBoardController.js'

export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
        this.ConnectionManager = new ConnectionManager()
    }

    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('dude', 
            'assets/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
        this.load.audio('bgMusic', 'assets/audio/killerqueen.mp3');
    }

    create() {
        
        this.add.image(400, 300, 'sky');

        this.platforms = this.createPlatforms()
        
        const cursors = this.input.keyboard.createCursorKeys();
        
        this.playerGroup = this.physics.add.group();

        const me = new Player(this.playerGroup, undefined , new KeyBoardController({
            up: cursors.up,
            down: cursors.down,
            right:cursors.right,
            left: cursors.left
        }))
        this.ConnectionManager.addPlayer(me)
        this.createPlayerScoreTexts([me])

        handlePlatformPlayersCollision(this, this.playerGroup, this.platforms)
        handlePlayersCollision(this, this.playerGroup)
        this.stars = this.createStarts()
        handlePlatformStarsCollision(this, this.stars, this.platforms)
        handlePlayerStarsCollision(this, this.stars, this.playerGroup)

        this.bombs = this.physics.add.group();
        handleBombPlatformCollision(this, this.bombs, this.platforms)
        handleBombPlayerCollision(this, this.bombs, this.playerGroup)

        this.timeText = this.add.text(516, 16, ``, { fontSize: '32px', fill: '#000' });
        this.timeLeft = 60;
        this.refreshTimer()
        this.gameTimer()

        this.backgroundMusic = this.sound.add('bgMusic', { loop: true, volume: 0.3 });
        this.backgroundMusic.play({seek: 7});
        /*
        this.players.push(new Player(this.playerGroup, undefined, new KeyBoardController({
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        })))
        */
    }

    gameTimer() {
        const scene = this;
        this.timerIntervalId = setInterval(() => {
            if(scene.timeLeft == 0) {
                scene.timesUp()
                return
            }
            scene.timeLeft--
            scene.refreshTimer()
        }, 1000)
    }

    timesUp(){
        clearInterval(this.timerIntervalId)
        this.physics.pause();
        const playerWithHighestScore = this.ConnectionManager.playerWithHighestScore()
        this.timeText.setText(`${playerWithHighestScore.getName()} win`)
    }

    refreshTimer(){
        this.timeText.setText(this.timeLeft)
    }

    createPlatforms(){
        const platforms = this.physics.add.staticGroup();

        platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');
        return platforms
    }

    createStarts() {
        const stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
        return stars
    }

    createPlayerScoreTexts(players) {
        let i = 1
        for(const player of players) {
            const scoreText = this.add.text(16, 32*(i-1)+16, ``, { fontSize: '32px', fill: '#000' });
            player.setScoreListener((text) => {
                scoreText.setText(text)
            })
            i++
        }
    }

    update() {
        this.ConnectionManager.update()
        this.ConnectionManager.checkAndAddRemotePlayers(this.playerGroup)
    }
    
}