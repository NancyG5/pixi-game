// Создаем объект нашей игры 
const app = new PIXI.Application({
    width: 1280,
    height: 720,
  });
  
  // Подгружаем фон и прописываем размеры 
  const background = PIXI.Sprite.from('./src/assets/space.jpg');
  background.width = app.screen.width;
  background.height = app.screen.height;
  app.stage.addChild(background);
  document.body.appendChild(app.view);// Вставляем фон в DOM 
  
  // Флаги для старта и окончания игры 
  let gameStarted = false;
  let gameOver = false;
  
  // Создание ракеты (или космическокго корабля)
  const rocket = PIXI.Sprite.from('./src/assets/rocket.svg');
  app.stage.addChild(rocket);
  rocket.anchor.set(0.5);
  rocket.x = app.screen.width / 2;
  rocket.y = app.screen.height / 1.1;
  
  const speed = 5; // Скорость ракеты при двежении
  
  // Массив и переменные для пуль
  const bullets = [];
  const bulletSpeed = 10;
  let bulletCount = 0;

  // Массивы для сохранения астероидов 
  const asteroids = [];
  const asteroidPool = [];
  const asteroidSpeed = 3; // Скорость астероидов 
  const maxAsteroids = 5; // Максимальное кол-во астероидов
  let activeAsteroids = maxAsteroids;
  
  // Свойства Босса
  let boss = 1;
  let bossHP = 4;
  let bossHits = 0;
  let bossSpeed = 3;
  let bossDirection = 1;
  let bossTime = 0;
  let bossStopped = false;
  const bossBullets = [];
  const bossBulletSpeed = 5;
  const bossInterval = 120;
  
  const keys = {}; // Отслеживаем нажатие клавиш
  
  // Создаем кнопку старта игры
  const startButton = new PIXI.Text('Start Game', {
    fontSize: 60,
    fill: 0xFFFFFF,
  });
  startButton.position.set(app.screen.width / 2 - startButton.width / 2, app.screen.height / 2 - startButton.height / 2);
  startButton.interactive = true;
  startButton.buttonMode = true;
  app.stage.addChild(startButton);
  
  // Навешиваем обработчик событий на кнопку старта 
  startButton.on('click', () => {
    startGame();
    startButton.destroy();
  });
  
  // Текст для вывода результата
  const rank = new PIXI.Text('', {
    fontFamily: 'Lobster',
    fontSize: 60,
    zIndex: 5,
  });
  rank.position.set(500, 300);
  app.stage.addChild(rank);
  
  // Текст для таймера 
  const countdownText = new PIXI.Text('', {
    fontFamily: 'Arial',
    fontSize: 36,
    fill: 0xFFFFFF,
  });
  countdownText.position.set(20, 20);
  app.stage.addChild(countdownText);
  let countdown = 60;
  
  // Текст для счетчика пуль
  const bulletCountText = new PIXI.Text('', {
    fontSize: 36,
    fill: 0xFFFFFF,
  });
  bulletCountText.position.set(1050, 20);
  app.stage.addChild(bulletCountText);
  
  // Обработчик событий для пробела 
  window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
  
    if (e.key === ' ' && bulletCount < 10 && gameStarted) {
      const bullet = new PIXI.Graphics(); // Создаем пулю 
      bullet.beginFill(0xFFFF80);
      bullet.drawCircle(0, 0, 5, 5);
      bullet.endFill();
      bullet.x = rocket.x;
      bullet.y = rocket.y;
      app.stage.addChild(bullet);
      bullets.push(bullet);
      bulletCount++;
    }
  });
  
  // Обработчик событий при отпускании пробела
  window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
  });
  
  // Функция начала игры 
  function startGame() {
    document.getElementById('startButton').remove(); // Удаление кнопки старта, после нажатия на неё
    gameStarted = true;
    app.ticker.start(); // Запуск игры
    for (let i = 0; i < maxAsteroids; i++) {
      const asteroid = PIXI.Sprite.from('./src/assets/asteroid.svg'); // Создаем астероид
      asteroid.x = Math.random() * (app.screen.width - asteroid.width);
      asteroid.y = -Math.random() * app.screen.width;
      asteroid.scale.set(0.6);
      app.stage.addChild(asteroid);
      asteroids.push(asteroid);
      asteroidPool.push(asteroid);
    }
  
    // Функция перехода на новый уровень 
    function newLevel() {
      bulletCount = 0;
      bulletCountText.text = `Bullets: ${10 - bulletCount}/10`;
      countdown = 60;
      countdownText.text = `Time: ${Math.round(countdown)}`;
      // Удаляем астероиды с первого уровня 
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
  
    // Основной игровой цикл
    app.ticker.add((delta) => {
      countdown -= delta / 60; // Обратный отсчет таймера 
      countdownText.text = `Time: ${Math.round(countdown)}`;
      bulletCountText.text = `Bullets: ${10 - bulletCount}/10`;

      // Остановка игры по окончанию времени
      if (countdown <= 0) {
        app.ticker.stop();
        rank.text = 'YOU LOSE';
        rank.style.fill = 0xFF0000;
      }
      //  Перемещение ракеты влево при нажатии на клавишу 
      if (keys['ArrowLeft'] && rocket.x > rocket.width / 2 - 40) {
        rocket.x -= speed;
      }
      //  Перемещение ракеты вправо при нажатии на клавишу
      if (keys['ArrowRight'] && rocket.x < app.screen.width - rocket.width / 2 + 40) {
        rocket.x += speed;
      }
      
      // Пули при выстреле летят вверх
      for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        bullet.y -= bulletSpeed;
      }
  
      // Обновляем время и создаем пули босса
      bossTime += 1;
      if (bossTime >= bossInterval) {
        const bullet = new PIXI.Graphics();
        bullet.beginFill(0xFF0000);
        bullet.drawCircle(0, 0, 13, 13);
        bullet.x = boss.x + boss.width / 2 - bullet.width / 2;
        bullet.y = boss.y + boss.height;
        app.stage.addChild(bullet);
        bossBullets.push(bullet);
        bossTime = 0;
      }
      //Пули босса летят вниз; проверка столкновения пули босса с ракетой
      for (let i = bossBullets.length - 1; i >= 0; i--) {
        const bossBullet = bossBullets[i];
        bossBullet.y += bossBulletSpeed;
        if (
          bossBullet.x + bossBullet.width / 2 > rocket.x - rocket.width / 2 + 60 &&
          bossBullet.x - bossBullet.width / 2 < rocket.x + rocket.width / 2 - 60 &&
          bossBullet.y + bossBullet.height / 2 > rocket.y - rocket.height / 2 + 20 &&
          bossBullet.y - bossBullet.height / 2 < rocket.y + rocket.height / 2
        ) {
          gameOver = true;
          app.ticker.stop();
          rank.text = 'YOU LOSE';
          rank.style.fill = 0xFF0000;
        }
        // Удаляем пулю, если она вылетела за игровой экран
        if (bossBullet.y > app.screen.height) {
          bossBullets.splice(i, 1);
          app.stage.removeChild(bossBullet);
        }
      }

      // Функция для движения босса и его остановки
      function moveBossWithPause() {
        if (!bossStopped) {
          boss.x += bossSpeed * bossDirection;
          if (boss.x + boss.width > app.screen.width) {
            bossDirection = -1;
            boss.x = app.screen.width - boss.width;
          }
          if (boss.x < 0) {
            bossDirection = 1;
            boss.x = 0;
          }
          if (Math.random() < 0.0065) {
            bossStopped = true;
            setTimeout(() => {
              bossStopped = false;
            }, 3000); 
          }
        }
      }
      moveBossWithPause();

      // Движенеи астероидов (двигаются вниз, когда астероид выхзодит за низ игрового поля, то он перемещается в рандомное положение сверху экрана)
      for (let i = 0; i < asteroids.length; i++) {
        const asteroid = asteroids[i];
        asteroid.y += asteroidSpeed;
        if (asteroid.y > app.screen.height) {
          asteroid.y = -50;
          asteroid.x = Math.random() * (app.screen.width - asteroid.width);
        }
      }
      
      // Проверка столкновения пуль ракеты с астероидами 
      for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        for (let j = asteroids.length - 1; j >= 0; j--) {
          const asteroid = asteroids[j];
          if (
            bullet.x + bullet.width / 2 > asteroid.x - asteroid.width / 2 + 45 &&
            bullet.x - bullet.width / 2 < asteroid.x + asteroid.width / 2 + 40 &&
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
        // Проверяем кол-во хит поинтов босса
        if (bossHP > 0) {
          // Проверяем столкновение пули с боссом 
          if (
            bullet.x + bullet.width / 2 > boss.x - boss.width / 2 + 65 &&
            bullet.x - bullet.width / 2 < boss.x + boss.width / 2 + 45 &&
            bullet.y + bullet.height / 2 > boss.y - boss.height / 2 &&
            bullet.y - bullet.height / 2 < boss.y + boss.height / 2 + 50
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
              rank.style.fill = 0x00FF00;
            }
            break;
          }
        }

        // Поверяем столкновение пуль ракеты с пулями босса
        for (let j = bossBullets.length - 1; j >= 0; j--) {
          const bossBullet = bossBullets[j];
          if (
            bullet.x + bullet.width / 2 > bossBullet.x - bossBullet.width / 2 &&
            bullet.x - bullet.width / 2 < bossBullet.x + bossBullet.width / 2 &&
            bullet.y + bullet.height / 2 > bossBullet.y - bossBullet.height / 2 &&
            bullet.y - bullet.height / 2 < bossBullet.y + bossBullet.height / 2
          ) {
            app.stage.removeChild(bullet);
            app.stage.removeChild(bossBullet);
            bullets.splice(i, 1);
            bossBullets.splice(j, 1);
            break; 
          }
        }
      }

      // Условие победы 
      if (activeAsteroids === 0) {
        app.ticker.stop();
        rank.text = 'YOU WIN';
        rank.style.fill = 0x00FF00;
        setTimeout(() => {
          newLevel();
          app.ticker.start();
          rank.text = '';
        }, 2000);
        // Условие поражения 
      } else if (bulletCount === 10 && activeAsteroids > 0) {
        app.ticker.stop();
        rank.text = 'YOU LOSE';
        rank.style.fill = 0xFF0000;
      }
      if (gameOver) {
        // Здесь можно добавить кнопку перезагрузки игры
      }
    });
  }
  