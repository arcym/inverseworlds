var WIDTH = 640, HEIGHT = 480;

var level, layer, player, stars, cursors;

var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, "game",
{
	preload: function()
	{
		game.load.tilemap("level", "level.json", null, Phaser.Tilemap.TILED_JSON);
		game.load.image("tiles", "tiles.png");
		game.load.image("player", "player.png");
		game.load.image("star", "star.png");
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
		
		player = game.add.sprite(32*3, 32*(level.height - 5), "player");
		
		game.physics.enable(player);
		player.body.bounce.y = 0.2;
		player.body.linearDamping = 1;
		player.body.collideWorldBounds = true;
		
		game.camera.follow(player);
		//game.camera.y += 32*25;
		
		cursors = game.input.keyboard.createCursorKeys();
		
		stars = game.add.group();
		stars.enableBody = true;
		for(var i = 0; i < 60; i += 2)
		{
			var star = stars.create(i * 32, 32*(level.height - 8), "star");
			star.body.gravity.y = 6;
			star.body.bounce.y = 0.7 + Math.random() * 0.2;
		}
	},
	
	update: function()
	{
		game.physics.arcade.collide(player, layer);
		game.physics.arcade.collide(stars, layer);
		
		player.body.velocity.x = 0;
		
		if(cursors.left.isDown)
		{
			player.body.velocity.x = -150;
		}
		else if(cursors.right.isDown)
		{
			player.body.velocity.x = 150;
		}
		
		if(cursors.up.isDown)
		{
			if(player.body.onFloor())
			{
				player.body.velocity.y = -200;
			}
		}
	},
	
	render: function()
	{
		//game.debug.bodyInfo(player, 32, 320);
	}
});