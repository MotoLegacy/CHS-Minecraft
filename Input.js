//
// Input.js - Keyboard keydown checks
//

//
// Input_KeyDown(e)
// Called whenever a key is pressed.
//
function Input_KeyDown(e) {

	switch(e.keyCode) {
		case Keyboard.LEFT:
			Camera_PanLeft();
			break;
		case Keyboard.RIGHT:
			Camera_PanRight();
			break;
		default:
			break;
	}
}