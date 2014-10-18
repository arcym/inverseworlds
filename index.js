var TILE_SIZE = 32;
var score = 0, maxscore = 0;
var title, title_goal = (HEIGHT/3);

var level = new Level();
var player = new Player();

var WIDTH = 640, HEIGHT = 480, GRAVITY = 960;

game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, "game", GameState);