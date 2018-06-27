/**
 * 激光
 */

var vertexShader	= [
    'varying vec3	vVertexWorldPosition;',
    'varying vec3	vVertexNormal;',
    'varying vec4	vFragColor;',

    'void main(){',
    '	vVertexNormal	= normalize(normalMatrix * normal);',
    '	vVertexWorldPosition	= (modelMatrix * vec4(position, 1.0)).xyz;',
    '	gl_Position	= projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
    '}'
].join('\n');
var fragmentShader	= [
    'uniform vec3	glowColor;',

    'varying vec3	vVertexNormal;',
    'varying vec3	vVertexWorldPosition;',
    'varying vec4	vFragColor;',

    'void main(){',
    '	vec3 worldVertexToCamera = cameraPosition - vVertexWorldPosition;',
    '	vec3 viewCameraToVertex	= (viewMatrix * vec4(worldVertexToCamera, 0.0)).xyz;',
    '	viewCameraToVertex = normalize(viewCameraToVertex);',
    // '	float cos = pow(dot(vVertexNormal, viewCameraToVertex), 3.0);',
    '	float cos = dot(vVertexNormal, viewCameraToVertex);',
    '	float r = cos + (1.0 - cos) * glowColor.r;',
    '	float g = cos + (1.0 - cos) * glowColor.g;',
    '	float b = cos + (1.0 - cos) * glowColor.b;',
    '	gl_FragColor = vec4(r, g, b, 1);',
    '}'
].join('\n');
var laserMaterial	= new THREE.ShaderMaterial({
    uniforms: {
        glowColor	: {
            type	: "c",
            value	: new THREE.Color(0xff55ff)
        }
    },
    vertexShader	: vertexShader,
    fragmentShader	: fragmentShader,
    blending	: THREE.NormalBlending,
    transparent	: true
});

Laser = function (scene, start, direction, distance, material) {
    this.liveTime = 0.05;

    var x = direction.x;
    var y = direction.y;
    var z = direction.z;
    var angleY = Math.atan(x/z);
    var angleX = Math.atan(Math.sqrt(x*x+z*z)/y);

    var yawObject = new THREE.Object3D();
    var pitchObject = new THREE.Object3D();
    yawObject.add(pitchObject);

    var geometry = new THREE.CylinderGeometry(0.8, 0.8, distance, 8);
    var mesh = new THREE.Mesh(geometry, material);
    // yawObject.position = start;
    // mesh.position = new THREE.Vector3(0, 0, 0);
    pitchObject.add(mesh);
    scene.add(yawObject);
    mesh.position.y = distance / 2;
    if (z >= 0)
        yawObject.rotation.y = angleY;
    else
        yawObject.rotation.y = angleY + Math.PI;
    if (y >= 0)
        pitchObject.rotation.x = angleX;
    else
        pitchObject.rotation.x = angleX + Math.PI;
    yawObject.position.copy(start);
    // scene.add(mesh);

    this.remove = function () {
        scene.remove(yawObject);
        // scene.remove(mesh);
    };

    this.getObject = function () {
        return yawObject;
    };
};

function updateLasers(delta) {
    for (var i = 0; i < lasers.length; i++)
        lasers[i].liveTime -= delta;
    while (lasers.length > 0 && lasers[0].liveTime <= 0) {
        lasers[0].remove();
        lasers.shift();
    }
}
