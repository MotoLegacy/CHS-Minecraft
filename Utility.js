//
// Utility.js - A set of extended CodeHS API features.
//

// Array to store all Rectangles for Gradients
var Utility_GradientArray = [];

//
// Utility_InterpolateColor(ColorOne, ColorTwo, Fidelity)
// Primarily used for Utility_DrawGradient, Interpolates Color objects
// To present a smooth transition.
// ----
// The 'Fidelity' Param (2) specifies how radical the interpolation will
// be. Function expects a value between 0-1.
//
function Utility_InterpolateColor(ColorOne, ColorTwo, Fidelity) {
    // Return ColorOne if Fidelity does not exist
    if (Fidelity <= 0) {
        return ColorOne;
    }

    // Similarly, return ColorTwo if Fidelity is greater than one
    if (Fidelity >= 1) {
        return ColorTwo;
    }

    // Store Color Information
    var ColorOneArray = [ColorOne.r, ColorOne.g, ColorOne.b];
    var ColorTwoArray = [ColorTwo.r, ColorTwo.g, ColorTwo.b];

    // Interpolate
    var R = (Fidelity * (ColorTwoArray[0] - ColorOneArray[0]) + ColorOneArray[0]);
    var G = (Fidelity * (ColorTwoArray[1] - ColorOneArray[1]) + ColorOneArray[1]);
    var B = (Fidelity * (ColorTwoArray[2] - ColorOneArray[2]) + ColorOneArray[2]);

    // Define and Return new Color
    var NewColor = new Color(R, G, B);
    return NewColor;
}

//
// Utility_ClearGradient()
// Removes all of the Rectangles in the Gradient Array.
//
function Utility_ClearGradient() {
    for (var i = 0; i < Utility_GradientArray.length; i++) {
        remove(Utility_GradientArray[i]);
    }
    Utility_GradientArray = [];
}

//
// Utility_DrawGradient(Width, Height, StartColor, EndColor, Fidelity)
// Draws a series of Rectangles in respect to the defined Width and Height,
// to simulate a Gradient Blend between Colors. May be Performance Intensive!
// ----
// The 'RectWidth' Param (4) specifies the width of the individual Rectangles
// drawn, increasing this number decreases the amount of Rectangles drawn (Faster)
// but also produces a rougher Gradient.
// ----
// See Draw_InterpolatedColor for Information on the 'Fidelity' Parameter.
// ----
// This Utility is currently functional but features a bug in which Fidelity
// increases exponentially, 
function Utility_DrawGradient(Width, Height, StartColor, EndColor, RectWidth, Fidelity) {
    // For Storing our Interpolated Colors
    var InterpolatedColor = StartColor;

    // Reset Gradient Array
    Utility_ClearGradient();

    for (var i = 0; i < Height; i += RectWidth) {
        var Rect = new Rectangle(Width, RectWidth);
        
        // Get new Color for next Interation
        InterpolatedColor = Utility_InterpolateColor(StartColor, EndColor, Fidelity);

        // Set Our Color
        Rect.setColor(InterpolatedColor);

        // Add it to the Canvas
        Rect.setPosition(0, i);
        add(Rect);

        // Push to Gradient Array
        Utility_GradientArray.push(Rect);
    }
}