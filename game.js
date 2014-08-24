var WIDTH = 640, HEIGHT = 480;
var ROOM_WIDTH = 20, ROOM_HEIGHT = 15;
var TILE_SIZE = 32;

var level, tiles, player, stars, cursors, overhead, score = 0, portals;

var jumpstate = {
	height: 0,
	again: true
};

var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, "game",
{
	preload: function()
	{
		game.load.tilemap("level", "level.json", null, Phaser.Tilemap.TILED_JSON);
		game.load.image("tiles", "tiles.png");
		game.load.image("player", "player.png");
		game.load.image("star", "star.png");
		game.load.image("portal", "portal.png");
	},
	
	create: function()
	{
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.arcade.gravity.y = 800;
		game.physics.arcade.TILE_BIAS = 27;
		
		game.stage.backgroundColor = "#787878";
		
		level = game.add.tilemap("level");
		level.addTilesetImage("tiles", "tiles");
		level.setCollision(1);
		
		tiles = level.createLayer("Tiles");
		tiles.resizeWorld();
		
		portals = game.add.group()
		level.createFromObjects("portals!", "Portals", "portal", null, null, null, portals);
		
		player = game.add.sprite(TILE_SIZE*3, TILE_SIZE*(level.height-3), "player");
		game.physics.enable(player);
		player.body.collideWorldBounds = true;
		
		game.camera.follow(player);
		
		/*stars = game.add.group();
		stars.enableBody = true;
		for(var i = 0; i < 60; i += 2)
		{
			var star = stars.create(i * TILE_SIZE, TILE_SIZE*(level.height - 8), "star");
			star.body.gravity.y = 1;
			star.body.bounce.y = 0.7 + Math.random() * 0.2;
		}*/
		
		overhead = game.add.text(16, 16, "0", {fontSize: "32px", fill: "#000"});
		overhead.fixedToCamera = true;
		
		cursors = game.input.keyboard.createCursorKeys();
	},
	
	update: function()
	{
		game.physics.arcade.collide(player, tiles);
		game.physics.arcade.collide(stars, tiles);
		game.physics.arcade.overlap(player, stars, function(player, star)
		{
			star.kill();
			score += 10;
		});
		
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
		
		overhead.text = jumpstate.height;
		overhead.text = player.body.velocity.y.toFixed(2);
		overhead.text = jumpstate.again;
	}
});