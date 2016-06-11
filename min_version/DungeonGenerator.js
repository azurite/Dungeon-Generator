var Dungeon = {
	LEVEL: 1,
	attackVariance: 5,
	weaponTypes: [
		{
			weaponName: "Wooden Stick",
			damage: 4,
			xp: 0
		},
		{
			weaponName: "Brass Knuckles",
			damage: 7,
			xp: 5
		},
		{
			weaponName: "Serrated Dagger",
			damage: 12,
			xp: 5
		},
		{
			weaponName: "Katana",
			damage: 16,
			xp: 5
		},
		{
			weaponName: "Reaper's scythe",
			damage: 22,
			xp: 5
		},
		{
			weaponName: "Large Trout",
			damage: 30,
			xp: 5
		}
	],
	Helper: {
		random: function(min, max) {
			//random value between [min,max]
			return Math.round(Math.random() * (max-min) + min);
		},
		min: function(a, b) {
			return a < b ? a : b;
		},
		max: function(a, b) {
			return a > b ? a : b;
		}
	},
	Point: function(x, y) {
		this.x = x;
		this.y = y;
	},
	Node: function(value) {
		this.value = value;
		this.lchild = undefined;
		this.rchild = undefined;
	},
	Container: function(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.center = new Dungeon.Point(
			((width % 2 !== 0 ? Math.floor(width/2) : (width/2) - 1) + x),
			((height % 2 !== 0 ? Math.floor(height/2) : (height/2) - 1) + y)
		);
	},
	Map: function(rows, cols, lists, entityIds) {
		this.height = rows;
		this.width = cols;
		this.floor = entityIds.floor;
		this.wall = entityIds.wall;
		this.enemy = entityIds.enemy;
		this.health = entityIds.health;
		this.weapon = entityIds.weapon;
		this.nextlvl = entityIds.nextlvl;
		this.player = entityIds.player;
		this.boss = entityIds.boss;

		this.roomlist = lists.roomlist;
		this.corridorlist = lists.corridorlist;
		this.entitylist = lists.entitylist;
		
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
	},
	Room: function(c) {
		if(Dungeon.Helper.min(c.width, c.height) / Dungeon.Helper.max(c.width, c.height) < 0.45) {
			if(Dungeon.Helper.max(c.width, c.height) === c.width) {
				this.height = Dungeon.Helper.random(c.height * 0.5, c.height);
				this.y = c.y + Dungeon.Helper.random(0, c.height - this.height);
				this.width = Math.ceil(this.height / 0.45);
				this.x = c.x + Math.floor((c.width / 2) - (this.width / 2));
			}
			else {
				//c.height is bigger
				this.width = Dungeon.Helper.random(c.width * 0.5, c.width);
				this.x = c.x + Dungeon.Helper.random(0, c.width - this.width);
				this.height = Math.ceil(this.width / 0.45);
				this.y = c.y + Math.floor((c.height / 2) - (this.height / 2));
			}
		}
		else {
			this.width = Dungeon.Helper.random(c.width * 0.5, c.width - 2);
			this.height = Dungeon.Helper.random(c.height * 0.5, c.height - 2);
			this.x = c.x + Dungeon.Helper.random(1, (c.width - 2) - this.width);
			this.y = c.y + Dungeon.Helper.random(1, (c.height - 2) - this.height);
		}
	},
	Entity: function(room, type) {
		this.x = Dungeon.Helper.random(room.x, room.x + room.width - 1);
		this.y = Dungeon.Helper.random(room.y, room.y + room.height - 1);
		switch(type) {
			case "enemy":
				this.type = type;
				this.stats = {
					health: 5 + (Dungeon.LEVEL * 20),
					attack: 12 + (Dungeon.LEVEL * 5),
					xp: 10 + (Dungeon.LEVEL * 5)
				};
				break;
			case "health":
				this.type = type;
				this.stats = {
					heal: Dungeon.Helper.random(30,60) + (Dungeon.LEVEL * 5),
					xp: 2 + (Dungeon.LEVEL * 2) - 1
				};
				break;
			case "weapon":
				this.type = type;
				this.stats = Dungeon.weaponTypes[Dungeon.LEVEL];
				break;

			case "nextlvl":
				this.type = type;
				this.stats = null;
				break;
			case "player":
				this.type = type;
				this.stats = {
					health: 100,
					weapon: Dungeon.weaponTypes[0],
					xp: 0,
					level: 0,
					toNextLevel: 60 
				};
				break;
			default: console.error("new Entity() Invalid type name: ", type);
				break;
		}
	},
	Boss: function(room) {
		this.x = Dungeon.Helper.random(room.x, room.x + room.width - 2);
		this.y = Dungeon.Helper.random(room.y, room.y + room.height -2);
		this.width = 2;
		this.height = 2;
		this.type = "boss";
		this.stats = {
			health: 300,
			attack: 45,
			xp: 200
		};
	},
	growTree: function(container, iter) {
		var root = new Dungeon.Node(container);
		var subc = container.split();
		if(iter != 0) {
			root.lchild = Dungeon.growTree(subc[0], iter - 1);
			root.rchild = Dungeon.growTree(subc[1], iter - 1);
		}
		return root;
	},
	itemPositionIsUnique: function(base, next) {
		for(var i = 0; i < base.length; i++) {
			if(base[i].x === next.x && base[i].y === next.y) {
				return false;
			}
		}
		return true;
	},
	bossPositionIsUnique: function(base, boss) {
		for(var i = 0; i < base.length; i++) {
			if(boss.x === base[i].x && boss.y === base[i].y) {
				return false;
			}
			if((boss.x + boss.width - 1) === base[i].x && boss.y === base[i].y) {
				return false;
			}
			if(boss.x === base[i].x && (boss.y + boss.height - 1) === base[i].y) {
				return false;
			}
			if((boss.x + boss.width - 1) === base[i].x && (boss.y + boss.height - 1) === base[i].y) {
				return false;
			}
		}
		return true;
	},
	createEntities: function(list, room, type) {
		var e_max = Dungeon.Helper.random(0,1);
		for(var i = 0; i < e_max; i++) {
			do {
				var item = new Dungeon.Entity(room, type);
			} while(!Dungeon.itemPositionIsUnique(list, item));
			list.push(item);
		}
		return list;
	},
	createBoss : function(list, room) {
		do {
			var boss = new Dungeon.Boss(room);
		} while(!Dungeon.bossPositionIsUnique(list, boss));
		list.push(boss);
		return list;
	},
	createDungeon: function(args) {
		if(args.entities.wall === undefined || args.entities.floor === undefined) {
			throw new Error("Dungeon.createDungeon() entities object must at least hold 'wall' and 'floor' properties");
		}

		var root_container = new Dungeon.Container(1,1, args.width - 2, args.height - 2);
		var containers = Dungeon.growTree(root_container, args.iterations).toArray();
		var room_template = containers.slice(containers.length / 2);
		var corridors = [];
		var rooms = [];
		var entities = [];

		for(var cor = 1; cor < containers.length; cor += 2) {
			corridors.push({ start: containers[cor].center, end: containers[cor+1].center });
		}

		for(var ri = 0; ri < room_template.length; ri++) {
			var room = new Dungeon.Room(room_template[ri]);
			rooms.push(room);
		}

		if(args.entities.player !== undefined) {
			var player = new Dungeon.Entity(rooms[Dungeon.Helper.random(0, rooms.length-1)], "player");
			entities.push(player);
		}

		if(args.entities.nextlvl !== undefined) {
			var exit = new Dungeon.Entity(rooms[0], "nextlvl");
			entities.push(exit);
		}

		if(args.entities.weapon !== undefined) {
			var weapon = new Dungeon.Entity(rooms[rooms.length - 1], "weapon");
			entities.push(weapon);
		}
		
		if(args.entities.enemy !== undefined) {
			for(var ei = 0; ei < rooms.length; ei++) {
				Dungeon.createEntities(entities, rooms[ei], "enemy");
			}
		}

		if(args.entities.health !== undefined) {
			for(var hi = 0; hi < rooms.length; hi++) {
				Dungeon.createEntities(entities, rooms[hi], "health")
			}
		}

		if(args.entities.boss !== undefined) {
			Dungeon.createBoss(entities, rooms[Dungeon.Helper.random(0, rooms.length - 1)]);
		}

		var map_template = new Dungeon.Map(
				args.height,
				args.width,
				{
					roomlist: rooms,
					corridorlist: corridors,
					entitylist: entities
				},
				{
					wall: args.entities.wall,
					floor: args.entities.floor,
					enemy: args.entities.enemy !== undefined ? args.entities.enemy : null,
					health: args.entities.health !== undefined ? args.entities.health : null,
					weapon: args.entities.weapon !== undefined ? args.entities.weapon : null,
					nextlvl: args.entities.nextlvl !== undefined ? args.entities.nextlvl : null,
					player: args.entities.player !== undefined ? args.entities.player : null,
					boss: args.entities.boss !== undefined ? args.entities.boss : null
				}
			);

		for(var c_nr = 0; c_nr < corridors.length; c_nr++) {
			map_template.drawCorridor(corridors[c_nr].start, corridors[c_nr].end);
		}

		for(var room_nr = 0; room_nr < rooms.length; room_nr++) {
			map_template.drawRoom(rooms[room_nr]);
		}

		for(var ent_nr = 0; ent_nr < entities.length; ent_nr++) {
			map_template.drawEntity(entities[ent_nr]);
		}

		return map_template;
	},
	render: function(dungeonMap, target) {
		var map_table = document.createElement('table');
		var map_body = document.createElement('tbody');
		
		for(var i = 0; i < dungeonMap.terrain.length; i++) {
			var row = document.createElement('tr');

			for(var j = 0; j < dungeonMap.terrain[i].length; j++) {
				var cell = document.createElement('td');

				if(dungeonMap.terrain[i][j] === dungeonMap.wall) {
					cell.classList.add('wall');
				}
				if(dungeonMap.terrain[i][j] === dungeonMap.floor) {
					cell.classList.add('floor');
				}
				if(dungeonMap.terrain[i][j] === dungeonMap.enemy) {
					cell.classList.add('enemy');
				}
				if(dungeonMap.terrain[i][j] === dungeonMap.health) {
					cell.classList.add('health');
				}
				if(dungeonMap.terrain[i][j] === dungeonMap.weapon) {
					cell.classList.add('weapon');
				}
				if(dungeonMap.terrain[i][j] === dungeonMap.nextlvl) {
					cell.classList.add('nextlvl');
				}
				if(dungeonMap.terrain[i][j] === dungeonMap.player) {
					cell.classList.add('player');
				}
				if(dungeonMap.terrain[i][j] === dungeonMap.boss) {
					cell.classList.add('boss');
				}
				row.appendChild(cell);
			}
			map_body.appendChild(row);
		}
		map_table.appendChild(map_body);
		target.appendChild(map_table);
	}
};

Dungeon.Node.prototype.toArray = function(target, i) {
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
};

Dungeon.Container.prototype.split = function(maxR) {
	maxR = maxR || 0.45;
	var c1, c2;
	if(Dungeon.Helper.random(0,1) === 0) {
		//split at x axis
			c1 = new Dungeon.Container(
				this.x, 
				this.y, 
				Dungeon.Helper.random(this.width * maxR, this.width * (1 - maxR)), 
				this.height
			);
			c2 = new Dungeon.Container(
				this.x + c1.width, 
				this.y, 
				this.width - c1.width, 
				this.height
			);
		return [c1, c2];
	}
	else {
		//split at y axis
			c1 = new Dungeon.Container(
				this.x,
				this.y,
				this.width,
				Dungeon.Helper.random(this.height * maxR, this.height * (1 - maxR))
			);
			c2 = new Dungeon.Container(
				this.x,
				this.y + c1.height,
				this.width,
				this.height - c1.height
			);
		return [c1, c2];
	}
};

Dungeon.Point.prototype.equals = function(refp) {
	if(!(refp instanceof Dungeon.Point)) {
		throw new TypeError("Point.equals() argument must be a Point");
	}
	else {
		return this.x === refp.x && this.y === refp.y;
	}
};

Dungeon.Point.prototype.isVerticalTo = function(refp) {
	if(!(refp instanceof Dungeon.Point)) {
		throw new TypeError("Point.equals() argument must be a Point");
	}
	else {
		return this.x === refp.x && this.y !== refp.y;
	}
};

Dungeon.Point.prototype.isHorizontalTo = function(refp) {
	if(!(refp instanceof Dungeon.Point)) {
		throw new TypeError("Point.equals() argument must be a Point");
	}
	else {
		return this.y === refp.y && this.x !== refp.x;
	}
};

Dungeon.Map.prototype.drawEntity = function(entity) {
	if(entity instanceof Dungeon.Boss) {
		for(var y = entity.y; y < (entity.y + entity.height); y++) {
			for(var x = entity.x; x < (entity.x + entity.width); x++) {
				this.terrain[y][x] = this[entity.type];
			}
		}
	}
	else if(!(entity instanceof Dungeon.Entity)) {
		throw new TypeError("Map.drawEntity() argument must be Entity");
	}
	else {
		this.terrain[entity.y][entity.x] = this[entity.type];
	}
};

Dungeon.Map.prototype.drawCorridor = function(p1, p2) {
	if(!(p1 instanceof Dungeon.Point) || !(p2 instanceof Dungeon.Point)) {
		throw new TypeError("Map.drawCorridor() arguments must be from Point");
	}
	else {
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
};

Dungeon.Map.prototype.drawRoom = function(room) {
	if(!(room instanceof Dungeon.Room)) {
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
};