var laserSounds = [];
var laserSoundLoader = new THREE.AudioLoader();
var laserSoundLoadOK = false;

function initSounds() {
    initSound(30);
}

function initSound(i) {
    if (i < 0) {
        laserSoundLoadOK = true;
        return;
    }

    laserSoundLoader.load(
        'audio/laser.wav',
        function (audioBuffer) {
            var sound = new THREE.PositionalAudio(audioListener);
            sound.setBuffer(audioBuffer);
            scene.add(sound);
            laserSounds.push(sound);
            initSound(--i);
        }
    );
}

function laserAudio(obj) {
    for (var i = 0; i < 30; i++) {
        if (!laserSounds[i].isPlaying) {
            laserSounds[i].position.copy(obj.position);
            laserSounds[i].play();
            break;
        }
    }
}