var WIDTH = 640, HEIGHT = 480;

var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, "game",
{
	preload: function()
	{
		game.load.tilemap("level", "level.json", null, Phaser.Tilemap.TILED_JSON);
		game.load.image("tiles", "tiles.png");
	},
	
	create: function()
	{
		game.stage.backgroundColor = "#787878";
		
		level = game.add.tilemap("level", 32, 32);
		level.addTilesetImage("tiles", "tiles");
		level.createLayer("FirstLayer").resizeWorld();
		
		game.camera.y += 32*25;
	},
	
	update: function()
	{
		//?!
	},
	
	render: function()
	{
		//?!
	}
});