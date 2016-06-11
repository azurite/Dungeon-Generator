var Entity = function(room, type) {
		this.x = Helper.random(room.x, room.x + room.width - 1);
		this.y = Helper.random(room.y, room.y + room.height - 1);
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
					heal: Helper.random(30,60) + (Dungeon.LEVEL * 5),
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
	};

var Boss = function(room) {
		this.x = Helper.random(room.x, room.x + room.width - 2);
		this.y = Helper.random(room.y, room.y + room.height -2);
		this.width = 2;
		this.height = 2;
		this.type = "boss";
		this.stats = {
			health: 300,
			attack: 45,
			xp: 200
		};
	};