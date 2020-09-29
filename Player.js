//
// Player.js - Player functions
//

// Definitions for Player Parts
var PLAYER_HEADPART 	= 0;

// Player Body Parts
var Player_Head;

// Array containing all player parts
var Player_Client;

// Player Velocity
var Player_VelocityX 	= 0;
var Player_VelocityY	= 0;

// Player Position
var Player_XCoord 		= 0;
var Player_YCoord		= 0;

var Player_FacingRight 	= true;
var Player_FacingLeft 	= false;

//
// Player_Initialize()
// Sets up all of the Player Body Parts
//
function Player_Initialize() {
	// Head
	Player_Head = new WebImage(ImageHandler_Images[IMAGE_PLAYERHEADRIGHT]);
	Player_Head.setPosition(50, 50);
	add(Player_Head);
}

//
// Player_Spawn(XCoord, YCoord)
// Spawn the Client at given coordinates.
//
function Player_Spawn(XCoord, YCoord) {
	// Set up the player body part images
	Player_Initialize();

	// Set Coords
	Player_XCoord = 50;
	Player_YCoord = 50;

	// Set up the Player timer..
	// this is separate from ticks because
	// the client should obviously run more
	// often than the "server"
	setTimer(Player_Update, 10);
}

//
// Player_SetPositionOnCanvas()
// Updates the Players poisition relative to canvas, not world.
// TODO: Get World coords, too
//
function Player_SetPositionOnCanvas(XCoord, YCoord) {
	Player_Head.setPosition(XCoord, YCoord);
}

//
// Player_Face(Direction)
// Flips Player textures to desired direction
// 0 = Left; 1 = Right
//
function Player_Face(Direction) {
	if (Direction) { // Right
		Player_Head.setImage(ImageHandler_Images[IMAGE_PLAYERHEADRIGHT]);
	} else { // Left
		Player_Head.setImage(ImageHandler_Images[IMAGE_PLAYERHEADLEFT]);
	}
}

//
// Player_Update()
// Called every 10ms, update function for the player.
//
function Player_Update() {
	// Add velocity to position
	Player_XCoord += Player_VelocityX;
	Player_YCoord += Player_VelocityY;

	// Reset Velocity
	Player_VelocityX = Player_VelocityY = 0;

	// Set position
	Player_SetPositionOnCanvas(Player_XCoord, Player_YCoord);

	// Update Player Direction
	if (Player_FacingLeft) {
		Player_Face(0);
	} else {
		Player_Face(1);
	}
}

//
// Player_HeadFollow(e)
// Have Player Head follow the Cursor
//
function Player_HeadFollow(e) {
	var Angle = Math.atan2(e.getY() - (Player_Head.getY() + 8), e.getX() - (Player_Head.getX() + 8)) * 180 / Math.PI;
	
	console.log(Angle);
	if (Player_FacingRight) {
		if (Angle > 90 || Angle < -90) {
			Player_FacingRight = false;
			Player_FacingLeft = true;
		}

		Player_Head.setRotation(Angle);
	} else {
		if (Angle < 90 || Angle > -90) {
			Player_FacingRight = true;
			Player_FacingLeft = false;
		}

		Player_Head.setRotation(Angle - 90);
	}
}

//
// Player_MoveLeft()
// Moves the Player to the Left.
//
function Player_MoveLeft() {
	Player_VelocityX += Math.cos(90) * 4;
	Player_FacingLeft = true;
	Player_FacingRight = false;
}

//
// Player_MoveRight()
// Moves the Player to the Right.
//
function Player_MoveRight() {
	Player_VelocityX -= Math.cos(90) * 4;
	Player_FacingRight = true;
	Player_FacingLeft = false;
}