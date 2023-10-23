/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ (() => {

eval("\n\nconst app = new PIXI.Application({\n    width: 1280,\n    height: 720,\n  });\n  \n  const background = PIXI.Sprite.from('./src/assets/space.jpg');\n  background.width = app.screen.width;\n  background.height = app.screen.height;\n  app.stage.addChild(background);\n  document.body.appendChild(app.view);\n  \n  let gameOver = false;\n  \n  const rocket = PIXI.Sprite.from('./src/assets/rocket.svg');\n  app.stage.addChild(rocket);\n  rocket.anchor.set(0.5);\n  rocket.x = app.screen.width / 2;\n  rocket.y = app.screen.height / 1.1;\n  \n  const speed = 5;\n  \n  const bullets = [];\n  const asteroids = [];\n  const asteroidPool = [];\n  \n  const bulletSpeed = 10;\n  const asteroidSpeed = 3;\n  const maxAsteroids = 5;\n  \n  let bulletCount = 0;\n  let activeAsteroids = maxAsteroids;\n  \n  let boss = 1;\n  let bossHP = 4;\n  let bossHits = 0;\n  let bossSpeed = 3;\n  let bossDirection = 1;\n  const bossBullets = [];\n  const bossBulletSpeed = 5;\n  \n  let bossTime = 0;\n  const bossInterval = 120;\n  \n  const keys = {};\n  \n  const startButton = new PIXI.Text('Start Game', {\n    fontSize: 60,\n    fill: 0xFFFFFF,\n  });\n  startButton.position.set(app.screen.width / 2 - startButton.width / 2, app.screen.height / 2 - startButton.height / 2);\n  startButton.interactive = true;\n  startButton.buttonMode = true;\n  app.stage.addChild(startButton);\n  \n  startButton.on('click', () => {\n    startGame();\n    startButton.destroy();\n  });\n  \n  const rank = new PIXI.Text('', {\n    fontFamily: 'Lobster',\n    fontSize: 60,\n    fill: 0xFF0000,\n  });\n  rank.position.set(500, 300);\n  app.stage.addChild(rank);\n  \n  const countdownText = new PIXI.Text('', {\n    fontFamily: 'Arial',\n    fontSize: 36,\n    fill: 0xFFFFFF,\n  });\n  countdownText.position.set(20, 20);\n  app.stage.addChild(countdownText);\n  let countdown = 60;\n  \n  const bulletCountText = new PIXI.Text('Bullets: 0/10', {\n    fontSize: 36,\n    fill: 0xFFFFFF,\n  });\n  bulletCountText.position.set(1050, 20);\n  app.stage.addChild(bulletCountText);\n  \n  window.addEventListener('keydown', (e) => {\n    keys[e.key] = true;\n  \n    if (e.key === ' ' && bulletCount < 10) {\n      const bullet = new PIXI.Graphics();\n      bullet.beginFill(0xFFFF80);\n      bullet.drawCircle(0, 0, 4, 4);\n      bullet.endFill();\n      bullet.x = rocket.x;\n      bullet.y = rocket.y;\n      app.stage.addChild(bullet);\n      bullets.push(bullet);\n      bulletCount++;\n      bulletCountText.text = `Bullets: ${bulletCount}/10`;\n    }\n  });\n  \n  window.addEventListener('keyup', (e) => {\n    keys[e.key] = false;\n  });\n  \n  function startGame() {\n    document.getElementById('startButton').remove();\n    app.ticker.start();\n    for (let i = 0; i < maxAsteroids; i++) {\n      const asteroid = PIXI.Sprite.from('./src/assets/asteroid.svg');\n      asteroid.x = Math.random() * app.screen.width;\n      asteroid.y = -Math.random() * app.screen.width;\n      asteroid.scale.set(0.6);\n      app.stage.addChild(asteroid);\n      asteroids.push(asteroid);\n      asteroidPool.push(asteroid);\n    }\n  \n    function newLevel() {\n      bulletCount = 0;\n      bulletCountText.text = `Bullets: ${bulletCount}/10`;\n      countdown = 60;\n      countdownText.text = `Time: ${Math.round(countdown)}`;\n      for (const asteroid of asteroids) {\n        app.stage.removeChild(asteroid);\n      }\n      asteroids.length = 0;\n      activeAsteroids = 1;\n  \n      app.ticker.add(() => {\n        for (let i = 0; i < boss; i++) {\n          boss = PIXI.Sprite.from('./src/assets/asteroid1.svg');\n          boss.x = Math.random() * app.screen.width;\n          boss.y = Math.random() * 350;\n          boss.scale.set(0.8);\n          app.stage.addChild(boss);\n  \n          for (let i = 0; i < 4; i++) {\n            const hpBar = new PIXI.Graphics();\n            hpBar.beginFill(0x00FF00);\n            hpBar.drawRect(0, 0, 30, 10);\n            hpBar.x = i * 40 - (2 * 4 / 2);\n            hpBar.y = boss.height - 15;\n            boss.addChild(hpBar);\n          }\n        }\n      });\n    }\n  \n    app.ticker.add((delta) => {\n      countdown -= delta / 60;\n      countdownText.text = `Time: ${Math.round(countdown)}`;\n      if (countdown <= 0) {\n        app.ticker.stop();\n        rank.text = 'YOU LOSE';\n      }\n      if (keys['ArrowLeft'] && rocket.x > rocket.width / 2) {\n        rocket.x -= speed;\n      }\n      if (keys['ArrowRight'] && rocket.x < app.screen.width - rocket.width / 2) {\n        rocket.x += speed;\n      }\n  \n      for (let i = bullets.length - 1; i >= 0; i--) {\n        const bullet = bullets[i];\n        bullet.y -= bulletSpeed;\n      }\n  \n      bossTime += 1;\n      if (bossTime >= bossInterval) {\n        const bullet = new PIXI.Graphics();\n        bullet.beginFill(0xFFFF00);\n        bullet.drawRect(0, 0, 10, 10);\n        bullet.x = boss.x + boss.width / 2 - bullet.width / 2;\n        bullet.y = boss.y + boss.height;\n        app.stage.addChild(bullet);\n        bossBullets.push(bullet);\n        bossTime = 0;\n      }\n      for (let i = bossBullets.length - 1; i >= 0; i--) {\n        const bossBullet = bossBullets[i];\n        bossBullet.y += bossBulletSpeed;\n        if (\n          bossBullet.x + bossBullet.width / 2 > rocket.x - rocket.width / 2 &&\n          bossBullet.x - bossBullet.width / 2 < rocket.x + rocket.width / 2 &&\n          bossBullet.y + bossBullet.height / 2 > rocket.y - rocket.height / 2 &&\n          bossBullet.y - bossBullet.height / 2 < rocket.y + rocket.height / 2\n        ) {\n          gameOver = true;\n          app.ticker.stop();\n          rank.text = 'YOU LOSE';\n        }\n        if (bossBullet.y > app.screen.height) {\n          bossBullets.splice(i, 1);\n          app.stage.removeChild(bossBullet);\n        }\n      }\n  \n      boss.x += bossSpeed * bossDirection;\n  \n      if (boss.x + boss.width > app.screen.width) {\n        bossDirection = -1;\n        boss.x = app.screen.width - boss.width;\n      }\n      if (boss.x < 0) {\n        bossDirection = 1;\n        boss.x = 0;\n      }\n      for (let i = 0; i < asteroids.length; i++) {\n        const asteroid = asteroids[i];\n        asteroid.y += asteroidSpeed;\n        if (asteroid.y > app.screen.height) {\n          asteroid.y = -50;\n          asteroid.x = Math.random() * app.screen.width;\n        }\n      }\n      for (let i = bullets.length - 1; i >= 0; i--) {\n        const bullet = bullets[i];\n        for (let j = asteroids.length - 1; j >= 0; j--) {\n          const asteroid = asteroids[j];\n          if (\n            bullet.x + bullet.width / 2 > asteroid.x - asteroid.width / 2 &&\n            bullet.x - bullet.width / 2 < asteroid.x + asteroid.width / 2 &&\n            bullet.y + bullet.height / 2 > asteroid.y - asteroid.height / 2 &&\n            bullet.y - bullet.height / 2 < asteroid.y + asteroid.height / 2\n          ) {\n            bullets.splice(i, 1);\n            app.stage.removeChild(bullet);\n            asteroids.splice(j, 1);\n            app.stage.removeChild(asteroid);\n            activeAsteroids--;\n            break;\n          }\n        }\n        if (bossHP > 0) {\n          if (\n            bullet.x + bullet.width / 2 > boss.x - boss.width / 2 &&\n            bullet.x - bullet.width / 2 < boss.x + boss.width / 2 &&\n            bullet.y + bullet.height / 2 > boss.y - boss.height / 2 &&\n            bullet.y - bullet.height / 2 < boss.y + boss.height / 2\n          ) {\n            bullets.splice(i, 1);\n            app.stage.removeChild(bullet);\n            bossHits++;\n            const hpBar = boss.children.shift();\n            boss.removeChild(hpBar);\n            if (bossHits === 4) {\n              app.stage.removeChild(boss);\n              app.ticker.stop();\n              rank.text = 'YOU WIN';\n            }\n            break;\n          }\n        }\n      }\n      if (activeAsteroids === 0) {\n        app.ticker.stop();\n        rank.text = 'YOU WIN';\n        setTimeout(() => {\n          newLevel();\n          app.ticker.start();\n          rank.text = '';\n        }, 2000);\n      } else if (bullets.length === 10 && activeAsteroids > 0) {\n        app.ticker.stop();\n        rank.text = 'YOU LOSE';\n      }\n      if (gameOver) {\n        // Здесь можно добавить кнопку перезагрузки игры\n      }\n    });\n  }\n  \n\n//# sourceURL=webpack://pixi-game/./index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./index.js"]();
/******/ 	
/******/ })()
;