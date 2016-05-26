var Entity = function(room, type) {
	this.x = Helper.random(room.x, room.x + room.width - 1);
	this.y = Helper.random(room.y, room.y + room.height - 1);
	switch(type) {
		case "enemy":
			this.type = type;
			this.stats = {
				health: 20,
				attack: 12,
				xp: 10
			};
			break;
		case "health":
			this.type = type;
			this.stats = Dungeon.healthPack;
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
				baseHealth: 100,
				health: 20,
				attack: 16,
				toNextLevel: 60
			}
			break;
		default: console.error("new Entity() Invalid type name: ", type);
			break;
	}
}
