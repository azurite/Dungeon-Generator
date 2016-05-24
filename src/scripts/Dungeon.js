var Dungeon = {
	growTree: function(container, iter) {
		var root = new Node(container);
		var subc = container.split();
		if(iter != 0) {
			root.lchild = Dungeon.growTree(subc[0], iter - 1);
			root.rchild = Dungeon.growTree(subc[1], iter - 1);
		}
		return root;
	},
	createDungeon: function(obj) {
		var D_height = obj.height;
		var D_width = obj.width;
		var N_iterations = obj.iterations;
		var WALL = obj.entities.wall;
		var FLOOR = obj.entities.floor;

		var map_template = new Map(
				D_height,
				D_width,
				{
					wall: WALL,
					floor: FLOOR
				}
			);

		var root_container = new Container(1,1, D_width - 2, D_height - 2);
		var containers = Dungeon.growTree(root_container, N_iterations).toArray();
		var room_template = containers.slice(containers.length / 2);
		var rooms = [];

		for(var ci = 1; ci < containers.length; ci += 2) {
			map_template.drawLine(containers[ci].center, containers[ci+1].center);
		}

		for(var ri = 0; ri < room_template.length; ri++) {
			var room = new Room(room_template[ri]);
			rooms.push(room);
		}

		for(var room_nr = 0; room_nr < rooms.length; room_nr++) {
			map_template.drawRoom(rooms[room_nr]);
		}

		return map_template;
	},
	render: function(dungeonMap, target) {
			var maptable = document.createElement('table');
			var map_body = document.createElement('tbody');
			
			for(var i = 0; i < dungeonMap.terrain.length; i++) {
				var row = document.createElement('tr');

				for(var j = 0; j < dungeonMap.terrain[i].length; j++) {
					var cell = document.createElement('td');

					if(dungeonMap.terrain[i][j] === 0) {
						cell.classList.add('zero');
					}
					if(dungeonMap.terrain[i][j] === 1) {
						cell.classList.add('one');
					}
					row.appendChild(cell);
				}
				map_body.appendChild(row);
			}
			maptable.appendChild(map_body);
			target.appendChild(maptable);
	}
};
