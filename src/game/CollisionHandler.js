
export function handlePlayerStarCollision(scene, players, stars) {
    
}

export function handlePlatformPlayersCollision(scene, playerGroup, platforms) {
    scene.physics.add.collider(playerGroup, platforms);
}

export function handlePlatformStarsCollision(scene, stars, platforms) {
    scene.physics.add.collider(stars, platforms);
}

export function handlePlayerStarsCollision(scene, stars, playerGroup) {
    scene.physics.add.overlap(playerGroup, stars, collectStar(scene, stars), null, this);
}

export function handlePlayersCollision(scene, playerGroup) {
    scene.physics.add.collider(playerGroup, playerGroup, playerCollision, null, this)
}

function playerCollision(playerSprite1, playerSprite2) {
        const player1 = playerSprite1.wrapper
        const player2 = playerSprite2.wrapper
        if(player1.getSprite().y < player2.getSprite().y) {
            player1.jumpedOnOther()
            player2.otherJumpedOnMe()
        } else if (player1.getSprite().y > player2.getSprite().y) {
            player1.otherJumpedOnMe()
            player2.jumpedOnOther()
        }
    }

function collectStar(scene, stars) {
    return function (playerSprite, starSprite) {
        playerSprite.wrapper.starCollected();
        starSprite.disableBody(true, true);
        if (stars.countActive(true) === 0)
        {
            resetStars(stars)
            releaseBomb(scene, playerSprite)
        }
    }
}

function resetStars(stars) {
    stars.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
    });
}

function releaseBomb(scene, player) {
    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    const bomb = scene.bombs.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
}

export function handleBombPlatformCollision(scene, bombs, platforms) {
    scene.physics.add.collider(bombs, platforms);
}

export function handleBombPlayerCollision(scene, bombs, playerGroup) {
    scene.physics.add.collider(playerGroup, bombs, hitBomb, null, scene);
}

function hitBomb(playerSprite, bomb) {
    playerSprite.wrapper.hitBomb()
    bomb.disableBody(true, true)
}


