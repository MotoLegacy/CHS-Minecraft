//
// AudioEngine.js - Everything pertaining to playing sounds and music.
//

// Temporary Music Copy
var AudioEngine_CurrentMusicTrack;

//
// AudioEngine_PlayMusicTrack(Track)
// Plays a music track
//
function AudioEngine_PlayMusicTrack(Track) {
	AudioEngine_CurrentMusicTrack = Track;
	AudioEngine_CurrentMusicTrack.play();
}