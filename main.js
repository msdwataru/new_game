// phina.js をグローバル領域に展開
phina.globalize();

const SCREEN_WIDTH  = 640;
const SCREEN_HEIGHT = 480;

const ASSETS = {
  image: {
    'tomapiko': 'https://rawgit.com/phi-jp/phina.js/develop/assets/images/tomapiko.png',
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
      // 当たり判定で消える
      if (this.spritePlayer.hitTestElement(this.spriteEnemy2)) {
        //this.spriteEnemy.backgroundColor = "red";
        this.spriteEnemy2.remove();
      }
    };
    // 敵
    this.spriteEnemy = Shape({
      backgroundColor: "blue",
      x: 100,
      y: 100,
      width: 30,
      height: 30,
    }).addChildTo(this)
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
    }).addChildTo(this)
  },
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
