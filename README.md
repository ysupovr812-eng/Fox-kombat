<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Fox Kombat</title>

<style>
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #1b1f2a;
  font-family: Arial, sans-serif;
}

#game-container {
  width: 100%;
  height: 100%;
  position: relative;
}

#ui {
  position: absolute;
  bottom: 30px;
  width: 100%;
  text-align: center;
  z-index: 10;
}

button {
  padding: 16px 40px;
  font-size: 20px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(#ffb347, #ff6a00);
  color: #000;
  cursor: pointer;
  box-shadow: 0 6px 0 #b34a00;
}

button:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 #b34a00;
}
</style>
</head>

<body>

<div id="game-container">
  <div id="ui">
    <button id="battleBtn">⚔ ATTACK</button>
  </div>
</div>

<!-- Telegram Mini App -->
<script src="https://telegram.org/js/telegram-web-app.js"></script>
<script>
const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
}
</script>

<!-- PIXI -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/pixi.js/7.3.2/pixi.min.js"></script>

<script>
window.onload = function () {

  const app = new PIXI.Application({
    resizeTo: window,
    backgroundColor: 0x1b1f2a
  });

  document.getElementById("game-container").appendChild(app.view);

  // Тень
  const shadow = new PIXI.Graphics();
  shadow.beginFill(0x000000, 0.35);
  shadow.drawEllipse(0, 0, 80, 20);
  shadow.endFill();
  shadow.x = app.screen.width / 2 - 150;
  shadow.y = app.screen.height / 2 + 40;
  app.stage.addChild(shadow);

  // Лиса
  const fox = new PIXI.Graphics();
  fox.beginFill(0xff6600);
  fox.drawRect(-40, -40, 80, 80);
  fox.endFill();
  fox.x = app.screen.width / 2 - 150;
  fox.y = app.screen.height / 2;
  app.stage.addChild(fox);

  // Враг
  const enemy = new PIXI.Graphics();
  enemy.beginFill(0x0066ff);
  enemy.drawRect(-40, -40, 80, 80);
  enemy.endFill();
  enemy.x = app.screen.width / 2 + 150;
  enemy.y = app.screen.height / 2;
  app.stage.addChild(enemy);

  // HP
  let foxHP = 100;
  let enemyHP = 100;

  const style = new PIXI.TextStyle({
    fill: "white",
    fontSize: 24,
    fontWeight: "bold"
  });

  const foxText = new PIXI.Text("HP: 100", style);
  foxText.x = 40;
  foxText.y = 30;
  app.stage.addChild(foxText);

  const enemyText = new PIXI.Text("HP: 100", style);
  enemyText.x = app.screen.width - 150;
  enemyText.y = 30;
  app.stage.addChild(enemyText);

  // Кнопка атаки
  document.getElementById("battleBtn").onclick = () => {

    fox.x += 50;
    shadow.x = fox.x;

    let dmg = Math.floor(Math.random() * 15) + 5;
    enemyHP = Math.max(0, enemyHP - dmg);
    enemyText.text = "HP: " + enemyHP;

    setTimeout(() => {
      fox.x -= 50;
      shadow.x = fox.x;

      if (enemyHP <= 0) {
        alert("🎉 Победа!");
        foxHP = 100;
        enemyHP = 100;
      } else {
        enemy.x -= 50;

        setTimeout(() => {
          enemy.x += 50;
          let dmg2 = Math.floor(Math.random() * 15) + 5;
          foxHP = Math.max(0, foxHP - dmg2);
          foxText.text = "HP: " + foxHP;

          if (foxHP <= 0) {
            alert("💀 Проигрыш!");
            foxHP = 100;
            enemyHP = 100;
          }
        }, 300);
      }

      foxText.text = "HP: " + foxHP;
      enemyText.text = "HP: " + enemyHP;

    }, 300);
  };
};
</script>

</body>
</html>
