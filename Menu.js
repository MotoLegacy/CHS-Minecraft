//
// Menu.js - Everything regarding to Menu function
//

// Scrolling Panorama
var Menu_Background;
var Menu_BackgroundTrail;

// Array storing all menu buttons active in the current window
var Menu_ButtonArray = [];

//
// Menu_Initialize()
// Set up basic menu elements and throw client into Main Menu
//
function Menu_Initialize() {
    // Set up Menu Background
    Menu_Background = new WebImage("assets/panorama.png");
    Menu_BackgroundTrail = new WebImage("assets/panorama-trail.png");
    Menu_Background.setSize(2048, 512);
    Menu_BackgroundTrail.setSize(1280, 512);
    Menu_Background.setPosition(0, 0);
    Menu_BackgroundTrail.setPosition(2048, 0);
    add(Menu_Background);
    add(Menu_BackgroundTrail);

    // Start Menu Update Loop
    setTimer(Menu_Update, 15);

    // Check Mouse Updates for Button Activity
    mouseMoveMethod(Menu_ButtonUpdate);

    // Load the Main Menu
    Menu_Main();
}

//
// Menu_ButtonUpdate(e)
// Loops through all active buttons to check whether or not
// the mouse is over any.
//
function Menu_ButtonUpdate(e) {
    for (var i = 0; i < Menu_ButtonArray.length; i++) {
        // TODO: Collision Checks?
        if (e.getX() >= Menu_ButtonArray[i].getX() && e.getX() <= Menu_ButtonArray[i].getX() + 512 && e.getY() >= Menu_ButtonArray[i].getY() && e.getY() <= Menu_ButtonArray[i].getY() + 48) {
            Menu_ButtonArray[i].setImage("assets/buttonHi.png");
        } else {
            Menu_ButtonArray[i].setImage("assets/button.png");
        }
    }
}

//
// Menu_Update()
// Handle Menu Animation
//
function Menu_Update() {
    // Shift the Background to the Right
    Menu_Background.setPosition(Menu_Background.getX() - 0.1, 0);
    Menu_BackgroundTrail.setPosition(Menu_BackgroundTrail.getX() - 0.1, 0);

    // Reset the Panorama when we've hit the edge
    if (Menu_BackgroundTrail.getX() <= 0) {
        Menu_Background.setPosition(0, 0);
        Menu_BackgroundTrail.setPosition(2048, 0);
    }
}

//
// Menu_CreateButton(Title, XPosition, YPosition)
// Creates a Menu Button
//
function Menu_CreateButton(Title, XPosition, YPosition) {
    var TempText = new Text(Title, "18pt Minecraftia");
    TempText.setColor(Color.white);
    TempText.setPosition(XPosition - TempText.getWidth()/2, YPosition + 48);

    var TempImage = new WebImage("assets/button.png");
    TempImage.setPosition(XPosition - 256, YPosition);

    add(TempImage);
    add(TempText);

    Menu_ButtonArray.push(TempImage);
}

//
// Menu_Main()
// The Main Game Menu
//
function Menu_Main() {
    Menu_CreateButton("Play Game", getWidth()/2, 150);
}