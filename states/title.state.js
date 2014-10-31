var TitleState =
{
	title: null,
	title_goal: 0,
	
	preload: function()
	{
		game.load.tilemap("level", "levels/title.level.json", null, Phaser.Tilemap.TILED_JSON);
		
		game.load.image("images/tiles.white.png", "images/tiles.white.png");
		game.load.image("images/tiles.black.png", "images/tiles.black.png");
		game.load.image("images/player.png", "images/player.png");
		game.load.image("images/portal.png", "images/portal.png");
	},
	
	create: function()
	{
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.arcade.gravity.y = 800;
		game.physics.arcade.TILE_BIAS = 27;
		
		level = game.add.tilemap("level");
		level.addTilesetImage("tileset", "images/tiles.white.png");
		level.setCollision(1, true);
		tiles = level.createLayer("tiles");
		tiles.resizeWorld();
		
		player = game.add.sprite(WIDTH/2, HEIGHT/2, "images/player.png");
		game.physics.enable(player);
		player.body.collideWorldBounds = true;
		game.camera.follow(player);
		
		title = game.add.text(WIDTH/2, HEIGHT/3, "0", {fill: "#FFC90E"});
		title.font = "goldfish";
		title.fontSize = "32px";
		title.fontWeight = "bold";
		title.strokeThickness = 5;
		title.text = "Inverse Worlds";
		title.anchor.x = 0.5;
		title.anchor.y = 0.5;
		title.alpha = 0;
		
		this.title_goal = HEIGHT / 3;
		
		cursors = game.input.keyboard.createCursorKeys();
	},
	
	update: function()
	{
		title.y = title.y + (0.05 * (title_goal - title.y));
		if(title.y > title_goal - 1) {title_goal = (HEIGHT/3) - 50;}
		if(title.y < title_goal + 1) {title_goal = (HEIGHT/3) - 30;}
		if(title.alpha < 1) {title.alpha += 0.05;}
		
		game.physics.arcade.collide(player, tiles);
		
		if(cursors.left.isDown)
			player.body.velocity.x = -150;
		else if(cursors.right.isDown)
			player.body.velocity.x = 150;
		else player.body.velocity.x = 0;
		
		if(cursors.up.isDown && jumpstate.height < 8)
		{
			player.body.allowGravity = false;
			player.body.velocity.y = 320 * -1;
			
			jumpstate.height += 1;
		}
		else
		{
			player.body.allowGravity = true;
			cursors.up.isDown = false;
			
			if(jumpstate.again)
			{
				jumpstate.height = 0;
				jumpstate.again = false;
			}
		}
		
		if(player.body.onFloor())
		{
			jumpstate.height = 0;
			jumpstate.again = true;
		}
	}
}