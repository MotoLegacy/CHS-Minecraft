//
// Camera.js - Camera function for viewing the World.
//

// Camera X + Y Coordinates
var Camera_X = 0;
var Camera_Y = 0;

//
// Camera_PanLeft()
// Pans the Camera to the Left.
//
function Camera_PanLeft() {
	Camera_X--;
	World_Redraw();
}

//
// Camera_PanLeft()
// Pans the Camera to the Right.
//
function Camera_PanRight() {
	Camera_X++;
	World_Redraw();
}