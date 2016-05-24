/*
var Room = function(c) {
	if(Helper.min(c.width, c.height) / Helper.max(c.width, c.height) < 0.45) {
		if(Helper.max(c.width, c.height) === c.width) {
			this.width = Math.floor((c.width - 1) / 3);
			this.height = Helper.random(c.height * 0.67, c.height - 1);
			this.x = c.x + Helper.random(this.width / 2, this.width - 1);
			this.y = c.y + Helper.random(0, c.height - this.height - 1);
		}
		else {
			//c.height is bigger
			this.height = Math.floor((c.height - 1) / 3);
			this.width = Helper.random(c.width * 0.67, c.width - 1);
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
*/

var Room = function(c) {
	if(Helper.min(c.width, c.height) / Helper.max(c.width, c.height) < 0.45) {
		if(Helper.max(c.width, c.height) === c.width) {
			this.height = Helper.random(c.height * 0.5, c.height);
			this.y = c.y + Helper.random(0, c.height - this.height);
			this.width = Math.ceil(this.height / 0.45);
			this.x = c.x + Math.floor((c.width / 2) - (this.width / 2));
		}
		else {
			//c.height is bigger
			this.width = Helper.random(c.width * 0.5, c.width);
			this.x = c.x + Helper.random(0, c.width - this.width);
			this.height = Math.ceil(this.width / 0.45);
			this.y = c.y + Math.floor((c.height / 2) - (this.height / 2));
		}
	}
	else {
		this.width = Helper.random(c.width * 0.5, c.width - 1);
		this.height = Helper.random(c.height * 0.5, c.height - 1);
		this.x = c.x + Helper.random(0, (c.width - 1) - this.width);
		this.y = c.y + Helper.random(0, (c.height - 1) - this.height);
	}
}
