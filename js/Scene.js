
function initRender() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function initScene() {
    scene = new THREE.Scene();
}

function initLight() {
    light1 = new THREE.PointLight( 0xffffff, 1, 400 );
    light1.position.set( 50, 50, 50 );
    scene.add( light1 );
    light = new THREE.HemisphereLight( 0xffffff, 0xaaaaaa, 1 );
    light.position.set( 0.5, 1, 0.75 );
    scene.add(light);
}

function initListener() {

    document.body.addEventListener('keydown', function (e) {
        switch (e.keyCode) {
            case 87: // w
                if (controls.enabled)
                    hero.moveForward = true;
                break;
            case 83: // s
                if (controls.enabled)
                    hero.moveBackward = true;
                break;
            case 65: // a
                if (controls.enabled)
                    hero.moveLeft = true;
                break;
            case 68: // d
                if (controls.enabled)
                    hero.moveRight = true;
                break;
            case 32: // space
                hero.jump();
                break;
            case 82: //R
                hero.reloadClip();
                break;
            case 80: //P
                console.log(killLogo.style.opacity);
                break;
        }
    }, false);

    document.body.addEventListener('keyup', function (e) {
        switch (e.keyCode) {
            case 87: // w
                hero.moveForward = false;
                break;
            case 83: // s
                hero.moveBackward = false;
                break;
            case 65: // a
                hero.moveLeft = false;
                break;
            case 68: // d
                hero.moveRight = false;
                break;
        }
    }, false);

    // document.body.addEventListener('mousewheel', function (e) {
    //     controls.translateZ(-e.wheelDelta/100);
    // }, false);

    document.body.addEventListener('mousedown', function (e) {
        if (e.button == 0) {
            if (hero.enabled && !lock.locked()) {
                clearInterval(fireTid);
                fireTid = setInterval(function () {
                    if (hero.enabled) {
                        var fire = hero.fire();
                        if (fire) {

                            var sight = new THREE.Vector3();
                            sight.setFromMatrixPosition(camera.matrixWorld);
                            var start = hero.getGunPoint();
                            var end = new THREE.Vector3();
                            end = end.addVectors(sight, hero.getDirection().multiplyScalar(500));
                            var direction = new THREE.Vector3();
                            direction = direction.subVectors(end, start);
                            direction.normalize();

                            socket.emit("report-shoot", id, start, direction);
                            // var laser = new Laser(scene, start, direction, 1000, laserMaterial);
                            // lasers.push(laser);

                            hero.setRecoil();
                        }
                    }
                }, 20);
            }
        }
        if (e.button == 2 && !lock.locked()) {
            camera.fov = 30;
            camera.updateProjectionMatrix();
            gunSight.style.display = 'none';
            gunSight_a.style.display = 'inline';
        }

    }, false);

    document.body.addEventListener('mouseup', function (e) {
        if (e.button == 0) {
            if (hero.enabled) {
                clearInterval(fireTid);
                hero.stopFire();
            }
        }
        if (e.button == 2) {
            camera.fov = 90;
            camera.updateProjectionMatrix();
            if (!lock.locked()) {
                gunSight.style.display = 'inline';
                gunSight_a.style.display = 'none';
            }
        }
    }, false);
}

function initGunSight() {
    gunSight = document.getElementById("gun_sight");
    gunSight.style.left = (window.innerWidth / 2 - 42) + "px";
    gunSight.style.top = (window.innerHeight / 2 - 41) + "px";
    // gunSight.src = "img/zx3.png";
    // gunSight.style.left = (window.innerWidth / 2 - 21) + "px";
    // gunSight.style.top = (window.innerHeight / 2 - 20.5) + "px";
    gunSight_a = document.getElementById("gun_sight_a");
    gunSight_a.style.left = (window.innerWidth / 2 - 103.5) + "px";
    gunSight_a.style.top = (window.innerHeight / 2 - 97.5) + "px";
    killLogo = document.getElementById("kill_logo");
    killLogo.style.left = (window.innerWidth / 2 - 79) + "px";
    killLogo.style.top = (window.innerHeight - 240) + "px";
}

function setClip(){
    var text = document.getElementById("clip-text");
    text.innerText = Math.floor(hero.getBullet())+"/∞";
    var bar = document.getElementById("clip-bar");

    bar.style.width = (16*hero.getBullet()/hero.getClipSize())+"%";
}