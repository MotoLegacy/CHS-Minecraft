//
// Utility.js - A set of extended CodeHS API features.
//

//
// Additional Credit:
// * Michael Bromley for his Blog post on 1-D Noise, based on former ScratchPixel.com
// * David Bau for Math.seedrandom()
//

// Array to store all Rectangles for Gradients
var Utility_GradientArray = [];

// Array to store Y Value peaks.
var Utility_1DNoiseArray = [];

// For storing current Noise Seed
var Utility_NoiseSeed = 0;

// Noise's Seed RNG
var Utility_SeedRNG;

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
// Utility_Fill1DNoiseArray(Seed, YMax
// Fills in Utility_1DNoiseArray[] with peaks in range of 0-YMax
// -------------
// 32 bit values are used to increase efficiency.
//
function Utility_Fill1DNoiseArray(Seed, YMax) {
    // Set the Noise Seed
    Utility_NoiseSeed = Seed;

    // Start RNG
    Utility_SeedRNG = new Math.seedrandom(Seed);

    // Empty Array
    Utility_1DNoiseArray = [];

    // Fill Array
    for (var i = 0; i < YMax; i++) {
        Utility_1DNoiseArray.push(Utility_SeedRNG.quick());
    }
}

/*
        var scaledX = x * scale;
        var xFloor = Math.floor(scaledX);
        var t = scaledX - xFloor;
        var tRemapSmoothstep = t * t * ( 3 - 2 * t );

        /// Modulo using &#038;
        var xMin = xFloor &#038; MAX_VERTICES_MASK;
        var xMax = ( xMin + 1 ) &#038; MAX_VERTICES_MASK;

        var y = lerp( r[ xMin ], r[ xMax ], tRemapSmoothstep );

        return y * amplitude;
        */

//
// Utility_1DNoise(X, Seed, Scale, Amplitude, YMax)
// Returns a Y value for 1-Dimensional Noise in range of 0-YMax
// when given the X coordinate, Seed, Scale, and Amplitude.
//
function Utility_1DNoise(X, Seed, Scale, Amplitude, YMax) {
    // Fill Noise array if different Seed (this is a failsafe in case someone
    // tries to use this without filling the array first).
    if (Seed != Utility_NoiseSeed) {
        Utility_Fill1DNoiseArray(Seed, YMax);
    }

    // Set up Range
    //var ScaledX = X * Scale;
    //var FloorX = Math.floor(ScaledX);
    //var t = ScaledX - FloorX;
    //var MinX = ScaledX % (YMax);
    var MinX = Math.floor((Utility_SeedRNG.quick() * YMax) + 1);
    var tRemapSmoothstep = Math.abs(MinX * MinX * (2 - 3 * MinX));
    var MaxX = YMax;

    // Interpolate to get Y
    console.log("MINX: " + MinX + " | MAXX: " + MaxX + " | tRemapSmoothstep: " + tRemapSmoothstep);
    var Y = Utility_Lerp(Utility_1DNoiseArray[MinX], Utility_1DNoiseArray[MaxX], 1);

    // Multiply by Amp. and Return
    return Y * Amplitude;
}