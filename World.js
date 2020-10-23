//
// World.js - World Generation and Management
//

// World Borders
var WORLD_LENGTH 		= 256;
var WORLD_HEIGHT 		= 12;

// Blocks in World
var World_Blocks 		= [];

// Blocks in World, but only the ones in the Canvas
var World_CanvasBlocks 	= [];

//
// World_IsInCanvas(XCoord, YCoord)
// Checks if Entity/Block Coordinates are on the Canvas
// TODO: Y Bounds
function World_IsInCanvas(XCoord, YCoord) {
	if (getWidth() > XCoord && XCoord > -32)
		return true;

	return false;
}

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
	return (448 - (32 * Coord)) + Camera_Y;
}

//
// World_GetBlocksInBounds(X, Y, Width, Height)
// Returns an Array of Blocks that are in the given rectangle
//
function World_GetBlocksInBounds(X, Y, Width, Height) {
	// Where we'll store Blocks and later return
	var TempBlocks = [];

	// Append Position tot he Width/Height to complete boundary
	Width = X + Width;
	Height = Y + Height;

	// X Boundaries
	for(var XCoord = X; XCoord < Width; XCoord++) {
		// Y Boundaries
		for(var YCoord = Y; YCoord < Height; YCoord++) {
			for (var i = 0; i < World_CanvasBlocks.length; i++) {
				// Is Our X in Range?
				if (XCoord >= World_CanvasBlocks[i].Image.getX() && XCoord <= World_CanvasBlocks[i].Image.getX() + 32) {
					// How about our Y?
					if (YCoord >= World_CanvasBlocks[i].Image.getY() && YCoord <= World_CanvasBlocks[i].Image.getY() + 32) {
						// All dependancies met, add to Array.
						TempBlocks.push(World_CanvasBlocks[i]);
					}	
				}
			}
		}
	}

	return TempBlocks;
}

//
// World_Redraw()
// Redraws all blocks in the world
//
function World_Redraw() {
	World_CanvasBlocks = [];

	for (var i = 0; i < World_Blocks.length; i++) {
		remove(World_Blocks[i].Image);

		// Canvas Coordinates
		XDrawCoord = World_GetCanvasXCoordinate(World_Blocks[i].XCoord);
		YDrawCoord = World_GetCanvasYCoordinate(World_Blocks[i].YCoord);
		World_Blocks[i].Image.setPosition(XDrawCoord, YDrawCoord);
		
		// Re-draw if still in Canvas
		if (World_IsInCanvas(XDrawCoord, YDrawCoord)) {
			add(World_Blocks[i].Image);
			World_CanvasBlocks.push(World_Blocks[i]);
		}
	}
}

//
// World_PlaceBlock(XCoord, YCoord, BlockID)
// Places a Block at the Given Coordinates
//
function World_PlaceBlock(XCoord, YCoord, BlockID) {
	// Is the Block in the Canvas?
	var IsInCanvas = false;

	// Create the Block Image
	var BlockImage = new WebImage(Block_GetTexture(BlockID));

	// Canvas Coordinates
	XDrawCoord = World_GetCanvasXCoordinate(XCoord);
	YDrawCoord = World_GetCanvasYCoordinate(YCoord);

	// Set Position
	BlockImage.setPosition(XDrawCoord, YDrawCoord);

	// Only Add what is visible to the canvas
	if (World_IsInCanvas(XDrawCoord, YDrawCoord)) {
		add(BlockImage);

		IsInCanvas = true;
	}

	// Create a new Block
	var TempBlock = new Block(BlockImage, XCoord, YCoord);

	// Push to Block Array
	World_Blocks.push(TempBlock);

	// Push to the Canvas Array
	if (IsInCanvas)
		World_CanvasBlocks.push(TempBlock);
}

//
// World_Generate(Seed)
// Uses Noise to Generate a World given a set Seed.
//
// ---------------------------
// This world generator would not be possible without
// David Bau's seedrandom library, find it here on GitHub:
// https://github.com/davidbau/seedrandom
// ---------------------------
// The World generator uses 32 bits in order to increase
// efficiency. If Seed 0 is provided, JS' standard Math.random 
// will provide one.
//
function World_Generate(Seed) {
	// Super flat Override
	if (Seed == 1) {
		World_GenerateFlatworld();
		return;
	}

	//
	// Actual World generation
	//

	// Determine seed (max = 32 bit integer limit)
	if (Seed == 0) {
		Seed = Math.floor((Math.random() * Math.floor(2147483646)) + 1);
	}

	// Make an RNG based on seed generated/provided
	//var Seeded_RNG = new Math.seedrandom(Seed);

	// Prepare the Noise Generator
	Utility_SetSeed(Seed);

	// Loop through World coordinates
	for(var i = 0; i < WORLD_LENGTH; i++) {
		// Force Bedrock at layer 0
		World_PlaceBlock(i, 0, "minecraft:bedrock");

		// Get Y Coord
		var YCoord = Utility_1DNoise(i, WORLD_HEIGHT, 200, 50, 1);
		YCoord = (Math.floor(YCoord/32)) + 1;
		
		// Place Grass Block
		World_PlaceBlock(i, YCoord, "minecraft:grass");

		// Put Dirt under Grass Block until we hit Bedrock
		for (var j = YCoord - 1; j > 0; j--) {
			World_PlaceBlock(i, j, "minecraft:dirt");
		}
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