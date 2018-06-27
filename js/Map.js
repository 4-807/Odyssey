var vertexShader1	= [
    'varying vec3	vVertexWorldPosition;',
    'varying vec3	vVertexNormal;',
    'varying vec4	vFragColor;',

    'void main(){',
    '	vVertexNormal	= normalize(normalMatrix * normal);',
    '	vVertexWorldPosition	= (modelMatrix * vec4(position, 1.0)).xyz;',
    '	gl_Position	= projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
    '}'
].join('\n');
var fragmentShader1	= [
    'uniform vec3	glowColor;',
    'uniform float	coeficient;',
    'uniform float	power;',

    'varying vec3	vVertexNormal;',
    'varying vec3	vVertexWorldPosition;',

    'varying vec4	vFragColor;',

    'void main(){',
    '	vec3 worldCameraToVertex= vVertexWorldPosition - cameraPosition;',
    '	vec3 viewCameraToVertex	= (viewMatrix * vec4(worldCameraToVertex, 0.0)).xyz;',
    '	viewCameraToVertex	= normalize(viewCameraToVertex);',
    '	float intensity		= pow(coeficient + dot(vVertexNormal, viewCameraToVertex), power);',
    '	gl_FragColor		= vec4(glowColor, intensity);',
    '}'
].join('\n');


var ballMaterialW	= new THREE.ShaderMaterial({
    uniforms: {
        coeficient	: {
            type	: "f",
            value	: 1.0
        },
        power		: {
            type	: "f",
            value	: 2
        },
        glowColor	: {
            type	: "c",
            value	: new THREE.Color('white')
        }
    },
    vertexShader	: vertexShader1,
    fragmentShader	: fragmentShader1,
    blending	: THREE.NormalBlending,
    transparent	: true

});

var ballMaterialG	= new THREE.ShaderMaterial({
    uniforms: {
        coeficient	: {
            type	: "f",
            value	: 1.0
        },
        power		: {
            type	: "f",
            value	: 2
        },
        glowColor	: {
            type	: "c",
            value	: new THREE.Color('green')
        }
    },
    vertexShader	: vertexShader1,
    fragmentShader	: fragmentShader1,
    blending	: THREE.NormalBlending,
    transparent	: true

});

function initMap() {
    makePlatform(
        'model/platform.json',
        'model/platform.jpg',
        renderer.capabilities.getMaxAnisotropy());

    var bkgDir = 'img/bkg/';
    var envMap = new THREE.CubeTextureLoader().load( [
        bkgDir + 'px.jpg', // right
        bkgDir + 'nx.jpg', // left
        bkgDir + 'py.jpg', // top
        bkgDir + 'ny.jpg', // bottom
        bkgDir + 'pz.jpg', // back
        bkgDir + 'nz.jpg'  // front
    ] );
    envMap.format = THREE.RGBFormat;
    scene.background = envMap;

    var loader = new THREE.FBXLoader();
    loader.load( 'model/tower.FBX', function ( object ) {

        var scale = 0.0045;
        object.scale.x = 2*scale;
        object.scale.y = 2*scale;
        object.scale.z = scale;

        object.rotation.x = - Math.PI / 2;
        object.position.y = 77;

        scene.add( object );

    } );
}

function makePlatform( jsonUrl, textureUrl, textureQuality ) {
    var texture = new THREE.TextureLoader().load( textureUrl );
    texture.minFilter = THREE.LinearFilter;
    texture.anisotropy = textureQuality;

    var loader = new THREE.JSONLoader();
    loader.load( jsonUrl, function( geometry ) {

        geometry.computeFaceNormals();

        var platform = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({ map : texture }) );

        platform.name = "platform";

        objects.push(platform);

        var scale = 10;

        platform.scale.x = scale;
        platform.scale.y = scale;
        platform.scale.z = scale;

        scene.add(platform);
    });

    var sphere =  new THREE.SphereBufferGeometry( 40, 32, 32 );
    ball = new THREE.Mesh(sphere, ballMaterialW);
    ball.position.y = 140;

    scene.add(ball);
}