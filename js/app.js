/**
* @description class of enemy - bug
* @param {number} x - horizontal coordinate
* @param {number} y - vertical coordinate
* @param {number} minSpeed - minimal speed of enemy
*/
class Enemy {
    constructor(y,x = -100,minSpeed = 80) {
        this.row = [63,146,229];        // rows coordinate
        this.x = x;
        this.y = this.row[y];           // set y to row
        this.minSpeed = minSpeed;
        this.maxSpeed = 440;            // maximal speed of enemy
        this.speed = Math.floor(Math.random() * (this.maxSpeed - this.minSpeed ) + this.minSpeed);  // random speed of enemy
        this.sprite = 'images/enemy-bug.png';       // enemy's picture - bug
    }

    /**
    * @description update the enemy's position
    * @param {number} dt - a time delta between ticks
    */
    update(dt) {
        this.x = this.x + dt * this.speed;
        if (this.x > 500) {      // when enemy position is on  edge od canvas, then position is reset
            this.reset();
        }
        this.checkCollisions();   // check enemy's collision with player
    }

    /**
    * @description draw the enemy on the screen
    */
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    /**
    * @description increase enemy's speed
    */
    speedUp() {
        if (this.minSpeed < this.maxSpeed) this.minSpeed += 40;
        this.reset();
    }

    /**
    * @description reset enemy's position and speed
    */
    reset() {
        this.x = Math.floor(Math.random() * (-360 - (this.minSpeed/2) + 100 ) - 100); // random x coordinate; for more sprawling move of enemies
        this.y = this.row[Math.floor(Math.random() * 3 )];      // random row
        this.speed = Math.floor(Math.random() * (this.maxSpeed - this.minSpeed ) + this.minSpeed);      // random speed of enemy
    }

    /**
    * @description check enemy's collision with player
    */
    checkCollisions() {
        if ((this.y === player.y) && ((this.x + 71) > player.x) && (this.x < (player.x + 71)) ) endGame();
    }
};

/**
* @description class of player
*/
class Player {
    constructor() {
        this.x = 202;       // start x coordinate
        this.y = 395;       // start y coordinate
        this.sprite = 'images/char-boy.png';        // player's picture - bug
        this.score = 0;     // player score
    }

    /**
    * @description update player's position
    */
    update() {
        if (this.y === -20 ) {      // checking whether the player is at the end of canvas
            this.scores();
            this.reset();
        }
        scoreDiv.textContent = `Score: ${this.score}`;      // display score
    }

    /**
    * @description draw the player on the screen
    */
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    /**
    * @description change player's coordinates, according to the keypressed
    */
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

    /**
    * @description increase player's score and eventually add enemy
    */
    scores() {
        this.score++;       // inc score
        for (const enemy of allEnemies) {       // increase speed of all enemies
            enemy.speedUp();
        }
        if (this.score === 2) {         // add enemy
            const enemy3 = new Enemy(0,-300,160);
            allEnemies.push(enemy3);
        }
        if (this.score === 5) {         // add enemy
            const enemy4 = new Enemy(1,-300,280);
            allEnemies.push(enemy4);
        }
        if (this.score === 9) {         // add enemy
            const enemy5 = new Enemy(0,-300,440);
            allEnemies.push(enemy5);
        }
        if (this.score === 14) {        // add enemy
            const enemy6 = new Enemy(0,-300,440);
            allEnemies.push(enemy6);
        }
    }

    /**
    * @description set starting coordinates
    */
    reset() {
        this.x = 202;
        this.y = 395;
    }
}

// This listens for key presses and sends the keys to your  Player.handleInput() method
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

/**
* @description show pop-up window with game's score
*/
function endGame() {
    allEnemies = [];        //clear enemies
    const score = player.score;
    if (player.score>0) {
        swal({			// popup windows with sweet alert 2
            title: 'GAME OVER!',
            html: `<p>Your score: ${player.score}</p> <p>Insert your name for addition to leaderboard:</p>`,
            input: 'text',
            type: 'error',
            confirmButtonText: 'Play again?',
            confirmButtonColor: 'green'
        }).then((result) => {
            if (result.value) {
                const name = result.value;			// when name is enter
                addResult({name,score});	        // save result to leaderboard - local storage
                resetGame();	    // create new game
            } else {
                resetGame();        // create new game
            }
        })
    } else {
        swal({			// popup windows with sweet alert and 0 score
            title: 'GAME OVER!',
            type: 'error',
            confirmButtonText: 'Play again?',
            confirmButtonColor: 'green'
        }).then((result) => {
            resetGame();            // create new game
        })
    }
}

/**
* @description reset game
*/
function resetGame() {
    leaderBoard();      // show leaderboard
    player.score = 0;   // set player's score
    player.reset();     // reset player's coordinate
    allEnemies = [enemy0,enemy1,enemy2];        //set 3 enemies
    for (const enemy of allEnemies) {       // set start minimal speed and reset position
        enemy.minSpeed = 70;
        enemy.reset();
    }

}

let allEnemies = [];        // array of all enemies

let player = new Player;

let enemy0 = new Enemy(0);
allEnemies.push(enemy0);
let enemy1 = new Enemy(1);
allEnemies.push(enemy1);
let enemy2 = new Enemy(2);
allEnemies.push(enemy2);

let scoreDiv, leaderBoardDiv;       // DOM target

document.addEventListener("DOMContentLoaded", function() {      // wait to load DOM
    const can = document.querySelector('canvas');
    can.insertAdjacentHTML('beforebegin','<div id="score" class="sec-title">Score: 0</div>');       // create score div
    can.insertAdjacentHTML('afterend','<div id="leaderboard"></div>');          // create leaderboard div
    scoreDiv = document.querySelector('#score');
    leaderBoardDiv = document.querySelector('#leaderboard');
    leaderBoard();      // show leaderboard
  });


//----------------------LEADERBOARD--------------------------------------------------------------------------

/**
* @description show leaderboard
*/
function leaderBoard() {
	leaderBoardDiv.innerHTML = '';			// delete leaderboard contain
	const data = localStorage.getItem('results');		// load data from local storage (from variable results)
	if (data) {
        leaderBoardDiv.classList.remove('hide');
        const results = JSON.parse(data);					// save object to variable results
        leaderBoardDiv.insertAdjacentHTML('afterbegin','<span class="sec-title">Leaderboard</span>');  // display leaderboard
        results.sort((a, b) => b.score - a.score);			// sort this array of objects according to moves
  		for (const res of results ) {			// display leaderboards results
            leaderBoardDiv.insertAdjacentHTML('beforeend','<div class="line"><span>' + res.name + '</span><span>score: ' + res.score + '</span></div>');
	  	}
	} else {
        leaderBoardDiv.classList.add('hide');
    }
}



//--------------------------STORAGE-----------------------------------------------------------------------
/**
* @description save data to local storage
* @param {object} result - game record with name and score
*/
function addResult(result){
	const data = localStorage.getItem('results');			// load data from local storage (from variable results)
	if (data) {                                 // when storage with data exist, then save data to storage
	  		let results = JSON.parse(data);     // load data from storage
	  		results.push(result);
	  		localStorage.setItem('results', JSON.stringify(results));			// save results to storage
	  	} else {                        //when storage don't exist
	  		let results = [];			// create new local storage variable
	  		results.push(result);
	  		localStorage.setItem('results', JSON.stringify(results));			// save results to storage
	  	}
}

/**
* @description manual delete results from local storage
*/
function clearResults() {
	localStorage.removeItem('results');
}