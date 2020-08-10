//
// Sky.js - Everything relating to the Sky
//

// Sky Colors
var SKY_DAY;
var SKY_MOONRISE;
var SKY_NIGHT;
var SKY_SUNRISE;

// Sky Objects
var Sky_Background;
var Sky_Sun;
var Sky_Moon;
var Sky_Void;

//
// Sky_Update()
// Revolve Sun and Moon around World, change Sky Color
//
function Sky_Update() {
    // Calculate the Movement Angle
    var Angle = ((Time/24000)/100) * 360;
    
    // Move the Sun and Moon based on Angle
    Sky_Sun.setPosition((Math.cos(Angle) * 225) + (getWidth()/2) - 25, -(Math.sin(Angle) * 225) + (getHeight()/2) - 25);
    Sky_Moon.setPosition(-(Math.cos(Angle) * 225) + (getWidth()/2) - 25, (Math.sin(Angle) * 225) + (getHeight()/2) - 25);
}

//
// Sky_Create()
// Initialize Sky background, Sun, Moon, and Void.
//
function Sky_Create() {
    // Initialize Sky Colors
    SKY_DAY = new Color(206, 232, 255);
    SKY_MOONRISE = new Color(127, 115, 153);
    SKY_NIGHT = new Color(17, 15, 25);
    SKY_SUNRISE = new Color(229, 115, 38);

    // Sky Color
    Sky_Background = new Rectangle(getWidth(), getHeight() - 2*32);
    Sky_Background.setPosition(0, 0);
    Sky_Background.setColor(SKY_DAY);
        
    // Sun
    Sky_Sun = new Rectangle(50, 50);
    Sky_Sun.setPosition(getWidth() - 25, getHeight()/2 - 25);
    Sky_Sun.setColor(Color.yellow);
    
    // Moon
    Sky_Moon = new Rectangle(50, 50);
    Sky_Moon.setPosition(getWidth()/2 - 25, getHeight()/2 - 25);
    Sky_Moon.setColor(Color.white);
        
    // The Void
    Sky_Void = new Rectangle(getWidth(), getHeight());
    Sky_Void.setPosition(0, getHeight() - 2*32);
    Sky_Void.setColor(Color.black)
        
    // Add to World
    add(Sky_Background);
    add(Sky_Sun);
    add(Sky_Moon);
    add(Sky_Void);
}