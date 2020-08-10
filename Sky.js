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
var Sky_SunAngle = 0;
var Sky_MoonAngle = 0;

//
// Sky_Update()
// Revolve Sun and Moon around World, change Sky Color
//
function Sky_Update() {
    Sky_SunAngle -= 4 * Math.PI / 180;
    Sky_MoonAngle -= 4 * Math.PI / 180;
    Sky_Sun.setPosition(Sky_Sun.getX() - 25 * Math.cos(Sky_SunAngle), Sky_Sun.getY() - 20 * Math.sin(Sky_SunAngle));
    Sky_Moon.setPosition(Sky_Moon.getX() - 25 * Math.cos(Sky_MoonAngle), Sky_Moon.getY() + 20 * Math.sin(Sky_MoonAngle));
}

//
// Sky_Create()
// Initialize Sky background, Sun, Moon, and Void. Also Sets a Timer for Sky Updating.
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
    Sky_Sun.setPosition(getWidth()/2, 30);
    Sky_Sun.setColor(Color.yellow);
    
    // Moon
    Sky_Moon = new Rectangle(50, 50);
    Sky_Moon.setPosition(getWidth()/2, 600);
    Sky_Moon.setColor(Color.white);
        
    // The Void
    Sky_Void = new Rectangle(getWidth(), getHeight());
    Sky_Void.setPosition(0, 0);
    Sky_Void.setColor(Color.black)
        
    // Add to World
    add(Sky_Void);
    add(Sky_Background);
    add(Sky_Sun);
    add(Sky_Moon);

    // Start Timer for Sky Updates
    setTimer(Sky_Update, 50);
}