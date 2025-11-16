// =============================================================================
// PORTFOLIO GAME MODE - 3D VERSION WITH THREE.JS
// =============================================================================

class PortfolioGame3D {
    constructor() {
        console.log('🎮 Initializing 3D Portfolio Game...');
        
        // Three.js core objects
        this.scene = null;
        this.camera = null;
        this.minimapRenderer = null;
        this.minimapSize = 200;
        
        // Game objects
        this.car = null;
        this.world = null;
        this.buildings = [];
        this.trees = [];
        this.roads = [];
        this.particles = [];
    this.buildingLabels = [];
    this.sectionGuideLabels = [];
    this.sectionGuideHalos = [];
        
        this.gameActive = false;
        this.animationId = null;
        this.clock = new THREE.Clock();
        
        // Car physics properties
        this.carPhysics = {
            position: new THREE.Vector3(0, 0.5, 0),
            velocity: new THREE.Vector3(0, 0, 0),
            rotation: 0, // Start facing forward (along positive Z axis)
            speed: 0,
            maxSpeed: 80,  // Significantly increased for better gameplay
            acceleration: 3.0,  // Increased acceleration
            friction: 0.92,  // Slightly more friction for high speed control
            turnSpeed: 0.045,  // Increased turn speed
            isDrifting: false,
            wheelAngle: 0
        };
        
        // World properties
        this.worldSize = { width: 200, height: 200 };

        // Environment height tuning to keep roads above terrain undulations
        this.environmentHeights = {
            groundVariation: 0.08,
            roadElevation: 0.18,
            markingElevation: 0.21,
            crosswalkElevation: 0.23
        };
        
        // Game state
        this.keys = {};
        this.fuel = 100;
        this.nearSection = null;
        this.animationTime = 0;
        
        // Interaction state
        this.isInInteractiveZone = false;
        this.currentBuilding = null;
        this.isResumeViewOpen = false;
        this.resumeModal = null;
        this.isTouchDevice = this.shouldUseTouchControls();
        this.touchInput = {
            accelerate: false,
            reverse: false,
            left: false,
            right: false
        };
        // Portfolio sections as 3D buildings - positioned safely away from roads
        this.portfolioSections = [
            {
                id: 'about',
                title: 'About Raghav',
                label: 'ABOUT',
                minimapLabel: 'ABOUT',
                position: { x: -50, z: -15 }, // Moved away from roads
                size: { width: 18, height: 25, depth: 12 }, // Increased size
                color: 0x2563eb,
                description: 'Robotics & ML engineer building intelligent systems and applied research projects.',
                type: 'office',
                debugCode: 'P1',
                resumeContent: {
                    title: 'About Raghav',
                    content: `
                        <h2>Profile</h2>
                        <p>Software Engineer focused on robotics and machine learning. I develop intelligent systems, automation pipelines, and applied AI solutions using Python and modern frameworks.</p>

                        <h3>Focus Areas</h3>
                        <ul>
                            <li>Robotics, human-in-the-loop automation, and real-time control</li>
                            <li>Computer vision, few-shot learning, and multimodal perception</li>
                            <li>Speech prosody analysis and audio ML for creative tooling</li>
                            <li>Scalable backend services for ML-powered experiences</li>
                        </ul>

                        <h3>Beyond Code</h3>
                        <ul>
                            <li>Music producer (Megatroniz) with Trinity-certified drums and music theory</li>
                            <li>Part of two World Records and organizer for a G20 college event</li>
                            <li>Building <strong>Energme</strong> to explore energy-focused innovation</li>
                        </ul>
                    `
                }
            },
            {
                id: 'projects',
                title: 'Projects & Research',
                label: 'PROJECTS',
                minimapLabel: 'PROJECTS',
                position: { x: 50, z: -15 }, // Moved away from roads
                size: { width: 20, height: 28, depth: 15 }, // Increased size
                color: 0xc084fc,
                description: 'Hands-on robotics, vision, and ML projects from campus research to production prototypes.',
                type: 'commercial',
                debugCode: 'P2',
                resumeContent: {
                    title: 'Highlighted Projects',
                    content: `
                        <h2>Featured Builds</h2>

                        <h3>Automated Parking System with Self Parking Cars</h3>
                        <p><strong>Focus:</strong> Autonomous navigation, vision-based docking, and fleet coordination.</p>
                        <p><strong>Stack:</strong> Python · ROS · Computer Vision</p>

                        <h3>Ultrasonic Automatic Speed Breaker</h3>
                        <p><strong>Focus:</strong> Smart traffic management using sensor-driven actuation.</p>
                        <p><strong>Stack:</strong> Arduino · Embedded Systems · IoT</p>

                        <h3>Wi-Fi Controlled Car with ADAS & Parking Assist</h3>
                        <p><strong>Focus:</strong> Remote vehicle control with driver assistance overlays.</p>
                        <p><strong>Stack:</strong> Arduino · ADAS · Wireless Networking</p>

                        <h3>Secure AI Assistant for Windows</h3>
                        <p><strong>Focus:</strong> Voice-enabled assistant with on-device NLP and security layers.</p>
                        <p><strong>Stack:</strong> Python · NLP · Speech Recognition</p>

                        <h3>Additional Explorations</h3>
                        <ul>
                            <li>Integrating TOR Browser and lightweight Linux on a smartwatch</li>
                            <li>Decentralized voting with Ethereum smart contracts</li>
                            <li>Iris-tracking cursor control for accessible computing</li>
                            <li>Cognitive vision modeling research in machine learning</li>
                        </ul>
                    `
                }
            },
            {
                id: 'skills',
                title: 'Skills & Tech Stack',
                label: 'SKILLS',
                minimapLabel: 'SKILLS',
                position: { x: -65, z: 15 }, // Moved further away from roads
                size: { width: 19, height: 26, depth: 13 }, // Increased size
                color: 0x22d3ee,
                description: 'Key technologies powering my robotics, ML, and software projects.',
                type: 'office',
                debugCode: 'P3',
                resumeContent: {
                    title: 'Technical Toolkit',
                    content: `
                        <h2>Core Domains</h2>
                        <ul>
                            <li><strong>Robotics:</strong> Arduino, Raspberry Pi, ROS Noetic, sensor fusion</li>
                            <li><strong>AI & ML:</strong> Machine Learning, Deep Learning, Meta Learning, Computer Vision</li>
                            <li><strong>Software:</strong> Python, Java, C, SQL, Flask, FastAPI</li>
                            <li><strong>Tooling:</strong> Docker, Git, SQLite3, Firebase, TensorFlow, PyTorch</li>
                        </ul>

                        <h3>What I Work With</h3>
                        <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px;">
                            <div>
                                <h4>Robotics & Embedded</h4>
                                <ul>
                                    <li>Autonomous navigation</li>
                                    <li>Sensor calibration & actuation</li>
                                    <li>Real-time control loops</li>
                                </ul>
                            </div>
                            <div>
                                <h4>AI Engineering</h4>
                                <ul>
                                    <li>Computer vision pipelines</li>
                                    <li>Model deployment & monitoring</li>
                                    <li>Data processing & analytics</li>
                                </ul>
                            </div>
                        </div>
                    `
                }
            },
            {
                id: 'experience',
                title: 'Experience Timeline',
                label: 'EXPERIENCE',
                minimapLabel: 'EXPERIENCE',
                position: { x: 50, z: 55 }, // Moved away from roads
                size: { width: 22, height: 30, depth: 16 }, // Increased size
                color: 0xfbbf24,
                description: 'Internships and research roles across robotics, ML, and computer vision.',
                type: 'corporate',
                debugCode: 'P4',
                resumeContent: {
                    title: 'Work Experience',
                    content: `
                        <h2>Professional Experience</h2>

                        <h3>Meister-Gen Technologies — SDE & Machine Learning Intern</h3>
                        <p><strong>May 2025 – Jul 2025</strong></p>
                        <ul>
                            <li>Designed real-time video calling infrastructure with Mediasoup for low-latency collaboration.</li>
                            <li>Trained pipelines to convert 2D building imagery into textured 3D walkthroughs with Three.js.</li>
                            <li>Integrated ML workflows into production prototypes for clients in architecture and planning.</li>
                        </ul>

                        <h3>Indian Institute of Technology, Mandi — Research Intern</h3>
                        <p><strong>Sep 2024 – Mar 2025</strong></p>
                        <ul>
                            <li>Developed lightweight image compression by encoding MSB bitplanes for efficient reconstruction.</li>
                            <li>Produced evaluation tooling to measure fidelity vs. storage across diverse datasets.</li>
                        </ul>

                        <h3>Shiv Nadar University Chennai — Research Intern</h3>
                        <p><strong>Dec 2024 – Jan 2025</strong></p>
                        <ul>
                            <li>Built a prosody similarity evaluation system using acoustic features like pitch, energy, and rhythm.</li>
                            <li>Enabled objective comparison for speech synthesis and speaker imitation research.</li>
                        </ul>

                        <h3>National Institute of Technology, Trichy — Research Intern</h3>
                        <p><strong>May 2024 – Jul 2024</strong></p>
                        <ul>
                            <li>Integrated Faster R-CNN with Prototypical Networks for few-shot object detection in autonomous driving.</li>
                            <li>Achieved 86.25% accuracy with only 40 samples per class, enabling rapid adaptation to new objects.</li>
                        </ul>
                    `
                }
            },
            {
                id: 'contact',
                title: 'Connect with Raghav',
                label: 'CONTACT',
                minimapLabel: 'CONTACT',
                position: { x: -15, z: 70 }, // Moved away from roads
                size: { width: 16, height: 22, depth: 10 }, // Increased size
                color: 0x6366f1,
                description: 'Reach out to collaborate on robotics, ML, or creative technology.',
                type: 'home',
                debugCode: 'P5',
                resumeContent: {
                    title: 'Contact Information',
                    content: `
                        <h2>Let's Connect</h2>

                        <h3>Contact Channels</h3>
                        <p><strong>Email:</strong> <a href="mailto:raghav.vijayanand@gmail.com">raghav.vijayanand@gmail.com</a></p>
                        <p><strong>Phone:</strong> <a href="tel:+919566131050">+91 9566131050</a></p>
                        <p><strong>Location:</strong> Chennai, India</p>

                        <h3>Online</h3>
                        <p><strong>Website:</strong> <a href="http://www.energme.com" target="_blank">www.energme.com</a></p>
                        <p><strong>GitHub:</strong> <a href="https://github.com/RaghavVijayanand" target="_blank">github.com/RaghavVijayanand</a></p>
                        <p><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/raghav-vijayanand" target="_blank">linkedin.com/in/raghav-vijayanand</a></p>
                        <p><strong>YouTube:</strong> <a href="https://www.youtube.com/@megatroniz2004" target="_blank">@megatroniz2004</a></p>
                        <p><strong>Medium:</strong> <a href="https://medium.com/@raghav.vijayanand" target="_blank">@raghav.vijayanand</a></p>

                        <h3>Collaboration Notes</h3>
                        <ul>
                            <li>Open to research collaborations, hackathons, and robotics builds.</li>
                            <li>Happy to discuss ML consulting or creative tech projects.</li>
                            <li>Preferred contact via email with a quick project brief.</li>
                        </ul>
                    `
                }
            }
        ];
        
        this.init();
    }
    
    init() {
        console.log('🚀 Starting 3D game initialization...');
        this.showLoadingScreen();
        
        // Simulate loading time
        let progress = 0;
        const loadingInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadingInterval);
                setTimeout(() => this.startGame(), 500);
            }
            this.updateLoadingProgress(progress);
        }, 200);
    }
    
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.remove('hidden');
        }
    }
    
    updateLoadingProgress(progress) {
        const progressBar = document.getElementById('loading-progress');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }
    
    startGame() {
        console.log('🎮 Starting 3D game...');
        
        // Hide loading screen
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
        
        try {
            // Setup Three.js
            this.setupThreeJS();
            console.log('✅ Three.js setup complete');
            
            this.createWorld();
            console.log('✅ World created');
            
            this.createCar();
            console.log('✅ Car created');
            
            this.setupLighting();
            console.log('✅ Lighting setup');
            
            this.setupEventListeners();
            console.log('✅ Event listeners setup');
            this.setupTouchControls();
            console.log('✅ Touch controls configured');
            
            // Initial camera position
            this.camera.position.set(0, 15, 20);
            this.camera.lookAt(0, 0, 0);
            
            // Start game loop
            this.gameActive = true;
            this.gameLoop();
            
            console.log('✅ 3D Game started successfully!');
        } catch (error) {
            console.error('❌ Error starting game:', error);
        }
    }
    
    setupThreeJS() {
        console.log('🔧 Setting up Three.js...');
        const container = document.getElementById('game-viewport');
        
        if (!container) {
            console.error('❌ Game viewport container not found!');
            return;
        }
        
        if (!THREE) {
            console.error('❌ Three.js not loaded!');
            return;
        }
        
        console.log('✅ Three.js loaded successfully');
        
        // Scene
        this.scene = new THREE.Scene();
        
        // Enhanced sky with gradient
        this.createSky();
        
        console.log('✅ Scene created');
        
        // Main Camera
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        console.log('✅ Camera created');
        
        // Minimap Camera (orthographic top-down view)
        this.minimapCamera = new THREE.OrthographicCamera(
            -50, 50, 50, -50, 1, 200
        );
        this.minimapCamera.position.set(0, 100, 0);
        this.minimapCamera.lookAt(0, 0, 0);
        
        // Main Renderer
        try {
            this.renderer = new THREE.WebGLRenderer({ antialias: true });
            console.log('✅ WebGL renderer created');
        } catch (error) {
            console.error('❌ WebGL not supported, using Canvas renderer');
            this.renderer = new THREE.CanvasRenderer();
        }
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(0x87CEEB, 1);  // Set clear color
        
        container.appendChild(this.renderer.domElement);
        console.log('✅ Main renderer created and added to DOM');
        
        // Minimap Renderer
        this.minimapRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.minimapRenderer.setSize(this.minimapSize, this.minimapSize);
        this.minimapRenderer.domElement.style.position = 'absolute';
        this.minimapRenderer.domElement.style.top = '20px';
        this.minimapRenderer.domElement.style.right = '20px';
    this.minimapRenderer.domElement.style.border = '3px solid #38bdf8';
        this.minimapRenderer.domElement.style.borderRadius = '10px';
    this.minimapRenderer.domElement.style.boxShadow = '0 0 25px rgba(56, 189, 248, 0.35)';
        this.minimapRenderer.domElement.style.zIndex = '1000';
    this.minimapRenderer.domElement.style.background = 'rgba(11, 17, 32, 0.9)';
        
        container.appendChild(this.minimapRenderer.domElement);
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    createSky() {
        const skyGeometry = new THREE.SphereGeometry(400, 64, 64);

        const skyMaterial = new THREE.ShaderMaterial({
            uniforms: {
                topColor: { value: new THREE.Color(0x0f172a) },
                horizonColor: { value: new THREE.Color(0x1e293b) },
                bottomColor: { value: new THREE.Color(0x0b1120) },
                sunDirection: { value: new THREE.Vector3(0.5, 0.8, 0.3) },
                atmosphereIntensity: { value: 1.1 }
            },
            vertexShader: `
                varying vec3 vWorldPosition;
                varying float vHeight;
                void main() {
                    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                    vWorldPosition = worldPosition.xyz;
                    vHeight = normalize(position).y;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 topColor;
                uniform vec3 horizonColor;
                uniform vec3 bottomColor;
                uniform vec3 sunDirection;
                uniform float atmosphereIntensity;
                varying vec3 vWorldPosition;
                varying float vHeight;

                void main() {
                    float heightFactor = clamp(vHeight * 0.5 + 0.5, 0.0, 1.0);

                    vec3 skyColor = mix(bottomColor, horizonColor, smoothstep(0.0, 0.35, heightFactor));
                    skyColor = mix(skyColor, topColor, smoothstep(0.25, 1.0, heightFactor));

                    vec3 worldDirection = normalize(vWorldPosition);
                    float sunInfluence = max(dot(worldDirection, normalize(sunDirection)), 0.0);
                    vec3 sunGlow = vec3(1.0, 0.86, 0.68) * pow(sunInfluence, 8.0) * atmosphereIntensity;

                    gl_FragColor = vec4(skyColor + sunGlow, 1.0);
                }
            `,
            side: THREE.BackSide
        });

        const sky = new THREE.Mesh(skyGeometry, skyMaterial);
        this.scene.add(sky);

        this.createRealisticClouds();

        this.scene.fog = new THREE.Fog(0x0b1120, 120, 350);
    }
    
    createRealisticClouds() {
        // Create volumetric-looking clouds with better materials
        const cloudGroup = new THREE.Group();
        
        for (let i = 0; i < 25; i++) {
            const cloudGeometry = new THREE.SphereGeometry(
                Math.random() * 15 + 8, 16, 12
            );
            
            // More realistic cloud material
            const cloudMaterial = new THREE.MeshLambertMaterial({
                color: new THREE.Color().setHSL(0, 0, 0.9 + Math.random() * 0.1),
                transparent: true,
                opacity: 0.6 + Math.random() * 0.2,
                fog: true
            });
            
            const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
            
            // Position clouds more naturally
            cloud.position.set(
                (Math.random() - 0.5) * 600,
                Math.random() * 40 + 80,
                (Math.random() - 0.5) * 600
            );
            
            // Vary cloud shapes and sizes
            cloud.scale.set(
                Math.random() * 1.5 + 0.8,
                Math.random() * 0.6 + 0.4,
                Math.random() * 1.5 + 0.8
            );
            
            cloud.rotation.x = Math.random() * Math.PI;
            cloud.rotation.y = Math.random() * Math.PI;
            cloud.rotation.z = Math.random() * Math.PI;
            
            this.scene.add(cloud);
            
            // Add some wispy secondary clouds
            if (Math.random() > 0.6) {
                const wispyCloud = new THREE.Mesh(
                    new THREE.SphereGeometry(Math.random() * 8 + 4, 12, 8),
                    new THREE.MeshLambertMaterial({
                        color: 0xffffff,
                        transparent: true,
                        opacity: 0.3 + Math.random() * 0.2
                    })
                );
                
                wispyCloud.position.copy(cloud.position);
                wispyCloud.position.x += (Math.random() - 0.5) * 30;
                wispyCloud.position.y += (Math.random() - 0.5) * 15;
                wispyCloud.position.z += (Math.random() - 0.5) * 30;
                
                this.scene.add(wispyCloud);
            }
        }
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Keep minimap in top-right corner
        const container = document.getElementById('game-viewport');
        const minimapElement = this.minimapRenderer.domElement;
        minimapElement.style.right = '20px';
        minimapElement.style.top = '20px';
    }
    
    setupLighting() {
        // Enhanced ambient light for better overall visibility
        const ambientLight = new THREE.AmbientLight(0x5C7CFA, 0.4);
        this.scene.add(ambientLight);
        
        // Main directional light (sun) with realistic warm color
        const directionalLight = new THREE.DirectionalLight(0xFFF8DC, 1.2);
        directionalLight.position.set(80, 120, 60);
        directionalLight.castShadow = true;
        
        // Enhanced shadow quality
        directionalLight.shadow.mapSize.width = 4096;
        directionalLight.shadow.mapSize.height = 4096;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 300;
        directionalLight.shadow.camera.left = -150;
        directionalLight.shadow.camera.right = 150;
        directionalLight.shadow.camera.top = 150;
        directionalLight.shadow.camera.bottom = -150;
        directionalLight.shadow.bias = -0.0001;
        this.scene.add(directionalLight);
        
        // Secondary fill light for softer shadows
        const fillLight = new THREE.DirectionalLight(0x87CEEB, 0.3);
        fillLight.position.set(-50, 60, -80);
        this.scene.add(fillLight);
        
        // Atmospheric rim lighting
        const rimLight = new THREE.DirectionalLight(0xFFE4B5, 0.2);
        rimLight.position.set(0, 30, -100);
        this.scene.add(rimLight);
        
        // Subtle colored accent lights for ambiance
        const accentLight1 = new THREE.PointLight(0xFFA500, 0.3, 50);
        accentLight1.position.set(40, 15, 40);
        this.scene.add(accentLight1);
        
        const accentLight2 = new THREE.PointLight(0x87CEEB, 0.2, 40);
        accentLight2.position.set(-60, 12, -40);
        this.scene.add(accentLight2);
        
        // Store reference to main light for day/night cycle potential
        this.mainLight = directionalLight;
    }
    
    createWorld() {
        // Enhanced ground with more realistic material
        const groundGeometry = new THREE.PlaneGeometry(this.worldSize.width, this.worldSize.height, 64, 64);
        
        // Add subtle height variation so ground feels alive without swallowing roads
        const groundVertices = groundGeometry.attributes.position.array;
        const variation = this.environmentHeights.groundVariation;
        for (let i = 0; i < groundVertices.length; i += 3) {
            groundVertices[i + 2] = Math.sin(groundVertices[i] * 0.01) * Math.cos(groundVertices[i + 1] * 0.01) * variation;
        }
        groundGeometry.attributes.position.needsUpdate = true;
        groundGeometry.computeVertexNormals();
        
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x4A7C59,  // More realistic grass color
            transparent: false,
            fog: true
        });
        
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // Create roads
        this.createRoads();
        
        // Create portfolio buildings (only the essential ones)
        this.createPortfolioBuildings();
        
        // Create minimal scenery buildings (reduce unnecessary buildings)
        this.createMinimalSceneryBuildings();
        
        // Create enhanced trees
        this.createTrees();
        
        // Create street furniture
        this.createStreetFurniture();
        
        // Create minimap labels for portfolio buildings
        this.createMinimapLabels();
    }
    
    createMinimapLabels() {
        // Add building labels visible in the minimap
        this.portfolioSections.forEach(section => {
            // Create label background
            const labelGeometry = new THREE.PlaneGeometry(6, 1.5);
            const labelMaterial = new THREE.MeshBasicMaterial({
                color: 0x0b1120,
                transparent: true,
                opacity: 0.9
            });
            
            const labelBg = new THREE.Mesh(labelGeometry, labelMaterial);
            labelBg.position.set(
                section.position.x,
                section.size.height + 8, // Above the building for minimap visibility
                section.position.z
            );
            labelBg.rotation.x = -Math.PI / 2; // Lay flat for top-down view
            
            // Create text texture
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = 256;
            canvas.height = 64;
            
            context.fillStyle = '#0b1120';
            context.fillRect(0, 0, canvas.width, canvas.height);
            
            context.fillStyle = '#38bdf8';
            context.font = '600 26px "Segoe UI", Arial, sans-serif';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            const minimapLabel = section.minimapLabel || section.label || section.debugCode || '';
            context.fillText(minimapLabel, canvas.width/2, canvas.height/2);
            
            const textTexture = new THREE.CanvasTexture(canvas);
            const textMaterial = new THREE.MeshBasicMaterial({
                map: textTexture,
                transparent: true
            });
            
            const textMesh = new THREE.Mesh(labelGeometry, textMaterial);
            textMesh.position.copy(labelBg.position);
            textMesh.position.y += 0.01;
            textMesh.rotation.x = -Math.PI / 2;
            
            this.scene.add(labelBg);
            this.scene.add(textMesh);
        });
    }
    
    createRoads() {
        // Enhanced road material with more realistic appearance
        const roadMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x2C2C2C,  // Darker, more realistic asphalt color
            fog: true
        });
        const roadElevation = this.environmentHeights.roadElevation;
        
        // Main horizontal roads
        const mainRoadGeometry = new THREE.PlaneGeometry(this.worldSize.width, 8);
        
        // Road 1 (main)
        const road1 = new THREE.Mesh(mainRoadGeometry, roadMaterial);
        road1.rotation.x = -Math.PI / 2;
        road1.position.y = roadElevation;
        road1.position.z = 0;
        road1.receiveShadow = true;
        this.scene.add(road1);
        
        // Road 2 (north)
        const road2 = new THREE.Mesh(mainRoadGeometry, roadMaterial);
        road2.rotation.x = -Math.PI / 2;
    road2.position.y = roadElevation;
        road2.position.z = 40;
        road2.receiveShadow = true;
        this.scene.add(road2);
        
        // Road 3 (south)
        const road3 = new THREE.Mesh(mainRoadGeometry, roadMaterial);
        road3.rotation.x = -Math.PI / 2;
    road3.position.y = roadElevation;
        road3.position.z = -40;
        road3.receiveShadow = true;
        this.scene.add(road3);
        
        // Vertical roads
        const verticalRoadGeometry = new THREE.PlaneGeometry(8, this.worldSize.height);
        
        // Road 4 (east)
        const road4 = new THREE.Mesh(verticalRoadGeometry, roadMaterial);
        road4.rotation.x = -Math.PI / 2;
    road4.position.y = roadElevation;
        road4.position.x = 30;
        road4.receiveShadow = true;
        this.scene.add(road4);
        
        // Road 5 (west)
        const road5 = new THREE.Mesh(verticalRoadGeometry, roadMaterial);
        road5.rotation.x = -Math.PI / 2;
    road5.position.y = roadElevation;
        road5.position.x = -30;
        road5.receiveShadow = true;
        this.scene.add(road5);
        
        // Add road markings
        this.createRoadMarkings();
    }
    
    createRoadMarkings() {
        const markingMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xFFFFFF,
            fog: true
        });
        const markingElevation = this.environmentHeights.markingElevation;
        
        // Improved road markings with better visibility
        const centerLineGeometry = new THREE.PlaneGeometry(0.3, 4); // Dashed line segments
        
        // Horizontal roads center lines
        [-40, 0, 40].forEach(z => {
            for (let x = -this.worldSize.width/2; x < this.worldSize.width/2; x += 8) {
                const marking = new THREE.Mesh(centerLineGeometry, markingMaterial);
                marking.position.set(x, markingElevation, z);
                marking.rotation.x = -Math.PI / 2;
                this.scene.add(marking);
            }
        });
        
        // Vertical roads center lines
        const verticalLineGeometry = new THREE.PlaneGeometry(4, 0.3);
        [-30, 30].forEach(x => {
            for (let z = -this.worldSize.height/2; z < this.worldSize.height/2; z += 8) {
                const marking = new THREE.Mesh(verticalLineGeometry, markingMaterial);
                marking.position.set(x, markingElevation, z);
                marking.rotation.x = -Math.PI / 2;
                this.scene.add(marking);
            }
        });
        
        // Add some crosswalk markings at intersections
        this.createCrosswalks();
    }
    
    createCrosswalks() {
        const crosswalkMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xFFFFFF,
            fog: true
        });
        const crosswalkElevation = this.environmentHeights.crosswalkElevation;
        
        // Crosswalk stripes
        const stripeGeometry = new THREE.PlaneGeometry(1, 8);
        
        // Major intersections
        const intersections = [
            { x: 30, z: 0 }, { x: -30, z: 0 },
            { x: 30, z: 40 }, { x: -30, z: 40 },
            { x: 30, z: -40 }, { x: -30, z: -40 }
        ];
        
        intersections.forEach(intersection => {
            for (let i = -3; i <= 3; i += 2) {
                const stripe = new THREE.Mesh(stripeGeometry, crosswalkMaterial);
                stripe.position.set(intersection.x + i, crosswalkElevation, intersection.z);
                stripe.rotation.x = -Math.PI / 2;
                this.scene.add(stripe);
            }
        });
    }
    
    createPortfolioBuildings() {
        this.buildingLabels = [];
        this.sectionGuideLabels = [];
        this.sectionGuideHalos = [];
        this.portfolioSections.forEach(section => {
            const building = this.createRealisticBuilding(
                section.size.width,
                section.size.height,
                section.size.depth,
                section.color,
                section.position.x,
                section.position.z,
                section.type,
                section.label || section.debugCode
            );
            
            building.userData = section;
            this.buildings.push(building);
            this.scene.add(building);
            
            // Add building label (pass height as parameter)
            const buildingLabel = this.createBuildingLabel(building, section.title, section.size.height);
            if (buildingLabel) {
                this.buildingLabels.push(buildingLabel);
            }

            const guidePlanes = this.createSectionGuide(
                building,
                section.label || section.debugCode || section.title,
                section.size
            );
            if (guidePlanes && guidePlanes.length) {
                this.sectionGuideLabels.push(...guidePlanes);
            }
        });
        console.log('✅ Portfolio Buildings Created');
    }
    
    createMinimalSceneryBuildings() {
        // Create only essential background buildings for context, not clutter
        const essentialBuildings = [
            // Background skyline buildings (far from roads)
            { x: -80, z: -80, width: 15, height: 35, depth: 12, color: 0x708090, type: 'office' },
            { x: 80, z: -80, width: 18, height: 42, depth: 15, color: 0x696969, type: 'office' },
            { x: -80, z: 80, width: 12, height: 28, depth: 10, color: 0x778899, type: 'residential' },
            { x: 80, z: 80, width: 20, height: 38, depth: 18, color: 0x2F4F4F, type: 'office' }
        ];
        
        essentialBuildings.forEach(building => {
            const mesh = this.createRealisticBuilding(
                building.width,
                building.height,
                building.depth,
                building.color,
                building.x,
                building.z,
                building.type
            );
            this.scene.add(mesh);
        });
        console.log('✅ Essential Scenery Buildings Created');
    }
    
    createRealisticBuilding(width, height, depth, color, x, z, type, signLabel = null) {
        const buildingGroup = new THREE.Group();
        
        // Enhanced main building structure with better materials
        const geometry = new THREE.BoxGeometry(width, height, depth);
        
        // More realistic building material based on type
        let material;
        switch(type) {
            case 'office':
                material = new THREE.MeshLambertMaterial({ 
                    color: new THREE.Color(color).multiplyScalar(0.9),
                    fog: true
                });
                break;
            case 'residential':
                material = new THREE.MeshLambertMaterial({ 
                    color: new THREE.Color(color).multiplyScalar(1.1),
                    fog: true
                });
                break;
            case 'shop':
            case 'commercial':
                material = new THREE.MeshLambertMaterial({ 
                    color: new THREE.Color(color),
                    emissive: new THREE.Color(color).multiplyScalar(0.1),
                    emissiveIntensity: 0.05,
                    fog: true
                });
                break;
            default:
                material = new THREE.MeshLambertMaterial({ 
                    color: color,
                    fog: true
                });
        }
        
        const building = new THREE.Mesh(geometry, material);
        building.position.y = height / 2;
        building.castShadow = true;
        building.receiveShadow = true;
        buildingGroup.add(building);
        
        // Add glowing ground boards so visitors know each section
        if (signLabel) {
            this.addBuildingIdentifierBoards(buildingGroup, signLabel, width, depth);
        }

        // Add proper windows on all sides
        this.addImprovedWindows(buildingGroup, width, height, depth, color);
        
        // Add building details based on type
        if (type === 'office') {
            this.addRooftopDetails(buildingGroup, width, height, depth);
        } else if (type === 'residential') {
            this.addBalconies(buildingGroup, width, height, depth);
        } else if (type === 'shop' || type === 'commercial') {
            this.addStorefront(buildingGroup, width, height, depth, color);
            this.addSignage(buildingGroup, width, height, depth);
        }
        
        buildingGroup.position.set(x, 0, z);
        return buildingGroup;
    }
    
    addDebugLabel(buildingGroup, debugCode, width, height, depth) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 128;
        canvas.height = 128;
        
        // Background
        context.fillStyle = 'rgba(255, 255, 0, 0.9)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = '#000000';
        context.lineWidth = 3;
        context.strokeRect(3, 3, canvas.width - 6, canvas.height - 6);
        
        // Debug code text
        context.fillStyle = '#000000';
        context.font = 'bold 36px Arial';
        context.textAlign = 'center';
        context.fillText(debugCode, canvas.width / 2, canvas.height / 2 + 12);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshBasicMaterial({ 
            map: texture, 
            transparent: true,
            alphaTest: 0.1
        });
        
        const geometry = new THREE.PlaneGeometry(4, 4);
        const label = new THREE.Mesh(geometry, material);
        label.position.y = height / 2 + 5;
        label.position.z = depth / 2 + 1;  // Slightly in front
        buildingGroup.add(label);
    }
    
    addWindows(buildingGroup, width, height, depth, baseColor) {
        const windowMaterial = new THREE.MeshLambertMaterial({ 
            color: Math.random() > 0.3 ? 0xffffcc : 0x444444,
            emissive: Math.random() > 0.7 ? 0x666600 : 0x000000,
            emissiveIntensity: 0.2
        });
        
        // Front and back windows
        for (let floor = 1; floor < Math.floor(height / 3); floor++) {
            for (let i = 0; i < Math.floor(width / 2); i++) {
                const windowGeometry = new THREE.PlaneGeometry(1, 1.5);
                const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
                const window2 = new THREE.Mesh(windowGeometry, windowMaterial);
                
                window1.position.set(
                    -width/2 + 1 + i * 2,
                    floor * 3,
                    depth/2 + 0.01
                );
                window2.position.set(
                    -width/2 + 1 + i * 2,
                    floor * 3,
                    -depth/2 - 0.01
                );
                window2.rotation.y = Math.PI;
                
                buildingGroup.add(window1);
                buildingGroup.add(window2);
            }
        }
    }
    
    addBalconies(buildingGroup, width, height, depth) {
        const balconyMaterial = new THREE.MeshLambertMaterial({ color: 0x888888 });
        
        for (let floor = 2; floor < Math.floor(height / 4); floor++) {
            if (Math.random() > 0.5) {
                const balconyGeometry = new THREE.BoxGeometry(width * 0.8, 0.2, 1.5);
                const balcony = new THREE.Mesh(balconyGeometry, balconyMaterial);
                balcony.position.set(0, floor * 4, depth/2 + 0.75);
                balcony.castShadow = true;
                buildingGroup.add(balcony);
            }
        }
    }
    
    addRooftopDetails(buildingGroup, width, height, depth) {
        // Add rooftop equipment
        const equipmentMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
        
        // Air conditioning units
        for (let i = 0; i < 2; i++) {
            const acGeometry = new THREE.BoxGeometry(2, 1, 1);
            const ac = new THREE.Mesh(acGeometry, equipmentMaterial);
            ac.position.set(
                (Math.random() - 0.5) * width * 0.6,
                height + 0.5,
                (Math.random() - 0.5) * depth * 0.6
            );
            ac.castShadow = true;
            buildingGroup.add(ac);
        }
        
        // Antenna
        if (Math.random() > 0.7) {
            const antennaGeometry = new THREE.CylinderGeometry(0.1, 0.1, 3, 8);
            const antenna = new THREE.Mesh(antennaGeometry, equipmentMaterial);
            antenna.position.set(0, height + 1.5, 0);
            buildingGroup.add(antenna);
        }
    }
    
    addStorefront(buildingGroup, width, height, depth, baseColor) {
        // Large storefront windows
        const storefrontMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xccccff,
            transparent: true,
            opacity: 0.7
        });
        
        const storefrontGeometry = new THREE.PlaneGeometry(width * 0.8, 3);
        const storefront = new THREE.Mesh(storefrontGeometry, storefrontMaterial);
        storefront.position.set(0, 1.5, depth/2 + 0.01);
        buildingGroup.add(storefront);
    }
    
    addSignage(buildingGroup, width, height, depth) {
        // Add a simple sign
        const accentPalette = [0x38bdf8, 0xc084fc, 0x22d3ee, 0xfbbf24];
        const signMaterial = new THREE.MeshLambertMaterial({ 
            color: accentPalette[Math.floor(Math.random() * accentPalette.length)],
            emissive: 0x0b1120,
            emissiveIntensity: 0.25
        });
        
        const signGeometry = new THREE.PlaneGeometry(width * 0.6, 1);
        const sign = new THREE.Mesh(signGeometry, signMaterial);
        sign.position.set(0, 4, depth/2 + 0.02);
        buildingGroup.add(sign);
    }

    addBuildingIdentifierBoards(buildingGroup, label, width, depth) {
        if (!label) {
            return;
        }

        const boardText = label.toUpperCase();
        const boardWidth = Math.min(width * 0.9, 9);
        const boardHeight = 1.8;
        const boardSpacing = depth / 2 + 1.5;
        const placements = [
            { position: new THREE.Vector3(0, 0, boardSpacing), rotationY: 0, primary: true },
            { position: new THREE.Vector3(0, 0, -boardSpacing), rotationY: Math.PI, primary: false }
        ];

        placements.forEach(spec => {
            const board = this.createIdentifierBoard(boardText, boardWidth, boardHeight, spec.primary);
            board.position.copy(spec.position);
            board.rotation.y = spec.rotationY;
            buildingGroup.add(board);
        });
    }

    createIdentifierBoard(text, boardWidth, boardHeight, isPrimaryFace) {
        const group = new THREE.Group();

        const baseGeometry = new THREE.BoxGeometry(boardWidth * 0.6, 0.3, 1.2);
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0x0b1120,
            roughness: 0.7,
            metalness: 0.2
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 0.15;
        base.receiveShadow = true;
        group.add(base);

        const stemGeometry = new THREE.BoxGeometry(0.4, 1.2, 0.4);
        const stemMaterial = new THREE.MeshStandardMaterial({
            color: 0x111b2f,
            metalness: 0.35,
            roughness: 0.4,
            emissive: 0x0b1120,
            emissiveIntensity: 0.3
        });
        const stem = new THREE.Mesh(stemGeometry, stemMaterial);
        stem.position.y = 0.75;
        group.add(stem);

        const frameGeometry = new THREE.PlaneGeometry(boardWidth + 0.3, boardHeight + 0.3);
        const frameMaterial = new THREE.MeshLambertMaterial({
            color: isPrimaryFace ? 0x38bdf8 : 0xc084fc,
            emissive: isPrimaryFace ? 0x123b56 : 0x3b1256,
            emissiveIntensity: 0.35
        });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.set(0, 1.5, -0.03);
        group.add(frame);

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 1024;
        canvas.height = 256;
        context.fillStyle = isPrimaryFace ? '#04162E' : '#160924';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = isPrimaryFace ? '#38bdf8' : '#c084fc';
        context.lineWidth = 10;
        context.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);
        context.fillStyle = '#f8fafc';
        context.font = '700 72px "Segoe UI", Arial, sans-serif';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        const boardMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true
        });
        const board = new THREE.Mesh(new THREE.PlaneGeometry(boardWidth, boardHeight), boardMaterial);
        board.position.y = 1.5;
        group.add(board);

        return group;
    }
    
    addImprovedWindows(buildingGroup, width, height, depth, baseColor) {
        // More realistic window materials with reflections
        const windowMaterials = [
            new THREE.MeshLambertMaterial({ 
                color: 0x87ceeb,
                transparent: true,
                opacity: 0.6,
                emissive: 0x001133,
                emissiveIntensity: Math.random() > 0.7 ? 0.3 : 0.1 // Some lit windows
            }),
            new THREE.MeshLambertMaterial({ 
                color: 0x333333,
                transparent: true,
                opacity: 0.8 // Dark/unlit windows
            }),
            new THREE.MeshLambertMaterial({ 
                color: 0xffffcc,
                transparent: true,
                opacity: 0.7,
                emissive: 0x443300,
                emissiveIntensity: 0.4 // Warm lit windows
            })
        ];
        
        const windowSize = 1.2;
        const windowSpacing = 2.2;
        const floorHeight = 3.5;
        
        // Calculate number of floors and windows per floor
        const floors = Math.floor(height / floorHeight);
        const windowsPerFloorX = Math.floor(width / windowSpacing);
        const windowsPerFloorZ = Math.floor(depth / windowSpacing);
        
        // Add windows to front and back faces (Z direction)
        for (let floor = 0; floor < floors; floor++) {
            for (let w = 0; w < windowsPerFloorX; w++) {
                const windowY = (floor + 0.5) * floorHeight;
                const windowX = (w - (windowsPerFloorX - 1) / 2) * windowSpacing;
                
                // Front face
                const frontWindow = new THREE.Mesh(
                    new THREE.PlaneGeometry(windowSize, windowSize),
                    windowMaterials[Math.floor(Math.random() * windowMaterials.length)]
                );
                frontWindow.position.set(windowX, windowY, depth/2 + 0.01);
                buildingGroup.add(frontWindow);
                
                // Back face
                const backWindow = new THREE.Mesh(
                    new THREE.PlaneGeometry(windowSize, windowSize),
                    windowMaterials[Math.floor(Math.random() * windowMaterials.length)]
                );
                backWindow.position.set(windowX, windowY, -depth/2 - 0.01);
                backWindow.rotation.y = Math.PI;
                buildingGroup.add(backWindow);
            }
        }
        
        // Add windows to left and right faces (X direction)
        for (let floor = 0; floor < floors; floor++) {
            for (let w = 0; w < windowsPerFloorZ; w++) {
                const windowY = (floor + 0.5) * floorHeight;
                const windowZ = (w - (windowsPerFloorZ - 1) / 2) * windowSpacing;
                
                // Right face
                const rightWindow = new THREE.Mesh(
                    new THREE.PlaneGeometry(windowSize, windowSize),
                    windowMaterials[Math.floor(Math.random() * windowMaterials.length)]
                );
                rightWindow.position.set(width/2 + 0.01, windowY, windowZ);
                rightWindow.rotation.y = Math.PI/2;
                buildingGroup.add(rightWindow);
                
                // Left face
                const leftWindow = new THREE.Mesh(
                    new THREE.PlaneGeometry(windowSize, windowSize),
                    windowMaterials[Math.floor(Math.random() * windowMaterials.length)]
                );
                leftWindow.position.set(-width/2 - 0.01, windowY, windowZ);
                leftWindow.rotation.y = -Math.PI/2;
                buildingGroup.add(leftWindow);
            }
        }
    }

    createBuilding(width, height, depth, color, x, z, isPortfolio = false) {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshLambertMaterial({ color: color });
        
        if (isPortfolio) {
            // Add emissive property for portfolio buildings
            material.emissive = new THREE.Color(color);
            material.emissiveIntensity = 0.1;
        }
        
        const building = new THREE.Mesh(geometry, material);
        building.position.set(x, height / 2, z);
        building.castShadow = true;
        building.receiveShadow = true;
        
        // Add windows
        this.addWindows(building, width, height, depth);
        
        return building;
    }
    
    addWindows(building, width, height, depth) {
        const windowMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x87CEEB,
            transparent: true,
            opacity: 0.8
        });
        
        const windowGeometry = new THREE.PlaneGeometry(0.8, 1.2);
        
        // Front face windows
        for (let i = 0; i < Math.floor(width / 2); i++) {
            for (let j = 0; j < Math.floor(height / 3); j++) {
                const window = new THREE.Mesh(windowGeometry, windowMaterial);
                window.position.set(
                    (i - Math.floor(width / 4)) * 2,
                    (j - Math.floor(height / 6)) * 3,
                    depth / 2 + 0.01
                );
                building.add(window);
            }
        }
    }
    
    createBuildingLabel(building, text, buildingHeight) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;  // Increased resolution
        canvas.height = 128; // Increased resolution
        
        // Background with border
    context.fillStyle = 'rgba(11, 17, 32, 0.92)';
        context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = '#38bdf8';
    context.lineWidth = 3;
        context.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);
        
        // Text
    context.fillStyle = '#e2ecff';
    context.font = '600 34px "Segoe UI", Arial, sans-serif';
        context.textAlign = 'center';
        context.fillText(text, canvas.width / 2, canvas.height / 2 + 12);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshBasicMaterial({ 
            map: texture, 
            transparent: true,
            alphaTest: 0.1
        });
        
        const geometry = new THREE.PlaneGeometry(12, 3);  // Larger label
        const label = new THREE.Mesh(geometry, material);
        label.position.y = buildingHeight / 2 + 3;  // Use passed height parameter
        // Don't set lookAt here - will be updated in animation loop
        building.add(label);
        return label;
    }

    createSectionGuide(building, text, size) {
        if (!text) {
            return null;
        }

        const labelText = text.toUpperCase();
        const guideGroup = new THREE.Group();
        const depthOffset = ((size && size.depth) || 10) / 2 + 4;
        guideGroup.position.set(0, 0, depthOffset);

        const floorHaloGeometry = new THREE.CircleGeometry(2.8, 48);
        const floorHaloMaterial = new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.25
        });
        const floorHalo = new THREE.Mesh(floorHaloGeometry, floorHaloMaterial);
        floorHalo.rotation.x = -Math.PI / 2;
        floorHalo.position.y = 0.02;
        guideGroup.add(floorHalo);

        const pedestalGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.45, 24);
        const pedestalMaterial = new THREE.MeshStandardMaterial({
            color: 0x0b1120,
            emissive: 0x0c1a2f,
            emissiveIntensity: 0.4
        });
        const pedestal = new THREE.Mesh(pedestalGeometry, pedestalMaterial);
        pedestal.castShadow = false;
        pedestal.receiveShadow = true;
        guideGroup.add(pedestal);

        const poleGeometry = new THREE.CylinderGeometry(0.15, 0.2, 2.5, 12);
        const poleMaterial = new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            emissive: 0x38bdf8,
            emissiveIntensity: 0.5
        });
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        pole.position.y = 1.4;
        pole.castShadow = true;
        guideGroup.add(pole);

        const haloGeometry = new THREE.TorusGeometry(0.9, 0.06, 16, 42);
        const haloMaterial = new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.85
        });
        const halo = new THREE.Mesh(haloGeometry, haloMaterial);
        halo.position.y = 2.2;
        halo.rotation.x = Math.PI / 2;
        guideGroup.add(halo);
        this.sectionGuideHalos.push(halo);

        const arrowGeometry = new THREE.ConeGeometry(0.35, 0.9, 24);
        const arrowMaterial = new THREE.MeshStandardMaterial({
            color: 0xfbbf24,
            emissive: 0xfbbf24,
            emissiveIntensity: 0.5
        });
        const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
        arrow.position.y = 3.2;
        arrow.rotation.x = Math.PI;
        guideGroup.add(arrow);

        const panelGeometry = new THREE.PlaneGeometry(6, 1.7);
        const panelMaterial = new THREE.MeshBasicMaterial({
            color: 0x050c1a,
            transparent: true,
            opacity: 0.88
        });
        const panel = new THREE.Mesh(panelGeometry, panelMaterial);
        panel.position.y = 2.8;
        guideGroup.add(panel);

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 128;
        context.fillStyle = 'rgba(5, 11, 26, 0.9)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = '#38bdf8';
        context.lineWidth = 6;
        context.strokeRect(10, 20, canvas.width - 20, canvas.height - 40);
        context.fillStyle = '#e2ecff';
        context.font = '600 46px "Segoe UI", Arial, sans-serif';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(labelText, canvas.width / 2, canvas.height / 2);

        const textTexture = new THREE.CanvasTexture(canvas);
        const textMaterial = new THREE.MeshBasicMaterial({
            map: textTexture,
            transparent: true
        });
        const textMesh = new THREE.Mesh(new THREE.PlaneGeometry(5.6, 1.4), textMaterial);
        textMesh.position.set(0, 2.8, 0.02);
        guideGroup.add(textMesh);

        building.add(guideGroup);
        return [panel, textMesh];
    }
    
    createTrees() {
        // Create more trees throughout the environment
        const treePositions = [
            { x: -120, z: -80 }, { x: -110, z: -90 }, { x: -130, z: -70 },
            { x: 120, z: -80 }, { x: 110, z: -90 }, { x: 130, z: -70 },
            { x: -120, z: 80 }, { x: -110, z: 90 }, { x: -130, z: 70 },
            { x: 120, z: 80 }, { x: 110, z: 90 }, { x: 130, z: 70 },
            { x: -90, z: -120 }, { x: -80, z: -130 }, { x: -70, z: -110 },
            { x: 90, z: -120 }, { x: 80, z: -130 }, { x: 70, z: -110 },
            { x: -90, z: 120 }, { x: -80, z: 130 }, { x: -70, z: 110 },
            { x: 90, z: 120 }, { x: 80, z: 130 }, { x: 70, z: 110 },
            // Additional scattered trees
            { x: -60, z: -100 }, { x: 60, z: -100 }, { x: -60, z: 100 }, { x: 60, z: 100 },
            { x: -100, z: -60 }, { x: 100, z: -60 }, { x: -100, z: 60 }, { x: 100, z: 60 },
            { x: -45, z: -45 }, { x: 45, z: -45 }, { x: -45, z: 45 }, { x: 45, z: 45 },
        ];
        
        treePositions.forEach(pos => {
            const tree = this.createTree(pos.x, pos.z);
            this.scene.add(tree);
        });
        
        // Create forest patches
        this.createForestPatch(-150, -150, 8);
        this.createForestPatch(150, -150, 8);
        this.createForestPatch(-150, 150, 8);
        this.createForestPatch(150, 150, 8);
        
        // Add bushes throughout the environment
        this.createBushes();
    }
    
    createForestPatch(centerX, centerZ, treeCount) {
        for (let i = 0; i < treeCount; i++) {
            const x = centerX + (Math.random() - 0.5) * 40;
            const z = centerZ + (Math.random() - 0.5) * 40;
            const tree = this.createTree(x, z, Math.random() * 0.5 + 0.7); // Vary tree size
            this.scene.add(tree);
        }
    }
    
    createBushes() {
        const bushPositions = [
            // Around buildings
            { x: -35, z: -35 }, { x: 35, z: -35 }, { x: -35, z: 35 }, { x: 35, z: 35 },
            { x: -65, z: -35 }, { x: 65, z: -35 }, { x: -65, z: 35 }, { x: 65, z: 35 },
            { x: -35, z: -65 }, { x: 35, z: -65 }, { x: -35, z: 65 }, { x: 35, z: 65 },
            // Random scattered bushes
            { x: -25, z: -55 }, { x: 25, z: -55 }, { x: -25, z: 55 }, { x: 25, z: 55 },
            { x: -55, z: -25 }, { x: 55, z: -25 }, { x: -55, z: 25 }, { x: 55, z: 25 },
            { x: -75, z: -75 }, { x: 75, z: -75 }, { x: -75, z: 75 }, { x: 75, z: 75 },
            { x: -15, z: -85 }, { x: 15, z: -85 }, { x: -15, z: 85 }, { x: 15, z: 85 },
            { x: -85, z: -15 }, { x: 85, z: -15 }, { x: -85, z: 15 }, { x: 85, z: 15 },
        ];
        
        bushPositions.forEach(pos => {
            this.createBush(pos.x, pos.z);
        });
    }
    
    createBush(x, z) {
        const bushGroup = new THREE.Group();
        
        // Create multiple small spheres for a more realistic bushy look
        const bushColors = [0x228B22, 0x32CD32, 0x006400, 0x90EE90, 0x8FBC8F];
        const sphereCount = Math.floor(Math.random() * 4) + 3;
        
        for (let i = 0; i < sphereCount; i++) {
            const sphereGeometry = new THREE.SphereGeometry(
                Math.random() * 1.2 + 0.8, 12, 8
            );
            const sphereMaterial = new THREE.MeshLambertMaterial({
                color: bushColors[Math.floor(Math.random() * bushColors.length)],
                fog: true
            });
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            
            sphere.position.set(
                (Math.random() - 0.5) * 2.5,
                Math.random() * 1.5 + 1,
                (Math.random() - 0.5) * 2.5
            );
            
            sphere.castShadow = true;
            sphere.receiveShadow = true;
            bushGroup.add(sphere);
        }
        
        // Add some small berry details randomly
        if (Math.random() > 0.7) {
            for (let i = 0; i < 3; i++) {
                const berryGeometry = new THREE.SphereGeometry(0.1, 6, 4);
                const berryMaterial = new THREE.MeshLambertMaterial({
                    color: Math.random() > 0.5 ? 0xFF0000 : 0x800080,
                    emissive: 0x220000,
                    emissiveIntensity: 0.2
                });
                const berry = new THREE.Mesh(berryGeometry, berryMaterial);
                
                berry.position.set(
                    (Math.random() - 0.5) * 2,
                    Math.random() * 2 + 1,
                    (Math.random() - 0.5) * 2
                );
                
                bushGroup.add(berry);
            }
        }
        
        bushGroup.position.set(x, 0, z);
        this.scene.add(bushGroup);
    }
    
    createTree(x, z, scale = 1) {
        const group = new THREE.Group();
        
        // More realistic trunk with texture variation
        const trunkGeometry = new THREE.CylinderGeometry(
            0.6 * scale, 1.0 * scale, 5 * scale, 12
        );
        const trunkMaterial = new THREE.MeshLambertMaterial({ 
            color: new THREE.Color().setHSL(0.083, 0.4, 0.3) // Brown with slight variation
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 2.5 * scale;
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        group.add(trunk);
        
        // Create multiple leaf clusters for realistic canopy
        const leafColors = [0x228B22, 0x32CD32, 0x006400, 0x8FBC8F];
        const leafColor = leafColors[Math.floor(Math.random() * leafColors.length)];
        
        // Main canopy
        const mainCanopyGeometry = new THREE.SphereGeometry(3.5 * scale, 16, 12);
        const mainCanopyMaterial = new THREE.MeshLambertMaterial({ 
            color: leafColor,
            fog: true
        });
        const mainCanopy = new THREE.Mesh(mainCanopyGeometry, mainCanopyMaterial);
        mainCanopy.position.y = 6 * scale;
        mainCanopy.castShadow = true;
        group.add(mainCanopy);
        
        // Add secondary canopy clusters for more natural look
        for (let i = 0; i < 3; i++) {
            const clusterGeometry = new THREE.SphereGeometry(
                (2 + Math.random()) * scale, 12, 8
            );
            const clusterMaterial = new THREE.MeshLambertMaterial({
                color: new THREE.Color(leafColor).multiplyScalar(0.9 + Math.random() * 0.2)
            });
            const cluster = new THREE.Mesh(clusterGeometry, clusterMaterial);
            
            cluster.position.set(
                (Math.random() - 0.5) * 4 * scale,
                (5 + Math.random() * 2) * scale,
                (Math.random() - 0.5) * 4 * scale
            );
            cluster.castShadow = true;
            group.add(cluster);
        }
        
        // Add small branches
        for (let i = 0; i < 4; i++) {
            const branchGeometry = new THREE.CylinderGeometry(
                0.1 * scale, 0.2 * scale, 1.5 * scale, 6
            );
            const branchMaterial = new THREE.MeshLambertMaterial({ 
                color: 0x8B4513
            });
            const branch = new THREE.Mesh(branchGeometry, branchMaterial);
            
            branch.position.set(
                (Math.random() - 0.5) * 2 * scale,
                (3 + Math.random() * 2) * scale,
                (Math.random() - 0.5) * 2 * scale
            );
            branch.rotation.z = (Math.random() - 0.5) * Math.PI / 3;
            branch.castShadow = true;
            group.add(branch);
        }
        
        group.position.set(x, 0, z);
        group.userData = { isTree: true }; // For animation identification
        return group;
    }
    
    createStreetFurniture() {
        // Street lights
        const lightPositions = [
            { x: -35, z: -5 }, { x: 35, z: 5 }, { x: -5, z: -35 }, { x: 5, z: 35 }
        ];
        
        lightPositions.forEach(pos => {
            const streetLight = this.createStreetLight(pos.x, pos.z);
            this.scene.add(streetLight);
        });
    }
    
    createStreetLight(x, z) {
        const group = new THREE.Group();
        
        // Pole
        const poleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 8, 8);
        const poleMaterial = new THREE.MeshLambertMaterial({ color: 0x444444 });
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        pole.position.y = 4;
        pole.castShadow = true;
        group.add(pole);
        
        // Light
        const lightGeometry = new THREE.SphereGeometry(0.5, 8, 6);
        const lightMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xFFFACD,
            emissive: 0xFFFACD,
            emissiveIntensity: 0.5,
            roughness: 0.2
        });
        const light = new THREE.Mesh(lightGeometry, lightMaterial);
        light.position.y = 8;
        group.add(light);
        
        // Add point light
        const pointLight = new THREE.PointLight(0xFFFACD, 0.5, 20);
        pointLight.position.y = 8;
        group.add(pointLight);
        
        group.position.set(x, 0, z);
        return group;
    }
    
    createCar() {
        const carGroup = new THREE.Group();
        
        // Car body - oriented along Z-axis (forward/backward)
        const bodyGeometry = new THREE.BoxGeometry(2, 1, 4); // width, height, length
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.5;
        body.castShadow = true;
        carGroup.add(body);
        
        // Car roof
        const roofGeometry = new THREE.BoxGeometry(1.8, 0.8, 2.5); // width, height, length
        const roofMaterial = new THREE.MeshLambertMaterial({ color: 0xcc0000 });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = 1.4;
        roof.castShadow = true;
        carGroup.add(roof);
        
        // Wheels - positioned for Z-axis oriented car
        const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 8);
        const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
        
        const wheelPositions = [
            { x: 1.1, y: 0.4, z: 1.3 },  // front right
            { x: -1.1, y: 0.4, z: 1.3 }, // front left
            { x: 1.1, y: 0.4, z: -1.3 }, // rear right
            { x: -1.1, y: 0.4, z: -1.3 } // rear left
        ];
        
        wheelPositions.forEach(pos => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.position.set(pos.x, pos.y, pos.z);
            wheel.rotation.z = Math.PI / 2;
            wheel.castShadow = true;
            carGroup.add(wheel);
        });
        
        // Headlights - positioned at the front (positive Z)
        const headlightGeometry = new THREE.SphereGeometry(0.2, 8, 6);
        const headlightMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xFFFFFF,
            emissive: 0xFFFFAA,
            emissiveIntensity: 0.5,
            roughness: 0.3
        });
        
        const headlight1 = new THREE.Mesh(headlightGeometry, headlightMaterial);
        headlight1.position.set(0.7, 0.8, 2.1); // right headlight at front
        carGroup.add(headlight1);
        
        const headlight2 = new THREE.Mesh(headlightGeometry, headlightMaterial);
        headlight2.position.set(-0.7, 0.8, 2.1); // left headlight at front
        carGroup.add(headlight2);
        
        // Add rear lights
        const rearLightGeometry = new THREE.SphereGeometry(0.15, 6, 4);
        const rearLightMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xFF0000,
            emissive: 0x440000,
            emissiveIntensity: 0.3,
            roughness: 0.35
        });
        
        const rearLight1 = new THREE.Mesh(rearLightGeometry, rearLightMaterial);
        rearLight1.position.set(0.7, 0.8, -2.1); // right rear light
        carGroup.add(rearLight1);
        
        const rearLight2 = new THREE.Mesh(rearLightGeometry, rearLightMaterial);
        rearLight2.position.set(-0.7, 0.8, -2.1); // left rear light
        carGroup.add(rearLight2);
        
        // No rotation needed - car is already properly oriented
        carGroup.position.copy(this.carPhysics.position);
        this.car = carGroup;
        this.scene.add(carGroup);
        
        // Create minimap car indicator
        this.createMinimapCarIndicator();
    }
    
    createMinimapCarIndicator() {
        // Create a bright indicator for the car on the minimap
        const indicatorGeometry = new THREE.ConeGeometry(1, 2, 4);
        const indicatorMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xFFFF00,
            emissive: 0xFFFF00,
            emissiveIntensity: 0.5,
            roughness: 0.4
        });
        
        this.minimapCarIndicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
        this.minimapCarIndicator.position.y = 5; // Above ground for visibility
        this.minimapCarIndicator.rotation.y = 0; // Match car rotation (no rotation needed)
        this.scene.add(this.minimapCarIndicator);
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // Modal close button
        const modalClose = document.getElementById('modal-close');
        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeModal());
        }
    }

    setupTouchControls() {
        const mobileControls = document.getElementById('mobile-controls');
        if (!mobileControls) {
            this.isTouchDevice = false;
            return;
        }

        this.mobileControlsElement = mobileControls;

        const updateVisibility = () => {
            const shouldShow = this.shouldUseTouchControls();
            this.isTouchDevice = shouldShow;
            mobileControls.classList.toggle('hidden', !shouldShow);
            mobileControls.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
        };

        updateVisibility();
        window.addEventListener('resize', updateVisibility);
        window.addEventListener('orientationchange', updateVisibility);

        this.bindTouchHold('touch-left', 'left');
        this.bindTouchHold('touch-right', 'right');
        this.bindTouchHold('touch-accelerate', 'accelerate');
        this.bindTouchHold('touch-reverse', 'reverse');
        this.bindTouchTap('touch-interact', () => this.handleTouchInteract());
    }

    bindTouchHold(elementId, actionKey) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const setActive = (isActive, event) => {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            this.touchInput[actionKey] = isActive;
            element.classList.toggle('active', isActive);
        };

        element.addEventListener('pointerdown', (event) => {
            setActive(true, event);
            element.setPointerCapture?.(event.pointerId);
        });

        const clearActive = (event) => {
            setActive(false, event);
            element.releasePointerCapture?.(event.pointerId);
        };

        element.addEventListener('pointerup', clearActive);
        element.addEventListener('pointercancel', clearActive);
        element.addEventListener('pointerleave', clearActive);
    }

    bindTouchTap(elementId, handler) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const handlePointerUp = (event) => {
            event.preventDefault();
            event.stopPropagation();
            handler();
        };

        element.addEventListener('pointerdown', (event) => {
            event.preventDefault();
            event.stopPropagation();
        });
        element.addEventListener('pointerup', handlePointerUp);
        element.addEventListener('pointercancel', (event) => {
            event.preventDefault();
            event.stopPropagation();
        });
        element.addEventListener('click', (event) => {
            event.preventDefault();
            handler();
        });
    }

    handleTouchInteract() {
        if (this.isResumeViewOpen) {
            this.closeResumeView();
            return;
        }

        if (this.isInInteractiveZone && this.currentBuilding) {
            this.openResumeView();
        }
    }

    shouldUseTouchControls() {
        if (typeof window === 'undefined') {
            return false;
        }

        const hasTouchSupport = 'ontouchstart' in window;
        const coarsePointer = window.matchMedia ? window.matchMedia('(pointer: coarse)').matches : false;
        const navigatorHasTouch = typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0;
        return hasTouchSupport || navigatorHasTouch || coarsePointer || window.innerWidth <= 900;
    }
    
    handleKeyDown(e) {
        // Handle resume modal keys first (global handling)
        if (this.isResumeViewOpen) {
            if (e.code === 'KeyQ' || e.code === 'Escape') {
                e.preventDefault();
                this.closeResumeView();
                return;
            }
        }
        
        if (e.code === 'Escape' && e.shiftKey) {
            e.preventDefault();
            this.exitToMainSite();
            return;
        }
        
        if (!this.gameActive) return;
        
        this.keys[e.code] = true;
        
        // Special keys
        if (e.code === 'KeyE' && this.isInInteractiveZone && this.currentBuilding) {
            e.preventDefault();
            this.openResumeView();
        }
        
        // Prevent default for game keys
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) {
            e.preventDefault();
        }
    }
    
    handleKeyUp(e) {
        this.keys[e.code] = false;
    }

    resetInputState() {
        this.keys = {};
        if (this.touchInput) {
            Object.keys(this.touchInput).forEach(key => {
                this.touchInput[key] = false;
            });
        }

        if (this.mobileControlsElement) {
            this.mobileControlsElement.querySelectorAll('.control-button.active').forEach(button => {
                button.classList.remove('active');
            });
        }
    }
    
    gameLoop() {
        const delta = this.clock.getDelta();
        
        if (this.gameActive) {
            this.animationTime += delta;
            this.update(delta);
            this.updateCamera();
            this.updateHUD();
        }
        
        this.render();
        this.animationId = requestAnimationFrame(() => this.gameLoop());
    }
    
    update(delta) {
        this.updateCarPhysics(delta);
        this.updateFuel(delta);
        this.checkPortfolioSections();
        this.animateEnvironment(delta);
        this.updateBuildingLabels();
        this.updateSpeedEffects(delta);
    }
    
    updateBuildingLabels() {
        if (this.buildingLabels && this.buildingLabels.length) {
            this.buildingLabels.forEach(label => {
                if (label && label.lookAt) {
                    label.lookAt(this.camera.position);
                }
            });
        }

        if (this.sectionGuideLabels && this.sectionGuideLabels.length) {
            this.sectionGuideLabels.forEach(mesh => {
                if (mesh && mesh.lookAt) {
                    mesh.lookAt(this.camera.position);
                }
            });
        }
    }
    
    updateCarPhysics(delta) {
        // Handle input
        let steerInput = 0;
        let throttleInput = 0;
        let brakeInput = 0;
        let reverseInput = 0;
        
        // Fixed controls: A = left, D = right
        if (this.keys['ArrowLeft'] || this.keys['KeyA']) steerInput = 1;
        if (this.keys['ArrowRight'] || this.keys['KeyD']) steerInput = -1;
        if (this.keys['ArrowUp'] || this.keys['KeyW']) throttleInput = 1;
        if (this.keys['ArrowDown'] || this.keys['KeyS']) reverseInput = 1;

        if (this.touchInput) {
            if (this.touchInput.left && !this.touchInput.right) {
                steerInput = 1;
            } else if (this.touchInput.right) {
                steerInput = -1;
            }

            if (this.touchInput.accelerate) {
                throttleInput = 1;
            }

            if (this.touchInput.reverse) {
                reverseInput = 1;
            }
        }
        
        // Calculate forces with enhanced acceleration
        const speedFactor = 1 - (Math.abs(this.carPhysics.speed) / this.carPhysics.maxSpeed);
        const engineForce = throttleInput * this.carPhysics.acceleration * (0.3 + speedFactor * 0.7);
        const reverseForce = reverseInput * this.carPhysics.acceleration * 0.6; // Reverse is slower
        const netForce = engineForce - reverseForce;
        
        // Update speed with enhanced acceleration multiplier
        this.carPhysics.speed += netForce * delta * 25; // Increased from 15 for better acceleration
        
        // Allow reverse up to 30% of max speed
        const maxReverseSpeed = -this.carPhysics.maxSpeed * 0.3;
        this.carPhysics.speed = Math.max(maxReverseSpeed, Math.min(this.carPhysics.maxSpeed, this.carPhysics.speed));
        
        // Apply friction (less at higher speeds for realistic feel)
        const frictionFactor = Math.pow(this.carPhysics.friction, delta * 60);
        this.carPhysics.speed *= frictionFactor;
        
        // Enhanced steering with speed-dependent responsiveness
        if (Math.abs(steerInput) > 0 && Math.abs(this.carPhysics.speed) > 0.5) {
            const speedBasedTurning = Math.min(1, Math.abs(this.carPhysics.speed) / 10);
            const turnRate = this.carPhysics.turnSpeed * speedBasedTurning;
            // Reverse steering when going backwards
            const steerDirection = this.carPhysics.speed < 0 ? -steerInput : steerInput;
            this.carPhysics.rotation += steerDirection * turnRate * delta * 60;
        }
        
        // Update position with corrected movement calculation
        const moveX = Math.sin(this.carPhysics.rotation) * this.carPhysics.speed * delta;
        const moveZ = Math.cos(this.carPhysics.rotation) * this.carPhysics.speed * delta;
        
        this.carPhysics.position.x += moveX;
        this.carPhysics.position.z += moveZ;
        
        // Keep in bounds
        const bounds = this.worldSize.width / 2 - 10;
        this.carPhysics.position.x = Math.max(-bounds, Math.min(bounds, this.carPhysics.position.x));
        this.carPhysics.position.z = Math.max(-bounds, Math.min(bounds, this.carPhysics.position.z));
        
        // Update car mesh
        this.car.position.copy(this.carPhysics.position);
        this.car.rotation.y = this.carPhysics.rotation;
        
        // Update minimap car indicator
        if (this.minimapCarIndicator) {
            this.minimapCarIndicator.position.x = this.carPhysics.position.x;
            this.minimapCarIndicator.position.z = this.carPhysics.position.z;
            this.minimapCarIndicator.rotation.y = this.carPhysics.rotation;
        }
    }
    
    updateCamera() {
        // Enhanced dynamic camera with dramatic speed-based distance
        const baseDistance = 15;
        const speedDistance = Math.abs(this.carPhysics.speed) * 0.8; // Increased from 0.3
        const cameraDistance = baseDistance + speedDistance;
        const cameraHeight = 8 + speedDistance * 0.5; // More dramatic height change
        
        // Corrected camera positioning - camera behind the car
        const targetX = this.carPhysics.position.x - Math.sin(this.carPhysics.rotation) * cameraDistance;
        const targetZ = this.carPhysics.position.z - Math.cos(this.carPhysics.rotation) * cameraDistance;
        
        // Faster camera follow at high speeds for more responsive feel
        const followSpeed = Math.min(0.2, 0.08 + Math.abs(this.carPhysics.speed) * 0.004);
        
        this.camera.position.x += (targetX - this.camera.position.x) * followSpeed;
        this.camera.position.y = cameraHeight;
        this.camera.position.z += (targetZ - this.camera.position.z) * followSpeed;
        
        // Look much further ahead at high speeds for speed sensation
        const lookAheadDistance = this.carPhysics.speed * 1.2; // Increased from 0.5
        const lookAtX = this.carPhysics.position.x + Math.sin(this.carPhysics.rotation) * lookAheadDistance;
        const lookAtZ = this.carPhysics.position.z + Math.cos(this.carPhysics.rotation) * lookAheadDistance;
        
        this.camera.lookAt(lookAtX, this.carPhysics.position.y + 2, lookAtZ);
        
        // Update minimap camera to follow car
        this.minimapCamera.position.x = this.carPhysics.position.x;
        this.minimapCamera.position.z = this.carPhysics.position.z;
    }
    
    updateFuel(delta) {
        // Fuel consumption
        if (this.carPhysics.speed > 1) {
            this.fuel = Math.max(0, this.fuel - delta * 2);
        }
    }
    
    updateHUD() {
        // Update speed display with reverse indication
        const speedDisplay = document.getElementById('speed-display');
        if (speedDisplay) {
            const kmh = Math.round(Math.abs(this.carPhysics.speed) * 15);
            const gearText = this.carPhysics.speed < 0 ? 'R' : 'D';
            speedDisplay.textContent = `${kmh} km/h [${gearText}]`;

            // Color-code based on speed ranges
            if (kmh > 140) {
                speedDisplay.style.color = '#f97316';
                speedDisplay.style.textShadow = '0 0 10px #f97316';
            } else if (kmh > 100) {
                speedDisplay.style.color = '#fbbf24';
                speedDisplay.style.textShadow = '0 0 8px #fbbf24';
            } else if (kmh > 60) {
                speedDisplay.style.color = '#38bdf8';
                speedDisplay.style.textShadow = '0 0 6px #38bdf8';
            } else if (this.carPhysics.speed < 0) {
                speedDisplay.style.color = '#f472b6'; // Soft magenta for reverse
                speedDisplay.style.textShadow = '0 0 4px #f472b6';
            } else {
                speedDisplay.style.color = '#e0f2fe';
                speedDisplay.style.textShadow = '0 0 4px #22d3ee';
            }
        }
        
        // Update fuel display
        const fuelDisplay = document.getElementById('fuel-display');
        if (fuelDisplay) {
            fuelDisplay.textContent = `${Math.round(this.fuel)}%`;
            fuelDisplay.style.color = this.fuel < 20 ? '#f97316' : '#e0f2fe';
        }
    }
    
    checkPortfolioSections() {
        this.nearSection = null;
        this.isInInteractiveZone = false;
        this.currentBuilding = null;
        
        for (const building of this.buildings) {
            const distance = this.carPhysics.position.distanceTo(building.position);
            if (distance < 8) {
                this.nearSection = building.userData;
                this.isInInteractiveZone = true;
                this.currentBuilding = building;
                
                // Highlight building - find the main mesh in the group
                building.traverse((child) => {
                    if (child.isMesh && child.material && child.material.emissive) {
                        child.material.emissiveIntensity = 0.3;
                    }
                });
                break;
            } else {
                // Reset highlight
                building.traverse((child) => {
                    if (child.isMesh && child.material && child.material.emissive) {
                        child.material.emissiveIntensity = 0.1;
                    }
                });
            }
        }
        
        // Update interaction prompt
        this.updateInteractionPrompt();
    }
    
    animateEnvironment(delta) {
        // Animate trees swaying
        this.scene.traverse((object) => {
            if (object.userData && object.userData.isTree) {
                object.rotation.z = Math.sin(this.animationTime + object.position.x * 0.01) * 0.1;
            }
        });

        if (this.sectionGuideHalos && this.sectionGuideHalos.length) {
            this.sectionGuideHalos.forEach((halo, index) => {
                if (halo) {
                    halo.rotation.z += delta * 0.8;
                    if (halo.material) {
                        const baseOpacity = 0.55;
                        const pulse = (Math.sin(this.animationTime * 2 + index) + 1) * 0.25;
                        halo.material.opacity = Math.min(1, baseOpacity + pulse * 0.4);
                    }
                }
            });
        }
    }
    
    updateSpeedEffects(delta) {
        const speed = Math.abs(this.carPhysics.speed);
        const speedFactor = Math.min(speed / this.carPhysics.maxSpeed, 1);
        
        // Dynamic FOV based on speed for speed sensation
        const baseFOV = 75;
        const maxFOVIncrease = 25; // Increased for more dramatic effect
        const targetFOV = baseFOV + (speedFactor * maxFOVIncrease);
        
        // Smooth FOV transition
        this.camera.fov += (targetFOV - this.camera.fov) * delta * 8; // Faster transition
        this.camera.updateProjectionMatrix();
        
        // Dynamic motion blur effect through increased fog at high speeds
        if (this.scene.fog) {
            const baseFogNear = 80;
            const baseFogFar = 250;
            const speedBlur = speedFactor * 50; // Increased effect
            
            this.scene.fog.near = Math.max(baseFogNear - speedBlur, 15);
            this.scene.fog.far = baseFogFar + speedBlur * 2;
        }
        
        // Camera shake at very high speeds
        if (speed > this.carPhysics.maxSpeed * 0.7) {
            const shakeIntensity = (speed / this.carPhysics.maxSpeed - 0.7) * 0.8; // Increased intensity
            this.camera.position.x += (Math.random() - 0.5) * shakeIntensity;
            this.camera.position.y += (Math.random() - 0.5) * shakeIntensity * 0.3;
            this.camera.position.z += (Math.random() - 0.5) * shakeIntensity * 0.5;
        }
        
        // Enhanced ground texture blur simulation through camera movement
        if (speed > 20) {
            const pulseEffect = Math.sin(Date.now() * 0.02) * speedFactor * 1.2;
            this.camera.position.y += pulseEffect * 0.3;
            
            // Add slight camera tilt at high speeds
            this.camera.rotation.z = Math.sin(Date.now() * 0.01) * speedFactor * 0.02;
        }
    }
    
    showPortfolioSection(section) {
        const modal = document.getElementById('portfolio-modal');
        const title = document.getElementById('modal-title');
        const description = document.getElementById('modal-description');
        
        if (modal && title && description) {
            title.textContent = section.title;
            description.textContent = section.description;
            modal.classList.remove('hidden');
        }
    }
    
    closeModal() {
        const modal = document.getElementById('portfolio-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }
    
    updateInteractionPrompt() {
        const prompt = document.getElementById('interaction-prompt');
        const promptTitle = document.getElementById('prompt-title');
        const promptDescription = document.getElementById('prompt-description');
        
        if (this.isInInteractiveZone && this.currentBuilding && !this.isResumeViewOpen) {
            const userData = this.currentBuilding.userData;
            if (userData && userData.title) {
                promptTitle.textContent = userData.title;
                promptDescription.textContent = userData.description;
                prompt.classList.remove('hidden');
            }
        } else {
            prompt.classList.add('hidden');
        }
    }
    
    openResumeView() {
        if (!this.currentBuilding || !this.currentBuilding.userData) return;
        
        const userData = this.currentBuilding.userData;
        const portfolioSection = this.portfolioSections.find(section => 
            section.debugCode === userData.debugCode
        );
        
        if (!portfolioSection || !portfolioSection.resumeContent) return;
        
        const modal = document.getElementById('resume-modal');
        const title = document.getElementById('resume-title');
        const body = document.getElementById('resume-body');
        
        if (modal && title && body) {
            title.textContent = portfolioSection.resumeContent.title;
            body.innerHTML = portfolioSection.resumeContent.content;
            
            modal.classList.remove('hidden');
            this.isResumeViewOpen = true;
            
            // Pause car movement
            this.gameActive = false;
            this.resetInputState();
        }
    }
    
    closeResumeView() {
        const modal = document.getElementById('resume-modal');
        if (modal) {
            modal.classList.add('hidden');
            this.isResumeViewOpen = false;
            this.resetInputState();
            this.gameActive = true;
        }
    }
    
    exitToMainSite() {
        // Navigate back to the main portfolio site
        window.location.href = 'index.html';
    }
    
    render() {
        try {
            // Render main 3D view
            this.renderer.render(this.scene, this.camera);
            
            // Render minimap (top-down view)
            this.minimapRenderer.render(this.scene, this.minimapCamera);
        } catch (error) {
            console.error('❌ Render error:', error);
        }
    }
}

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 Starting 3D Portfolio Game...');
    new PortfolioGame3D();
});
