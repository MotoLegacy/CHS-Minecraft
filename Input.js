//
// Input.js - Keyboard keydown checks
//

//
// Input_KeyDown(e)
// Called whenever a key is pressed.
//
function Input_KeyDown(e) {
	switch(e.keyCode) {
		case Keyboard.letter('A'):
			Player_MoveLeft();
			break;
		case Keyboard.letter('D'):
			Player_MoveRight();
			break;
		case Keyboard.SPACE:
			Player_Jump();
			break;
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

//
// Input_MouseMove(e)
// Called whenever the Mouse is moved
//
function Input_MouseMove(e) {
	Player_HeadFollow(e);
}