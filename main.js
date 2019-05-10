// phina.js をグローバル領域に展開
phina.globalize();

const SCREEN_WIDTH  = 640;
const SCREEN_HEIGHT = 480;

const ASSETS = {
  image: {
    'tomapiko': 'https://rawgit.com/phi-jp/phina.js/develop/assets/images/tomapiko.png',
  }
};

const KEY_NO_PUSHED = 0;
const KEY_UP        = 1;
const KEY_DOWN      = 2;
const KEY_RIGHT     = 3;
const KEY_LEFT      = 4;

let getPushedKey = (keyboard) => {
  if (keyboard.getKey("up")) { return KEY_UP; }
  else if (keyboard.getKey("down")) { return KEY_DOWN; }
  else if (keyboard.getKey("right")) { return KEY_RIGHT; }
  else if (keyboard.getKey("left")) { return KEY_LEFT; }
  return KEY_NO_PUSHED;
};

let shootable = true;
let shootBullet = (scene, direction, initPos) => {
  if (!shootable) return;
  shootable = false;
  setTimeout(() => {
    shootable = true;
  }, 100);
  const BULLET_SPEED = 16;
  let bullet = CircleShape({
    radius: 8,
  }).addChildTo(scene);
  bullet.setPosition(initPos.x, initPos.y);
  let dx = 0, dy = 0;
  switch (direction) {
    case KEY_UP: {
      dy = -1;
      break;
    }
    case KEY_DOWN: {
      dy = 1;
      break;
    }
    case KEY_RIGHT: {
      dx = 1;
      break;
    }
    case KEY_LEFT: {
      dx = -1;
      break;
    }
    default: { assert("shootBullet????"); }
  }
  bullet.updatedCount = 0;
  let UPDATE_LIMIT = (direction == KEY_UP || direction == KEY_DOWN) ? 30 : 45;
  bullet.update = () => {
    bullet.moveBy(dx*BULLET_SPEED, dy*BULLET_SPEED);
    if (bullet.updatedCount >= UPDATE_LIMIT) {
      bullet.remove();
    } else {
      console.log("b");
      bullet.updatedCount += 1;
      // 各敵との当たり判定
      console.log(scene.enemies.size);
      for (enemy of scene.enemies) {
        if (bullet.hitTestElement(enemy)) {
          scene.updateScore(1);
          enemy.remove();
          scene.enemies.delete(enemy);
          bullet.remove();
        }
      }
    }
  };
};

// 敵クラス
phina.define("Enemy", {
  superClass: 'Label',
  init: function(scene) {
    this.superInit();
    this.text = "仕事";
    this.fill = "white";
    this.stroke = "blue";
    this.fontFamily = "'Monaco','Consolas','MS 明朝'";
    this.strokeWidth = 10;
    this.shadow = "black";
    this.shadowBlur = 100;
    this.fontSize = 32;
    this.x = Random.randint(0,SCREEN_WIDTH);
    this.y = Random.randint(0,SCREEN_HEIGHT);
    this.addChildTo(scene);

    this.x = Random.randint(0,SCREEN_WIDTH);
    this.y = Random.randint(0,SCREEN_HEIGHT);
    this.vx = Random.randint(1, 10);
    this.vy = Random.randint(1, 10);

    this.update = () => {
      this.x += this.vx
      this.y += this.vy

      if (this.left < 0) {
        this.left = 0;
        this.vx *= -1;
      }
      else if (this.right > SCREEN_WIDTH) {
        this.right = SCREEN_WIDTH;
        this.vx *= -1;
      }
      if (this.bottom < this.height) {
        this.bottom = this.height;
        this.vy *= -1;
      }
      else if (this.top > SCREEN_HEIGHT-this.height) {
        this.top = SCREEN_HEIGHT-this.height;
        this.vy *= -1;
      }
    }
  },

});

// MainScene クラスを定義
phina.define('MainScene', {
  superClass: 'DisplayScene',
  init: function() {
    this.superInit({
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
    });

    this.remainingLifeOfPlayer = 3;

    // 残りライフのラベル
    this.lifeLabel = Label(this.remainingLifeOfPlayer+"").addChildTo(this);
    this.lifeLabel.x = SCREEN_WIDTH - 30;
    this.lifeLabel.y = this.gridY.span(1);
    this.lifeLabel.fill = 'white';

    // スコアラベル
    this.scoreLabel = Label('0').addChildTo(this);
    this.scoreLabel.x = this.gridX.center();
    this.scoreLabel.y = this.gridY.span(1);
    this.scoreLabel.fill = 'white';

    this.score = 0;
    this.time = 0;

    // 背景色を指定
    this.backgroundColor = '#444';

    // プレイヤー
    this.spritePlayer = Sprite('tomapiko').addChildTo(this);
    this.spritePlayer.x = this.gridX.center();
    this.spritePlayer.y = this.gridY.center();
    this.spritePlayer.direction = KEY_LEFT;
    this.spritePlayer.update = (e) => {
      let newX = Math.round(e.pointer.x);
      let newY = Math.round(e.pointer.y);
      this.spritePlayer.x = newX;
      this.spritePlayer.y = newY;
      const key = getPushedKey(e.keyboard);
      if (key != KEY_NO_PUSHED) {
        shootBullet(this, getPushedKey(e.keyboard), {x:newX, y:newY});
        if (key == KEY_LEFT  && this.spritePlayer.direction == KEY_RIGHT ||
            key == KEY_RIGHT && this.spritePlayer.direction == KEY_LEFT) {
          this.spritePlayer.scaleX *= -1; // 画像を反転
          this.spritePlayer.direction = key;
        }
      }
      // 各敵との当たり判定
      for (enemy of this.enemies) {
        if (this.spritePlayer.hitTestElement(enemy)) {
          enemy.remove();
          this.enemies.delete(enemy);
          if (this.remainingLifeOfPlayer <= 0) {
            // game over ...
            let gameoverLabel = Label("GAME OVER").addChildTo(this);
            gameoverLabel.x = this.gridX.center(); // x 座標
            gameoverLabel.y = this.gridY.center(); // y 座標
            gameoverLabel.fill = 'white'; // 塗りつぶし色
          } else {
            this.remainingLifeOfPlayer -= 1;
            this.lifeLabel.text = this.remainingLifeOfPlayer+"";
          }
        }
      }
    };
    // 敵の集合
    this.enemies = new Set();

    this.countFrame = 0;
    this.numEnemy = 0;
  },

  update: function(app) {
    this.time += app.deltaTime;

    // 一定フレームごとに敵を生成
    if (this.countFrame % 50 == 0) {
      let enemy = Enemy(this);
      this.enemies.add(enemy);
    }    
    this.countFrame ++;
  },

  updateScore: function(point) {
    this.score += point;
    this.scoreLabel.text = this.score+"";
  }
});



// メイン処理
phina.main(function() {
  // アプリケーション生成
  var app = GameApp({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    assets: ASSETS,
    startLabel: 'main', // メインシーンから開始する
  });
  // アプリケーション実行
  app.run();
});
