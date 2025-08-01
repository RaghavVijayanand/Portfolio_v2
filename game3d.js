// =============================================================================
// PORTFOLIO GAME MODE - 3D VERSION WITH THREE.JS
// =============================================================================

class PortfolioGame3D {
    constructor() {
        console.log('🎮 Initializing 3D Portfolio Game...');
        
        // Three.js core objects
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        
        // Minimap system
        this.minimapCamera = null;
        this.minimapRenderer = null;
        this.minimapSize = 200;
        
        // Game objects
        this.car = null;
        this.world = null;
        this.buildings = [];
        this.trees = [];
        this.roads = [];
        this.particles = [];
        
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
        
        // Portfolio sections as 3D buildings - positioned safely away from roads
        this.portfolioSections = [
            {
                id: 'about',
                title: 'About Me [P1]',
                position: { x: -50, z: -15 }, // Moved away from roads
                size: { width: 18, height: 25, depth: 12 }, // Increased size
                color: 0x3498db,
                description: 'Learn about my background, skills, and journey as a developer.',
                type: 'office',
                debugCode: 'P1',
                resumeContent: {
                    title: 'About Me',
                    content: `
                        <h2>Professional Summary</h2>
                        <p>Passionate Full-Stack Developer with 5+ years of experience in building modern web applications. 
                        I specialize in JavaScript, React, Node.js, and cloud technologies.</p>
                        
                        <h3>Background</h3>
                        <p>Started my journey in computer science with a focus on problem-solving and creating 
                        innovative solutions. I believe in writing clean, maintainable code and staying up-to-date 
                        with the latest industry trends.</p>
                        
                        <h3>Interests</h3>
                        <ul>
                            <li>3D Graphics and WebGL</li>
                            <li>AI and Machine Learning</li>
                            <li>Game Development</li>
                            <li>Open Source Contribution</li>
                        </ul>
                    `
                }
            },
            {
                id: 'projects',
                title: 'Projects [P2]',
                position: { x: 50, z: -15 }, // Moved away from roads
                size: { width: 20, height: 28, depth: 15 }, // Increased size
                color: 0xe74c3c,
                description: 'Explore my latest projects and applications.',
                type: 'tech',
                debugCode: 'P2',
                resumeContent: {
                    title: 'Featured Projects',
                    content: `
                        <h2>Recent Projects</h2>
                        
                        <h3>🚗 3D Portfolio Racing Game</h3>
                        <p><strong>Technologies:</strong> Three.js, WebGL, JavaScript</p>
                        <p>Interactive 3D world for portfolio exploration with realistic physics and dynamic lighting.</p>
                        
                        <h3>🛍️ E-Commerce Platform</h3>
                        <p><strong>Technologies:</strong> React, Node.js, MongoDB, Stripe</p>
                        <p>Full-stack application with payment integration and real-time inventory management.</p>
                        
                        <h3>📱 Mobile Task Manager</h3>
                        <p><strong>Technologies:</strong> React Native, Firebase, Redux</p>
                        <p>Cross-platform mobile app with offline sync and team collaboration features.</p>
                        
                        <h3>🤖 AI Chat Assistant</h3>
                        <p><strong>Technologies:</strong> Python, OpenAI API, FastAPI</p>
                        <p>Intelligent chatbot with natural language processing and context awareness.</p>
                    `
                }
            },
            {
                id: 'skills',
                title: 'Skills [P3]',
                position: { x: -65, z: 15 }, // Moved further away from roads
                size: { width: 19, height: 26, depth: 13 }, // Increased size
                color: 0x2ecc71,
                description: 'Discover my technical skills and expertise.',
                type: 'school',
                debugCode: 'P3',
                resumeContent: {
                    title: 'Technical Skills',
                    content: `
                        <h2>Programming Languages</h2>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                            <div>
                                <h4>Frontend</h4>
                                <ul>
                                    <li>JavaScript (ES6+)</li>
                                    <li>TypeScript</li>
                                    <li>React.js</li>
                                    <li>Vue.js</li>
                                    <li>HTML5 & CSS3</li>
                                    <li>Three.js & WebGL</li>
                                </ul>
                            </div>
                            <div>
                                <h4>Backend</h4>
                                <ul>
                                    <li>Node.js</li>
                                    <li>Python</li>
                                    <li>Express.js</li>
                                    <li>FastAPI</li>
                                    <li>PostgreSQL</li>
                                    <li>MongoDB</li>
                                </ul>
                            </div>
                        </div>
                        
                        <h3>Tools & Technologies</h3>
                        <p><strong>Cloud:</strong> AWS, Google Cloud, Docker, Kubernetes</p>
                        <p><strong>DevOps:</strong> Git, CI/CD, Jenkins, GitHub Actions</p>
                        <p><strong>Testing:</strong> Jest, Cypress, Selenium</p>
                    `
                }
            },
            {
                id: 'experience',
                title: 'Experience [P4]',
                position: { x: 50, z: 55 }, // Moved away from roads
                size: { width: 22, height: 30, depth: 16 }, // Increased size
                color: 0xf39c12,
                description: 'My professional journey and work experience.',
                type: 'corporate',
                debugCode: 'P4',
                resumeContent: {
                    title: 'Work Experience',
                    content: `
                        <h2>Professional Experience</h2>
                        
                        <h3>Senior Full-Stack Developer</h3>
                        <p><strong>TechCorp Solutions</strong> | 2022 - Present</p>
                        <ul>
                            <li>Led development of microservices architecture serving 100K+ users</li>
                            <li>Implemented CI/CD pipelines reducing deployment time by 60%</li>
                            <li>Mentored junior developers and conducted code reviews</li>
                            <li>Built real-time features using WebSockets and Redis</li>
                        </ul>
                        
                        <h3>Frontend Developer</h3>
                        <p><strong>Digital Agency Inc.</strong> | 2020 - 2022</p>
                        <ul>
                            <li>Developed responsive web applications using React and Vue.js</li>
                            <li>Collaborated with design team to implement pixel-perfect UIs</li>
                            <li>Optimized application performance improving load times by 40%</li>
                            <li>Integrated third-party APIs and payment systems</li>
                        </ul>
                        
                        <h3>Junior Developer</h3>
                        <p><strong>StartupHub</strong> | 2019 - 2020</p>
                        <ul>
                            <li>Built features for MVP products using JavaScript and Node.js</li>
                            <li>Participated in agile development and sprint planning</li>
                            <li>Wrote unit tests achieving 85%+ code coverage</li>
                        </ul>
                    `
                }
            },
            {
                id: 'contact',
                title: 'Contact [P5]',
                position: { x: -15, z: 70 }, // Moved away from roads
                size: { width: 16, height: 22, depth: 10 }, // Increased size
                color: 0x9b59b6,
                description: 'Get in touch with me!',
                type: 'home',
                debugCode: 'P5',
                resumeContent: {
                    title: 'Contact Information',
                    content: `
                        <h2>Let's Connect!</h2>
                        
                        <h3>📧 Contact Details</h3>
                        <p><strong>Email:</strong> your.email@example.com</p>
                        <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                        <p><strong>Location:</strong> San Francisco, CA</p>
                        
                        <h3>🌐 Online Presence</h3>
                        <p><strong>LinkedIn:</strong> linkedin.com/in/yourprofile</p>
                        <p><strong>GitHub:</strong> github.com/yourusername</p>
                        <p><strong>Portfolio:</strong> yourportfolio.com</p>
                        
                        <h3>💼 Availability</h3>
                        <p>Currently open to new opportunities and freelance projects. 
                        Feel free to reach out for collaborations or just to say hello!</p>
                        
                        <p><em>Preferred contact method: Email</em></p>
                        <p><em>Response time: Within 24 hours</em></p>
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
            
            // Initial camera position
            this.camera.position.set(0, 15, 20);
            this.camera.lookAt(0, 0, 0);
            
            // Add a test cube to verify rendering
            const testGeometry = new THREE.BoxGeometry(5, 5, 5);
            const testMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            const testCube = new THREE.Mesh(testGeometry, testMaterial);
            testCube.position.set(0, 2.5, 0);
            this.scene.add(testCube);
            console.log('✅ Test cube added');
            
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
        this.minimapRenderer.domElement.style.border = '3px solid #00ff00';
        this.minimapRenderer.domElement.style.borderRadius = '10px';
        this.minimapRenderer.domElement.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.5)';
        this.minimapRenderer.domElement.style.zIndex = '1000';
        this.minimapRenderer.domElement.style.background = 'rgba(0, 0, 0, 0.8)';
        
        container.appendChild(this.minimapRenderer.domElement);
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    createSky() {
        // Create a beautiful gradient sky
        const skyGeometry = new THREE.SphereGeometry(300, 32, 32);
        
        // Create sky material with gradient
        const skyMaterial = new THREE.ShaderMaterial({
            uniforms: {
                topColor: { value: new THREE.Color(0x0077ff) },
                bottomColor: { value: new THREE.Color(0xffffff) },
                offset: { value: 33 },
                exponent: { value: 0.6 }
            },
            vertexShader: `
                varying vec3 vWorldPosition;
                void main() {
                    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                    vWorldPosition = worldPosition.xyz;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 topColor;
                uniform vec3 bottomColor;
                uniform float offset;
                uniform float exponent;
                varying vec3 vWorldPosition;
                void main() {
                    float h = normalize(vWorldPosition + offset).y;
                    gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
                }
            `,
            side: THREE.BackSide
        });
        
        const sky = new THREE.Mesh(skyGeometry, skyMaterial);
        this.scene.add(sky);
        
        // Add some clouds
        this.createClouds();
        
        // Add fog for depth
        this.scene.fog = new THREE.Fog(0x87CEEB, 80, 250);
    }
    
    createClouds() {
        const cloudGeometry = new THREE.SphereGeometry(10, 8, 8);
        const cloudMaterial = new THREE.MeshLambertMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.7
        });
        
        for (let i = 0; i < 20; i++) {
            const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
            cloud.position.set(
                (Math.random() - 0.5) * 400,
                Math.random() * 50 + 60,
                (Math.random() - 0.5) * 400
            );
            cloud.scale.set(
                Math.random() * 2 + 1,
                Math.random() * 0.5 + 0.5,
                Math.random() * 2 + 1
            );
            this.scene.add(cloud);
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
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);
        
        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(50, 50, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 200;
        directionalLight.shadow.camera.left = -100;
        directionalLight.shadow.camera.right = 100;
        directionalLight.shadow.camera.top = 100;
        directionalLight.shadow.camera.bottom = -100;
        this.scene.add(directionalLight);
        
        // Point lights for atmosphere
        const pointLight1 = new THREE.PointLight(0xffa500, 0.5, 30);
        pointLight1.position.set(20, 10, 20);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0x00ff00, 0.3, 25);
        pointLight2.position.set(-30, 8, -30);
        this.scene.add(pointLight2);
    }
    
    createWorld() {
        // Ground plane
        const groundGeometry = new THREE.PlaneGeometry(this.worldSize.width, this.worldSize.height);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x7FB069,
            transparent: true,
            opacity: 0.9
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // Create roads
        this.createRoads();
        
        // Create portfolio buildings
        this.createPortfolioBuildings();
        
        // Create scenery buildings
        this.createSceneryBuildings();
        
        // Create trees
        this.createTrees();
        
        // Create street furniture
        this.createStreetFurniture();
    }
    
    createRoads() {
        const roadMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        
        // Main horizontal roads
        const mainRoadGeometry = new THREE.PlaneGeometry(this.worldSize.width, 8);
        
        // Road 1
        const road1 = new THREE.Mesh(mainRoadGeometry, roadMaterial);
        road1.rotation.x = -Math.PI / 2;
        road1.position.y = 0.1;
        road1.position.z = 0;
        this.scene.add(road1);
        
        // Road 2
        const road2 = new THREE.Mesh(mainRoadGeometry, roadMaterial);
        road2.rotation.x = -Math.PI / 2;
        road2.position.y = 0.1;
        road2.position.z = 40;
        this.scene.add(road2);
        
        // Road 3
        const road3 = new THREE.Mesh(mainRoadGeometry, roadMaterial);
        road3.rotation.x = -Math.PI / 2;
        road3.position.y = 0.1;
        road3.position.z = -40;
        this.scene.add(road3);
        
        // Vertical roads
        const verticalRoadGeometry = new THREE.PlaneGeometry(8, this.worldSize.height);
        
        // Road 4
        const road4 = new THREE.Mesh(verticalRoadGeometry, roadMaterial);
        road4.rotation.x = -Math.PI / 2;
        road4.position.y = 0.1;
        road4.position.x = 30;
        this.scene.add(road4);
        
        // Road 5
        const road5 = new THREE.Mesh(verticalRoadGeometry, roadMaterial);
        road5.rotation.x = -Math.PI / 2;
        road5.position.y = 0.1;
        road5.position.x = -30;
        this.scene.add(road5);
        
        // Add road markings
        this.createRoadMarkings();
    }
    
    createRoadMarkings() {
        const markingMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        
        // Main roads center lines
        const centerLineGeometry = new THREE.PlaneGeometry(2, 0.3);
        
        // Horizontal roads center lines
        [-40, 0, 40].forEach(z => {
            for (let x = -this.worldSize.width/2; x < this.worldSize.width/2; x += 6) {
                const marking = new THREE.Mesh(centerLineGeometry, markingMaterial);
                marking.rotation.x = -Math.PI / 2;
                marking.position.set(x, 0.15, z);
                this.scene.add(marking);
            }
        });
        
        // Vertical roads center lines
        [-30, 30].forEach(x => {
            for (let z = -this.worldSize.height/2; z < this.worldSize.height/2; z += 6) {
                const marking = new THREE.Mesh(centerLineGeometry, markingMaterial);
                marking.rotation.x = -Math.PI / 2;
                marking.rotation.z = Math.PI / 2;
                marking.position.set(x, 0.15, z);
                this.scene.add(marking);
            }
        });
        
        // Add crosswalk markings at intersections
        this.createCrosswalks();
    }
    
    createCrosswalks() {
        const crosswalkMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        const crosswalkGeometry = new THREE.PlaneGeometry(1, 8);
        
        // Crosswalks at major intersections
        const intersections = [
            { x: -30, z: 0 }, { x: 30, z: 0 },
            { x: -30, z: 40 }, { x: 30, z: 40 },
            { x: -30, z: -40 }, { x: 30, z: -40 }
        ];
        
        intersections.forEach(intersection => {
            // Horizontal crosswalk
            for (let i = -3; i <= 3; i += 2) {
                const crosswalk = new THREE.Mesh(crosswalkGeometry, crosswalkMaterial);
                crosswalk.rotation.x = -Math.PI / 2;
                crosswalk.position.set(intersection.x + i, 0.16, intersection.z);
                this.scene.add(crosswalk);
            }
            
            // Vertical crosswalk
            const verticalCrosswalkGeometry = new THREE.PlaneGeometry(8, 1);
            for (let i = -3; i <= 3; i += 2) {
                const crosswalk = new THREE.Mesh(verticalCrosswalkGeometry, crosswalkMaterial);
                crosswalk.rotation.x = -Math.PI / 2;
                crosswalk.position.set(intersection.x, 0.16, intersection.z + i);
                this.scene.add(crosswalk);
            }
        });
    }
    
    createPortfolioBuildings() {
        console.log('🏢 Creating Portfolio Buildings...');
        this.portfolioSections.forEach(section => {
            console.log(`📍 Building ${section.debugCode}: ${section.title} at (${section.position.x}, ${section.position.z}) - Size: ${section.size.width}x${section.size.height}x${section.size.depth}`);
            
            const building = this.createRealisticBuilding(
                section.size.width,
                section.size.height,
                section.size.depth,
                section.color,
                section.position.x,
                section.position.z,
                section.type,
                section.debugCode
            );
            
            building.userData = section;
            this.buildings.push(building);
            this.scene.add(building);
            
            // Add building label (pass height as parameter)
            this.createBuildingLabel(building, section.title, section.size.height);
        });
        console.log('✅ Portfolio Buildings Created');
    }
    
    createSceneryBuildings() {
        // Create fewer, strategically placed buildings only in green areas
        const sceneryBuildings = [
            // Buildings in corners (far from roads)
            { x: -60, z: -60, width: 15, height: 20, depth: 12, color: 0x95a5a6, type: 'office', debugCode: 'S1' },
            { x: 60, z: -60, width: 12, height: 18, depth: 9, color: 0x3498db, type: 'residential', debugCode: 'S2' },
            { x: -60, z: 60, width: 18, height: 25, depth: 15, color: 0x2c3e50, type: 'office', debugCode: 'S3' },
            { x: 60, z: 60, width: 14, height: 21, depth: 11, color: 0x9b59b6, type: 'residential', debugCode: 'S4' },
            
            // A few buildings in mid-distance green areas
            { x: -70, z: 15, width: 12, height: 16, depth: 9, color: 0xe74c3c, type: 'shop', debugCode: 'S5' },
            { x: 70, z: -15, width: 15, height: 19, depth: 12, color: 0xf39c12, type: 'commercial', debugCode: 'S6' }
            
            // Removed S7 and S8 - not required and S8 was on road
        ];
        
        sceneryBuildings.forEach(building => {
            console.log(`🏠 Building ${building.debugCode}: ${building.type} at (${building.x}, ${building.z}) - Size: ${building.width}x${building.height}x${building.depth}`);
            const mesh = this.createRealisticBuilding(
                building.width,
                building.height,
                building.depth,
                building.color,
                building.x,
                building.z,
                building.type,
                building.debugCode
            );
            this.scene.add(mesh);
        });
        console.log('✅ Scenery Buildings Created');
    }
    
    createRealisticBuilding(width, height, depth, color, x, z, type, debugCode = null) {
        const buildingGroup = new THREE.Group();
        
        // Main building structure
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshLambertMaterial({ color: color });
        const building = new THREE.Mesh(geometry, material);
        building.position.y = height / 2;
        building.castShadow = true;
        building.receiveShadow = true;
        buildingGroup.add(building);
        
        // Add building name banners on all 4 sides
        if (debugCode) {
            this.addBuildingBanners(buildingGroup, debugCode, width, height, depth);
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
        const windowMaterial = new THREE.MeshBasicMaterial({ 
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
        const signMaterial = new THREE.MeshLambertMaterial({ 
            color: [0xff0000, 0x00ff00, 0x0000ff, 0xffff00][Math.floor(Math.random() * 4)],
            emissive: 0x333333,
            emissiveIntensity: 0.3
        });
        
        const signGeometry = new THREE.PlaneGeometry(width * 0.6, 1);
        const sign = new THREE.Mesh(signGeometry, signMaterial);
        sign.position.set(0, 4, depth/2 + 0.02);
        buildingGroup.add(sign);
    }
    
    addBuildingBanners(buildingGroup, debugCode, width, height, depth) {
        const portfolioTitles = {
            'P1': 'ABOUT ME',
            'P2': 'PROJECTS', 
            'P3': 'SKILLS',
            'P4': 'EXPERIENCE',
            'P5': 'CONTACT'
        };
        
        const title = portfolioTitles[debugCode] || debugCode;
        
        // Create banner on all 4 sides
        const bannerHeight = 3;
        const bannerWidth = Math.max(width * 0.8, depth * 0.8);
        
        const positions = [
            { x: 0, y: height * 0.8, z: depth/2 + 0.1, rotY: 0 }, // Front
            { x: 0, y: height * 0.8, z: -depth/2 - 0.1, rotY: Math.PI }, // Back
            { x: width/2 + 0.1, y: height * 0.8, z: 0, rotY: Math.PI/2 }, // Right
            { x: -width/2 - 0.1, y: height * 0.8, z: 0, rotY: -Math.PI/2 } // Left
        ];
        
        positions.forEach(pos => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = 512;
            canvas.height = 128;
            
            // Background gradient
            const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#001122');
            gradient.addColorStop(1, '#003366');
            context.fillStyle = gradient;
            context.fillRect(0, 0, canvas.width, canvas.height);
            
            // Border
            context.strokeStyle = '#00ffff';
            context.lineWidth = 8;
            context.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);
            
            // Text
            context.fillStyle = '#00ffff';
            context.font = 'bold 36px Arial';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(title, canvas.width/2, canvas.height/2);
            
            // Create material and mesh
            const texture = new THREE.CanvasTexture(canvas);
            const bannerMaterial = new THREE.MeshLambertMaterial({ 
                map: texture,
                transparent: true,
                emissive: 0x002244,
                emissiveIntensity: 0.3
            });
            
            const bannerGeometry = new THREE.PlaneGeometry(bannerWidth, bannerHeight);
            const banner = new THREE.Mesh(bannerGeometry, bannerMaterial);
            banner.position.set(pos.x, pos.y, pos.z);
            banner.rotation.y = pos.rotY;
            buildingGroup.add(banner);
        });
    }
    
    addImprovedWindows(buildingGroup, width, height, depth, baseColor) {
        const windowMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x87ceeb,
            transparent: true,
            opacity: 0.7,
            emissive: 0x001133,
            emissiveIntensity: 0.2
        });
        
        const windowSize = 1.5;
        const windowSpacing = 2.5;
        const floorHeight = 3;
        
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
                    windowMaterial
                );
                frontWindow.position.set(windowX, windowY, depth/2 + 0.01);
                buildingGroup.add(frontWindow);
                
                // Back face
                const backWindow = new THREE.Mesh(
                    new THREE.PlaneGeometry(windowSize, windowSize),
                    windowMaterial
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
                    windowMaterial
                );
                rightWindow.position.set(width/2 + 0.01, windowY, windowZ);
                rightWindow.rotation.y = Math.PI/2;
                buildingGroup.add(rightWindow);
                
                // Left face
                const leftWindow = new THREE.Mesh(
                    new THREE.PlaneGeometry(windowSize, windowSize),
                    windowMaterial
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
        context.fillStyle = 'rgba(0, 0, 0, 0.9)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = '#00ff00';
        context.lineWidth = 4;
        context.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);
        
        // Text
        context.fillStyle = '#00ff00';
        context.font = 'bold 32px Arial';  // Larger font
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
        
        // Create multiple small spheres for a bushy look
        const bushColors = [0x228B22, 0x32CD32, 0x006400, 0x90EE90];
        const sphereCount = Math.floor(Math.random() * 3) + 3;
        
        for (let i = 0; i < sphereCount; i++) {
            const sphereGeometry = new THREE.SphereGeometry(
                Math.random() * 1.5 + 1, 8, 6
            );
            const sphereMaterial = new THREE.MeshLambertMaterial({
                color: bushColors[Math.floor(Math.random() * bushColors.length)]
            });
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            
            sphere.position.set(
                (Math.random() - 0.5) * 2,
                Math.random() * 2 + 1,
                (Math.random() - 0.5) * 2
            );
            
            bushGroup.add(sphere);
        }
        
        bushGroup.position.set(x, 0, z);
        this.scene.add(bushGroup);
    }
    
    createTree(x, z, scale = 1) {
        const group = new THREE.Group();
        
        // Trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.5 * scale, 0.8 * scale, 4 * scale, 8);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 2 * scale;
        trunk.castShadow = true;
        group.add(trunk);
        
        // Leaves - create multiple layers for variety
        const leafColors = [0x228B22, 0x32CD32, 0x006400];
        const leafColor = leafColors[Math.floor(Math.random() * leafColors.length)];
        
        // Main canopy
        const leavesGeometry = new THREE.SphereGeometry(3 * scale, 8, 6);
        const leavesMaterial = new THREE.MeshLambertMaterial({ color: leafColor });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.y = 5 * scale;
        leaves.castShadow = true;
        group.add(leaves);
        
        // Add smaller leaf clusters for more natural look
        for (let i = 0; i < 2; i++) {
            const smallLeavesGeometry = new THREE.SphereGeometry(1.5 * scale, 6, 4);
            const smallLeaves = new THREE.Mesh(smallLeavesGeometry, leavesMaterial);
            smallLeaves.position.set(
                (Math.random() - 0.5) * 3 * scale,
                (4 + Math.random() * 2) * scale,
                (Math.random() - 0.5) * 3 * scale
            );
            smallLeaves.castShadow = true;
            group.add(smallLeaves);
        }
        
        group.position.set(x, 0, z);
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
        const lightMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xFFFACD,
            emissive: 0xFFFACD,
            emissiveIntensity: 0.5
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
        const headlightMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xFFFFFF,
            emissive: 0xFFFFAA,
            emissiveIntensity: 0.5
        });
        
        const headlight1 = new THREE.Mesh(headlightGeometry, headlightMaterial);
        headlight1.position.set(0.7, 0.8, 2.1); // right headlight at front
        carGroup.add(headlight1);
        
        const headlight2 = new THREE.Mesh(headlightGeometry, headlightMaterial);
        headlight2.position.set(-0.7, 0.8, 2.1); // left headlight at front
        carGroup.add(headlight2);
        
        // Add rear lights
        const rearLightGeometry = new THREE.SphereGeometry(0.15, 6, 4);
        const rearLightMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xFF0000,
            emissive: 0x440000,
            emissiveIntensity: 0.3
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
        const indicatorMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xFFFF00,
            emissive: 0xFFFF00,
            emissiveIntensity: 0.5
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
    
    handleKeyDown(e) {
        // Handle resume modal keys first (global handling)
        if (this.isResumeViewOpen) {
            if (e.code === 'KeyQ') {
                e.preventDefault();
                this.closeResumeView();
                return;
            } else if (e.code === 'Escape') {
                e.preventDefault();
                this.exitToMainSite();
                return;
            }
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
        if (!this.gameActive) return;
        this.keys[e.code] = false;
    }
    
    gameLoop() {
        if (!this.gameActive) {
            console.log('⚠️ Game loop stopped - gameActive is false');
            return;
        }
        
        const delta = this.clock.getDelta();
        this.animationTime += delta;
        
        this.update(delta);
        this.updateCamera();
        this.updateHUD();
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
        // Make all building labels face the camera
        this.buildings.forEach(building => {
            if (building.children.length > 0) {
                const label = building.children.find(child => child.material && child.material.map);
                if (label) {
                    label.lookAt(this.camera.position);
                }
            }
        });
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
            if (kmh > 400) {
                speedDisplay.style.color = '#ff0000';
                speedDisplay.style.textShadow = '0 0 10px #ff0000';
            } else if (kmh > 250) {
                speedDisplay.style.color = '#ff8800';
                speedDisplay.style.textShadow = '0 0 8px #ff8800';
            } else if (kmh > 150) {
                speedDisplay.style.color = '#ffff00';
                speedDisplay.style.textShadow = '0 0 6px #ffff00';
            } else if (this.carPhysics.speed < 0) {
                speedDisplay.style.color = '#ff6666'; // Red tint for reverse
                speedDisplay.style.textShadow = '0 0 4px #ff6666';
            } else {
                speedDisplay.style.color = '#ffffff';
                speedDisplay.style.textShadow = '0 0 4px #00ff00';
            }
        }
        
        // Update fuel display
        const fuelDisplay = document.getElementById('fuel-display');
        if (fuelDisplay) {
            fuelDisplay.textContent = `${Math.round(this.fuel)}%`;
            fuelDisplay.style.color = this.fuel < 20 ? '#ff0000' : '#ffffff';
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
        }
    }
    
    closeResumeView() {
        const modal = document.getElementById('resume-modal');
        if (modal) {
            modal.classList.add('hidden');
            this.isResumeViewOpen = false;
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
