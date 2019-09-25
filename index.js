const score = document.querySelector('.score'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.gameArea'),
    car = document.createElement('div');


car.classList.add('car');

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

const keys  = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
},

settings = {
    start: false,
    score: 0,
    speed: 3,
    traffic: 3
}

function getQuantityElements(heightElement) {
   return document.documentElement.clientHeight / heightElement + 1;
}

function startGame() {
    start.classList.add('hide');
    score.classList.remove('hide');
    gameArea.innerHTML = '';
    car.style.left = '50%';
    car.style.bottom = '15px;';
    car.style.top = 'unset';

    for(let i = 0; i < getQuantityElements(100); i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i*100) + 'px';
        line.y = i * 100;
        gameArea.append(line);
    }

    for(let i = 0; i < getQuantityElements(100 * settings.traffic); i++) {
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.y = -100 * settings.traffic * (i + 1);
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
      
        enemy.style.top = enemy.y + 'px';
        gameArea.appendChild(enemy);
    }

    settings.score = 0;
    settings.start = true;

    gameArea.appendChild(car);
    settings.x = car.offsetLeft;
    settings.y = car.offsetTop;

    requestAnimationFrame(playGame);
}


function playGame(){

    if(settings.start) {

    settings.score += settings.speed;
    score.textContent = 'Score: ' + settings.score;

    moveRoad();
    moveEnemy();

        if(keys.ArrowLeft && settings.x > 0) {
            settings.x -= settings.speed;
        }

        if(keys.ArrowRight && settings.x < (gameArea.offsetWidth - car.offsetWidth)) {
            settings.x += settings.speed;
        }

        if(keys.ArrowDown && settings.y < (gameArea.offsetHeight - car.offsetHeight - 10)) {
            settings.y += settings.speed;
        }

        if(keys.ArrowUp && settings.y > 0) {
            settings.y -= settings.speed;
        }

        car.style.left = settings.x + 'px';
        car.style.top = settings.y + 'px';

        requestAnimationFrame(playGame);
    }
}




function startRun(event) {
    event.preventDefault();
    keys[event.key] = true;
}

function stopRun(event) {  
    event.preventDefault();
    keys[event.key] = false;
}

function moveRoad() {
    let lines = document.querySelectorAll('.line');

    lines.forEach(function(line) {
        line.y += settings.speed; 
        line.style.top = line.y + 'px';

        if(line.y >= document.documentElement.clientHeight) {
            line.y = -100;
        }
    })

}

function moveEnemy() {
    let enemies = document.querySelectorAll('.enemy');


    enemies.forEach(function(enemy) {
        let carRect = car.getBoundingClientRect(),
            enemyRect = enemy.getBoundingClientRect();
        
        if(carRect.top <= enemyRect.bottom &&
        carRect.right >= enemyRect.left &&
        carRect.left <= enemyRect.right &&
        carRect.bottom >= enemyRect.top){
            console.warn('ДТП');
            settings.start = false;
            start.classList.remove('hide');
            start.style.top = score.offsetHeight + 10px;
        }


        enemy.y += settings.speed / 2;
        enemy.style.top = enemy.y + 'px';

        if(enemy.y >= document.documentElement.clientHeight) {
            enemy.y = -100 * settings.traffic;
            enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        }
    })
}