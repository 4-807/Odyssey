/**
 * 英雄
 */

Hero = function (scene, width, height, birdSight, listener) {
    
    var me = this;

    var velocity = new THREE.Vector3();
    var direction = new THREE.Vector3();
    var acceleration = 320;
    var friction = 5;
    var gravity = 200;
    var revive = [
        new THREE.Vector3(50, 0, 0),
        new THREE.Vector3(-50, 0, 0),
        new THREE.Vector3(0, 0, 50),
        new THREE.Vector3(0, 0, -50),
        new THREE.Vector3(35.4, 0, 35.4),
        new THREE.Vector3(35.4, 0, -35.4),
        new THREE.Vector3(-35.4, 0, 35.4),
        new THREE.Vector3(-35.4, 0, -35.4),
        new THREE.Vector3(-1.256066878416276, 28, -197.91275666123005),
        new THREE.Vector3(177.20898455682706, 76, -196.9882526434111),
        new THREE.Vector3(229.42776141137375, 76, -132.19495091180258),
        new THREE.Vector3(261.20928746650554, 76, -58.67687561566167),
        new THREE.Vector3(168.18353493496423, 28, 91.12713205874512),
        new THREE.Vector3(83.68485582157537, 76, 249.15679869499817),
        new THREE.Vector3(-0.3122162575282961, 76, 273.4611249454205),
        new THREE.Vector3(-81.76424869174784, 76, 254.51718398324866),
        new THREE.Vector3(-164.4829332304185, 28, 97.6449721761018),
        new THREE.Vector3(-258.90834223820724, 76, -54.28680963827113),
        new THREE.Vector3(-232.63020066527915, 76, -131.59817740450916),
        new THREE.Vector3(-177.58553643993386, 76, -197.8349182177047)
    ];

    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    var canJump = false;

    var fireBlank = 0.1;
    var cooldown = 0;
    var horizontalRecoil = 0;
    var verticalRecoil = 0;
    var horizontalRecoilTime = 0.3;
    var verticalRecoilTime = 0.1;
    var verticalRecoilRecovery = 5;
    var verticalRecoilRecoveryTime = 0;
    var verticalRecoilRecovery = 5;
    var reloadClipTime = 0;
    var clipSize = 30;
    var bullet = 30;
    var reloadNum = 0;
    var isReloading = false;
    
    var model = null;
    var gun = null;
    var step = null;
    var killSound = null;
    var kill = 0;
    var clock = new THREE.Clock();
    var mixers = [];
    this.enabled = false;
    this.loaded = false;

    var controls = null;
    var object = null;

    var raycaster_bottom;
    var rayCount = 4;
    // var biasX = [-4.5, 4.5, 0, 0, -3.2, -3.2, 3.2, 3.2];
    // var biasZ = [0, 0, -4.5, 4.5, 3.2, -3.2, 3.2, -3.2];
    var biasX = [-3.5, 3.5, 0, 0, -3.5, -3.5, 3.5, 3.5];
    var biasZ = [0, 0, -3.5, 3.5, 3.5, -3.5, 3.5, -3.5];

    var deadTime = 0;
    this.strongTime = 0;

    var action_run_forward = null;
    var action_run_backward = null;
    var action_run_left = null;
    var action_run_right = null;
    var action_jump_forward = null;
    var action_jump_backward = null;
    var action_fire = null;
    var action_reload = null;
    var action_die = null;

    this.playing_run_forward = false;
    this.playing_run_backward = false;
    this.playing_run_left = false;
    this.playing_run_right = false;
    this.playing_jump_forward = false;
    this.playing_jump_backward = false;
    this.playing_fire = false;
    this.playing_reload = false;
    this.playing_die = false;

    raycaster_bottom = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, height/2 + 1 );

    this.loadModel = function () {
        var loader = new THREE.FBXLoader();
        loader.load( 'model/gun.fbx', function ( object ) {

            var scale = 60;
            object.scale.x = scale;
            object.scale.y = scale;
            object.scale.z = scale;

            gun = object;

            loader.load( 'model/model.fbx', function ( object ) {

                object.mixer = new THREE.AnimationMixer( object );
                mixers.push( object.mixer );

                action_run_forward = object.mixer.clipAction( object.animations[ 9 ] );
                action_run_backward = object.mixer.clipAction( object.animations[ 2 ] );
                action_run_left = object.mixer.clipAction( object.animations[ 6 ] );
                action_run_right = object.mixer.clipAction( object.animations[ 3 ] );
                action_jump_forward = object.mixer.clipAction( object.animations[ 0 ] );
                action_jump_backward = object.mixer.clipAction( object.animations[ 5 ] );
                action_reload = object.mixer.clipAction( object.animations[ 8 ] );
                action_fire = object.mixer.clipAction( object.animations[ 1 ] );
                action_die = object.mixer.clipAction( object.animations[ 7 ] );

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

                scene.add( object );
                model = object;
                model.rotation.y += Math.PI - 0.15;
                model.add(listener);

                var audioLoader = new THREE.AudioLoader();
                audioLoader.load(
                    'audio/step.mp3',
                    function ( audioBuffer ) {
                        step = new THREE.PositionalAudio( listener );
                        step.setBuffer( audioBuffer );
                        scene.add(step);

                        audioLoader.load(
                            'audio/kill.wav',
                            function ( audioBuffer ) {
                                killSound = new THREE.Audio( listener );
                                killSound.setBuffer( audioBuffer );

                                me.enabled = true;
                                me.loaded = true;
                                me.reset();
                            }
                        );
                    }
                );

            } );

        } );
    };

    this.setControls = function (newControls) {
        controls = newControls;
        controls.setY(birdSight);
        controls.setX(4);
        object = controls.getObject();
        scene.add(object);
        object.position.x = 50;
    };

    this.updateVelocity = function (delta) {
        cooldown -= delta;

        velocity.y -= gravity * delta;

        velocity.x -= velocity.x * friction * delta;
        velocity.z -= velocity.z * friction * delta;

        direction.z = Number(me.moveForward) - Number(me.moveBackward);
        direction.x = Number(me.moveLeft) - Number(me.moveRight);
        direction.normalize();

        if (me.moveForward || me.moveBackward) velocity.z -= direction.z * acceleration * delta;
        if (me.moveLeft || me.moveRight) velocity.x -= direction.x * acceleration * delta;

        if (!step.isPlaying)
            step.play();
        if (me.moveForward && me.moveBackward) {
            action_run_forward.stop();
            action_run_backward.stop();
            me.playing_run_forward = false;
            me.playing_run_backward = false;
        }
        else if (me.moveForward && !me.moveBackward) {
            action_run_forward.play();
            action_run_backward.stop();
            me.playing_run_forward = true;
            me.playing_run_backward = false;
        }
        else if (!me.moveForward && me.moveBackward) {
            action_run_forward.stop();
            action_run_backward.play();
            me.playing_run_forward = false;
            me.playing_run_backward = true;
        }
        else {
            action_run_forward.stop();
            action_run_backward.stop();
            me.playing_run_forward = false;
            me.playing_run_backward = false;
        }

        if (me.moveLeft && me.moveRight) {
            action_run_left.stop();
            action_run_right.stop();
            me.playing_run_left = false;
            me.playing_run_right = false;
        }
        else if (me.moveLeft && !me.moveRight) {
            action_run_left.play();
            action_run_right.stop();
            me.playing_run_left = true;
            me.playing_run_right = false;
        }
        else if (!me.moveLeft && me.moveRight) {
            action_run_left.stop();
            action_run_right.play();
            me.playing_run_left = false;
            me.playing_run_right = true;
        }
        else {
            action_run_left.stop();
            action_run_right.stop();
            me.playing_run_left = false;
            me.playing_run_right = false;
        }

        if (!me.moveLeft && !me.moveRight && !me.moveForward && !me.moveBackward)
            step.stop();

        if (!canJump) {
            step.stop();
            action_run_forward.stop();
            action_run_backward.stop();
            action_run_left.stop();
            action_run_right.stop();
            me.playing_run_forward = false;
            me.playing_run_backward = false;
            me.playing_run_left = false;
            me.playing_run_right = false;
        }

    };

    this.passTime = function (delta) {
        if (horizontalRecoilTime > 0) {
            object.rotation.y += horizontalRecoil * Math.min(horizontalRecoilTime, delta);
            horizontalRecoilTime -= delta;
        }

        if (verticalRecoilTime > 0) {
            controls.getPitchObject().rotation.x += verticalRecoil * Math.min(verticalRecoilTime, delta);
            verticalRecoilTime -= delta;
        }

        if (verticalRecoilRecoveryTime > 0) {
            controls.getPitchObject().rotation.x -= verticalRecoilRecovery * Math.min(verticalRecoilRecoveryTime, delta);
            controls.limitPitch();
            verticalRecoilRecoveryTime -= delta;
        }

        if (reloadClipTime > 0) {
            reloadClipTime -= delta;
            bullet += delta * reloadNum / 3;
            if (reloadClipTime <= 0) {
                action_reload.stop();
                me.playing_reload = false;
                bullet = clipSize;
                isReloading = false;
            }
        }

        if (deadTime > 0) {
            velocity.y = 0;
            deadTime -= delta;
            if (deadTime <= 0) {
                action_die.stop();
                me.playing_die = false;
                me.reset();
            }
        }

        me.strongTime -= delta;

    };

    this.move = function (delta) {

        var distance_pre = Math.pow(object.position.x, 2) + Math.pow(object.position.z, 2);

        object.translateX( velocity.x * delta );
        object.translateY( velocity.y * delta );
        object.translateZ( velocity.z * delta );

        var distance_now = Math.pow(object.position.x, 2) + Math.pow(object.position.z, 2);

        if (distance_now <= distance_pre && distance_now <= 1225) {
            object.translateX( -velocity.x * delta );
            object.translateZ( -velocity.z * delta );
            velocity.x = 0;
            velocity.z = 0;
        }

        if (object.position.y < birdSight && object.position.y > 15 && distance_now < 3600) {
            velocity.y = 0;
            object.position.y = birdSight;
            canJump = true;
            action_jump_forward.stop();
            me.playing_jump_forward = false;
        }

        synchronize();

    };

    this.jump = function () {
        if (canJump) {
            velocity.y += 100;
            canJump = false;
            me.playing_jump_forward = false;
            me.playing_jump_backward = false;
            if (me.moveForward && !me.moveBackward) {
                action_jump_forward.stop();
                action_jump_forward.play();
                me.playing_jump_forward = true;
            }
            else {
                action_jump_backward.stop();
                action_jump_backward.play();
                me.playing_jump_backward = true;
            }
        }
    };

    function synchronize() {
        if (hero.enabled) {
            model.rotation.copy(object.rotation);
            model.rotation.y += Math.PI - 0.15;

        }
        model.position.copy(object.position);
        model.position.y += (- birdSight);
        step.position.copy(model.position);
    }

    this.crash = function (objects) {
        if (velocity.y <= 0) {

            var minDistance_bottom = 100;

            for (let i = 0; i < rayCount; i++) {
                raycaster_bottom.ray.origin.x = object.position.x + biasX[i];
                raycaster_bottom.ray.origin.z = object.position.z + biasZ[i];
                raycaster_bottom.ray.origin.y = object.position.y - birdSight + height / 2;
                var hits_bottom = raycaster_bottom.intersectObjects(objects);
                if ((hits_bottom.length > 0) && (hits_bottom[0].face.normal.y > 0)) {
                    var actualHeight = hits_bottom[0].distance - height / 2;
                    minDistance_bottom = Math.min(minDistance_bottom, actualHeight);
                }

            }

            if (minDistance_bottom > -3 && minDistance_bottom < 1) {
                object.position.y -= minDistance_bottom;
                velocity.y = 0;
                canJump = true;
                action_jump_forward.stop();
                me.playing_jump_forward = false;
            }

        }

    };

    this.fire = function () {
        if (isReloading) return false;

        if (bullet <= 0) {
            me.reloadClip();
            return false;
        }

        if (cooldown <= 0) {
            action_fire.stop();
            action_fire.play();
            me.playing_fire = true;

            bullet--;
            cooldown = fireBlank;
            // object.rotation.y += 0.1 * Math.random() - 0.05;

            return true;
        }

        return false;
    };

    this.setRecoil = function () {
        var scale = 0.5;

        horizontalRecoilTime = 0.05;
        horizontalRecoil = 0.8 * (Math.random() - 0.5);

        verticalRecoilTime = 0.05;
        verticalRecoil = 2.4 + 0.2 * Math.random();

        verticalRecoilRecoveryTime = 0.3;
        verticalRecoilRecovery = 0.4;

        horizontalRecoil *= scale;
        verticalRecoil *= scale;
        verticalRecoilRecovery *= scale;
    };

    this.stopFire = function () {
        action_fire.stop();
        me.playing_fire = false;
    };

    this.reloadClip = function () {
        if (isReloading || bullet == clipSize) return;

        isReloading = true;
        reloadClipTime = 3;
        bullet = 0;
        reloadNum = clipSize - bullet;
        action_reload.play();
        me.playing_reload = true;
    };

    this.updateModel = function () {
        if ( mixers.length > 0 ) {
            for ( var i = 0; i < mixers.length; i ++ ) {
                mixers[ i ].update( clock.getDelta() );
            }
        }
    };

    this.getX = function () {
        return object.position.x;
    };
    this.getY = function () {
        return object.position.y;
    };
    this.getZ = function () {
        return object.position.z;
    };

    this.getGunPoint = function () {
        // object.translateX( 3 );
        // object.translateY( -3 );
        // object.translateZ( -4 );
        // var pos = new THREE.Vector3();
        // pos.copy(object.position);
        // object.translateX( -3 );
        // object.translateY( 3 );
        // object.translateZ( 4 );

        var pos = new THREE.Vector3();
        pos.setFromMatrixPosition( gun.matrixWorld );
        return pos;
    };

    this.getDirection = function () {
        return controls.getDirection();
    };

    this.getModelPosition = function () {
        return model.position;
    };

    this.getModelRotation = function () {
        return model.rotation;
    };

    this.reset = function () {
        var i = Math.floor(Math.random() * 20);
        object.position.copy(revive[i]);
        object.position.y += birdSight;
        synchronize();
        bullet = clipSize;
        isReloading = false;
        canJump = true;
        me.moveForward = false;
        me.moveBackward = false;
        me.moveLeft = false;
        me.moveRight = false;
        velocity.x = 0;
        velocity.y = 0;
        velocity.z = 0;
        horizontalRecoilTime = 0;
        verticalRecoilTime = 0;
        verticalRecoilRecoveryTime = 0;
        kill = 0;
        me.enabled = true;
    };

    this.die = function () {
        if (deadTime <= 0) {
            me.enabled = false;
            action_die.play();
            me.playing_die = true;

            me.moveForward = false;
            me.moveBackward = false;
            me.moveLeft = false;
            me.moveRight = false;
            velocity.x = 0;
            velocity.y = 0;
            velocity.z = 0;

            action_run_forward.stop();
            action_run_backward.stop();
            action_run_left.stop();
            action_run_right.stop();
            action_jump_forward.stop();
            action_jump_backward.stop();
            action_fire.stop();
            action_reload.stop();
            me.playing_run_forward = false;
            me.playing_run_backward = false;
            me.playing_run_left = false;
            me.playing_run_right = false;
            me.playing_jump_forward = false;
            me.playing_jump_backward = false;
            me.playing_fire = false;
            me.playing_reload = false;

            deadTime = 3;
            me.strongTime = 4;
        }
    };

    this.updateKill = function (newKill, killLogo) {
        if (newKill > kill) {
            kill = newKill;
            killLogo.style.opacity = "1.0";
            if (killSound) {
                if (killSound.isPlaying)
                    killSound.stop();
                killSound.play();
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

    this.getBullet = function() {
        return bullet;
    };

    this.getClipSize = function () {
        return clipSize;
    };

};