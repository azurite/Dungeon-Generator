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
	growTree: function(container, iter) {
		var root = new Node(container);
		var subc = container.split();
		if(iter != 0) {
			root.lchild = Dungeon.growTree(subc[0], iter - 1);
			root.rchild = Dungeon.growTree(subc[1], iter - 1);
		}
		return root;
	},
	itemPositionIsUnique: function(base, next) {
		for(var i in base) {
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
		var e_max = Helper.random(0,1);
		for(var i = 0; i < e_max; i++) {
			do {
				var item = new Entity(room, type);
			} while(!Dungeon.itemPositionIsUnique(list, item));
			list.push(item);
		}
		return list;
	},
	createBoss : function(list, room) {
		do {
			var boss = new Boss(room);
		} while(!Dungeon.bossPositionIsUnique(list, boss));
		list.push(boss);
		return list;
	},
	createDungeon: function(args) {
		if(args.entities.wall === undefined || args.entities.floor === undefined) {
			throw new Error("Dungeon.createDungeon() entities object must at least hold 'wall' and 'floor' properties");
		}

		var root_container = new Container(1,1, args.width - 2, args.height - 2);
		var containers = Dungeon.growTree(root_container, args.iterations).toArray();
		var room_template = containers.slice(containers.length / 2);
		var corridors = [];
		var rooms = [];
		var entities = [];

		for(var cor = 1; cor < containers.length; cor += 2) {
			corridors.push({ start: containers[cor].center, end: containers[cor+1].center });
		}

		for(var ri = 0; ri < room_template.length; ri++) {
			var room = new Room(room_template[ri]);
			rooms.push(room);
		}

		if(args.entities.player !== undefined) {
			var player = new Entity(rooms[Helper.random(0, rooms.length-1)], "player");
			entities.push(player);
		}

		if(args.entities.nextlvl !== undefined) {
			var exit = new Entity(rooms[0], "nextlvl");
			entities.push(exit);
		}

		if(args.entities.weapon !== undefined) {
			var weapon = new Entity(rooms[rooms.length - 1], "weapon");
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
			Dungeon.createBoss(entities, rooms[Helper.random(0, rooms.length - 1)]);
		}

		var map_template = new Map(
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
