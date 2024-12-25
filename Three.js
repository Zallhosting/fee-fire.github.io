<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3D Game Prototype</title>
    <style>
        body { margin: 0; overflow: hidden; }
        canvas { display: block; }
    </style>
</head>
<body>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script>
        // Set up the scene, camera, and renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // Create a simple plane for the ground
        const groundGeometry = new THREE.PlaneGeometry(500, 500);
        const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x228B22, side: THREE.DoubleSide });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = Math.PI / -2;
        scene.add(ground);

        // Create the player (cube for simplicity)
        const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
        const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x0000FF });
        const player = new THREE.Mesh(playerGeometry, playerMaterial);
        scene.add(player);

        // Create some enemies (cubes for simplicity)
        const enemyGeometry = new THREE.BoxGeometry(1, 1, 1);
        const enemyMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
        const enemies = [];

        for (let i = 0; i < 5; i++) {
            const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
            enemy.position.set(Math.random() * 20 - 10, 0.5, Math.random() * 20 - 10);
            enemies.push(enemy);
            scene.add(enemy);
        }

        // Create a bullet (sphere for simplicity)
        const bulletGeometry = new THREE.SphereGeometry(0.2, 32, 32);
        const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
        let bullets = [];

        // Camera position
        camera.position.z = 5;

        // Movement and Shooting Controls
        const controls = {
            moveForward: false,
            moveBackward: false,
            moveLeft: false,
            moveRight: false,
            shoot: false,
        };

        window.addEventListener('keydown', (event) => {
            if (event.key === 'w') controls.moveForward = true;
            if (event.key === 's') controls.moveBackward = true;
            if (event.key === 'a') controls.moveLeft = true;
            if (event.key === 'd') controls.moveRight = true;
            if (event.key === ' ') controls.shoot = true;
        });

        window.addEventListener('keyup', (event) => {
            if (event.key === 'w') controls.moveForward = false;
            if (event.key === 's') controls.moveBackward = false;
            if (event.key === 'a') controls.moveLeft = false;
            if (event.key === 'd') controls.moveRight = false;
            if (event.key === ' ') controls.shoot = false;
        });

        // Movement update function
        function updateMovement() {
            if (controls.moveForward) player.position.z -= 0.1;
            if (controls.moveBackward) player.position.z += 0.1;
            if (controls.moveLeft) player.position.x -= 0.1;
            if (controls.moveRight) player.position.x += 0.1;
        }

        // Bullet update function
        function updateBullets() {
            bullets.forEach((bullet, index) => {
                bullet.position.z -= 0.2;
                if (bullet.position.z < -50) {
                    scene.remove(bullet);
                    bullets.splice(index, 1);
                }

                // Check for collision with enemies
                enemies.forEach((enemy, eIndex) => {
                    const distance = bullet.position.distanceTo(enemy.position);
                    if (distance < 1) {
                        // Bullet hit enemy
                        scene.remove(enemy);
                        enemies.splice(eIndex, 1);
                        scene.remove(bullet);
                        bullets.splice(index, 1);
                    }
                });
            });
        }

        // Shooting function
        function shoot() {
            if (controls.shoot) {
                const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
                bullet.position.set(player.position.x, player.position.y, player.position.z);
                bullets.push(bullet);
                scene.add(bullet);
                controls.shoot = false; // Prevent shooting continuously
            }
        }

        // Render the scene
        function animate() {
            requestAnimationFrame(animate);

            updateMovement();
            updateBullets();
            shoot();

            renderer.render(scene, camera);
        }

        animate();
    </script>
</body>
</html>
