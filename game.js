var WIDTH = 640, HEIGHT = 480;

var level, layer, player, cursors;

var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, "game",
{
	preload: function()
	{
		game.load.tilemap("level", "level.json", null, Phaser.Tilemap.TILED_JSON);
		game.load.image("tiles", "tiles.png");
		game.load.image("player", "player.png");
	},
	
	create: function()
	{
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.arcade.gravity.y = 250;
		
		game.stage.backgroundColor = "#787878";
		
		level = game.add.tilemap("level");
		level.addTilesetImage("tiles", "tiles");
		level.setCollision(1);
		
		layer = level.createLayer("FirstLayer");
		layer.resizeWorld();
		
		player = game.add.sprite(32*4, 32*(level.height - 5), "player");
		
		game.physics.enable(player);
		player.body.bounce.y = 0.2;
		player.body.linearDamping = 1;
		player.body.collideWorldBounds = true;
		
		//game.camera.follow(player);
		game.camera.y += 32*25;
		
		cursors = game.input.keyboard.createCursorKeys();
	},
	
	update: function()
	{
		game.physics.arcade.collide(player, layer);
		
		player.body.velocity.x = 0;
		
		if(cursors.up.isDown)
		{
			if(player.body.onFloor())
			{
				player.body.velocity.y = -200;
			}
		}
		
		if(cursors.left.isDown)
		{
			player.body.velocity.x = -150;
		}
		else if(cursors.right.isDown)
		{
			player.body.velocity.x = 150;
		}
	},
	
	render: function()
	{
		//game.debug.bodyInfo(player, 32, 320);
	}
});