var Map = function(rows, cols, entities) {
	this.floor = entities.floor;
	this.wall = entities.wall;
	this.terrain = (function(wall) {
		var map = [];
		for(var y = 0; y < rows; y++) {
			var row = [];
			for(var x = 0; x < cols; x++) {
				row.push(wall);
			}
			map.push(row);
		}
		return map;
	}(this.wall));
}

Map.prototype.drawLine = function(p1, p2) {
	if(p1.isHorizontalTo(p2)) {
		//line is horizonal
		var bigger = p1.x > p2.x ? p1.x : p2.x;
		var smaller = p1.x < p2.x ? p1.x : p2.x;
		for(var x = smaller; x <= bigger; x++) {
			this.terrain[p1.y][x] = this.floor;
		} 
	}
	else if(p1.isVerticalTo(p2)) {
		//line is vertical
		var bigger = p1.y > p2.y ? p1.y : p2.y;
		var smaller = p1.y < p2.y ? p1.y : p2.y;
		for(var y = smaller; y <= bigger; y++) {
			this.terrain[y][p1.x] = this.floor;
		}
	}
	else if(p1.equals(p2)) {
		//just draw a point
		this.terrain[p1.y][p1.x] = this.floor;
	}
}

Map.prototype.drawRoom = function(room) {
	if(!(room instanceof Room)) {
		throw new TypeError("Map.drawRoom() argument must be Room");
	}
	else {
		for(var y = room.y; y < (room.y + room.height); y++) {
			for(var x = room.x; x < (room.x + room.width); x++) {
				//console.log(this.terrain[y][x]);
				this.terrain[y][x] = this.floor;
			}
		}
	}
}