/**
 * 锁鼠标
 */

PointerLock = function (title, description) {

    var createBlocker = function () {
        let blocker = document.createElement("div");
        blocker.id = "blocker";
        blocker.style.position = "absolute";
        blocker.style.width = "100%";
        blocker.style.height = "100%";
        blocker.style.zIndex = "995";
        blocker.style.backgroundColor = "rgba(0,0,0,0.5)";
        return blocker;
    };
    var createInstructions = function (title, description) {
        let instructions = document.createElement("div");
        instructions.id = "instructions";
        instructions.style.width = "100%";
        instructions.style.height = "100%";
        instructions.style.paddingTop = "20%";
        instructions.style.color = "#ffffff";
        instructions.style.textAlign = "center";
        instructions.style.cursor = "pointer";
        let text = document.createElement("span");
        text.style.fontSize = "40px";
        text.appendChild(document.createTextNode(title));
        instructions.appendChild(text);
        instructions.appendChild(document.createElement("br"));
        instructions.appendChild(document.createTextNode(description));
        return instructions;
    };

    var blocker = createBlocker();
    var instructions = createInstructions(title, description);
    blocker.appendChild(instructions);
    document.body.appendChild(blocker);

    var controlsEnabled = false;
    var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

    if ( havePointerLock ) {

        var element = document.body;

        var pointerlockchange = function ( event ) {
            if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
                controlsEnabled = true;
                blocker.style.display = "none";
                var quit_div = document.getElementById("quit");
                if (quit_div)
                    quit_div.style.display = 'none';
                var gun_sight = document.getElementById("gun_sight");
                var gun_sight_a = document.getElementById("gun_sight_a");
                if (gun_sight && gun_sight_a) {
                    if (camera.fov == 90)
                        gun_sight.style.display = 'inline';
                    else
                        gun_sight_a.style.display = 'inline';
                }
            }
            else {
                controlsEnabled = false;
                blocker.style.display = "inline";
                var quit_div = document.getElementById("quit");
                if (quit_div)
                    quit_div.style.display = 'inline';
                var gun_sight = document.getElementById("gun_sight");
                var gun_sight_a = document.getElementById("gun_sight_a");
                if (gun_sight && gun_sight_a) {
                    gun_sight.style.display = 'none';
                    gun_sight_a.style.display = 'none';
                }
                if (controls)
                    controls.enabled = false;
                if (hero) {
                    hero.moveForward = false;
                    hero.moveBackward = false;
                    hero.moveLeft = false;
                    hero.moveRight = false;
                }
            }
        };

        var pointerlockerror = function ( event ) {
            blocker.style.display = 'inline';
        };

        // Hook pointer lock state change events
        document.addEventListener( 'pointerlockchange', pointerlockchange, false );
        document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
        document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

        document.addEventListener( 'pointerlockerror', pointerlockerror, false );
        document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
        document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

        element.addEventListener( 'click', function ( event ) {
            // Ask the browser to lock the pointer
            if (!controlsEnabled) {
                element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
                element.requestPointerLock();
            }
        }, false );

    } else {

        instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

    }

    this.locked = function () {
        return !controlsEnabled;
    }

};
