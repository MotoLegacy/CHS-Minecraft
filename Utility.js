//
// Utility.js - A set of extended CodeHS API features.
//

//
// Additional Credit:
// * Michael Bromley for his Blog post on 1-D Noise, based on former ScratchPixel.com
// * Oliver Balfour for his Blog post, "Procederual Generation Part 1 - 1D Perlin Noise" on CodePen.io
// * David Bau for Math.seedrandom()
//

// Array to store all Rectangles for Gradients
var Utility_GradientArray = [];

// The Seed for Noise Generation
var Utility_Seed = 0;

// The Seeded RNG
var Utility_SeededRNG;

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

//
// Utility_Lerp(a, b, t)
// Linear Interpolation Function
//
function Utility_Lerp(a, b, t) {
    return a * (1 - t) + b * t;
}

//
// Utility_SetSeed(Seed)
// Sets the Seed for Noise Generation.
//
function Utility_SetSeed(Seed) {
    Utility_Seed = Seed;
    Utility_SeededRNG = new Math.seedrandom(Seed);
}

//
// Utility_1DNoise(X, Seed, Scale, Amplitude, YMax)
// Returns a Y value for 1-Dimensional Noise in range of 0-Height
// when given valid params.
//
function Utility_1DNoise(X, Height, Amplitude, Wavelength, Frequency) {
    // Check if the Seeder has been set
    if (Utility_Seed == 0) {
        // It hasn't, so log it and return 0.
        console.log("Utility_1DNoise: Seed not set! Use Utility_SetSeed()!");
        return 0;
    }

    // Prepare our Variables
    var Y = Height/2;
    var A = Utility_SeededRNG.quick();
    var B = Utility_SeededRNG.quick();
    Frequency = Frequency / Wavelength;

    if (X % Wavelength == 0) {
        A = B;
        B = Utility_SeededRNG.quick();
        Y = Height / 2 + A * Amplitude;
    } else {
        Y = Height / 2 + Utility_Lerp(A, B, (X % Wavelength) / Wavelength) * Amplitude;
    }

    return Y;
}