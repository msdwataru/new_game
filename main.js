// phina.js をグローバル領域に展開
phina.globalize();

const SCREEN_WIDTH  = 640;
const SCREEN_HEIGHT = 480;

const ASSETS = {
  image: {
    'tomapiko': 'https://rawgit.com/phi-jp/phina.js/develop/assets/images/tomapiko.png',
    'joushi': 'https://xn--p8j0cy86mjmh.jp/wp-content/uploads/2018/10/leader_ibaru.pngls',
  }
};

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


/*    this.shapeGroup = CanvasElement().addChildTo(this);
    (12).times(function() {
      var enemy = StarShape({}).addChildTo(this.shapeGroup);

      enemy.x = Random.randint(0,SCREEN_WIDTH);
      enemy.y = Random.randint(0,SCREEN_HEIGHT);
      }
    }, this);
*/

    var star = StarShape().addChildTo(this);
    star.x = Random.randint(0,SCREEN_WIDTH);
    star.y = Random.randint(0,SCREEN_HEIGHT);

    star.vx = Random.randint(1,10);
    star.vy = Random.randint(1,10);

    star.setInteractive(true);
    star.onpointend = function() {
      this.remove();
    }
    star.update = function() {
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

    // 背景色を指定
    this.backgroundColor = '#444';
    // ラベルを生成
    this.label = Label('Hello, phina.js!').addChildTo(this);
    this.label.x = this.gridX.center(); // x 座標
    this.label.y = this.gridY.center(); // y 座標
    this.label.fill = 'white'; // 塗りつぶし色
    // キャラクタ
    this.spritePlayer = Sprite('tomapiko').addChildTo(this);
    this.spritePlayer.x = this.gridX.center();
    this.spritePlayer.y = this.gridY.center();
    this.spritePlayer.update = (e) => {
      this.spritePlayer.x = Math.round(e.pointer.x);
      this.spritePlayer.y = Math.round(e.pointer.y);
    };
    this.score = 0;
    this.time = 0;
  },

  update: function(app) {
    this.time += app.deltaTime;
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
