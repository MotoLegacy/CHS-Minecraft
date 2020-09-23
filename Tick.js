//
// Tick.js - Handles all Tick-based Systems
// (1t = 0.05s = 50ms; 20t/s)
//

var Time = 0;
var Time_DaysPlayed = 0;

function Tick_Update() {
    // Increment Time
    Time++;

    // Update the Sky
    Sky_Update();

    // End of a Day, increment Variable.
    if (Time >= 24000) {
        Time = 0;
        Time_DaysPlayed++;
    }
}