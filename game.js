// =============================================================================
// PORTFOLIO GAME MODE - STANDALONE VERSION
// =============================================================================

class PortfolioGame {
    constructor() {
        console.log('🎮 Initializing Portfolio Game...');
        
        this.canvas = null;
        this.ctx = null;
        this.minimap = null;
        this.minimapCtx = null;
        
        this.gameActive = false;
        this.animationId = null;
        
        // Car properties with realistic physics
        this.car = {
            x: 400,
            y: 300,
            angle: 0,
            velocity: { x: 0, y: 0 },
            speed: 0,
            maxSpeed: 12,
            acceleration: 0.4,
            deceleration: 0.6,
            friction: 0.92,
            turnSpeed: 0.03,
            maxTurnSpeed: 0.08,
            mass: 1000,
            width: 30,
            height: 16,
            wheelAngle: 0,
            maxWheelAngle: Math.PI / 6, // 30 degrees
            wheelbase: 20,
            driftThreshold: 0.8,
            isDrifting: false,
            traction: 0.9,
            brakingPower: 0.8
        };
        
        // World properties
        this.world = {
            width: 3000,
            height: 2000,
            camera: { x: 0, y: 0 }
        };
        
        // Game state
        this.keys = {};
        this.fuel = 100;
        this.nearSection = null;
        this.particles = [];
        this.animationTime = 0;
        this.trafficLightTimer = 0;
        
        // Portfolio sections as buildings alongside roads (more realistic positioning)
        this.portfolioSections = [
            {
                id: 'about',
                title: 'About Me',
                x: 150,
                y: 150,
                width: 120,
                height: 80,
                color: '#3498db',
                description: 'Learn about my background, skills, and journey as a developer. Discover what drives my passion for creating amazing digital experiences.',
                type: 'office'
            },
            {
                id: 'projects',
                title: 'Projects',
                x: 1050,
                y: 180,
                width: 140,
                height: 100,
                color: '#e74c3c',
                description: 'Explore my latest projects and applications. From web development to mobile apps, see what I\'ve been building.',
                type: 'tech'
            },
            {
                id: 'skills',
                title: 'Skills',
                x: 650,
                y: 650,
                width: 130,
                height: 90,
                color: '#2ecc71',
                description: 'Discover my technical skills and expertise. From programming languages to frameworks and tools I work with.',
                type: 'school'
            },
            {
                id: 'experience',
                title: 'Experience',
                x: 1850,
                y: 450,
                width: 135,
                height: 95,
                color: '#f39c12',
                description: 'My professional journey and work experience. See where I\'ve worked and what I\'ve accomplished.',
                type: 'corporate'
            },
            {
                id: 'contact',
                title: 'Contact',
                x: 1350,
                y: 1050,
                width: 110,
                height: 85,
                color: '#9b59b6',
                description: 'Get in touch with me! Find my contact information and connect with me on social media.',
                type: 'home'
            }
        ];

        // Add decorative buildings and scenery
        this.sceneryBuildings = [
            // Residential area
            {x: 100, y: 450, width: 80, height: 60, color: '#95a5a6', type: 'house'},
            {x: 200, y: 470, width: 70, height: 55, color: '#bdc3c7', type: 'house'},
            {x: 120, y: 550, width: 75, height: 65, color: '#7f8c8d', type: 'house'},
            
            // Commercial area
            {x: 1350, y: 50, width: 100, height: 120, color: '#34495e', type: 'shop'},
            {x: 1470, y: 60, width: 90, height: 110, color: '#2c3e50', type: 'shop'},
            {x: 1580, y: 70, width: 85, height: 100, color: '#34495e', type: 'shop'},
            
            // Industrial area
            {x: 2200, y: 900, width: 150, height: 140, color: '#5d4e75', type: 'factory'},
            {x: 2400, y: 920, width: 120, height: 120, color: '#6c5ce7', type: 'factory'},
            
            // Park buildings
            {x: 850, y: 1200, width: 60, height: 40, color: '#00b894', type: 'park'},
            {x: 950, y: 1220, width: 55, height: 35, color: '#00cec9', type: 'park'}
        ];

        // Traffic lights and road furniture
        this.trafficLights = [
            {x: 500, y: 300, active: true},
            {x: 1200, y: 300, active: false},
            {x: 500, y: 800, active: false},
            {x: 1200, y: 800, active: true}
        ];

        // Trees positioned more naturally
        this.trees = [
            // Park area
            {x: 900, y: 1100, size: 30}, {x: 950, y: 1120, size: 25}, {x: 880, y: 1140, size: 35},
            {x: 1020, y: 1080, size: 28}, {x: 1080, y: 1150, size: 32}, {x: 940, y: 1180, size: 27},
            
            // Residential area trees
            {x: 250, y: 400, size: 20}, {x: 180, y: 420, size: 22}, {x: 320, y: 380, size: 25},
            {x: 150, y: 600, size: 18}, {x: 280, y: 580, size: 24}, {x: 220, y: 620, size: 21},
            
            // Highway trees
            {x: 2100, y: 200, size: 35}, {x: 2150, y: 180, size: 30}, {x: 2200, y: 220, size: 40},
            {x: 2050, y: 500, size: 33}, {x: 2250, y: 480, size: 38}, {x: 2180, y: 520, size: 32},
            
            // Scattered trees
            {x: 400, y: 100, size: 25}, {x: 700, y: 50, size: 28}, {x: 1600, y: 400, size: 30},
            {x: 800, y: 400, size: 22}, {x: 1800, y: 1200, size: 35}, {x: 600, y: 1300, size: 27}
        ];
        
        this.init();
    }
    
    init() {
        console.log('🚀 Starting game initialization...');
        this.showLoadingScreen();
        
        // Simulate loading time
        let progress = 0;
        const loadingInterval = setInterval(() => {
            progress += Math.random() * 20;
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
        console.log('🎮 Starting game...');
        
        // Hide loading screen
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
        
        // Setup canvas
        this.setupCanvas();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Start game loop
        this.gameActive = true;
        this.gameLoop();
        
        console.log('✅ Game started successfully!');
    }
    
    setupCanvas() {
        this.canvas = document.getElementById('game-canvas');
        this.minimap = document.getElementById('minimap');
        
        if (!this.canvas || !this.minimap) {
            console.error('❌ Canvas elements not found');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.minimapCtx = this.minimap.getContext('2d');
        
        if (!this.ctx || !this.minimapCtx) {
            console.error('❌ Canvas contexts not available');
            return;
        }
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        console.log('✅ Canvas setup complete');
    }
    
    resizeCanvas() {
        if (!this.canvas) return;
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        console.log(`📐 Canvas resized to ${this.canvas.width}x${this.canvas.height}`);
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // Modal close button
        const modalClose = document.getElementById('modal-close');
        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeModal());
        }
        
        // Click outside modal to close
        const modal = document.getElementById('portfolio-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }
    }
    
    handleKeyDown(e) {
        if (!this.gameActive) return;
        
        this.keys[e.code] = true;
        
        // Special keys
        if (e.code === 'KeyE' && this.nearSection) {
            e.preventDefault();
            this.showPortfolioSection(this.nearSection);
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
        if (!this.gameActive) return;
        
        this.update();
        this.render();
        
        this.animationId = requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        this.animationTime += 0.016; // Assuming 60fps
        this.trafficLightTimer += 0.016;
        
        // Switch traffic lights every 5 seconds
        if (this.trafficLightTimer > 5) {
            this.trafficLightTimer = 0;
            this.trafficLights.forEach(light => light.active = !light.active);
        }
        
        this.updateCar();
        this.updateCamera();
        this.updateFuel();
        this.updateParticles();
        this.checkPortfolioSections();
    }
    
    updateCar() {
        // Store previous position for collision detection
        const prevX = this.car.x;
        const prevY = this.car.y;
        
        // Handle steering input
        let steerInput = 0;
        if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
            steerInput = -1;
        }
        if (this.keys['ArrowRight'] || this.keys['KeyD']) {
            steerInput = 1;
        }
        
        // Handle acceleration/braking input
        let throttleInput = 0;
        let brakeInput = 0;
        
        if (this.keys['ArrowUp'] || this.keys['KeyW']) {
            throttleInput = 1;
        }
        if (this.keys['ArrowDown'] || this.keys['KeyS']) {
            brakeInput = 1;
        }
        
        // Calculate current speed
        this.car.speed = Math.sqrt(this.car.velocity.x * this.car.velocity.x + this.car.velocity.y * this.car.velocity.y);
        
        // Steering physics - speed-dependent turning
        const speedFactor = Math.min(this.car.speed / 5, 1);
        const turnRate = this.car.turnSpeed + (this.car.maxTurnSpeed - this.car.turnSpeed) * speedFactor;
        
        if (Math.abs(steerInput) > 0 && this.car.speed > 0.5) {
            this.car.wheelAngle = Math.max(-this.car.maxWheelAngle, 
                Math.min(this.car.maxWheelAngle, this.car.wheelAngle + steerInput * turnRate));
            
            // Calculate turn radius and angular velocity
            const turnRadius = this.car.wheelbase / Math.tan(Math.abs(this.car.wheelAngle));
            const angularVelocity = this.car.speed / turnRadius * Math.sign(this.car.wheelAngle);
            this.car.angle += angularVelocity;
        } else {
            // Return wheels to center when not steering
            this.car.wheelAngle *= 0.85;
        }
        
        // Engine force calculation
        let engineForce = 0;
        if (throttleInput > 0) {
            // Forward acceleration with power curve
            const powerFactor = Math.max(0.2, 1 - (this.car.speed / this.car.maxSpeed));
            engineForce = this.car.acceleration * powerFactor * throttleInput;
        }
        
        // Braking force
        let brakingForce = 0;
        if (brakeInput > 0) {
            brakingForce = this.car.brakingPower * brakeInput;
        }
        
        // Calculate forces in car's local coordinate system
        const forwardForce = engineForce - brakingForce;
        
        // Convert to world coordinates
        const forceX = Math.cos(this.car.angle) * forwardForce;
        const forceY = Math.sin(this.car.angle) * forwardForce;
        
        // Apply forces to velocity
        this.car.velocity.x += forceX;
        this.car.velocity.y += forceY;
        
        // Traction and drift physics
        const forwardSpeed = this.car.velocity.x * Math.cos(this.car.angle) + 
                           this.car.velocity.y * Math.sin(this.car.angle);
        const sideSpeed = -this.car.velocity.x * Math.sin(this.car.angle) + 
                         this.car.velocity.y * Math.cos(this.car.angle);
        
        // Check if drifting
        this.car.isDrifting = Math.abs(sideSpeed) > this.car.driftThreshold && this.car.speed > 3;
        
        // Apply traction (reduce sideways sliding)
        const tractionForce = this.car.isDrifting ? this.car.traction * 0.3 : this.car.traction;
        const maxSideForce = tractionForce * Math.abs(forwardSpeed);
        const sideForce = Math.max(-maxSideForce, Math.min(maxSideForce, -sideSpeed * 0.5));
        
        // Convert side force back to world coordinates
        const sideForceX = -Math.sin(this.car.angle) * sideForce;
        const sideForceY = Math.cos(this.car.angle) * sideForce;
        
        this.car.velocity.x += sideForceX;
        this.car.velocity.y += sideForceY;
        
        // Apply friction
        this.car.velocity.x *= this.car.friction;
        this.car.velocity.y *= this.car.friction;
        
        // Update position
        this.car.x += this.car.velocity.x;
        this.car.y += this.car.velocity.y;
        
        // Collision detection with world boundaries
        const margin = this.car.width / 2;
        if (this.car.x < margin) {
            this.car.x = margin;
            this.car.velocity.x = Math.abs(this.car.velocity.x) * 0.3; // Bounce back
        }
        if (this.car.x > this.world.width - margin) {
            this.car.x = this.world.width - margin;
            this.car.velocity.x = -Math.abs(this.car.velocity.x) * 0.3;
        }
        if (this.car.y < margin) {
            this.car.y = margin;
            this.car.velocity.y = Math.abs(this.car.velocity.y) * 0.3;
        }
        if (this.car.y > this.world.height - margin) {
            this.car.y = this.world.height - margin;
            this.car.velocity.y = -Math.abs(this.car.velocity.y) * 0.3;
        }
        
        // Collision detection with buildings
        this.checkBuildingCollisions(prevX, prevY);
        
        // Create effects based on car state
        if (this.car.speed > 3) {
            this.createSpeedParticles();
        }
        
        if (this.car.isDrifting) {
            this.createDriftSmoke();
        }
        
        // Create tire marks on roads
        if (this.car.speed > 2 && (brakeInput > 0 || this.car.isDrifting)) {
            this.createTireMarks();
        }
    }
    
    updateCamera() {
        // Smooth camera follow
        const targetX = this.car.x - this.canvas.width / 2;
        const targetY = this.car.y - this.canvas.height / 2;
        
        this.world.camera.x += (targetX - this.world.camera.x) * 0.1;
        this.world.camera.y += (targetY - this.world.camera.y) * 0.1;
        
        // Keep camera in world bounds
        this.world.camera.x = Math.max(0, Math.min(this.world.width - this.canvas.width, this.world.camera.x));
        this.world.camera.y = Math.max(0, Math.min(this.world.height - this.canvas.height, this.world.camera.y));
    }
    
    updateFuel() {
        // Fuel consumption based on throttle input and speed
        const throttleInput = (this.keys['ArrowUp'] || this.keys['KeyW']) ? 1 : 0;
        const baseConsumption = 0.005;
        const speedMultiplier = 1 + (this.car.speed / this.car.maxSpeed) * 2;
        const throttleMultiplier = 1 + throttleInput * 2;
        const driftMultiplier = this.car.isDrifting ? 1.5 : 1;
        
        if (this.car.speed > 0.5) {
            this.fuel = Math.max(0, this.fuel - baseConsumption * speedMultiplier * throttleMultiplier * driftMultiplier);
        }
        
        // Reduce max speed when fuel is low
        if (this.fuel < 20) {
            this.car.maxSpeed = 8; // Reduced performance
        } else {
            this.car.maxSpeed = 12; // Full performance
        }
        
        // Update fuel display with color coding
        const fuelDisplay = document.getElementById('fuel-display');
        if (fuelDisplay) {
            fuelDisplay.textContent = `${Math.round(this.fuel)}%`;
            if (this.fuel < 10) {
                fuelDisplay.style.color = '#ff0000';
                fuelDisplay.style.animation = 'blink 1s infinite';
            } else if (this.fuel < 25) {
                fuelDisplay.style.color = '#ff8800';
                fuelDisplay.style.animation = 'none';
            } else {
                fuelDisplay.style.color = '#ffffff';
                fuelDisplay.style.animation = 'none';
            }
        }
        
        // Update speed display with physics-accurate calculation
        const speedDisplay = document.getElementById('speed-display');
        if (speedDisplay) {
            const kmh = Math.round(this.car.speed * 25); // More realistic speed scaling
            speedDisplay.textContent = `${kmh} km/h`;
            
            // Color code speed display
            if (kmh > 200) {
                speedDisplay.style.color = '#ff0000';
            } else if (kmh > 120) {
                speedDisplay.style.color = '#ff8800';
            } else {
                speedDisplay.style.color = '#ffffff';
            }
        }
    }
    
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            particle.alpha = particle.life / particle.maxLife;
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    checkBuildingCollisions(prevX, prevY) {
        for (const section of this.portfolioSections) {
            // Simple rectangular collision detection
            const carLeft = this.car.x - this.car.width / 2;
            const carRight = this.car.x + this.car.width / 2;
            const carTop = this.car.y - this.car.height / 2;
            const carBottom = this.car.y + this.car.height / 2;
            
            const buildingLeft = section.x;
            const buildingRight = section.x + section.width;
            const buildingTop = section.y;
            const buildingBottom = section.y + section.height;
            
            // Check for collision
            if (carRight > buildingLeft && carLeft < buildingRight &&
                carBottom > buildingTop && carTop < buildingBottom) {
                
                // Collision detected - move car back and apply bounce
                this.car.x = prevX;
                this.car.y = prevY;
                
                // Calculate collision normal and apply bounce
                const centerX = section.x + section.width / 2;
                const centerY = section.y + section.height / 2;
                const dx = this.car.x - centerX;
                const dy = this.car.y - centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > 0) {
                    const normalX = dx / distance;
                    const normalY = dy / distance;
                    
                    // Reflect velocity
                    const dotProduct = this.car.velocity.x * normalX + this.car.velocity.y * normalY;
                    this.car.velocity.x = (this.car.velocity.x - 2 * dotProduct * normalX) * 0.5;
                    this.car.velocity.y = (this.car.velocity.y - 2 * dotProduct * normalY) * 0.5;
                    
                    // Create crash particles
                    this.createCrashParticles();
                }
                break;
            }
        }
    }

    createDriftSmoke() {
        if (Math.random() < 0.4) {
            // Create smoke particles from rear wheels
            const rearX = this.car.x - Math.cos(this.car.angle) * 15;
            const rearY = this.car.y - Math.sin(this.car.angle) * 15;
            
            for (let i = 0; i < 2; i++) {
                this.particles.push({
                    x: rearX + (Math.random() - 0.5) * 10,
                    y: rearY + (Math.random() - 0.5) * 10,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    life: 40 + Math.random() * 20,
                    maxLife: 60,
                    alpha: 0.8,
                    color: '#ddd',
                    size: 3 + Math.random() * 4,
                    type: 'smoke'
                });
            }
        }
    }

    createTireMarks() {
        if (Math.random() < 0.3) {
            this.particles.push({
                x: this.car.x,
                y: this.car.y,
                vx: 0,
                vy: 0,
                life: 200,
                maxLife: 200,
                alpha: 0.6,
                color: '#333',
                size: 2,
                type: 'mark'
            });
        }
    }

    createCrashParticles() {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: this.car.x,
                y: this.car.y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 30,
                maxLife: 30,
                alpha: 1,
                color: Math.random() < 0.5 ? '#ff6b35' : '#ffd700',
                size: 2 + Math.random() * 3,
                type: 'spark'
            });
        }
    }
    
    createSpeedParticles() {
        if (Math.random() < 0.3) {
            const angle = this.car.angle + Math.PI + (Math.random() - 0.5) * 0.5;
            this.particles.push({
                x: this.car.x - Math.cos(this.car.angle) * 30,
                y: this.car.y - Math.sin(this.car.angle) * 30,
                vx: Math.cos(angle) * (2 + Math.random() * 2),
                vy: Math.sin(angle) * (2 + Math.random() * 2),
                life: 20,
                maxLife: 20,
                alpha: 1,
                color: Math.random() < 0.5 ? '#888' : '#666',
                size: 1 + Math.random() * 2,
                type: 'dust'
            });
        }
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // Different physics for different particle types
            if (particle.type === 'smoke') {
                // Smoke rises and spreads
                particle.vy -= 0.1;
                particle.vx *= 0.98;
                particle.vy *= 0.98;
                particle.size *= 1.02; // Expand
            } else if (particle.type === 'mark') {
                // Tire marks don't move
                particle.vx = 0;
                particle.vy = 0;
            } else if (particle.type === 'spark') {
                // Sparks have gravity
                particle.vy += 0.2;
                particle.vx *= 0.95;
            }
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            particle.alpha = particle.life / particle.maxLife;
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    checkPortfolioSections() {
        this.nearSection = null;
        
        for (const section of this.portfolioSections) {
            const distance = Math.sqrt(
                Math.pow(this.car.x - (section.x + section.width / 2), 2) +
                Math.pow(this.car.y - (section.y + section.height / 2), 2)
            );
            
            if (distance < 100) {
                this.nearSection = section;
                break;
            }
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
    
    render() {
        if (!this.ctx || !this.canvas) return;
        
        try {
            // Clear canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Sky gradient background
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
            gradient.addColorStop(0, '#87CEEB');
            gradient.addColorStop(0.7, '#98D8E8');
            gradient.addColorStop(1, '#90EE90');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Save context for camera transform
            this.ctx.save();
            this.ctx.translate(-this.world.camera.x, -this.world.camera.y);
            
            // Draw world elements in proper order (back to front)
            this.drawGrass();
            this.drawRoads();
            this.drawTrees();
            this.drawPortfolioBuildings();
            this.drawParticles();
            this.drawCar();
            
            // Restore context
            this.ctx.restore();
            
            // Draw UI elements (not affected by camera)
            this.drawMinimap();
            this.drawInteractionPrompt();
            
        } catch (error) {
            console.error('❌ Render error:', error);
        }
    }
    
    drawGrass() {
        // Base grass color with texture
        const gradient = this.ctx.createRadialGradient(
            this.world.width/2, this.world.height/2, 0,
            this.world.width/2, this.world.height/2, this.world.width
        );
        gradient.addColorStop(0, '#7FB069');
        gradient.addColorStop(0.5, '#689F56');
        gradient.addColorStop(1, '#588B4A');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.world.width, this.world.height);
        
        // Add grass texture with moving animation
        this.ctx.fillStyle = 'rgba(95, 158, 79, 0.3)';
        for (let x = 0; x < this.world.width; x += 30) {
            for (let y = 0; y < this.world.height; y += 30) {
                const offset = Math.sin(this.animationTime + x * 0.01 + y * 0.01) * 2;
                if (Math.random() < 0.4) {
                    this.ctx.fillRect(x + offset, y + offset, 2, 8);
                    this.ctx.fillRect(x + offset + 3, y + offset + 2, 2, 6);
                }
            }
        }
    }
    
    drawRoads() {
        // Road base with gradient
        const roadGradient = this.ctx.createLinearGradient(0, 0, 0, 20);
        roadGradient.addColorStop(0, '#4a4a4a');
        roadGradient.addColorStop(0.5, '#333333');
        roadGradient.addColorStop(1, '#2a2a2a');
        
        this.ctx.strokeStyle = roadGradient;
        this.ctx.lineWidth = 120;
        this.ctx.lineCap = 'round';
        
        // Main road network - more realistic layout
        this.ctx.beginPath();
        // Horizontal main roads
        this.ctx.moveTo(0, 300);
        this.ctx.lineTo(this.world.width, 300);
        this.ctx.moveTo(0, 800);
        this.ctx.lineTo(this.world.width, 800);
        this.ctx.moveTo(0, 1300);
        this.ctx.lineTo(this.world.width, 1300);
        
        // Vertical roads
        this.ctx.moveTo(500, 0);
        this.ctx.lineTo(500, this.world.height);
        this.ctx.moveTo(1200, 0);
        this.ctx.lineTo(1200, this.world.height);
        this.ctx.moveTo(2000, 0);
        this.ctx.lineTo(2000, this.world.height);
        this.ctx.stroke();
        
        // Road edges/sidewalks
        this.ctx.strokeStyle = '#666666';
        this.ctx.lineWidth = 8;
        
        // Sidewalk lines
        this.ctx.beginPath();
        this.ctx.moveTo(0, 240);
        this.ctx.lineTo(this.world.width, 240);
        this.ctx.moveTo(0, 360);
        this.ctx.lineTo(this.world.width, 360);
        this.ctx.moveTo(0, 740);
        this.ctx.lineTo(this.world.width, 740);
        this.ctx.moveTo(0, 860);
        this.ctx.lineTo(this.world.width, 860);
        this.ctx.stroke();
        
        // Center line markings with animation
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 4;
        const dashOffset = (this.animationTime * 100) % 40;
        this.ctx.setLineDash([20, 20]);
        this.ctx.lineDashOffset = -dashOffset;
        
        this.ctx.beginPath();
        this.ctx.moveTo(0, 300);
        this.ctx.lineTo(this.world.width, 300);
        this.ctx.moveTo(0, 800);
        this.ctx.lineTo(this.world.width, 800);
        this.ctx.moveTo(500, 0);
        this.ctx.lineTo(500, this.world.height);
        this.ctx.moveTo(1200, 0);
        this.ctx.lineTo(1200, this.world.height);
        this.ctx.stroke();
        
        this.ctx.setLineDash([]);
        this.ctx.lineDashOffset = 0;
        
        // Draw traffic lights
        this.drawTrafficLights();
    }
    
    drawTrafficLights() {
        this.trafficLights.forEach(light => {
            // Traffic light pole
            this.ctx.fillStyle = '#444444';
            this.ctx.fillRect(light.x - 3, light.y - 40, 6, 40);
            
            // Traffic light box
            this.ctx.fillStyle = '#222222';
            this.ctx.fillRect(light.x - 8, light.y - 35, 16, 25);
            
            // Lights
            this.ctx.fillStyle = light.active ? '#ff0000' : '#660000';
            this.ctx.beginPath();
            this.ctx.arc(light.x, light.y - 25, 4, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.fillStyle = !light.active ? '#00ff00' : '#006600';
            this.ctx.beginPath();
            this.ctx.arc(light.x, light.y - 15, 4, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Glow effect for active light
            if (light.active) {
                this.ctx.shadowColor = '#ff0000';
                this.ctx.shadowBlur = 10;
                this.ctx.fillStyle = '#ff0000';
                this.ctx.beginPath();
                this.ctx.arc(light.x, light.y - 25, 4, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
            } else {
                this.ctx.shadowColor = '#00ff00';
                this.ctx.shadowBlur = 10;
                this.ctx.fillStyle = '#00ff00';
                this.ctx.beginPath();
                this.ctx.arc(light.x, light.y - 15, 4, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
            }
        });
    }

    drawTrees() {
        this.trees.forEach(tree => {
            // Tree shadow
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            this.ctx.beginPath();
            this.ctx.arc(tree.x + 3, tree.y + 3, tree.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Tree trunk with texture
            const trunkWidth = tree.size * 0.3;
            const trunkHeight = tree.size * 0.8;
            
            this.ctx.fillStyle = '#8B4513';
            this.ctx.fillRect(tree.x - trunkWidth/2, tree.y - 5, trunkWidth, trunkHeight);
            
            // Trunk texture lines
            this.ctx.strokeStyle = '#654321';
            this.ctx.lineWidth = 1;
            for (let i = 0; i < 3; i++) {
                this.ctx.beginPath();
                this.ctx.moveTo(tree.x - trunkWidth/2 + 2, tree.y + i * 10);
                this.ctx.lineTo(tree.x + trunkWidth/2 - 2, tree.y + i * 10);
                this.ctx.stroke();
            }
            
            // Tree crown with gradient and animation
            const swayOffset = Math.sin(this.animationTime * 2 + tree.x * 0.01) * 2;
            
            const gradient = this.ctx.createRadialGradient(
                tree.x + swayOffset, tree.y - tree.size/2, 0,
                tree.x + swayOffset, tree.y - tree.size/2, tree.size
            );
            gradient.addColorStop(0, '#4CAF50');
            gradient.addColorStop(0.7, '#2E7D32');
            gradient.addColorStop(1, '#1B5E20');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(tree.x + swayOffset, tree.y - tree.size/2, tree.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Tree highlights
            this.ctx.fillStyle = 'rgba(76, 175, 80, 0.6)';
            this.ctx.beginPath();
            this.ctx.arc(tree.x + swayOffset - tree.size/4, tree.y - tree.size/2 - tree.size/4, tree.size/3, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    drawPortfolioBuildings() {
        this.portfolioSections.forEach(section => {
            this.drawBuilding(section, true);
        });
        
        // Draw scenery buildings
        this.sceneryBuildings.forEach(building => {
            this.drawBuilding(building, false);
        });
    }
    
    drawBuilding(building, isPortfolio = false) {
        const x = building.x;
        const y = building.y;
        const width = building.width;
        const height = building.height;
        
        // Building shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(x + 4, y + 4, width, height);
        
        // Building base
        const gradient = this.ctx.createLinearGradient(x, y, x + width, y + height);
        gradient.addColorStop(0, building.color);
        gradient.addColorStop(1, this.darkenColor(building.color, 0.3));
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(x, y, width, height);
        
        // Building type-specific details
        this.drawBuildingDetails(building, x, y, width, height);
        
        // Building outline
        this.ctx.strokeStyle = isPortfolio ? '#FFD700' : '#333333';
        this.ctx.lineWidth = isPortfolio ? 3 : 2;
        this.ctx.strokeRect(x, y, width, height);
        
        if (isPortfolio) {
            // Portfolio building enhancements
            this.drawPortfolioBuildingDetails(building, x, y, width, height);
            
            // Interaction indicator if near
            if (this.nearSection === building) {
                const pulseSize = 5 + Math.sin(this.animationTime * 4) * 3;
                this.ctx.strokeStyle = '#FFD700';
                this.ctx.lineWidth = 4;
                this.ctx.setLineDash([10, 10]);
                this.ctx.lineDashOffset = this.animationTime * 20;
                this.ctx.strokeRect(x - pulseSize, y - pulseSize, width + pulseSize*2, height + pulseSize*2);
                this.ctx.setLineDash([]);
                this.ctx.lineDashOffset = 0;
                
                // Floating indicator
                const floatY = y - 20 + Math.sin(this.animationTime * 3) * 5;
                this.ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
                this.ctx.fillRect(x + width/2 - 15, floatY, 30, 15);
                this.ctx.fillStyle = '#000';
                this.ctx.font = 'bold 10px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('PRESS E', x + width/2, floatY + 10);
            }
        }
    }
    
    drawBuildingDetails(building, x, y, width, height) {
        switch (building.type) {
            case 'office':
            case 'tech':
            case 'corporate':
                // Windows in grid pattern
                const windowRows = Math.floor(height / 20);
                const windowCols = Math.floor(width / 15);
                
                for (let row = 0; row < windowRows; row++) {
                    for (let col = 0; col < windowCols; col++) {
                        const wx = x + 5 + col * 15;
                        const wy = y + 5 + row * 20;
                        
                        // Window
                        this.ctx.fillStyle = Math.random() < 0.7 ? '#87CEEB' : '#FFD700';
                        this.ctx.fillRect(wx, wy, 8, 12);
                        
                        // Window frame
                        this.ctx.strokeStyle = '#333';
                        this.ctx.lineWidth = 1;
                        this.ctx.strokeRect(wx, wy, 8, 12);
                    }
                }
                break;
                
            case 'house':
                // Roof
                this.ctx.fillStyle = '#8B4513';
                this.ctx.beginPath();
                this.ctx.moveTo(x, y);
                this.ctx.lineTo(x + width/2, y - 15);
                this.ctx.lineTo(x + width, y);
                this.ctx.fill();
                
                // Door
                this.ctx.fillStyle = '#654321';
                this.ctx.fillRect(x + width/2 - 8, y + height - 20, 16, 20);
                
                // Windows
                this.ctx.fillStyle = '#87CEEB';
                this.ctx.fillRect(x + 8, y + height/2, 12, 10);
                this.ctx.fillRect(x + width - 20, y + height/2, 12, 10);
                break;
                
            case 'shop':
                // Store front
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                this.ctx.fillRect(x + 5, y + height - 40, width - 10, 35);
                
                // Store sign
                this.ctx.fillStyle = '#FF6B35';
                this.ctx.fillRect(x + 10, y + 10, width - 20, 15);
                break;
                
            case 'factory':
                // Smokestacks
                this.ctx.fillStyle = '#666';
                this.ctx.fillRect(x + 10, y - 30, 8, 30);
                this.ctx.fillRect(x + width - 18, y - 25, 8, 25);
                
                // Smoke
                this.ctx.fillStyle = 'rgba(128, 128, 128, 0.6)';
                const smokeOffset = Math.sin(this.animationTime) * 5;
                this.ctx.fillRect(x + 12 + smokeOffset, y - 45, 4, 15);
                break;
                
            case 'park':
                // Gazebo style
                this.ctx.strokeStyle = '#2d5a27';
                this.ctx.lineWidth = 3;
                this.ctx.strokeRect(x + 5, y + 5, width - 10, height - 10);
                break;
        }
    }
    
    drawPortfolioBuildingDetails(building, x, y, width, height) {
        // Special effects for portfolio buildings
        this.ctx.fillStyle = building.title;
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = '#fff';
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        this.ctx.strokeText(building.title, x + width/2, y + height/2 + 5);
        this.ctx.fillText(building.title, x + width/2, y + height/2 + 5);
        
        // Glowing effect
        this.ctx.shadowColor = building.color;
        this.ctx.shadowBlur = 15;
        this.ctx.fillStyle = building.color;
        this.ctx.fillRect(x, y, width, 5);
        this.ctx.shadowBlur = 0;
    }
    
    darkenColor(color, amount) {
        // Simple color darkening function
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(255 * amount);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255))
            .toString(16).slice(1);
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.alpha;
            
            if (particle.type === 'smoke') {
                // Draw smoke as expanding circles
                this.ctx.fillStyle = particle.color;
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fill();
            } else if (particle.type === 'mark') {
                // Draw tire marks as small rectangles
                this.ctx.fillStyle = particle.color;
                this.ctx.fillRect(particle.x - 1, particle.y - 1, 2, 2);
            } else if (particle.type === 'spark') {
                // Draw sparks as bright small circles
                this.ctx.fillStyle = particle.color;
                this.ctx.shadowColor = particle.color;
                this.ctx.shadowBlur = 5;
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fill();
            } else {
                // Default dust particles
                this.ctx.fillStyle = particle.color;
                this.ctx.fillRect(particle.x - particle.size/2, particle.y - particle.size/2, particle.size, particle.size);
            }
            
            this.ctx.restore();
        });
    }
    
    drawCar() {
        this.ctx.save();
        this.ctx.translate(this.car.x, this.car.y);
        this.ctx.rotate(this.car.angle);
        
        // Car shadow (offset based on speed for motion effect)
        const shadowOffset = Math.min(this.car.speed * 0.5, 3);
        this.ctx.save();
        this.ctx.translate(shadowOffset, shadowOffset);
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(-this.car.width/2, -this.car.height/2, this.car.width, this.car.height);
        this.ctx.restore();
        
        // Drift glow effect
        if (this.car.isDrifting) {
            this.ctx.shadowColor = '#ff6b35';
            this.ctx.shadowBlur = 15;
        }
        
        // Car body
        this.ctx.fillStyle = this.car.isDrifting ? '#ff4444' : '#ff0000';
        this.ctx.fillRect(-this.car.width/2, -this.car.height/2, this.car.width, this.car.height);
        
        // Car details
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = '#333';
        
        // Windows
        this.ctx.fillRect(-this.car.width/2 + 3, -this.car.height/2 + 2, 8, 4);
        this.ctx.fillRect(-this.car.width/2 + 3, this.car.height/2 - 6, 8, 4);
        
        // Headlights
        this.ctx.fillStyle = this.car.speed > 0 ? '#ffff88' : '#ffffff';
        this.ctx.fillRect(this.car.width/2 - 2, -this.car.height/2 + 2, 3, 3);
        this.ctx.fillRect(this.car.width/2 - 2, this.car.height/2 - 5, 3, 3);
        
        // Wheels with steering angle
        this.ctx.fillStyle = '#000';
        
        // Front wheels (steering)
        this.ctx.save();
        this.ctx.translate(this.car.width/2 - 5, -this.car.height/2 - 2);
        this.ctx.rotate(this.car.wheelAngle);
        this.ctx.fillRect(-3, -1, 6, 2);
        this.ctx.restore();
        
        this.ctx.save();
        this.ctx.translate(this.car.width/2 - 5, this.car.height/2 + 2);
        this.ctx.rotate(this.car.wheelAngle);
        this.ctx.fillRect(-3, -1, 6, 2);
        this.ctx.restore();
        
        // Rear wheels (fixed)
        this.ctx.fillRect(-this.car.width/2 + 2, -this.car.height/2 - 2, 6, 2);
        this.ctx.fillRect(-this.car.width/2 + 2, this.car.height/2, 6, 2);
        
        // Speed lines when moving fast
        if (this.car.speed > 6) {
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            this.ctx.lineWidth = 1;
            for (let i = 0; i < 3; i++) {
                this.ctx.beginPath();
                this.ctx.moveTo(-this.car.width/2 - 10 - i * 5, (i - 1) * 3);
                this.ctx.lineTo(-this.car.width/2 - 20 - i * 5, (i - 1) * 3);
                this.ctx.stroke();
            }
        }
        
        this.ctx.restore();
    }
    
    drawMinimap() {
        if (!this.minimapCtx) return;
        
        // Clear minimap
        this.minimapCtx.clearRect(0, 0, 200, 150);
        
        // Minimap background
        this.minimapCtx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.minimapCtx.fillRect(0, 0, 200, 150);
        
        // Scale factor
        const scaleX = 200 / this.world.width;
        const scaleY = 150 / this.world.height;
        
        // Draw portfolio buildings on minimap
        this.portfolioSections.forEach(section => {
            this.minimapCtx.fillStyle = section.color;
            this.minimapCtx.fillRect(
                section.x * scaleX,
                section.y * scaleY,
                Math.max(2, section.width * scaleX),
                Math.max(2, section.height * scaleY)
            );
        });
        
        // Draw car on minimap
        this.minimapCtx.fillStyle = '#ffffff';
        this.minimapCtx.fillRect(
            this.car.x * scaleX - 2,
            this.car.y * scaleY - 2,
            4, 4
        );
        
        // Camera view indicator
        this.minimapCtx.strokeStyle = '#00ff00';
        this.minimapCtx.lineWidth = 2;
        this.minimapCtx.strokeRect(
            this.world.camera.x * scaleX,
            this.world.camera.y * scaleY,
            this.canvas.width * scaleX,
            this.canvas.height * scaleY
        );
    }
    
    drawInteractionPrompt() {
        if (this.nearSection) {
            const promptText = `Press E to explore ${this.nearSection.title}`;
            
            this.ctx.save();
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            this.ctx.fillRect(
                this.canvas.width / 2 - 150,
                this.canvas.height - 100,
                300, 40
            );
            
            this.ctx.fillStyle = '#00ff00';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(
                promptText,
                this.canvas.width / 2,
                this.canvas.height - 75
            );
            this.ctx.restore();
        }
    }
}

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 Starting Portfolio Game...');
    new PortfolioGame();
});
