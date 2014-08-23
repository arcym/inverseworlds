var WIDTH = 704, HEIGHT = 480;

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
		
		var level = game.add.tilemap("level", 32, 32);
		level.addTilesetImage("tiles", "tiles");
		level.createLayer("FirstLayer").resizeWorld();
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