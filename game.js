var WIDTH = 640, HEIGHT = 480;
var ROOM_WIDTH = 20, ROOM_HEIGHT = 15;
var TILE_SIZE = 32;

var level, tiles, player, stars, cursors, overhead, victory, score = 0, maxscore = 0, portals;

var jumpstate = {
	height: 0,
	again: true
};

var toggle = false;

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
		
		portals = game.add.group();
		portals.enableBody = true;
		level.createFromObjects("Portals", 3, "portal", 0, true, false, portals);
		portals.forEach(function(portal)
		{
			portal.body.allowGravity = false;
			portal.anchor.x = 0.5;
			portal.anchor.y = 0.5;
			portal.x += 16;
			portal.y += 16;
		});
		
		player = game.add.sprite(TILE_SIZE*4, TILE_SIZE*(level.height-3), "player");
		game.physics.enable(player);
		player.body.collideWorldBounds = true;
		
		game.camera.follow(player);
		
		stars = game.add.group();
		stars.enableBody = true;
		level.createFromObjects("Stars", 4, "star", 0, true, false, stars);
		stars.forEach(function(star)
		{
			star.body.allowGravity = false;
			star.anchor.x = 0.5;
			star.anchor.y = 0.5;
			star.x += 16;
			star.y += 16;
			star.angle -= Math.random() * 180;
		});
		maxscore = stars.length;
		
		overhead = game.add.text(16, 16, "0", {fontSize: "32px", fill: "#FFC90E"});
		overhead.fixedToCamera = true;
		overhead.strokeThickness = 3;
		
		cursors = game.input.keyboard.createCursorKeys();
	},
	
	update: function()
	{
		game.physics.arcade.collide(player, tiles);
		
		portals.forEachAlive(function(portal)
		{
			portal.angle += 7;
		});
		
		stars.forEachAlive(function(star)
		{
			star.angle -= 1;
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
		
		game.physics.arcade.overlap(player, stars, function(player, star)
		{
			star.kill();
			score += 1;
		});
		
		game.physics.arcade.overlap(player, portals, function(player, portal)
		{
			player.body.x = portal.tx;
			player.body.y = portal.ty;
			console.log(portal.tx, portal.ty);
			
			toggle = !toggle;
			
			level.setCollision(1, !toggle);
			level.setCollision(2, toggle);
		});
		
		overhead.text = ((score / maxscore) * 100).toFixed(0) + "% completed";
		if(score == maxscore) {overhead.text = "You win!!";}
	}
});