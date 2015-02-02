var level = new Level();
var player = new Player();

var TILE_SIZE = 32;
var WIDTH = 640, HEIGHT = 480;
var GRAVITY = 960;

game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, "game", GameState);