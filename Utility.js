//
// Utility.js - A set of extended CodeHS API features.
//

//
// Utility_InterpolateColor(ColorOne, ColorTwo, Fidelity)
// Primarily used for Utility_DrawGradient, Interpolates Color objects
// To present a smooth transition.
// ----
// The 'Fidelity' Param (2) specifies how radical the interpolation will
// be. Function expects a value between 0-1.
//
function Utility_InterpolateColor(ColorOne, ColorTwo, Fidelity) {
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
// Utility_DrawGradient(Width, Height, StartColor, EndColor, Fidelity)
// Draws a series of Rectangles in respect to the defined Width and Height,
// to simulate a Gradient Blend between Colors. May be Performance Intensive!
// ----
// The 'RectWidth' Param (4) specifies the width of the individual Rectangles
// drawn, increasing this number decreases the amount of Rectangles drawn (Faster)
// but also produces a rougher Gradient.
// ----
// See Draw_InterpolatedColor for Information on the 'Fidelity' Parameter.
//
function Utility_DrawGradient(Width, Height, StartColor, EndColor, RectWidth, Fidelity) {
    // For Storing our Interpolated Colors
    var InterpolatedColor = StartColor;

    for (var i = 0; i < Height; i += RectWidth) {
        var Rect = new Rectangle(Width, RectWidth);
        
        // Set Our Color
        Rect.setColor(InterpolatedColor);

        // Get new Color for next Interation
        InterpolatedColor = Utility_InterpolateColor(InterpolatedColor, EndColor, Fidelity);

        Rect.setPosition(0, i);
        add(Rect);
    }
}