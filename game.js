var WIDTH = 728, HEIGHT = 480;

var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, "game",
{
	preload: function()
	{
		game.load.image("background", "background.png");
	},
	
	create: function()
	{
		game.add.sprite(0, 0, "background");
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