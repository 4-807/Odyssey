/**
 * 第三人称控制器
 */

ThirdPersonControls = function ( camera ) {

    var scope = this;

    camera.rotation.set( 0, 0, 0 );

    var pitchObject = new THREE.Object3D();
    pitchObject.add( camera );
    camera.position.z = 100;

    var yawObject = new THREE.Object3D();
    yawObject.position.y = 10;
    yawObject.add( pitchObject );

    var PI_2 = Math.PI / 2;

    var onMouseMove = function ( event ) {

        if ( scope.enabled === false ) return;

        var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        yawObject.rotation.y -= movementX * 0.002;
        pitchObject.rotation.x -= movementY * 0.002;

        scope.limitPitch();

    };

    this.limitPitch = function () {
        pitchObject.rotation.x = Math.max( - PI_2 , Math.min( PI_2 / 2, pitchObject.rotation.x ) );
    };

    this.dispose = function () {

        document.removeEventListener( 'mousemove', onMouseMove, false );

    };

    document.addEventListener( 'mousemove', onMouseMove, false );

    this.enabled = false;

    this.getObject = function () {

        return yawObject;

    };

    this.getDirection = function () {

        // assumes the camera itself is not rotated

        var direction = new THREE.Vector3(0, 0, -1);
        var rotation = new THREE.Euler(0, 0, 0, 'YXZ');

        var v = new THREE.Vector3();

        rotation.set(pitchObject.rotation.x, yawObject.rotation.y, 0);

        v.copy(direction).applyEuler(rotation);

        return v;

    };

    this.setY = function (y) {
        yawObject.position.y = y;
    };

    this.setX = function (x) {
        camera.position.x = x;
    };

    this.setZ = function (z) {
        camera.position.z = z;
    };

    this.translateZ = function (deltaZ) {
        camera.position.z += deltaZ;
        if (camera.position.z > 30)
            camera.position.z = 30;
        if (camera.position.z < 0)
            camera.position.z = 0;
    };

    this.position = yawObject.position;

    this.getPitchObject = function () {
        return pitchObject;
    };

};
