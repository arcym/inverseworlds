var WIDTH = 640, HEIGHT = 480;

var level, layer, player, stars, cursors, overhead, score = 0;

var jumpstate = {
	height: 0,
	amount: 2
};

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
		game.physics.arcade.gravity.y = 800;
		
		game.stage.backgroundColor = "#787878";
		
		level = game.add.tilemap("level");
		level.addTilesetImage("tiles", "tiles");
		level.setCollision(1);
		
		layer = level.createLayer("FirstLayer");
		layer.resizeWorld();
		
		player = game.add.sprite(32*3, 32*(level.height - 5), "player");
		
		game.physics.enable(player);
		player.body.linearDamping = 1;
		player.body.collideWorldBounds = true;
		
		game.camera.follow(player);
		//game.camera.y += 32*25;
		
		stars = game.add.group();
		stars.enableBody = true;
		for(var i = 0; i < 60; i += 2)
		{
			var star = stars.create(i * 32, 32*(level.height - 8), "star");
			star.body.gravity.y = 1;
			star.body.bounce.y = 0.7 + Math.random() * 0.2;
		}
		
		overhead = game.add.text(16, 16, "0", {fontSize: "32px", fill: "#000"});
		overhead.fixedToCamera = true;
		
		cursors = game.input.keyboard.createCursorKeys();
		jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.UP);
		jumpButton.onDown.add(function()
		{
			if(jumpstate.amount > 0)
			{
				jumpstate.amount -= 1;
				player.body.velocity.y = 500 * -1;
			}
		});
	},
	
	update: function()
	{
		game.physics.arcade.collide(player, layer);
		game.physics.arcade.collide(stars, layer);
		game.physics.arcade.overlap(player, stars, function(player, star)
		{
			star.kill();
			score += 10;
		});
		
		player.body.velocity.x = 0;
		if(cursors.left.isDown)
			player.body.velocity.x = -150;
		else if(cursors.right.isDown)
			player.body.velocity.x = 150;
		
		if(player.body.onFloor())
			jumpstate.amount = 2;
		
		overhead.text = player.body.velocity.y;
	}
});