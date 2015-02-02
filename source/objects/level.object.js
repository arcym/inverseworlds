Level = function()
{
	this.tilemap = null;
	this.tiles = null;
	this.portals = null;
	this.stars = null;
	
	this.toggle = false;
}

Level.prototype.preload = function()
{
	game.load.tilemap("level.json", "levels/game.level.json", null, Phaser.Tilemap.TILED_JSON);
	
	game.load.image("images/tiles.white.png", "images/tiles.white.png");
	game.load.image("images/tiles.black.png", "images/tiles.black.png");
}

Level.prototype.create = function()
{
	this.tilemap = game.add.tilemap("level.json");
	this.tilemap.addTilesetImage("tileset", "images/tiles.white.png");
	this.tilemap.setCollision(1, true);	
	
	this.tiles = this.tilemap.createLayer("tiles");
	this.tiles.resizeWorld();
	
	this.portals = game.add.group();
	this.portals.enableBody = true;
	this.tilemap.createFromObjects("portals", 3, "images/portal.png", 0, true, false, this.portals);
	this.portals.forEach(function(portal)
	{
		portal.body.allowGravity = false;
		portal.anchor.x = 0.5;
		portal.anchor.y = 0.5;
		portal.x += 16;
		portal.y += 16;
	});
	
	this.stars = game.add.group();
	this.stars.enableBody = true;
	this.tilemap.createFromObjects("stars", 4, "images/star.png", 0, true, false, this.stars);
	this.stars.forEach(function(star)
	{
		star.body.allowGravity = false;
		star.anchor.x = 0.5;
		star.anchor.y = 0.5;
		star.x += 16;
		star.y += 16;
		star.angle -= Math.random() * 180;
	});
}

Level.prototype.update = function()
{
	this.portals.forEach(function(portal)
	{
		portal.angle += 7;
	});
	
	this.stars.forEachAlive(function(star)
	{
		star.angle -= 1;
	});
}

Level.prototype.toggleWorld = function()
{
	this.toggle = !this.toggle;
	
	this.tilemap.setCollision(1, !this.toggle);
	this.tilemap.setCollision(2, this.toggle);
		
	if(this.toggle)
	{
		this.tilemap.addTilesetImage("tileset", "images/tiles.black.png");
	}
	else
	{
		this.tilemap.addTilesetImage("tileset", "images/tiles.white.png");
	}
}