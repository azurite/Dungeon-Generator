# Dungeon-Generator

The Dungeon Generator is a collection of Javascript Modules that allows you to randomly generate dungeons on a map with predefined parameters. The algorithm uses a technique called [Binary Space Partitioning](https://en.wikipedia.org/wiki/Binary_space_partitioning).

Just include all the files from the scripts folder at the end of the body of your html document and you're good to go.

You can generate a map like this: 
```
var myDungeon = Dungeon.createDungeon({
  width: 100,
  height: 100,
  iterations: 4,
  entities: {
    wall: 0,
    floor: 1
  }
});
```
This creates a dungeon map in form of a 2D array with the specified with and height.
The array gets filled with numbers which represent entities like a wall or a floor but also enemies or weapons.
For now the wall and floor entities are mandatory and are the only one's supported so far. I'm working towards a more complex behaviour of the algorithm that can also randomly place items and enemies in rooms.

What you do with the data is totally up to you as long as you remember that your map is represented as a 2D array with numbers.
This example provides you with a render function that visualizes the map. You can implement your own render function if you wish

```
Dungeon.render(Mymap, document.getElementById("map"));
```
Keep in mind to access the 2D array of your map via the terrain property like: 
```
var level1 = MyMap.terrain;
```

The algorithm is still a work in progress and updates will be added from time to time. Including a more thorough documentation.
