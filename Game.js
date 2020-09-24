//
// Game.js - Game-side mechanics
//

//
// Game_Start()
// Start up a Game and generate a World
//
function Game_Start() {
	// Initialize the Sky
	Sky_Create();

	// Start the Tick System and set Time to Mid-Day
	setTimer(Tick_Update, 50);
    Time = 12000;

    // Keyboard input
    keyDownMethod(Input_KeyDown);

    // Generate a World
    // TODO: Seeds
    World_Generate(1);
}