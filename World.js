//
// World.js - World Generation and Management
//

// World Borders
var WORLD_LENGTH 	= 128;
var WORLD_HEIGHT 	= 128;

// Blocks in World
var World_Blocks 	= [];

//
// World_GetCanvasXCoordinate(Coord)
// Returns the location on the canvas of a game X-coord
//
function World_GetCanvasXCoordinate(Coord) {
	return (32 * Coord) + Camera_X;
}

//
// World_GetCanvasYCoordinate(Coord)
// Returns the location on the canvas of a game Y-coord
//
function World_GetCanvasYCoordinate(Coord) {
	console.log("y: " + ((448 - (32 * Coord)) + Camera_Y))
	return (448 - (32 * Coord)) + Camera_Y;
}

//
// World_Redraw()
// Redraws all blocks in the world
//
function World_Redraw() {
	for (var i = 0; i < World_Blocks.length; i++) {
		remove(World_Blocks[i].Image);
		World_Blocks[i].Image.setPosition(World_GetCanvasXCoordinate(World_Blocks[i].XCoord), World_GetCanvasYCoordinate(World_Blocks[i].YCoord));
		add(World_Blocks[i].Image);
	}
}

//
// World_PlaceBlock(XCoord, YCoord, BlockID)
// Places a Block at the Given Coordinates
//
function World_PlaceBlock(XCoord, YCoord, BlockID) {
	// Create the Block Image
	var BlockImage = new WebImage(Block_GetTexture(BlockID));
	BlockImage.setPosition(World_GetCanvasXCoordinate(XCoord), World_GetCanvasYCoordinate(YCoord));
	add(BlockImage);

	// Create a new Block
	var TempBlock = new Block(BlockImage, XCoord, YCoord);

	// Push to Block Array
	World_Blocks.push(TempBlock);
}

//
// World_Generate(Seed)
// Uses Noise to Generate a World given a set Seed.
//
function World_Generate(Seed) {
	if (Seed == 1) {
		World_GenerateFlatworld();
		return;
	}
}

//
// World_GenerateFlatworld()
// Generate a Standard Superflat World
//
function World_GenerateFlatworld() {
	// Just skim the X axis
	for(var i = 0; i < WORLD_LENGTH; i++) {
		World_PlaceBlock(i, 0, "minecraft:bedrock");
		World_PlaceBlock(i, 1, "minecraft:dirt");
		World_PlaceBlock(i, 2, "minecraft:dirt");
		World_PlaceBlock(i, 3, "minecraft:dirt");
		World_PlaceBlock(i, 4, "minecraft:grass");
	}
}