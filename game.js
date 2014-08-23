var WIDTH = 720+20, HEIGHT = 480+20;

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