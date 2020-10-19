//
// ImageHandler.js - Contains Image locations as well as contains functions for Image "caching"
//

// Holds all Image Locations
var ImageHandler_Images 		= [];

// Image Indexes
// Splash
var IMAGE_MOJANG 				= 0;
var IMAGE_XBOX 					= 1;

// Menu
var IMAGE_PANORAMA 				= 2;
var IMAGE_PANORAMATRAIL 		= 3;
var IMAGE_MENUBUTTON 			= 4;
var IMAGE_MENUBUTTONACTIVE 		= 5;
var IMAGE_MCLOGO 				= 6;
var IMAGE_DISCLAIMER 			= 7;

// Player Parts
var IMAGE_PLAYERHEADRIGHT 		= 8;
var IMAGE_PLAYERHEADLEFT		= 9;
var IMAGE_PLAYERTORSORIGHT 		= 10;
var IMAGE_PLAYERTORSOLEFT 		= 11;
var IMAGE_PLAYERARMRIGHT 		= 12;
var IMAGE_PLAYERARMLEFT 		= 13;
var IMAGE_PLAYERLEGRIGHT 		= 14;
var IMAGE_PLAYERLEGLEFT 		= 15;

// Blocks
var IMAGE_BLOCKBEDROCK 			= 16;
var IMAGE_BLOCKDIRT 			= 17;
var IMAGE_BLOCKGRASS 			= 18;

// Used in CacheLoop() for visualization
var ImageHandler_BlackBG;
var ImageHandler_LoadingText;

// Cache Counter
var ImageHandler_CacheCount 	= 0;
var ImageHandler_CacheAmount 	= 0;


//
// ImageHandler_Initialize()
// Fills the ImageHandler_Images array with needed assets
//
function ImageHandler_Initialize() {
	// Splash
	ImageHandler_Images.push("assets/splash/mojang.png");
	ImageHandler_Images.push("assets/splash/xbox.png");

	// Menu
	ImageHandler_Images.push("assets/gui/panorama.png");
	ImageHandler_Images.push("assets/gui/panorama-trail.png");
	ImageHandler_Images.push("assets/gui/button.png");
	ImageHandler_Images.push("assets/gui/buttonHi.png");
	ImageHandler_Images.push("assets/gui/logo.png");
	ImageHandler_Images.push("assets/gui/disclaimer.png");

	// Player Parts
	ImageHandler_Images.push("assets/mob/steve/default/head-right.png");
	ImageHandler_Images.push("assets/mob/steve/default/head-left.png");
	ImageHandler_Images.push("assets/mob/steve/default/torso-right.png");
	ImageHandler_Images.push("assets/mob/steve/default/torso-left.png");
	ImageHandler_Images.push("assets/mob/steve/default/arm-right.png");
	ImageHandler_Images.push("assets/mob/steve/default/arm-left.png");
	ImageHandler_Images.push("assets/mob/steve/default/leg-right.png");
	ImageHandler_Images.push("assets/mob/steve/default/leg-left.png");

	// Blocks
	ImageHandler_Images.push("assets/blocks/bedrock.png");
	ImageHandler_Images.push("assets/blocks/dirt.png");
	ImageHandler_Images.push("assets/blocks/grass-side.png");

	// Start caching process
	ImageHandler_Cache();
}

//
// ImageHandler_Cache()
// Loads/Unloads every image several times to ensure they
// are stored, and they can be used.
//
function ImageHandler_Cache() {
	// Visualization
	ImageHandler_BlackBG = new Rectangle(getWidth(), getHeight());
	ImageHandler_BlackBG.setColor(Color.black);
	ImageHandler_BlackBG.setPosition(0, 0);

	var Text1 = new Text("Caching Images, this may take some time!", "20pt Arial");
	Text1.setPosition(25, 50);
	Text1.setColor(Color.white);

	var Text2 = new Text("This is done to prevent an attempt to load an image in-game that isn't yet retrieved.", "20pt Arial");
	Text2.setPosition(25, 80);
	Text2.setColor(Color.white);

	ImageHandler_LoadingText = new Text("Loading: ", "20pt Arial");
	ImageHandler_LoadingText.setPosition(50, 500);
	ImageHandler_LoadingText.setColor(Color.white);


	// Add visuals
	add(ImageHandler_BlackBG);
	add(Text1);
	add(Text2);
	add(ImageHandler_LoadingText);

	// Start caching process
	setTimer(ImageHandler_CacheLoop, 40);
}

//
// ImageHandler_CacheLoop
// This does the actual caching called by ImageHandler_Cache()
//
function ImageHandler_CacheLoop() {
	// Move on to different image and/or stop cache process
	if (ImageHandler_CacheAmount >= 10) {
		ImageHandler_CacheAmount = 0;
		ImageHandler_CacheCount++;

		// Clean up, stop timer, start splash screen.
		if (ImageHandler_CacheCount >= ImageHandler_Images.length) {
			stopTimer(ImageHandler_CacheCount);
			remove(ImageHandler_BlackBG);
			remove(ImageHandler_LoadingText);
			Splash_Initialize();
		}
	}

	// Update the status message.
	var NewText = "Loading: " + ImageHandler_Images[ImageHandler_CacheCount] + " (" + (ImageHandler_CacheCount + 1) + " of " + (ImageHandler_Images.length) + ")";
	ImageHandler_LoadingText.setText(NewText);

	var TempImage = new WebImage(ImageHandler_Images[ImageHandler_CacheCount]);
	add(TempImage);
	remove(TempImage);

	ImageHandler_CacheAmount++;
}