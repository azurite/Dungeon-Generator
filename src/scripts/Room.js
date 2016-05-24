var Room = function(c) {
	if(Helper.min(c.width, c.height) / Helper.max(c.width, c.height) < 0.45) {
		if(Helper.max(c.width, c.height) === c.width) {
			this.width = Math.floor((c.width - 1) / 3);
			this.height = Helper.random(c.height * 0.66, c.height - 1);
			this.x = c.x + Helper.random(this.width / 2, this.width - 1);
			this.y = c.y + Helper.random(0, c.height - this.height - 1);
		}
		else {
			//c.height is bigger
			this.height = Math.floor((c.height - 1) / 3);
			this.width = Helper.random(c.width * 0.66, c.width - 1);
			this.y = c.y + Helper.random(this.height / 2, this.height - 1);
			this.x = c.x + Helper.random(0, c.width - this.width - 1);
		}
	}
	else {
		this.width = Helper.random(c.width * 0.5, c.width - 1);
		this.height = Helper.random(c.height * 0.5, c.height - 1);
		this.x = c.x + Helper.random(0, (c.width - 1) - this.width);
		this.y = c.y + Helper.random(0, (c.height - 1) - this.height);
	}
}
