let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, .1, 10000);
let renderer = new THREE.WebGLRenderer();
var mouse;
var raycaster;
var boxes = [];
let controls = {};
let player = {
    height: 200,
    turnSpeed: .05,
    speed: 8,
    jumpHeight: 90,
    gravity: 6,
    velocity: 0,
    playerJumps: false
};
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
scene.background = new THREE.Color("black");
document.body.appendChild(renderer.domElement);

class Box extends THREE.Mesh {
    constructor(x, y, z, painter) {
        super(
            new THREE.BoxBufferGeometry(100, 100, 100),
            new THREE.MeshBasicMaterial()
        );
        this.position.x = x || 0;
        this.position.y = y || 0;
        this.position.z = z || 0;
        if (painter instanceof Function) {
            painter(this);
        }
    }
}
function paintRandom(mesh) {
    switch (Math.floor(Math.random() * 3)) {
        case 0:
            paintBlue(mesh);
            break;
        case 1:
            paintRed(mesh);
            break;
        case 2:
            paintYellow(mesh);
            break;
    }
}
function paintBlue(mesh) {
    mesh.material.color.set(0x4b8bf4);
}
function paintRed(mesh) {
    mesh.material.color.set(0xea4335);
}
function paintYellow(mesh) {
    mesh.material.color.set(0xfbbc05);
}

camera.position.set(0, player.height, -800);
camera.lookAt(new THREE.Vector3(0, player.height, 0));
mouse = new THREE.Vector2();
raycaster = new THREE.Raycaster();

boxes.push(new Box(-100, 0, 0, paintBlue));
boxes.push(new Box(0, 0, 0, paintRed));
boxes.push(new Box(100, 0, 0, paintYellow));

boxes.push(new Box(-100, 0, -100, paintYellow));
boxes.push(new Box(0, 0, -100, paintBlue));
boxes.push(new Box(100, 0, -100, paintRed));

boxes.push(new Box(-100, 0, -200, paintRed));
boxes.push(new Box(0, 0, -200, paintYellow));
boxes.push(new Box(100, 0, -200, paintBlue));

boxes.push(new Box(-100, 100, -200, paintBlue));
boxes.push(new Box(-100, 200, -200, paintYellow));
boxes.push(new Box(-100, 300, -200, paintRed));
boxes.push(new Box(0, 300, -200, paintBlue));
boxes.push(new Box(100, 100, -200, paintBlue));
boxes.push(new Box(100, 200, -200, paintRed));
boxes.push(new Box(100, 300, -200, paintYellow));

boxes.push(new Box(-100, 0, -300, paintBlue));
boxes.push(new Box(0, 0, -300, paintRed));
boxes.push(new Box(100, 0, -300, paintYellow));


boxes.forEach(b => scene.add(b));

document.addEventListener("click", clickHandler);
window.addEventListener("contextmenu", rightClickHandler, false);
window.addEventListener('resize', () => {
    let w = window.innerWidth,
        h = window.innerHeight;

    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
});

function clickHandler(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
        console.log(getClickedFace(intersects[0]));
        intersects[0].object.parent.remove(intersects[0].object);
    }

}
function rightClickHandler(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
        var box = intersects[0].object;
        var face = getClickedFace(intersects[0]);

        var x = box.position.x;
        var y = box.position.y;
        var z = box.position.z;

        if (face === "front") {
            z += 100;
        } else if (face === "back") {
            z -= 100;
        } else if (face === "top") {
            y += 100;
        } else if (face === "bottom") {
            y -= 100;
        } else if (face === "right") {
            x += 100;
        } else if (face === "left") {
            x -= 100;
        }

        var newBox = new Box(x, y, z);
        paintRandom(newBox);
        scene.add(newBox);
    }
    return false;
}
function getClickedFace(intersection) {
    if (intersection.face.normal.z === 1) {
        return "front";
    } else if (intersection.face.normal.z === -1) {
        return "back";
    } else if (intersection.face.normal.y === 1) {
        return "top";
    } else if (intersection.face.normal.y === -1) {
        return "bottom";
    } else if (intersection.face.normal.x === 1) {
        return "right";
    } else if (intersection.face.normal.x === -1) {
        return "left";
    }
}
document.addEventListener('keydown', ({
    keyCode
}) => {
    controls[keyCode] = true
});
document.addEventListener('keyup', ({
    keyCode
}) => {
    controls[keyCode] = false
});

function control() {
    if (controls[87]) { // w
        camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
        camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
    }
    if (controls[83]) { // s
        camera.position.x += Math.sin(camera.rotation.y) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
    }
    if (controls[65]) { // a
        camera.position.x += Math.sin(camera.rotation.y + Math.PI / 2) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed;
    }
    if (controls[68]) { // d
        camera.position.x += Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed;
    }
    if (controls[37]) { // la
        camera.rotation.y -= player.turnSpeed;
    }
    if (controls[39]) { // ra
        camera.rotation.y += player.turnSpeed;
    }
    if (controls[32]) { // space
        if (player.jumps) return false;
        player.jumps = true;
        player.velocity = -player.jumpHeight;
    }
}

function movementUpdate() {
    player.velocity += player.gravity;
    camera.position.y -= player.velocity;

    if (camera.position.y < player.height) {
        camera.position.y = player.height;
        player.jumps = false;
    }
}

function update() {
    control();
    movementUpdate();
}

function render() {
    renderer.render(scene, camera);
}

function loop() {
    requestAnimationFrame(loop);
    update();
    render();
}

loop();