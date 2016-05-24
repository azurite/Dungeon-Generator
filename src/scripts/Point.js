var Point = function(x, y) {
	this.x = x;
	this.y = y;
}

Point.prototype.equals = function(refp) {
	if(!(refp instanceof Point)) {
		throw new TypeError("Point.equals() argument must be a Point");
	}
	else {
		return this.x === refp.x && this.y === refp.y;
	}
}

Point.prototype.isVerticalTo = function(refp) {
	if(!(refp instanceof Point)) {
		throw new TypeError("Point.equals() argument must be a Point");
	}
	else {
		return this.x === refp.x && this.y !== refp.y;
	}
}

Point.prototype.isHorizontalTo = function(refp) {
	if(!(refp instanceof Point)) {
		throw new TypeError("Point.equals() argument must be a Point");
	}
	else {
		return this.y === refp.y && this.x !== refp.x;
	}
}