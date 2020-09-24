//
// Block.js - Block data structure and data storage
//

//
// Block 'Struct'
// Everything a block requires stored in a manner similar to C-Structs
//
function Block(Image, XCoord, YCoord) {
	this.Image = Image;
	this.XCoord = XCoord;
	this.YCoord = YCoord;
}

//
// Block_GetTexture(BlockID)
// Returns a string containing Texture location for block
//
function Block_GetTexture(BlockID) {
	switch(BlockID) {
		case "minecraft:bedrock":
			return ImageHandler_Images[IMAGE_BLOCKBEDROCK];
			break;
		case "minecraft:dirt":
			return ImageHandler_Images[IMAGE_BLOCKDIRT];
			break;
		case "minecraft:grass":
			return ImageHandler_Images[IMAGE_BLOCKGRASS];
			break;
		default:
			return "";
			break;
	}

	// Not found, print
	console.log("Block_GetTexture: No block with ID " + BlockID + " found!");
	return "";
}