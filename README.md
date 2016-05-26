# Dungeon-Generator

The Dungeon Generator is a Javascript Module that allows you to randomly generate dungeons on a map with predefined parameters. The algorithm uses a technique called [Binary Space Partitioning](https://en.wikipedia.org/wiki/Binary_space_partitioning).

Just include all the files from the scripts folder at the end of the body of your html document and you're good to go.

You can generate a map like this: 

```
var myDungeon = Dungeon.createDungeon({
  width: 100,
  height: 100,
  iterations: 4,
  entities: {
    wall: 0,
    floor: 1,
    enemy: 2,
    health: 3,
    weapon: 4,
    nextlvl: 5,
    player: 6
  }
});
```
This creates a dungeon map in form of a 2D array with the specified with and height. The number of iterations determines how many times the map get's split. Many iterations equal many small rooms, few iterations equal few big rooms. Try to play with these values to find the optimal dungeon size for you.

The array gets filled with numbers which represent entities like a wall or a floor but also enemies or weapons.
The wall and floor entity are mandatory. The rest is not requred. You can choose if you want to add a "player", "weapon", "nextlvl" or "enemy" and "health" entity. Note that at this time enemy and health must either be both included or none.

What you do with the data is totally up to you as long as you remember how it is stored:

#### 1. 2D Array of Numbers
  When you create e new map you can acces it's data in form of a 2D Array with numbers that represent your entites.
  The 2D Array is stored in the terrain property.
  
  ```
  var levelAsArray = Mymap.terrain;
  var MyEntity = terrain[y][x];
  ```
  
#### 2. Rooms, Corridors and Entities are stores as objects with their coordinates and dimensions.
The map also stores it's information in objects for those who would rather like to work with a canvas or would like to have more possibilities to customize their map.

``` 
var myRooms = MyMap.roomlist;
var myCorridors = MyMap.corridorlist;
var myEntities = myMap.entitylist;
```

These object have properties like:

  
##### 2.1 The roomlist property contains an array of room objects. A room object has the following properties:
  
1. ```roomlist[i].x``` and ```roomlist[i].y``` are the coordinates of the upper left corner of a room.
2. ```roomlist[i].width``` and ```roomlist[i].height``` are the width and height of a room.
  
##### 2.2 The corridorlist property contains an array of corridor objects. A corridor has the following properties:

1. ```corridorlist[i].start``` and ```corridorlist[i].end``` are basically two points that have an x and y coordinate
2. Access the coordinates like ```corridorlist[i].start.x``` and ```corridorlist[i].start.y```
  
##### 2.3 The entitylist property contains an array of all entity objects scatterd on the map. It has the following properties:

1. ```entitiylist[i].type``` determines what type of entity it is and is directly corresponding with the entity types that you defined with ```Dungeon.createDungeon()``` type properties are:

  ```
  enemy
  health
  weapon
  nextlvl
  player
  ```
 
  Remember that although wall and floor are defined within the entities object in the constructor function they cant be accessed via the entitylist and don't count as actual entities.

2. ``` entitylist[i].stats``` from there you can access the stats from your entity like the health and attack damage from an emeny or the type of weapon that you picked up and how much damage it deals.

At the moment Each type has the following stats:

  1. enemy: baseHealth health, attack, toNextLevel
  2. health: heal, xp
  3. weapon: weaponName damage xp
  4. nextlvl: null


The Module provides you with a render function that visualizes the map. Remember to include the dungeonStyle.css or the prebuilt render function wont display the map correctly. You can implement your own render function if you wish. It is even recommended as the custom one does a pretty minimal job visually and was only intended for testing purposes.

```
Dungeon.render(Mymap, document.getElementById("map"));
```

The algorithm is still a work in progress and updates will be added from time to time. Including a more thorough documentation.
