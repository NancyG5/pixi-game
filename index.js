

const app = new PIXI.Application({
    width: 1280,
    height: 720,
  });
  
  const background = PIXI.Sprite.from('./src/assets/space.jpg');
  background.width = app.screen.width;
  background.height = app.screen.height;
  app.stage.addChild(background);
  document.body.appendChild(app.view);
  
  let gameOver = false;
  
  const rocket = PIXI.Sprite.from('./src/assets/rocket.svg');
  app.stage.addChild(rocket);
  rocket.anchor.set(0.5);
  rocket.x = app.screen.width / 2;
  rocket.y = app.screen.height / 1.1;
  
  const speed = 5;
  
  const bullets = [];
  const asteroids = [];
  const asteroidPool = [];
  
  const bulletSpeed = 10;
  const asteroidSpeed = 3;
  const maxAsteroids = 5;
  
  let bulletCount = 0;
  let activeAsteroids = maxAsteroids;
  
  let boss = 1;
  let bossHP = 4;
  let bossHits = 0;
  let bossSpeed = 3;
  let bossDirection = 1;
  const bossBullets = [];
  const bossBulletSpeed = 5;
  
  let bossTime = 0;
  const bossInterval = 120;
  
  const keys = {};
  
  const startButton = new PIXI.Text('Start Game', {
    fontSize: 60,
    fill: 0xFFFFFF,
  });
  startButton.position.set(app.screen.width / 2 - startButton.width / 2, app.screen.height / 2 - startButton.height / 2);
  startButton.interactive = true;
  startButton.buttonMode = true;
  app.stage.addChild(startButton);
  
  startButton.on('click', () => {
    startGame();
    startButton.destroy();
  });
  
  const rank = new PIXI.Text('', {
    fontFamily: 'Lobster',
    fontSize: 60,
    fill: 0xFF0000,
  });
  rank.position.set(500, 300);
  app.stage.addChild(rank);
  
  const countdownText = new PIXI.Text('', {
    fontFamily: 'Arial',
    fontSize: 36,
    fill: 0xFFFFFF,
  });
  countdownText.position.set(20, 20);
  app.stage.addChild(countdownText);
  let countdown = 60;
  
  const bulletCountText = new PIXI.Text('Bullets: 0/10', {
    fontSize: 36,
    fill: 0xFFFFFF,
  });
  bulletCountText.position.set(1050, 20);
  app.stage.addChild(bulletCountText);
  
  window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
  
    if (e.key === ' ' && bulletCount < 10) {
      const bullet = new PIXI.Graphics();
      bullet.beginFill(0xFFFF80);
      bullet.drawCircle(0, 0, 4, 4);
      bullet.endFill();
      bullet.x = rocket.x;
      bullet.y = rocket.y;
      app.stage.addChild(bullet);
      bullets.push(bullet);
      bulletCount++;
      bulletCountText.text = `Bullets: ${bulletCount}/10`;
    }
  });
  
  window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
  });
  
  function startGame() {
    document.getElementById('startButton').remove();
    app.ticker.start();
    for (let i = 0; i < maxAsteroids; i++) {
      const asteroid = PIXI.Sprite.from('./src/assets/asteroid.svg');
      asteroid.x = Math.random() * app.screen.width;
      asteroid.y = -Math.random() * app.screen.width;
      asteroid.scale.set(0.6);
      app.stage.addChild(asteroid);
      asteroids.push(asteroid);
      asteroidPool.push(asteroid);
    }
  
    function newLevel() {
      bulletCount = 0;
      bulletCountText.text = `Bullets: ${bulletCount}/10`;
      countdown = 60;
      countdownText.text = `Time: ${Math.round(countdown)}`;
      for (const asteroid of asteroids) {
        app.stage.removeChild(asteroid);
      }
      asteroids.length = 0;
      activeAsteroids = 1;
  
      app.ticker.add(() => {
        for (let i = 0; i < boss; i++) {
          boss = PIXI.Sprite.from('./src/assets/asteroid1.svg');
          boss.x = Math.random() * app.screen.width;
          boss.y = Math.random() * 350;
          boss.scale.set(0.8);
          app.stage.addChild(boss);
  
          for (let i = 0; i < 4; i++) {
            const hpBar = new PIXI.Graphics();
            hpBar.beginFill(0x00FF00);
            hpBar.drawRect(0, 0, 30, 10);
            hpBar.x = i * 40 - (2 * 4 / 2);
            hpBar.y = boss.height - 15;
            boss.addChild(hpBar);
          }
        }
      });
    }
  
    app.ticker.add((delta) => {
      countdown -= delta / 60;
      countdownText.text = `Time: ${Math.round(countdown)}`;
      if (countdown <= 0) {
        app.ticker.stop();
        rank.text = 'YOU LOSE';
      }
      if (keys['ArrowLeft'] && rocket.x > rocket.width / 2) {
        rocket.x -= speed;
      }
      if (keys['ArrowRight'] && rocket.x < app.screen.width - rocket.width / 2) {
        rocket.x += speed;
      }
  
      for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        bullet.y -= bulletSpeed;
      }
  
      bossTime += 1;
      if (bossTime >= bossInterval) {
        const bullet = new PIXI.Graphics();
        bullet.beginFill(0xFFFF00);
        bullet.drawRect(0, 0, 10, 10);
        bullet.x = boss.x + boss.width / 2 - bullet.width / 2;
        bullet.y = boss.y + boss.height;
        app.stage.addChild(bullet);
        bossBullets.push(bullet);
        bossTime = 0;
      }
      for (let i = bossBullets.length - 1; i >= 0; i--) {
        const bossBullet = bossBullets[i];
        bossBullet.y += bossBulletSpeed;
        if (
          bossBullet.x + bossBullet.width / 2 > rocket.x - rocket.width / 2 &&
          bossBullet.x - bossBullet.width / 2 < rocket.x + rocket.width / 2 &&
          bossBullet.y + bossBullet.height / 2 > rocket.y - rocket.height / 2 &&
          bossBullet.y - bossBullet.height / 2 < rocket.y + rocket.height / 2
        ) {
          gameOver = true;
          app.ticker.stop();
          rank.text = 'YOU LOSE';
        }
        if (bossBullet.y > app.screen.height) {
          bossBullets.splice(i, 1);
          app.stage.removeChild(bossBullet);
        }
      }
  
      boss.x += bossSpeed * bossDirection;
  
      if (boss.x + boss.width > app.screen.width) {
        bossDirection = -1;
        boss.x = app.screen.width - boss.width;
      }
      if (boss.x < 0) {
        bossDirection = 1;
        boss.x = 0;
      }
      for (let i = 0; i < asteroids.length; i++) {
        const asteroid = asteroids[i];
        asteroid.y += asteroidSpeed;
        if (asteroid.y > app.screen.height) {
          asteroid.y = -50;
          asteroid.x = Math.random() * app.screen.width;
        }
      }
      for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        for (let j = asteroids.length - 1; j >= 0; j--) {
          const asteroid = asteroids[j];
          if (
            bullet.x + bullet.width / 2 > asteroid.x - asteroid.width / 2 &&
            bullet.x - bullet.width / 2 < asteroid.x + asteroid.width / 2 &&
            bullet.y + bullet.height / 2 > asteroid.y - asteroid.height / 2 &&
            bullet.y - bullet.height / 2 < asteroid.y + asteroid.height / 2
          ) {
            bullets.splice(i, 1);
            app.stage.removeChild(bullet);
            asteroids.splice(j, 1);
            app.stage.removeChild(asteroid);
            activeAsteroids--;
            break;
          }
        }
        if (bossHP > 0) {
          if (
            bullet.x + bullet.width / 2 > boss.x - boss.width / 2 &&
            bullet.x - bullet.width / 2 < boss.x + boss.width / 2 &&
            bullet.y + bullet.height / 2 > boss.y - boss.height / 2 &&
            bullet.y - bullet.height / 2 < boss.y + boss.height / 2
          ) {
            bullets.splice(i, 1);
            app.stage.removeChild(bullet);
            bossHits++;
            const hpBar = boss.children.shift();
            boss.removeChild(hpBar);
            if (bossHits === 4) {
              app.stage.removeChild(boss);
              app.ticker.stop();
              rank.text = 'YOU WIN';
            }
            break;
          }
        }
      }
      if (activeAsteroids === 0) {
        app.ticker.stop();
        rank.text = 'YOU WIN';
        setTimeout(() => {
          newLevel();
          app.ticker.start();
          rank.text = '';
        }, 2000);
      } else if (bullets.length === 10 && activeAsteroids > 0) {
        app.ticker.stop();
        rank.text = 'YOU LOSE';
      }
      if (gameOver) {
        // Здесь можно добавить кнопку перезагрузки игры
      }
    });
  }
  