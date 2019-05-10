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

let shootBullet = (scene, direction, initPos) => {
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
  bullet.update = () => {
    bullet.moveBy(dx*BULLET_SPEED, dy*BULLET_SPEED);
    if (bullet.updatedCount >= 60) {
      bullet.remove();
    } else {
      bullet.updatedCount += 1;
    }
  };
};

// 敵クラス
phina.define("Enemy", {
  init: function(scene) {

    //this.spriteEnemy = StarShape().addChildTo(scene);
    this.spriteEnemy = Label({
      text: "仕事",
      fill: "white",
      stroke: "blue",
      fontFamily:"'Monaco','Consolas','MS 明朝'",
      strokeWidth: 10,
      shadow: "black",
      shadowBlur: 100,
      fontSize: 32,
    }).addChildTo(scene);
    this.spriteEnemy.x = Random.randint(0,SCREEN_WIDTH);
    this.spriteEnemy.y = Random.randint(0,SCREEN_HEIGHT);
    this.spriteEnemy.vx = Random.randint(1, 10);
    this.spriteEnemy.vy = Random.randint(1, 10);

    this.spriteEnemy.update = () => {
      this.spriteEnemy.x += this.spriteEnemy.vx
      this.spriteEnemy.y += this.spriteEnemy.vy

      if (this.spriteEnemy.left < 0) {
        this.spriteEnemy.left = 0;
        this.spriteEnemy.vx *= -1;
      }
      else if (this.spriteEnemy.right > SCREEN_WIDTH) {
        this.spriteEnemy.right = SCREEN_WIDTH;
        this.spriteEnemy.vx *= -1;
      }
      if (this.spriteEnemy.bottom < this.spriteEnemy.height) {
        this.spriteEnemy.bottom = this.spriteEnemy.height;
        this.spriteEnemy.vy *= -1;
      }
      else if (this.spriteEnemy.top > SCREEN_HEIGHT-this.spriteEnemy.height) {
        this.spriteEnemy.top = SCREEN_HEIGHT-this.spriteEnemy.height;
        this.spriteEnemy.vy *= -1;
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

    // スコアラベル
    this.scoreLabel = Label('0').addChildTo(this);
    this.scoreLabel.x = this.gridX.center();
    this.scoreLabel.y = this.gridY.span(1);
    this.scoreLabel.fill = 'white';

    this.score = 0;
    this.time = 0;

    // 背景色を指定
    this.backgroundColor = '#444';
    // ラベルを生成
    this.label = Label('Hello, phina.js!').addChildTo(this);
    this.label.x = this.gridX.center(); // x 座標
    this.label.y = this.gridY.center(); // y 座標
    this.label.fill = 'white'; // 塗りつぶし色
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
      // 当たり判定で消える
      if (this.spritePlayer.hitTestElement(this.spriteEnemy2)) {
        //this.spriteEnemy.backgroundColor = "red";
        this.spriteEnemy2.remove();
      }
    };
    // 敵2
    this.spriteEnemy2 = Label({
      text: "仕事",
      fill: "white",
      stroke: "blue",
      fontFamily:"'Monaco','Consolas','MS 明朝'",
      strokeWidth: 10,
      shadow: "black",
      shadowBlur: 100,
      fontSize: 32,

      //backgroundColor: "blue",
      x: 200,
      y: 200,

    }).addChildTo(this);

    this.countFrame = 0;
    this.numEnemy = 0;
    
  },

  update: function(app) {
    this.time += app.deltaTime;

    // 一定フレームごとに敵を生成
    if (this.countFrame % 50 == 0) {
      let enemy = Enemy(this);
    }    
    this.countFrame ++;
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
