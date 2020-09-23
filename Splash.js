//
// Splash.js - The intro Splash screen
//

// State of the Splashes
var Splash_State = 0;

// Splash Images
var Splash_Mojang;
var Splash_Xbox;

//
// Splash_Initialize
// Define splash images, load music, and start Splash Timer.
//
function Splash_Initialize() {
	// Mojang Studios
	Splash_Mojang = new WebImage(ImageHandler_Images[IMAGE_MOJANG]);
	Splash_Mojang.setPosition(0, 0);

	// Xbox Game Studios
	Splash_Xbox = new WebImage(ImageHandler_Images[IMAGE_XBOX]);
	Splash_Xbox.setPosition(0, 0);

	// Tell Menu to load Music
	Menu_LoadMenuMusic();

	add(Splash_Mojang);

	// Start Splashes
	setTimer(Splash_Update, 3000);
}

//
// Splash_Update
// Move to next splash/move on to Menu.
//
function Splash_Update() {
	if (Splash_State == 0) {
		remove(Splash_Mojang);
		add(Splash_Xbox);
		Splash_State++;
	} else {
		remove(Splash_Xbox);
		stopTimer(Splash_Update);
		Menu_Initialize();
	}
}