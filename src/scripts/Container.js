var Container = function(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.center = new Point(
			((width % 2 !== 0 ? Math.floor(width/2) : (width/2) - 1) + x),
			((height % 2 !== 0 ? Math.floor(height/2) : (height/2) - 1) + y)
		);
}

Container.prototype.split = function(maxR) {
	maxR = maxR || 0.45;
	var c1, c2;
	if(Helper.random(0,1) === 0) {
		//split at x axis
			c1 = new Container(
				this.x, 
				this.y, 
				Helper.random(this.width * maxR, (this.width - 1) * (1 - maxR)), 
				this.height
			);
			c2 = new Container(
				this.x + c1.width, 
				this.y, 
				this.width - c1.width, 
				this.height
			);
		return [c1, c2];
	}
	else {
		//split at y axis
			c1 = new Container(
				this.x,
				this.y,
				this.width,
				Helper.random(this.height * maxR, (this.height - 1) * (1 - maxR))
			);
			c2 = new Container(
				this.x,
				this.y + c1.height,
				this.width,
				this.height - c1.height
			);
		return [c1, c2];
	}
}
