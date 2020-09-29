//
// Menu.js - Everything regarding to Menu function
//

// Scrolling Panorama
var Menu_Background;
var Menu_BackgroundTrail;

// Logo
var Menu_Logo;

// Music Tracks
var Menu_MusicTracks = [];
var Menu_Track1;
var Menu_Track2;
var Menu_Track3;
var Menu_Track4;

// Array storing all menu buttons active in the current window
var Menu_ButtonArray = [];
var Menu_ButtonTextArray = [];
var Menu_ActiveButton;

// Current Menu
var Menu_InMenu         =   0;
var MENU_DISCLAIMER     =   0;
var MENU_MAIN           =   1;

// Menu Sounds
var Menu_SoundClick;

//
// Menu_Initialize()
// Set up basic menu elements and throw client into Main Menu
//
function Menu_Initialize() {
    // Set up Menu Background
    Menu_Background = new WebImage(ImageHandler_Images[IMAGE_PANORAMA]);
    Menu_BackgroundTrail = new WebImage(ImageHandler_Images[IMAGE_PANORAMATRAIL]);
    Menu_Background.setSize(2048, 512);
    Menu_BackgroundTrail.setSize(1280, 512);
    Menu_Background.setPosition(0, 0);
    Menu_BackgroundTrail.setPosition(2048, 0);
    add(Menu_Background);
    add(Menu_BackgroundTrail);

    // Logo
    Menu_Logo = new WebImage(ImageHandler_Images[IMAGE_MCLOGO]);
    Menu_Logo.setPosition(getWidth()/3 - 15, 10);
    add(Menu_Logo);

    // Load Menu Sounds
    Menu_LoadSounds();

    // Start Menu Update Loop
    setTimer(Menu_Update, 15);

    // Every five minutes, play a new Menu track
    setTimer(Menu_PlayMenuTrack, 60000 * 5);

    // Check Mouse Updates for Button Activity
    mouseMoveMethod(Menu_ButtonUpdate);

    // Check for Mouse Button Activity for Menu Entering
    mouseClickMethod(Menu_EnterMenu);

    // Load Disclaimer Menu
    Menu_InMenu = MENU_DISCLAIMER;
    Menu_Disclaimer();

}

//
// Menu_EnterMenu()
// Check if we should enter a Menu on Mouse Click
//
function Menu_EnterMenu(e) {
    // Don't do anything if we aren't highlighting a button
    if (Menu_ActiveButton == -1)
        return;

    switch(Menu_InMenu) {
        case MENU_DISCLAIMER:
            Menu_DisclaimerInput();
            break;
        case MENU_MAIN:
            Menu_MainInput();
            break;
        default:
            break;
    }
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
            Menu_ButtonArray[i].setImage(ImageHandler_Images[IMAGE_MENUBUTTONACTIVE]);
            Menu_ButtonTextArray[i].setColor(Color.yellow);
            Menu_ActiveButton = i;
        } else {
            Menu_ButtonArray[i].setImage(ImageHandler_Images[IMAGE_MENUBUTTON]);
            Menu_ButtonTextArray[i].setColor(Color.white);

            if (Menu_ActiveButton == i)
                Menu_ActiveButton = -1;
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
// Menu_Clean
// Clean the entire Menu
//
function Menu_Clean() {
    stopTimer(Menu_Update);
    stopTimer(Menu_PlayMenuTrack);
    remove(Menu_Logo);
    remove(Menu_Background);
    remove(Menu_BackgroundTrail);
}

//
// Menu_Refresh()
// Refreshes the Panorama and logo, unloads buttons, plays click sound
//
function Menu_Refresh() {
    remove(Menu_Background);
    remove(Menu_BackgroundTrail);
    remove(Menu_Logo);
    add(Menu_Background);
    add(Menu_BackgroundTrail);
    add(Menu_Logo);

    for(var i = 0; i < Menu_ButtonArray.length; i++) {
        remove(Menu_ButtonArray[i]);
        remove(Menu_ButtonTextArray[i]);
    }

    Menu_ButtonArray = [];
    Menu_ButtonTextArray = [];

    Menu_SoundClick.play();
}

//
// Menu_CreateButton(Title, XPosition, YPosition)
// Creates a Menu Button
//
function Menu_CreateButton(Title, XPosition, YPosition) {
    var TempText = new Text(Title, "18pt Minecraftia");
    TempText.setColor(Color.white);
    TempText.setPosition(XPosition - TempText.getWidth()/2, YPosition + 48);

    var TempImage = new WebImage(ImageHandler_Images[IMAGE_MENUBUTTON]);
    TempImage.setPosition(XPosition - 256, YPosition);

    add(TempImage);
    add(TempText);

    Menu_ButtonArray.push(TempImage);
    Menu_ButtonTextArray.push(TempText);
}

//
// Menu_Disclaimer()
// A disclaimer concerning project authenticity and motive
//
var Menu_DisclaimerImage;
var Menu_DisclaimerText1;
var Menu_DisclaimerText2;
var Menu_DisclaimerText3;
var Menu_DisclaimerText4;
var Menu_DisclaimerText5;
var Menu_DisclaimerText6;
var Menu_DisclaimerText7;
function Menu_Disclaimer() {
    // Background Image
    Menu_DisclaimerImage = new WebImage(ImageHandler_Images[IMAGE_DISCLAIMER]);
    Menu_DisclaimerImage.setPosition(5, 80);
    add(Menu_DisclaimerImage);

    // Text
    Menu_DisclaimerText1 = new Text("Hi!", "18pt Minecraftia");
    Menu_DisclaimerText1.setColor(Color.white);
    Menu_DisclaimerText1.setPosition(40, 150);
    //
    Menu_DisclaimerText2 = new Text("This project mainly serves as a Proof of Concept to display some", "18pt Minecraftia");
    Menu_DisclaimerText2.setColor(Color.white);
    Menu_DisclaimerText2.setPosition(40, 200);

    Menu_DisclaimerText3 = new Text("of the CodeHS JavaScript APIs capabilities on a large scale.", "18pt Minecraftia");
    Menu_DisclaimerText3.setColor(Color.white);
    Menu_DisclaimerText3.setPosition(40, 230);
    //
    Menu_DisclaimerText4 = new Text("It is in no way associated with Mojang, Xbox Game Studios, or", "18pt Minecraftia");
    Menu_DisclaimerText4.setColor(Color.white);
    Menu_DisclaimerText4.setPosition(40, 280);

    Menu_DisclaimerText5 = new Text("Microsoft, and is made with all but bad intentions.", "18pt Minecraftia");
    Menu_DisclaimerText5.setColor(Color.white);
    Menu_DisclaimerText5.setPosition(40, 310);
    //
    Menu_DisclaimerText6 = new Text("The Source Code to this project can be found at:", "18pt Minecraftia");
    Menu_DisclaimerText6.setColor(Color.white);
    Menu_DisclaimerText6.setPosition(40, 360);

    Menu_DisclaimerText7 = new Text("https://github.com/MotoLegacy/CHS-Minecraft", "18pt Minecraftia");
    Menu_DisclaimerText7.setColor(Color.white);
    Menu_DisclaimerText7.setPosition(40, 390);

    add(Menu_DisclaimerText1);
    add(Menu_DisclaimerText2);
    add(Menu_DisclaimerText3);
    add(Menu_DisclaimerText4);
    add(Menu_DisclaimerText5);
    add(Menu_DisclaimerText6);
    add(Menu_DisclaimerText7);

    // Button to head to the main Menu
    Menu_CreateButton("Gotcha!", getWidth()/2, 426);
}

//
// Menu_DisclaimerClean()
// Cleans all Disclaimer Elements
//
function Menu_DisclaimerClean() {
    remove(Menu_DisclaimerImage);
    remove(Menu_DisclaimerText1);
    remove(Menu_DisclaimerText2);
    remove(Menu_DisclaimerText3);
    remove(Menu_DisclaimerText4);
    remove(Menu_DisclaimerText5);
    remove(Menu_DisclaimerText6);
    remove(Menu_DisclaimerText7);

    Menu_Refresh();
}

//
// Menu_DisclaimerInput()
// Button Inputs for the Disclaimer Menu
//
function Menu_DisclaimerInput() {
    switch(Menu_ActiveButton) {
        case 0: // Gotcha
            Menu_DisclaimerClean();
            Menu_Main();
            Menu_InMenu = MENU_MAIN;
            break;
        default:
            break;
    }
}

//
// Menu_Main()
// The Main Game Menu
//
function Menu_Main() {
    Menu_CreateButton("Play Game", getWidth()/2, 150);
    Menu_CreateButton("Disclaimer", getWidth()/2, 210);
}

//
// Menu_MainClean()
// Clean Main Menu Elements
//
function Menu_MainClean() {
    Menu_Refresh();
}

//
// Menu_MainInput()
// Button Inputs for the Main Menu
//
function Menu_MainInput() {
    switch(Menu_ActiveButton) {
        case 0: // Play Game
            Menu_MainClean();
            Menu_Clean();
            Menu_InMenu = -1;
            Game_Start();
            break;
        case 1: // Disclaimer
            Menu_MainClean();
            Menu_Disclaimer();
            Menu_InMenu = MENU_DISCLAIMER;
            break;
        default:
            break;
    }
}

//
// Menu_LoadMenuMusic()
// Loads all of the Menu Music Tracks, and starts playing one.
//
function Menu_LoadMenuMusic() {
    var TempTrack = new Audio("assets/music/menu1.mp3");
    Menu_MusicTracks.push(TempTrack);
    TempTrack = new Audio("assets/music/menu2.mp3");
    Menu_MusicTracks.push(TempTrack);
    TempTrack = new Audio("assets/music/menu3.mp3");
    Menu_MusicTracks.push(TempTrack);
    TempTrack = new Audio("assets/music/menu4.mp3");
    Menu_MusicTracks.push(TempTrack);


    // Play a random Menu Track
    Menu_PlayMenuTrack();
}

//
// Menu_PlayMenuTrack()
// Plays a Menu Track.
//
function Menu_PlayMenuTrack() {
    var TempValue = Math.floor((Math.random() * 4)); // 0-3
    AudioEngine_PlayMusicTrack(Menu_MusicTracks[TempValue]);
}

//
// Menu_LoadSounds()
// Loads all menu-related sounds
//
function Menu_LoadSounds() {
    Menu_SoundClick = new Audio("assets/sound/random/click.mp3");
}