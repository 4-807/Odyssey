/**
 *其他玩家
 */

Player = function (scene, id, listener) {
    var he = this;

    this.id = id;
    this.enabled = false;
    var clock = new THREE.Clock();
    var mixers = [];
    var model = null;
    var gun = null;
    var step = null;

    var action_run_forward = null;
    var action_run_backward = null;
    var action_run_left = null;
    var action_run_right = null;
    var action_jump_forward = null;
    var action_jump_backward = null;
    var action_fire = null;
    var action_reload = null;
    var action_die = null;

    this.initModel = function () {

        var audioLoader = new THREE.AudioLoader();
        audioLoader.load(
            'audio/step.mp3',
            function ( audioBuffer ) {
                var audio = new THREE.PositionalAudio( listener );
                audio.setBuffer( audioBuffer );
                audio.setVolume(10);
                scene.add(audio);
                step = audio;
            }
        );

        var loader = new THREE.FBXLoader();
        loader.load( 'model/gun.fbx', function ( object ) {

            var scale = 60;
            object.scale.x = scale;
            object.scale.y = scale;
            object.scale.z = scale;

            gun = object;

            loader.load('model/model.fbx', function (object) {

                object.mixer = new THREE.AnimationMixer(object);
                mixers.push(object.mixer);

                action_run_forward = object.mixer.clipAction(object.animations[9]);
                action_run_backward = object.mixer.clipAction(object.animations[2]);
                action_run_left = object.mixer.clipAction(object.animations[6]);
                action_run_right = object.mixer.clipAction(object.animations[3]);
                action_jump_forward = object.mixer.clipAction(object.animations[0]);
                action_jump_backward = object.mixer.clipAction(object.animations[5]);
                action_reload = object.mixer.clipAction(object.animations[8]);
                action_fire = object.mixer.clipAction(object.animations[1]);
                action_die = object.mixer.clipAction(object.animations[7]);

                action_jump_forward.setLoop(THREE.LoopOnce, 1);
                action_jump_backward.setLoop(THREE.LoopOnce, 1);
                action_reload.setLoop(THREE.LoopOnce, 1);
                action_fire.setLoop(THREE.LoopOnce, 1);
                action_die.setLoop(THREE.LoopOnce, 1);

                var finger = findObject(object, 'mixamorigRightHand');

                finger.add(gun);
                gun.rotation.x = 1.7000000000000148;
                gun.rotation.y = 7.969999999999958;
                gun.rotation.z = 12.50999999999998;
                gun.position.x = -83.67866445439134;
                gun.position.y = -12.377484405007998;
                gun.position.z = 1.5927561556757477;

                var scale = 0.12;
                object.scale.x = scale;
                object.scale.y = scale;
                object.scale.z = scale;

                scene.add(object);
                model = object;
                model.rotation.y += Math.PI;

                he.enabled = true;
            });
        });
    };

    this.updateState = function (player) {
        if (he.enabled) {
            model.position.copy(player.position);
            model.rotation.copy(player.rotation);
            
            if (player.playing_run_forward)
                action_run_forward.play();
            else
                action_run_forward.stop();

            if (player.playing_run_backward)
                action_run_backward.play();
            else
                action_run_backward.stop();

            if (player.playing_run_left)
                action_run_left.play();
            else
                action_run_left.stop();

            if (player.playing_run_right)
                action_run_right.play();
            else
                action_run_right.stop();

            if (player.playing_jump_forward)
                action_jump_forward.play();
            else
                action_jump_forward.stop();

            if (player.playing_jump_backward)
                action_jump_backward.play();
            else
                action_jump_backward.stop();

            if (player.playing_fire)
                action_fire.play();
            else
                action_fire.stop();

            if (player.playing_reload)
                action_reload.play();
            else
                action_reload.stop();

            if (player.playing_die)
                action_die.play();
            else
                action_die.stop();

            if (step != null) {
                step.position.copy(model.position);
                if (!step.isPlaying)
                    step.play();
                if (!player.playing_run_forward &&
                        !player.playing_run_backward &&
                        !player.playing_run_left &&
                        !player.playing_run_right)
                    step.stop();
            }
        }
    };

    this.updateModel = function () {
        if ( mixers.length > 0 ) {
            for ( var i = 0; i < mixers.length; i ++ ) {
                mixers[ i ].update( clock.getDelta() );
            }
        }
    };

    function findObject(object, name) {
        if(object.name == name) return object;
        var ret = null;
        for(var childid in object.children) {
            ret = findObject(object.children[childid], name);
            if(ret != null) break;
        }
        return ret;
    }

    this.quit = function () {
        scene.remove(model);
        scene.remove(step);
    };

};