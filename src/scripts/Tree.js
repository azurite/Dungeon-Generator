var Node = function(value) {
	this.value = value;
	this.lchild = undefined;
	this.rchild = undefined;
}

Node.prototype.children = function() {
  return [this.lchild, this.rchild];
}

Node.prototype.toString = function() {
  var left = this.lchild === undefined ? "undefined" : this.lchild.value;
  var  right = this.rchild === undefined ? "undefined" : this.rchild.value;
  return "{.value: " + this.value + ", lchild: " + left + ", rchild: " + right + " }";  
}

Node.prototype.toArray = function(target, i) {
  i = i === undefined ? 0 : i;
  target = target === undefined ? [] : target;

  if(this.lchild !== undefined) {
    this.lchild.toArray(target, 2*i+1);
  }

  target[i] = this.value;

  if(this.rchild !== undefined) {
    this.rchild.toArray(target, 2*i+2);
  }
  return target;
}

Node.prototype.forEach = function(callback) {
  if(this.lchild !== undefined) {
    this.lchild.forEach(callback);
  }

  callback(this.value, this.lchild, this.rchild, this);

  if(this.rchild !== undefined) {
    this.rchild.forEach(callback);
  }
}

Node.prototype.map = function(callback) {
  var newValue = callback(this.value, this.lchild, this.rchild, this);
  var root = new Node(newValue);
  if(this.lchild !== undefined && this.rchild !== undefined) {
    root.lchild = this.lchild.map(callback);
    root.rchild = this.rchild.map(callback);
  }
  return root;
}
