// Enemies our player must avoid
class Enemy {
    constructor(y,x = -100) {
        // Variables applied to each of our instances go here,
        // we've provided one for you to get started
        // The image/sprite for our enemies, this uses
        // a helper we've provided to easily load images
        this.row = [63,146,229];
        this.x = x;
        this.y = this.row[y];
        this.minSpeed = 70;
        this.speed = Math.floor(Math.random() * (350 - this.minSpeed ) + this.minSpeed);
        this.sprite = 'images/enemy-bug.png';
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
        this.x = this.x + dt * this.speed;
        if (this.x > 500) {
            this.reset();
        }
        this.checkCollisions();
    }

    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    speedUp() {
        if (this.minSpeed < 350) this.minSpeed += 20;
        this.reset();
    }

    //pokud dojde brouk na konec plochy tak se vrati zpet na zacatek do nahodneho radku s nahodnou rychlosti
    reset() {
        this.x = -100;
        this.y = this.row[Math.floor(Math.random() * 3 )];  //global variables
        this.speed = Math.floor(Math.random() * (350 - this.minSpeed ) + this.minSpeed);
    }

    //x brouka je jeho zadek proto je potreba souradnici posunout, pokud by to bylo o sirku pole(101), tak by ke kolizi doslo
    //na rozhrani pole, proto je posunut o 71 aby doslo ke kolizi az bude brouk vice najetej v poli s panackem
    checkCollisions() {
        if ((this.y === player.y) && ((this.x + 71) > player.x) && (this.x < (player.x + 71)) ) {
            player.reset();
            for (const enemy of allEnemies) {
                enemy.minSpeed = 70;
                enemy.reset();
            }
        }
    }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player {
    constructor() {
        this.x = 202;
        this.y = 395;
        this.sprite = 'images/char-boy.png';
        this.score = 0;
    }

    update() {
        if (this.y === -20 ) {
            this.scores();
            this.x = 202;
            this.y = 395;
        }
        scoreDiv.textContent = `Score: ${this.score}`;
    }

    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    handleInput(way) {
        switch (way) {
            case 'up':
            if (this.y > 0) this.y -=  83;
                break;
            case 'down':
                if (this.y < 395) this.y +=  83;
                break;
            case 'left':
                if (this.x > 0) this.x -=  101;
                break;
            case 'right':
                if (this.x < 404) this.x += 101;
                break;
        }
    }

    scores() {
        this.score++;
        for (const enemy of allEnemies) {
            enemy.speedUp();
            console.log(enemy.speed);

        }
    }

    reset() {
        this.x = 202;
        this.y = 395;
        player.score = 0;

    }
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

let allEnemies = [];

let player = new Player;

let enemy0 = new Enemy(0);
allEnemies.push(enemy0);
let enemy1 = new Enemy(1);
allEnemies.push(enemy1);
/*let enemy2 = new Enemy(2);
allEnemies.push(enemy2);
let enemy3 = new Enemy(0,-300);
allEnemies.push(enemy3);
let enemy4 = new Enemy(2,-300);
allEnemies.push(enemy4);*/

let scoreDiv;

document.addEventListener("DOMContentLoaded", function() {
    const can = document.querySelector('canvas');
    can.insertAdjacentHTML('beforebegin','<div id="score">Score: 0</div>');
    scoreDiv = document.querySelector('#score');
  });



