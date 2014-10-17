var TILE_SIZE = 32;
var level, tiles, stars, cursors, overhead, victory, score = 0, maxscore = 0, portals;
var toggle = false;
var title, title_goal = (HEIGHT/3);

var player = new Player();
var WIDTH = 640, HEIGHT = 480;

var GameState = 
{
	preload: function()
	{
		player.preload();
		game.load.tilemap("level", "level.json", null, Phaser.Tilemap.TILED_JSON);
		
		game.load.image("images/tiles.white.png", "images/tiles.white.png");
		game.load.image("images/tiles.black.png", "images/tiles.black.png");
		game.load.image("images/portal.png", "images/portal.png");
		game.load.image("images/star.png", "images/star.png");
		
		game.load.audio("audio/portal.black2white.wav", "audio/portal.black2white.wav");
		game.load.audio("audio/portal.white2black.wav", "audio/portal.white2black.wav");
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
		
		portals = game.add.group();
		portals.enableBody = true;
		level.createFromObjects("portals", 3, "images/portal.png", 0, true, false, portals);
		portals.forEach(function(portal)
		{
			portal.body.allowGravity = false;
			portal.anchor.x = 0.5;
			portal.anchor.y = 0.5;
			portal.x += 16;
			portal.y += 16;
		});
		
		player.create();
		
		stars = game.add.group();
		stars.enableBody = true;
		level.createFromObjects("stars", 4, "images/star.png", 0, true, false, stars);
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
		
		/*b2w_sound = game.add.audio("portal.black2white", 0.25);
		w2b_sound = game.add.audio("portal.white2black", 0.25);
		for(var i = 1; i <= 8; i++)
		{
			sounds.push(game.add.audio("coin-" + i, 0.1));
		}*/
		
		overhead = game.add.text(14, 12, "0", {fill: "#FFC90E"});
		overhead.font = "goldfish";
		overhead.fontSize = "32px";
		overhead.fontWeight = "bold";
		overhead.strokeThickness = 5;
		overhead.fixedToCamera = true;
	},
	
	update: function()
	{
		game.physics.arcade.collide(player.sprite, tiles);
		
		player.update();
		
		portals.forEachAlive(function(portal)
		{
			portal.angle += 7;
		});
		
		stars.forEachAlive(function(star)
		{
			star.angle -= 1;
		});
		
		game.physics.arcade.overlap(player.sprite, stars, function(player, star)
		{
			star.kill();
			score += 1;
			//sounds[Math.floor(Math.random() * sounds.length)].play();
		});
		
		game.physics.arcade.overlap(player.sprite, portals, function(player, portal)
		{
			player.body.x = portal.tx;
			player.body.y = portal.ty;
			
			toggle = !toggle;
			
			if(toggle)
			{
				level.addTilesetImage("tileset", "images/tiles.black.png");
				//w2b_sound.play();
			}
			else
			{
				level.addTilesetImage("tileset", "images/tiles.white.png");
				//b2w_sound.play();
			}
			
			level.setCollision(1, !toggle);
			level.setCollision(2, toggle);
		});
		
		overhead.text = ((score / maxscore) * 100).toFixed(0) + "% completed";
		if(score == maxscore) {overhead.text = "You win!!";}
		
		if(game.input.keyboard.isDown(Phaser.Keyboard.ESC))
		{
			require("nw.gui").App.quit();
		}
	}
};

game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, "game", GameState);