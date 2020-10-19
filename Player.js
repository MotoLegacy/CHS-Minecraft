//
// Player.js - Player functions
//

// Definitions for Player Parts
var PLAYER_HEADPART 	= 0;
var PLAYER_TORSOPART 	= 1;
var PLAYER_ARMPART 		= 2;
var PLAYER_LEGPART 		= 3;

// Player Body Parts
var Player_Head;
var Player_Torso;
var Player_Arm;
var Player_Leg;

// Array containing all player parts
var Player_Client		= [];

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
	Player_Client.push(Player_Head);

	// Torso
	Player_Torso = new WebImage(ImageHandler_Images[IMAGE_PLAYERTORSORIGHT]);
	Player_Torso.setPosition(54, 66);
	Player_Client.push(Player_Torso);

	// Arm
	Player_Arm = new WebImage(ImageHandler_Images[IMAGE_PLAYERARMRIGHT]);
	Player_Arm.setPosition(54, 66);
	Player_Client.push(Player_Arm);

	// Leg
	Player_Leg = new WebImage(ImageHandler_Images[IMAGE_PLAYERLEGRIGHT]);
	Player_Leg.setPosition(54, 90);
	Player_Client.push(Player_Leg);

	// Add all Parts to the Canvas in the correct order
	add(Player_Leg);
	add(Player_Torso);
	add(Player_Arm);
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
// Player_SetPositionOnCanvas(XCoord, YCoord)
// Updates the Players poisition relative to canvas, not world.
// TODO: Get World coords, too
//
function Player_SetPositionOnCanvas(XCoord, YCoord) {
	Player_Head.setPosition(XCoord, YCoord);
	Player_Torso.setPosition(XCoord + 4, YCoord + 16);
	Player_Arm.setPosition(XCoord + 4, YCoord + 16);
	Player_Leg.setPosition(XCoord + 4, YCoord + 40);
}

//
// Player_Face(Direction)
// Flips Player textures to desired direction
// 0 = Left; 1 = Right
//
function Player_Face(Direction) {
	if (Direction) { // Right
		Player_Head.setImage(ImageHandler_Images[IMAGE_PLAYERHEADRIGHT]);
		Player_Torso.setImage(ImageHandler_Images[IMAGE_PLAYERTORSORIGHT]);
		Player_Arm.setImage(ImageHandler_Images[IMAGE_PLAYERARMRIGHT]);
		Player_Leg.setImage(ImageHandler_Images[IMAGE_PLAYERLEGRIGHT]);
	} else { // Left
		Player_Head.setImage(ImageHandler_Images[IMAGE_PLAYERHEADLEFT]);
		Player_Torso.setImage(ImageHandler_Images[IMAGE_PLAYERTORSOLEFT]);
		Player_Arm.setImage(ImageHandler_Images[IMAGE_PLAYERARMLEFT]);
		Player_Leg.setImage(ImageHandler_Images[IMAGE_PLAYERLEGLEFT]);
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
	// Calculate the Angle
	var Angle = Math.atan2(e.getY() - (Player_Head.getY() + 8), e.getX() - (Player_Head.getX() + 8)) * 180 / Math.PI;

	// Determine Direction
	if (Angle > -90 && Angle < 90) {
		Player_FacingRight = true;
		Player_FacingLeft = false;
	} else {
		Player_FacingLeft = true;
		Player_FacingRight = false;

		// Compensate for Direction Change
		Angle = Angle - 180;
	}

	// Add a downward limit so the player isn't completely looking into their body
	if (Angle > 80 && Player_FacingRight == true) {
		Angle = 80;
	} else if (Angle < (100  - 180) && Angle > (-90 - 180) && Player_FacingLeft == true) {
		Angle = (100 - 180);
	}

	// Finally, set the Player Head Angle.
	Player_Head.setRotation(Angle);
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