Player = function()
{
	this.sprite = null;
	this.cursors = null;
	
	this.jump =
	{
		height: 0,
		again: true
	};	
}

Player.prototype.preload = function()
{
	game.load.image("images/player.png", "images/player.png");
}

Player.prototype.create = function()
{
	this.sprite = game.add.sprite(TILE_SIZE * 4.5, TILE_SIZE * 40, "images/player.png");
	
	game.physics.enable(this.sprite);
	game.camera.follow(this.sprite);
	
	this.sprite.body.collideWorldBounds = true;
	
	this.cursors = game.input.keyboard.createCursorKeys();
}

Player.prototype.update = function()
{
	if(this.cursors.left.isDown)
	{
		this.sprite.body.velocity.x = -150;
	}
	else if(this.cursors.right.isDown)
	{
		this.sprite.body.velocity.x = 150;
	}
	else
	{
		this.sprite.body.velocity.x = 0;
	}
	
	if(this.cursors.up.isDown && this.jump.height < 8)
	{
		this.sprite.body.allowGravity = false;
		this.sprite.body.velocity.y = 320 * -1;
		
		this.jump.height += 1;
	}
	else
	{
		this.sprite.body.allowGravity = true;
		this.cursors.up.isDown = false;
		
		if(this.jump.again)
		{
			this.jump.height = 0;
			this.jump.again = false;
		}
	}
	
	if(this.sprite.body.onFloor())
	{
		this.jump.height = 0;
		this.jump.again = true;
	}
}