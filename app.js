// Enhanced Portfolio JavaScript with Reliable Loading and Comprehensive Features
console.log('🚀 Portfolio JavaScript starting...');

// Global state
let isLoaderComplete = false;
let loadStartTime = Date.now();

document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM Content Loaded');
    
    // Initialize with error handling
    try {
        initLoader();
        initCursor();
        initNavigation();
        initAnimations();
        initTiltCards();
        initMusicPlayer();
        initKonamiCode();
        initContactForm();
        initScrollEffects();
        initPerformanceOptimizations(); // Add performance optimizations
        initGameMode(); // Initialize game mode
        
        console.log('✅ All components initialized successfully!');
    } catch (error) {
        console.error('❌ Error during initialization:', error);
        // Force show content if initialization fails
        forceShowContent();
    }
});

// =============================================================================
// ENHANCED LOADING SCREEN WITH MULTIPLE FALLBACKS
// =============================================================================
function initLoader() {
    console.log('🔄 Initializing loader...');
    
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('main-content');
    
    if (!loader || !mainContent) {
        console.warn('⚠️ Loader or main content elements not found, showing content immediately');
        return;
    }
    
    // Check if user has visited before (but don't rely on it entirely)
    const hasVisited = sessionStorage.getItem('portfolioVisited');
    
    if (hasVisited) {
        console.log('👋 Returning visitor detected, skipping loader');
        showMainContent();
        return;
    }
    
    // Set up multiple fallback timers to ensure content shows
    console.log('⏱️ Setting up loader timers...');
    
    // Primary timer - normal load time (2 seconds)
    const primaryTimer = setTimeout(() => {
        console.log('✅ Primary loader timer completed');
        completeLoading();
    }, 2000);
    
    // Emergency fallback - force show content after 3 seconds no matter what
    const emergencyTimer = setTimeout(() => {
        console.warn('🚨 Emergency fallback activated - forcing content show');
        forceShowContent();
    }, 3000);
    
    // Ultra emergency fallback - absolute last resort after 5 seconds
    const ultraEmergencyTimer = setTimeout(() => {
        console.error('🆘 Ultra emergency fallback - removing loader completely');
        if (loader && loader.parentNode) {
            loader.parentNode.removeChild(loader);
        }
        if (mainContent) {
            mainContent.style.opacity = '1';
            mainContent.style.visibility = 'visible';
        }
        document.body.style.overflow = 'auto';
    }, 5000);
    
    function completeLoading() {
        if (isLoaderComplete) return;
        isLoaderComplete = true;
        
        // Clear all timers
        clearTimeout(primaryTimer);
        clearTimeout(emergencyTimer);
        clearTimeout(ultraEmergencyTimer);
        
        console.log('🎯 Completing loader transition...');
        
        try {
            // Fade out loader
            loader.classList.add('fade-out');
            
            // Show main content after a brief delay
            setTimeout(() => {
                showMainContent();
                
                // Remove loader after transition
                setTimeout(() => {
                    if (loader && loader.parentNode) {
                        loader.parentNode.removeChild(loader);
                    }
                    sessionStorage.setItem('portfolioVisited', 'true');
                    console.log('🗑️ Loader removed successfully');
                }, 500);
            }, 200);
            
        } catch (error) {
            console.error('❌ Error during loader completion:', error);
            forceShowContent();
        }
    }
    
    function showMainContent() {
        try {
            if (mainContent) {
                mainContent.classList.add('show');
                console.log('👁️ Main content shown');
            }
            document.body.style.overflow = 'auto';
        } catch (error) {
            console.error('❌ Error showing main content:', error);
            forceShowContent();
        }
    }
    
    // Also listen for any user interaction to speed up loading
    const speedUpEvents = ['click', 'keydown', 'scroll', 'touchstart'];
    speedUpEvents.forEach(event => {
        document.addEventListener(event, function speedUpHandler() {
            if (!isLoaderComplete && Date.now() - loadStartTime > 1000) {
                console.log('⚡ User interaction detected, speeding up loader');
                completeLoading();
            }
            // Remove listener after first use
            speedUpEvents.forEach(evt => {
                document.removeEventListener(evt, speedUpHandler);
            });
        }, { once: true });
    });
}

function forceShowContent() {
    console.log('🔧 Force showing content...');
    
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('main-content');
    
    if (loader) {
        loader.style.display = 'none';
        loader.classList.add('hidden');
    }
    
    if (mainContent) {
        mainContent.style.opacity = '1';
        mainContent.style.visibility = 'visible';
        mainContent.classList.add('show');
    }
    
    document.body.style.overflow = 'auto';
    isLoaderComplete = true;
}

// =============================================================================
// CUSTOM CURSOR WITH SMOOTH TRAILING
// =============================================================================
function initCursor() {
    const cursor = document.getElementById('cursor-ring');
    if (!cursor || window.innerWidth <= 768) {
        console.log('📱 Skipping cursor on mobile or cursor element not found');
        return;
    }
    
    console.log('🖱️ Initializing custom cursor...');
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    // Update mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth cursor animation
    function updateCursor() {
        try {
            const speed = 0.15;
            cursorX += (mouseX - cursorX) * speed;
            cursorY += (mouseY - cursorY) * speed;
            
            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
            requestAnimationFrame(updateCursor);
        } catch (error) {
            console.error('❌ Cursor animation error:', error);
        }
    }
    updateCursor();
    
    // Hover effects for interactive elements
    const hoverElements = document.querySelectorAll('a, button, .project__card, .music__video, .blog__card, .education__item, .skill__category, .cert__item');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
    
    console.log('✅ Custom cursor initialized');
}

// =============================================================================
// ENHANCED NAVIGATION
// =============================================================================
function initNavigation() {
    console.log('🧭 Initializing navigation...');
    
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    
    // Mobile navigation toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            try {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
                
                const isExpanded = navMenu.classList.contains('active');
                navToggle.setAttribute('aria-expanded', isExpanded);
                console.log('📱 Mobile menu toggled:', isExpanded);
            } catch (error) {
                console.error('❌ Mobile menu toggle error:', error);
            }
        });
    }

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            try {
                if (navMenu) navMenu.classList.remove('active');
                if (navToggle) navToggle.classList.remove('active');
                
                const href = this.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    smoothScrollTo(href);
                    console.log('🔗 Navigating to:', href);
                }
            } catch (error) {
                console.error('❌ Navigation click error:', error);
            }
        });
    });

    // Navigation background on scroll
    let ticking = false;
    
    function updateNavOnScroll() {
        try {
            const scrollTop = window.pageYOffset;
            
            if (nav) {
                if (scrollTop > 50) {
                    nav.style.background = 'rgba(252, 252, 249, 0.98)';
                    nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
                } else {
                    nav.style.background = 'rgba(252, 252, 249, 0.95)';
                    nav.style.boxShadow = 'none';
                }
            }

            updateActiveNavLink();
            ticking = false;
        } catch (error) {
            console.error('❌ Nav scroll update error:', error);
            ticking = false;
        }
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateNavOnScroll);
            ticking = true;
        }
    });

    function updateActiveNavLink() {
        try {
            const sections = document.querySelectorAll('section[id]');
            const scrollPos = window.scrollY + 100;

            let activeLink = null;
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    activeLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
                }
            });

            navLinks.forEach(link => link.classList.remove('active'));
            if (activeLink) {
                activeLink.classList.add('active');
            } else if (navLinks.length > 0) {
                navLinks[0].classList.add('active');
            }
        } catch (error) {
            console.error('❌ Active nav link update error:', error);
        }
    }

    function smoothScrollTo(targetId) {
        try {
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const navHeight = nav ? nav.offsetHeight : 70;
                const offsetTop = targetSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: Math.max(0, offsetTop),
                    behavior: 'smooth'
                });
                console.log('🎯 Smooth scrolled to:', targetId);
            }
        } catch (error) {
            console.error('❌ Smooth scroll error:', error);
        }
    }

    // Handle hero buttons
    const heroButtons = document.querySelectorAll('.hero__btn');
    heroButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            try {
                const href = this.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    smoothScrollTo(href);
                }
            } catch (error) {
                console.error('❌ Hero button click error:', error);
            }
        });
    });
    
    console.log('✅ Navigation initialized');
}

// =============================================================================
// SCROLL-TRIGGERED ANIMATIONS
// =============================================================================
function initAnimations() {
    console.log('🎬 Initializing animations...');
    
    try {
        // More aggressive loading - trigger animations much earlier
        const observerOptions = {
            threshold: 0.05, // Reduced threshold for earlier trigger
            rootMargin: '0px 0px -150px 0px' // Increased margin to start animations earlier
        };

        // Fast fade-in animations with immediate response
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Immediate animation start
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    // Stop observing to prevent re-triggering
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Faster section title wipe animations
        const wipeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    // Stop observing to prevent re-triggering
                    wipeObserver.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.2, // Reduced threshold for earlier trigger
            rootMargin: '0px 0px -100px 0px' // Earlier trigger
        });

        // Apply animations to various elements with faster timing
        const animateElements = document.querySelectorAll('.timeline__item, .cert__item, .education__item, .project__card, .blog__card, .skill__category');
        animateElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)'; // Reduced distance for snappier feel
            // Faster transitions with shorter delays
            el.style.transition = `opacity 0.4s ease ${index * 0.05}s, transform 0.4s ease ${index * 0.05}s`;
            fadeObserver.observe(el);
        });

        const wipeElements = document.querySelectorAll('.section__title--wipe');
        wipeElements.forEach(el => wipeObserver.observe(el));

        // Preload animations for critical above-fold content
        const criticalElements = document.querySelectorAll('.hero *, .about *');
        criticalElements.forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
        
        console.log('✅ Animations initialized with fast loading');
    } catch (error) {
        console.error('❌ Animation initialization error:', error);
    }
}

// =============================================================================
// 3D TILT EFFECT FOR CARDS
// =============================================================================
function initTiltCards() {
    console.log('🎴 Initializing tilt cards...');
    
    try {
        const tiltCards = document.querySelectorAll('.card-tilt');
        
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', handleTilt);
            card.addEventListener('mouseleave', resetTilt);
        });
        
        function handleTilt(e) {
            try {
                const card = e.currentTarget;
                const rect = card.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const mouseX = e.clientX - centerX;
                const mouseY = e.clientY - centerY;
                
                const rotateX = (mouseY / rect.height) * -10;
                const rotateY = (mouseX / rect.width) * 10;
                
                card.style.transform = `
                    perspective(1000px) 
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg) 
                    translateZ(10px)
                `;
            } catch (error) {
                console.error('❌ Card tilt error:', error);
            }
        }
        
        function resetTilt(e) {
            try {
                const card = e.currentTarget;
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            } catch (error) {
                console.error('❌ Card reset error:', error);
            }
        }
        
        console.log('✅ Tilt cards initialized');
    } catch (error) {
        console.error('❌ Tilt cards initialization error:', error);
    }
}

// =============================================================================
// MUSIC PLAYER WITH VISUALIZER
// =============================================================================
function initMusicPlayer() {
    console.log('🎵 Initializing music player...');
    
    try {
        const musicVideos = document.querySelectorAll('.music__video');
        const modal = document.getElementById('visualizer-modal');
        const modalClose = document.getElementById('modal-close');
        const visualizerCanvas = document.getElementById('visualizer-canvas');
        const visualizerToggle = document.getElementById('visualizer-toggle');
        
        let isVisualizerActive = false;
        let animationId = null;
        
        // YouTube API ready callback
        window.onYouTubeIframeAPIReady = function() {
            console.log('📺 YouTube API Ready');
        };
        
        // Music video click handlers
        musicVideos.forEach(video => {
            video.addEventListener('click', () => {
                try {
                    const videoId = video.dataset.videoId;
                    openMusicModal(videoId);
                    console.log('🎬 Opening video:', videoId);
                } catch (error) {
                    console.error('❌ Video click error:', error);
                }
            });
        });
        
        // Modal close handlers
        if (modalClose) {
            modalClose.addEventListener('click', closeMusicModal);
        }
        
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal || e.target.classList.contains('modal__backdrop')) {
                    closeMusicModal();
                }
            });
        }
        
        // Visualizer toggle
        if (visualizerToggle) {
            visualizerToggle.addEventListener('click', toggleVisualizer);
        }
        
        function openMusicModal(videoId) {
            try {
                if (!modal) return;
                
                modal.classList.remove('hidden');
                
                // Create YouTube player
                const playerContainer = document.getElementById('youtube-player');
                if (playerContainer) {
                    playerContainer.innerHTML = `
                        <iframe width="560" height="315" 
                            src="https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                        </iframe>
                    `;
                }
                
                // Initialize visualizer canvas
                setupVisualizerCanvas();
                console.log('🎥 Music modal opened');
            } catch (error) {
                console.error('❌ Music modal open error:', error);
            }
        }
        
        function closeMusicModal() {
            try {
                if (!modal) return;
                
                modal.classList.add('hidden');
                
                // Clean up
                const playerContainer = document.getElementById('youtube-player');
                if (playerContainer) {
                    playerContainer.innerHTML = '';
                }
                
                stopVisualizer();
                console.log('🔒 Music modal closed');
            } catch (error) {
                console.error('❌ Music modal close error:', error);
            }
        }
        
        function setupVisualizerCanvas() {
            try {
                const canvas = visualizerCanvas;
                if (!canvas) return;
                
                const ctx = canvas.getContext('2d');
                const width = canvas.width;
                const height = canvas.height;
                
                // Draw static bars initially
                drawStaticBars(ctx, width, height);
            } catch (error) {
                console.error('❌ Visualizer canvas setup error:', error);
            }
        }
        
        function drawStaticBars(ctx, width, height) {
            try {
                ctx.clearRect(0, 0, width, height);
                ctx.fillStyle = 'var(--color-primary)';
                
                const barCount = 50;
                const barWidth = width / barCount;
                
                for (let i = 0; i < barCount; i++) {
                    const barHeight = Math.random() * height * 0.3 + 10;
                    const x = i * barWidth;
                    const y = height - barHeight;
                    
                    ctx.fillRect(x, y, barWidth - 2, barHeight);
                }
            } catch (error) {
                console.error('❌ Static bars draw error:', error);
            }
        }
        
        function toggleVisualizer() {
            try {
                if (!isVisualizerActive) {
                    startVisualizer();
                } else {
                    stopVisualizer();
                }
            } catch (error) {
                console.error('❌ Visualizer toggle error:', error);
            }
        }
        
        function startVisualizer() {
            try {
                isVisualizerActive = true;
                if (visualizerToggle) visualizerToggle.textContent = 'Stop Visualizer';
                animateVisualizer();
                console.log('🎨 Visualizer started');
            } catch (error) {
                console.error('❌ Visualizer start error:', error);
            }
        }
        
        function stopVisualizer() {
            try {
                isVisualizerActive = false;
                if (visualizerToggle) visualizerToggle.textContent = 'Start Visualizer';
                
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
                
                // Reset to static bars
                setupVisualizerCanvas();
                console.log('🛑 Visualizer stopped');
            } catch (error) {
                console.error('❌ Visualizer stop error:', error);
            }
        }
        
        function animateVisualizer() {
            if (!isVisualizerActive) return;
            
            try {
                const canvas = visualizerCanvas;
                if (!canvas) return;
                
                const ctx = canvas.getContext('2d');
                const width = canvas.width;
                const height = canvas.height;
                
                ctx.clearRect(0, 0, width, height);
                
                const barCount = 50;
                const barWidth = width / barCount;
                const time = Date.now() * 0.01;
                
                // Create gradient
                const gradient = ctx.createLinearGradient(0, height, 0, 0);
                gradient.addColorStop(0, '#1FB8CD');
                gradient.addColorStop(0.5, '#32B8CA');
                gradient.addColorStop(1, '#5D878F');
                
                ctx.fillStyle = gradient;
                
                for (let i = 0; i < barCount; i++) {
                    const barHeight = Math.abs(Math.sin(time + i * 0.5)) * height * 0.6 + 20;
                    const x = i * barWidth;
                    const y = height - barHeight;
                    
                    ctx.fillRect(x, y, barWidth - 2, barHeight);
                }
                
                animationId = requestAnimationFrame(animateVisualizer);
            } catch (error) {
                console.error('❌ Visualizer animation error:', error);
                stopVisualizer();
            }
        }
        
        console.log('✅ Music player initialized');
    } catch (error) {
        console.error('❌ Music player initialization error:', error);
    }
}

// =============================================================================
// KONAMI CODE EASTER EGG
// =============================================================================
function initKonamiCode() {
    console.log('🎮 Initializing Konami code...');
    
    try {
        const konamiCode = [
            'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
            'KeyB', 'KeyA'
        ];
        
        let userInput = [];
        let retroTimeout = null;
        
        document.addEventListener('keydown', (e) => {
            try {
                userInput.push(e.code);
                
                // Keep only the last 10 keys
                if (userInput.length > konamiCode.length) {
                    userInput.shift();
                }
                
                // Check if sequence matches
                if (userInput.length === konamiCode.length) {
                    const matches = konamiCode.every((key, index) => key === userInput[index]);
                    
                    if (matches) {
                        activateRetroTheme();
                        userInput = []; // Reset
                        console.log('🕹️ Konami code activated!');
                    }
                }
            } catch (error) {
                console.error('❌ Konami code error:', error);
            }
        });
        
        function activateRetroTheme() {
            try {
                const overlay = document.getElementById('retro-overlay');
                const body = document.body;
                
                // Show retro overlay
                if (overlay) {
                    overlay.classList.remove('hidden');
                }
                
                // Apply retro theme to body
                body.classList.add('retro-theme');
                
                // Show notification
                showNotification('🎮 RETRO MODE ACTIVATED! Welcome to the 80s!', 'success');
                
                // Clear existing timeout
                if (retroTimeout) {
                    clearTimeout(retroTimeout);
                }
                
                // Auto-disable after 10 seconds
                retroTimeout = setTimeout(() => {
                    deactivateRetroTheme();
                }, 10000);
            } catch (error) {
                console.error('❌ Retro theme activation error:', error);
            }
        }
        
        function deactivateRetroTheme() {
            try {
                const overlay = document.getElementById('retro-overlay');
                const body = document.body;
                
                if (overlay) {
                    overlay.classList.add('hidden');
                }
                
                body.classList.remove('retro-theme');
                
                if (retroTimeout) {
                    clearTimeout(retroTimeout);
                    retroTimeout = null;
                }
                console.log('🔄 Retro theme deactivated');
            } catch (error) {
                console.error('❌ Retro theme deactivation error:', error);
            }
        }
        
        console.log('✅ Konami code initialized');
    } catch (error) {
        console.error('❌ Konami code initialization error:', error);
    }
}

// =============================================================================
// CONTACT FORM WITH ENHANCED VALIDATION
// =============================================================================
function initContactForm() {
    console.log('📧 Initializing contact form...');
    
    try {
        const contactForm = document.getElementById('contact-form');
        if (!contactForm) {
            console.log('📧 Contact form not found');
            return;
        }
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            try {
                const formData = new FormData(this);
                const name = formData.get('name');
                const email = formData.get('email');
                const subject = formData.get('subject');
                const message = formData.get('message');
                
                // Enhanced validation
                if (!name || !email || !subject || !message) {
                    showNotification('Please fill in all fields.', 'error');
                    return;
                }
                
                if (!isValidEmail(email)) {
                    showNotification('Please enter a valid email address.', 'error');
                    return;
                }
                
                if (message.length < 10) {
                    showNotification('Message must be at least 10 characters long.', 'error');
                    return;
                }
                
                // Simulate form submission with enhanced UX
                const submitButton = this.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                
                submitButton.textContent = 'Sending...';
                submitButton.disabled = true;
                submitButton.style.opacity = '0.7';
                
                setTimeout(() => {
                    showNotification('Thank you! Your message has been sent successfully. I\'ll get back to you soon!', 'success');
                    contactForm.reset();
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    submitButton.style.opacity = '1';
                    console.log('📤 Contact form submitted successfully');
                }, 1500);
                
            } catch (error) {
                console.error('❌ Contact form submission error:', error);
                showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
            }
        });
        
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
        
        console.log('✅ Contact form initialized');
    } catch (error) {
        console.error('❌ Contact form initialization error:', error);
    }
}

// =============================================================================
// ENHANCED SCROLL EFFECTS
// =============================================================================
function initScrollEffects() {
    console.log('📜 Initializing scroll effects...');
    
    try {
        // Optimized parallax effect for hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            let heroTicking = false;
            
            // Reduced throttling for smoother experience
            window.addEventListener('scroll', () => {
                if (!heroTicking) {
                    requestAnimationFrame(() => {
                        try {
                            const scrolled = window.pageYOffset;
                            const parallaxSpeed = 0.2; // Reduced for better performance
                            if (scrolled < window.innerHeight) {
                                // Use transform3d for hardware acceleration
                                hero.style.transform = `translate3d(0, ${scrolled * parallaxSpeed}px, 0)`;
                            }
                            heroTicking = false;
                        } catch (error) {
                            console.error('❌ Parallax effect error:', error);
                            heroTicking = false;
                        }
                    });
                    heroTicking = true;
                }
            });
        }
        
        // Enhanced skill items hover effect with immediate response
        const skillItems = document.querySelectorAll('.skill__item');
        skillItems.forEach(item => {
            // Preload transitions
            item.style.transition = 'transform 0.2s ease-out';
            
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translate3d(0, -2px, 0) scale(1.05)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translate3d(0, 0, 0) scale(1)';
            });
        });

        // Immediate scroll-to-section animation
        const navLinks = document.querySelectorAll('a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);
                
                if (target) {
                    // Smooth scroll with immediate visual feedback
                    target.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Immediately trigger animations in target section
                    setTimeout(() => {
                        const targetElements = target.querySelectorAll('.timeline__item, .cert__item, .education__item, .project__card, .blog__card, .skill__category');
                        targetElements.forEach(el => {
                            if (el.style.opacity === '0' || !el.style.opacity) {
                                el.style.opacity = '1';
                                el.style.transform = 'translateY(0)';
                                el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                            }
                        });
                    }, 200);
                }
            });
        });
        
        console.log('✅ Scroll effects initialized');
    } catch (error) {
        console.error('❌ Scroll effects initialization error:', error);
    }
}

// =============================================================================
// ENHANCED NOTIFICATION SYSTEM
// =============================================================================
function showNotification(message, type = 'info') {
    try {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        
        // Enhanced styling
        const baseStyles = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
            transform: translateX(100%);
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            font-family: var(--font-family-base);
            font-size: 14px;
            line-height: 1.5;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            backdrop-filter: blur(20px);
        `;

        let typeStyles = '';
        if (type === 'success') {
            typeStyles = `
                background: rgba(33, 128, 141, 0.15);
                border: 1px solid rgba(33, 128, 141, 0.3);
                color: var(--color-success);
            `;
        } else if (type === 'error') {
            typeStyles = `
                background: rgba(192, 21, 47, 0.15);
                border: 1px solid rgba(192, 21, 47, 0.3);
                color: var(--color-error);
            `;
        } else {
            typeStyles = `
                background: rgba(98, 108, 113, 0.15);
                border: 1px solid rgba(98, 108, 113, 0.3);
                color: var(--color-info);
            `;
        }

        notification.style.cssText = baseStyles + typeStyles;
        
        notification.innerHTML = `
            <span class="notification__message">${message}</span>
            <button class="notification__close" style="
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: inherit;
                padding: 0;
                margin: 0;
                line-height: 1;
                flex-shrink: 0;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.3s ease;
            ">&times;</button>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Close button
        const closeButton = notification.querySelector('.notification__close');
        closeButton.addEventListener('click', () => closeNotification(notification));
        closeButton.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(255, 255, 255, 0.1)';
        });
        closeButton.addEventListener('mouseleave', function() {
            this.style.background = 'none';
        });

        // Auto-close
        setTimeout(() => {
            if (document.body.contains(notification)) {
                closeNotification(notification);
            }
        }, 5000);
        
        console.log('🔔 Notification shown:', type, message);
    } catch (error) {
        console.error('❌ Notification error:', error);
    }
}

function closeNotification(notification) {
    try {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.remove();
            }
        }, 400);
    } catch (error) {
        console.error('❌ Notification close error:', error);
    }
}

// =============================================================================
// KEYBOARD ACCESSIBILITY & FINAL SETUP
// =============================================================================
document.addEventListener('keydown', function(e) {
    try {
        // ESC key closes modals
        if (e.key === 'Escape') {
            const modal = document.getElementById('visualizer-modal');
            if (modal && !modal.classList.contains('hidden')) {
                const modalClose = document.getElementById('modal-close');
                if (modalClose) modalClose.click();
            }
            
            const navMenu = document.getElementById('nav-menu');
            const navToggle = document.getElementById('nav-toggle');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (navToggle) navToggle.classList.remove('active');
            }
        }
    } catch (error) {
        console.error('❌ Keyboard event error:', error);
    }
});

// Enhanced accessibility
try {
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    focusableElements.forEach(el => {
        el.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--color-primary)';
            this.style.outlineOffset = '2px';
        });
        
        el.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
} catch (error) {
    console.error('❌ Accessibility setup error:', error);
}

// =============================================================================
// PERFORMANCE OPTIMIZATIONS FOR FASTER LOADING
// =============================================================================
function initPerformanceOptimizations() {
    console.log('⚡ Initializing performance optimizations...');
    
    try {
        // Preload animations for elements close to viewport
        function preloadNearbyAnimations() {
            const viewportHeight = window.innerHeight;
            const scrollTop = window.pageYOffset;
            const preloadZone = viewportHeight * 1.5; // Load animations 1.5x viewport ahead
            
            const animatedElements = document.querySelectorAll('.timeline__item, .cert__item, .education__item, .project__card, .blog__card, .skill__category');
            
            animatedElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                const elementTop = rect.top + scrollTop;
                
                // If element is within preload zone
                if (elementTop <= scrollTop + preloadZone) {
                    // Immediately show without waiting for intersection
                    if (el.style.opacity === '0' || !el.style.opacity) {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                        el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    }
                }
            });
        }
        
        // Run preload on initial load
        setTimeout(preloadNearbyAnimations, 100);
        
        // Throttled scroll listener for ongoing preloading
        let preloadTicking = false;
        window.addEventListener('scroll', () => {
            if (!preloadTicking) {
                requestAnimationFrame(() => {
                    preloadNearbyAnimations();
                    preloadTicking = false;
                });
                preloadTicking = true;
            }
        });
        
        // Reduce animation complexity on slower devices
        const isSlowDevice = navigator.hardwareConcurrency < 4 || 
                            /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/.test(navigator.userAgent);
        
        if (isSlowDevice) {
            console.log('📱 Slow device detected, reducing animations');
            const style = document.createElement('style');
            style.textContent = `
                * {
                    animation-duration: 0.2s !important;
                    transition-duration: 0.2s !important;
                }
                .card-tilt {
                    transform: none !important;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Prefetch resources on hover
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                const targetId = link.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);
                if (target) {
                    // Preload target section animations
                    const targetElements = target.querySelectorAll('.timeline__item, .cert__item, .education__item, .project__card, .blog__card, .skill__category');
                    targetElements.forEach(el => {
                        if (el.style.opacity === '0' || !el.style.opacity) {
                            el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        }
                    });
                }
            });
        });
        
        console.log('✅ Performance optimizations initialized');
    } catch (error) {
        console.error('❌ Performance optimization error:', error);
    }
}

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        try {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`⚡ Portfolio loaded in ${loadTime}ms`);
            console.log('🎉 Portfolio fully loaded and ready!');
        } catch (error) {
            console.error('❌ Performance monitoring error:', error);
        }
    });
}

// Emergency content show fallback - absolute last resort
setTimeout(() => {
    if (!isLoaderComplete) {
        console.warn('🚨 Emergency timeout reached - forcing content show');
        forceShowContent();
    }
}, 7000);

// =============================================================================
// GAME MODE INITIALIZATION
// =============================================================================
function initGameMode() {
    console.log('🎮 Initializing Game Mode...');
    
    try {
        // Create game instance
        window.portfolioGame = new PortfolioGameMode();
        console.log('✅ Game Mode initialized successfully');
    } catch (error) {
        console.error('❌ Game Mode initialization failed:', error);
    }
}

// =============================================================================
// GAME MODE - 2D CAR RACING PORTFOLIO EXPLORER
// =============================================================================

class PortfolioGameMode {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.minimap = null;
        this.minimapCtx = null;
        this.gameActive = false;
        this.animationId = null;
        
        // Car properties with enhanced features
        this.car = {
            x: 400,
            y: 300,
            width: 45,
            height: 25,
            speed: 0,
            maxSpeed: 10,
            acceleration: 0.4,
            friction: 0.88,
            angle: 0,
            color: '#ff6b35',
            engineSound: 0,
            exhaustParticles: [],
            headlights: true,
            brake: false
        };
        
        // Game world properties
        this.world = {
            width: 2000,
            height: 1500,
            camera: { x: 0, y: 0 }
        };
        
        // Portfolio sections scattered around the world as modern buildings
        this.portfolioSections = [
            { x: 300, y: 200, width: 120, height: 100, type: 'about', title: 'About Me', color: '#4CAF50', icon: '👨‍💻' },
            { x: 800, y: 150, width: 140, height: 120, type: 'education', title: 'Education', color: '#2196F3', icon: '🎓' },
            { x: 1400, y: 250, width: 160, height: 110, type: 'experience', title: 'Experience', color: '#FF9800', icon: '💼' },
            { x: 200, y: 600, width: 130, height: 90, type: 'skills', title: 'Skills', color: '#9C27B0', icon: '⚡' },
            { x: 1000, y: 700, width: 150, height: 130, type: 'projects', title: 'Projects', color: '#F44336', icon: '🚀' },
            { x: 1600, y: 500, width: 180, height: 100, type: 'certifications', title: 'Certifications', color: '#607D8B', icon: '🏆' },
            { x: 500, y: 1100, width: 110, height: 85, type: 'blogs', title: 'Blogs', color: '#795548', icon: '📝' },
            { x: 1300, y: 1000, width: 120, height: 95, type: 'music', title: 'Music', color: '#E91E63', icon: '🎵' },
            { x: 1800, y: 800, width: 140, height: 110, type: 'contact', title: 'Contact', color: '#009688', icon: '📞' }
        ];
        
        // Decorative elements for the landscape
        this.trees = [
            { x: 150, y: 300, size: 30 }, { x: 450, y: 350, size: 25 }, { x: 750, y: 400, size: 35 },
            { x: 1100, y: 320, size: 28 }, { x: 350, y: 800, size: 32 }, { x: 650, y: 900, size: 26 },
            { x: 950, y: 850, size: 30 }, { x: 1250, y: 750, size: 33 }, { x: 1550, y: 650, size: 29 },
            { x: 100, y: 1200, size: 27 }, { x: 400, y: 1300, size: 31 }, { x: 700, y: 1250, size: 24 },
            { x: 1000, y: 1150, size: 28 }, { x: 1400, y: 1350, size: 35 }, { x: 1700, y: 1200, size: 30 }
        ];
        
        // Decorative buildings for atmosphere
        this.decorativeBuildings = [
            { x: 50, y: 100, width: 80, height: 60, color: '#E0E0E0' },
            { x: 500, y: 50, width: 60, height: 80, color: '#BDBDBD' },
            { x: 1200, y: 100, width: 70, height: 70, color: '#9E9E9E' },
            { x: 1700, y: 150, width: 90, height: 50, color: '#757575' },
            { x: 100, y: 1000, width: 75, height: 65, color: '#E0E0E0' },
            { x: 800, y: 1300, width: 85, height: 55, color: '#BDBDBD' },
            { x: 1500, y: 1250, width: 65, height: 75, color: '#9E9E9E' }
        ];
        
        // Particles for atmosphere
        this.particles = [];
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.world.width,
                y: Math.random() * this.world.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
        
        // Controls
        this.keys = {};
        this.nearSection = null;
        
        // Fuel system
        this.fuel = 100;
        this.fuelConsumption = 0.02;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        console.log('🎮 Game Mode initialized');
    }
    
    setupEventListeners() {
        const gameToggle = document.getElementById('game-mode-toggle');
        const confirmExit = document.getElementById('confirm-exit');
        const cancelExit = document.getElementById('cancel-exit');
        const popupClose = document.getElementById('popup-close');
        
        if (gameToggle) {
            gameToggle.addEventListener('click', () => this.enterGameMode());
        }
        
        if (confirmExit) {
            confirmExit.addEventListener('click', () => this.exitGameMode());
        }
        
        if (cancelExit) {
            cancelExit.addEventListener('click', () => this.hideExitModal());
        }
        
        if (popupClose) {
            popupClose.addEventListener('click', () => this.hidePortfolioPopup());
        }
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }
    
    enterGameMode() {
        console.log('🏎️ Attempting to enter game mode...');
        
        const gameMode = document.getElementById('game-mode');
        const mainContent = document.getElementById('main-content');
        
        if (!gameMode || !mainContent) {
            console.error('❌ Game mode elements not found');
            return;
        }
        
        // Hide main content and show game
        mainContent.style.display = 'none';
        gameMode.classList.remove('hidden');
        
        console.log('📱 Game mode visible, setting up canvas...');
        
        // Setup canvas with delay to ensure DOM is updated
        setTimeout(() => {
            this.canvas = document.getElementById('game-canvas');
            this.minimap = document.getElementById('minimap');
            
            if (!this.canvas || !this.minimap) {
                console.error('❌ Canvas elements not found');
                console.log('Canvas:', this.canvas);
                console.log('Minimap:', this.minimap);
                return;
            }
            
            console.log('🎨 Canvas found, getting context...');
            this.ctx = this.canvas.getContext('2d');
            this.minimapCtx = this.minimap.getContext('2d');
            
            if (!this.ctx || !this.minimapCtx) {
                console.error('❌ Canvas contexts not available');
                return;
            }
            
            console.log('✅ Canvas contexts acquired');
            this.resizeCanvas();
            window.addEventListener('resize', () => this.resizeCanvas());
            
            // Reset car position
            this.car.x = 400;
            this.car.y = 300;
            this.car.speed = 0;
            this.car.angle = 0;
            this.fuel = 100;
            
            console.log('🚗 Car initialized at:', this.car.x, this.car.y);
            console.log('🌍 World size:', this.world.width, 'x', this.world.height);
            console.log('📐 Canvas size:', this.canvas.width, 'x', this.canvas.height);
            
            this.gameActive = true;
            
            // Test render
            console.log('🎨 Testing render...');
            try {
                this.render();
                console.log('✅ Test render successful');
            } catch (renderError) {
                console.error('❌ Test render failed:', renderError);
            }
            
            // Start game loop
            console.log('🔄 Starting game loop...');
            this.gameLoop();
            
            console.log('✅ Game mode active!');
        }, 100);
    }
    
    exitGameMode() {
        this.gameActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        const gameMode = document.getElementById('game-mode');
        const mainContent = document.getElementById('main-content');
        const exitModal = document.getElementById('game-exit-modal');
        
        if (gameMode) gameMode.classList.add('hidden');
        if (mainContent) mainContent.style.display = 'block';
        if (exitModal) exitModal.classList.add('hidden');
        
        console.log('👋 Exited game mode');
    }
    
    showExitModal() {
        const exitModal = document.getElementById('game-exit-modal');
        if (exitModal) {
            exitModal.classList.remove('hidden');
        }
    }
    
    hideExitModal() {
        const exitModal = document.getElementById('game-exit-modal');
        if (exitModal) {
            exitModal.classList.add('hidden');
        }
    }
    
    handleKeyDown(e) {
        if (!this.gameActive) return;
        
        this.keys[e.code] = true;
        
        // Special keys
        if (e.code === 'Escape') {
            e.preventDefault();
            this.showExitModal();
        }
        
        if (e.code === 'KeyE' && this.nearSection) {
            e.preventDefault();
            this.showPortfolioSection(this.nearSection);
        }
    }
    
    handleKeyUp(e) {
        if (!this.gameActive) return;
        this.keys[e.code] = false;
    }
    
    resizeCanvas() {
        if (!this.canvas) {
            console.warn('⚠️ Canvas not available for resize');
            return;
        }
        
        // Set canvas size to window size
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.canvas.width = width;
        this.canvas.height = height;
        
        // Force a style update
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
        
        console.log(`📐 Canvas resized to ${width}x${height}`);
    }
    
    updateCar() {
        // Handle input
        this.car.brake = false;
        
        if (this.keys['KeyW'] || this.keys['ArrowUp']) {
            this.car.speed = Math.min(this.car.speed + this.car.acceleration, this.car.maxSpeed);
            this.fuel = Math.max(0, this.fuel - this.fuelConsumption);
            this.car.engineSound = Math.min(this.car.engineSound + 0.1, 1);
        } else {
            this.car.engineSound = Math.max(this.car.engineSound - 0.05, 0);
        }
        
        if (this.keys['KeyS'] || this.keys['ArrowDown']) {
            this.car.speed = Math.max(this.car.speed - this.car.acceleration * 1.5, -this.car.maxSpeed * 0.5);
            this.car.brake = true;
        }
        
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) {
            if (Math.abs(this.car.speed) > 0.5) {
                this.car.angle -= 0.06 * Math.sign(this.car.speed);
            }
        }
        if (this.keys['KeyD'] || this.keys['ArrowRight']) {
            if (Math.abs(this.car.speed) > 0.5) {
                this.car.angle += 0.06 * Math.sign(this.car.speed);
            }
        }
        
        // Apply friction
        this.car.speed *= this.car.friction;
        
        // Stop if speed is very low
        if (Math.abs(this.car.speed) < 0.1) {
            this.car.speed = 0;
        }
        
        // Update position
        this.car.x += Math.cos(this.car.angle) * this.car.speed;
        this.car.y += Math.sin(this.car.angle) * this.car.speed;
        
        // Keep car in world bounds with bounce effect
        if (this.car.x < this.car.width/2) {
            this.car.x = this.car.width/2;
            this.car.speed *= -0.3;
        }
        if (this.car.x > this.world.width - this.car.width/2) {
            this.car.x = this.world.width - this.car.width/2;
            this.car.speed *= -0.3;
        }
        if (this.car.y < this.car.height/2) {
            this.car.y = this.car.height/2;
            this.car.speed *= -0.3;
        }
        if (this.car.y > this.world.height - this.car.height/2) {
            this.car.y = this.world.height - this.car.height/2;
            this.car.speed *= -0.3;
        }
        
        // Update camera to follow car smoothly
        const targetCameraX = this.car.x - this.canvas.width / 2;
        const targetCameraY = this.car.y - this.canvas.height / 2;
        
        this.world.camera.x += (targetCameraX - this.world.camera.x) * 0.1;
        this.world.camera.y += (targetCameraY - this.world.camera.y) * 0.1;
        
        // Keep camera in bounds
        this.world.camera.x = Math.max(0, Math.min(this.world.width - this.canvas.width, this.world.camera.x));
        this.world.camera.y = Math.max(0, Math.min(this.world.height - this.canvas.height, this.world.camera.y));
    }
    
    checkPortfolioSectionCollision() {
        this.nearSection = null;
        
        for (let section of this.portfolioSections) {
            const distance = Math.sqrt(
                Math.pow(this.car.x - (section.x + section.width/2), 2) +
                Math.pow(this.car.y - (section.y + section.height/2), 2)
            );
            
            if (distance < 80) {
                this.nearSection = section;
                break;
            }
        }
    }
    
    render() {
        if (!this.ctx || !this.canvas) {
            console.warn('⚠️ Canvas context not available for rendering');
            return;
        }
        
        try {
            // Clear canvas first
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Simple sky blue background as fallback
            this.ctx.fillStyle = '#87CEEB';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Save context for camera transform
            this.ctx.save();
            this.ctx.translate(-this.world.camera.x, -this.world.camera.y);
            
            // Draw simple grass background
            this.ctx.fillStyle = '#90EE90';
            this.ctx.fillRect(0, 0, this.world.width, this.world.height);
            
            // Try to draw enhanced elements, fall back to simple if they fail
            try {
                this.drawGrassBackground();
                this.drawTrees();
                this.drawDecorativeBuildings();
            } catch (enhancedError) {
                console.warn('⚠️ Enhanced graphics failed, using simple graphics:', enhancedError);
            }
            
            // Draw roads (essential)
            this.drawRoads();
            
            // Draw portfolio buildings (essential)
            this.drawPortfolioSections();
            
            // Try particles
            try {
                this.drawParticles();
            } catch (particleError) {
                console.warn('⚠️ Particles failed:', particleError);
            }
            
            // Draw car (essential)
            this.drawCar();
            
            // Restore context
            this.ctx.restore();
            
            // Draw UI elements
            this.drawMinimap();
            this.updateHUD();
            
            // Try speed lines
            try {
                this.drawSpeedLines();
            } catch (speedError) {
                console.warn('⚠️ Speed lines failed:', speedError);
            }
            
        } catch (error) {
            console.error('❌ Render error:', error);
            // Emergency fallback - just draw a colored background
            this.ctx.fillStyle = '#87CEEB';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Draw a simple indicator that the game is running
            this.ctx.fillStyle = '#ff0000';
            this.ctx.fillRect(this.canvas.width/2 - 10, this.canvas.height/2 - 10, 20, 20);
            
            this.ctx.fillStyle = '#000';
            this.ctx.font = '16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Game Loading...', this.canvas.width/2, this.canvas.height/2 + 40);
        }
    }
    
    drawRoads() {
        this.ctx.strokeStyle = '#666';
        this.ctx.lineWidth = 100;
        this.ctx.lineCap = 'round';
        
        // Main road network
        this.ctx.beginPath();
        this.ctx.moveTo(100, 300);
        this.ctx.lineTo(1900, 300);
        this.ctx.moveTo(300, 100);
        this.ctx.lineTo(300, 1400);
        this.ctx.moveTo(800, 150);
        this.ctx.lineTo(800, 1200);
        this.ctx.moveTo(1400, 200);
        this.ctx.lineTo(1400, 1300);
        this.ctx.stroke();
        
        // Road markings
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 4;
        this.ctx.setLineDash([20, 20]);
        
        this.ctx.beginPath();
        this.ctx.moveTo(100, 300);
        this.ctx.lineTo(1900, 300);
        this.ctx.moveTo(300, 100);
        this.ctx.lineTo(300, 1400);
        this.ctx.stroke();
        
        this.ctx.setLineDash([]);
    }
    
    drawGrassBackground() {
        // Create textured grass pattern
        const grassGradient = this.ctx.createLinearGradient(0, 0, 0, this.world.height);
        grassGradient.addColorStop(0, '#90EE90');
        grassGradient.addColorStop(0.5, '#7FDD7F');
        grassGradient.addColorStop(1, '#6FCC6F');
        this.ctx.fillStyle = grassGradient;
        this.ctx.fillRect(0, 0, this.world.width, this.world.height);
        
        // Add grass texture dots
        this.ctx.fillStyle = 'rgba(60, 150, 60, 0.3)';
        for (let i = 0; i < 500; i++) {
            const x = Math.random() * this.world.width;
            const y = Math.random() * this.world.height;
            this.ctx.beginPath();
            this.ctx.arc(x, y, Math.random() * 2, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    drawTrees() {
        for (let tree of this.trees) {
            // Tree trunk
            this.ctx.fillStyle = '#8B4513';
            this.ctx.fillRect(tree.x - 3, tree.y + tree.size * 0.3, 6, tree.size * 0.7);
            
            // Tree foliage
            const foliageGradient = this.ctx.createRadialGradient(
                tree.x, tree.y, 0,
                tree.x, tree.y, tree.size
            );
            foliageGradient.addColorStop(0, '#228B22');
            foliageGradient.addColorStop(1, '#006400');
            this.ctx.fillStyle = foliageGradient;
            this.ctx.beginPath();
            this.ctx.arc(tree.x, tree.y, tree.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Tree highlight
            this.ctx.fillStyle = 'rgba(144, 238, 144, 0.6)';
            this.ctx.beginPath();
            this.ctx.arc(tree.x - tree.size * 0.3, tree.y - tree.size * 0.3, tree.size * 0.4, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    drawDecorativeBuildings() {
        for (let building of this.decorativeBuildings) {
            // Building shadow
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            this.ctx.fillRect(building.x + 3, building.y + 3, building.width, building.height);
            
            // Building body
            this.ctx.fillStyle = building.color;
            this.ctx.fillRect(building.x, building.y, building.width, building.height);
            
            // Building windows
            this.ctx.fillStyle = '#333';
            const windowRows = Math.floor(building.height / 15);
            const windowCols = Math.floor(building.width / 15);
            for (let row = 1; row < windowRows; row++) {
                for (let col = 1; col < windowCols; col++) {
                    this.ctx.fillRect(
                        building.x + col * 15 - 3,
                        building.y + row * 15 - 3,
                        6, 8
                    );
                }
            }
            
            // Building outline
            this.ctx.strokeStyle = '#555';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(building.x, building.y, building.width, building.height);
        }
    }
    
    drawParticles() {
        for (let particle of this.particles) {
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = '#fff';
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Update particle position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Wrap particles around world
            if (particle.x < 0) particle.x = this.world.width;
            if (particle.x > this.world.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.world.height;
            if (particle.y > this.world.height) particle.y = 0;
        }
        this.ctx.globalAlpha = 1;
    }
    
    drawPortfolioSections() {
        for (let section of this.portfolioSections) {
            // Building shadow
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            this.ctx.fillRect(section.x + 5, section.y + 5, section.width, section.height);
            
            // Building gradient
            const buildingGradient = this.ctx.createLinearGradient(
                section.x, section.y,
                section.x + section.width, section.y + section.height
            );
            buildingGradient.addColorStop(0, section.color);
            buildingGradient.addColorStop(1, this.darkenColor(section.color, 0.3));
            this.ctx.fillStyle = buildingGradient;
            this.ctx.fillRect(section.x, section.y, section.width, section.height);
            
            // Building windows pattern
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            const windowRows = Math.floor(section.height / 20);
            const windowCols = Math.floor(section.width / 20);
            for (let row = 1; row < windowRows; row++) {
                for (let col = 1; col < windowCols; col++) {
                    if ((row + col) % 2 === 0) {
                        this.ctx.fillRect(
                            section.x + col * 20 - 4,
                            section.y + row * 20 - 4,
                            8, 10
                        );
                    }
                }
            }
            
            // Building roof
            this.ctx.fillStyle = this.darkenColor(section.color, 0.5);
            this.ctx.fillRect(section.x - 5, section.y - 10, section.width + 10, 10);
            
            // Border with glow effect
            this.ctx.strokeStyle = section.color;
            this.ctx.lineWidth = 4;
            this.ctx.shadowColor = section.color;
            this.ctx.shadowBlur = 10;
            this.ctx.strokeRect(section.x, section.y, section.width, section.height);
            this.ctx.shadowBlur = 0;
            
            // Icon and title
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(
                section.icon,
                section.x + section.width / 2,
                section.y + section.height / 2 - 10
            );
            
            this.ctx.font = 'bold 14px Arial';
            this.ctx.fillText(
                section.title,
                section.x + section.width / 2,
                section.y + section.height / 2 + 20
            );
            
            // Interaction indicator with animation
            if (this.nearSection === section) {
                const time = Date.now() * 0.005;
                const pulse = Math.sin(time) * 0.3 + 0.7;
                
                this.ctx.fillStyle = `rgba(255, 255, 255, ${pulse})`;
                this.ctx.font = 'bold 16px Arial';
                this.ctx.fillText(
                    '🎮 Press E to explore',
                    section.x + section.width / 2,
                    section.y - 25
                );
                
                // Glowing ring around building
                this.ctx.strokeStyle = `rgba(255, 255, 255, ${pulse})`;
                this.ctx.lineWidth = 3;
                this.ctx.strokeRect(
                    section.x - 10, section.y - 10,
                    section.width + 20, section.height + 20
                );
            }
        }
    }
    
    drawCar() {
        this.ctx.save();
        this.ctx.translate(this.car.x, this.car.y);
        this.ctx.rotate(this.car.angle);
        
        // Car exhaust particles
        if (Math.abs(this.car.speed) > 1) {
            for (let i = 0; i < 3; i++) {
                const exhaustX = -this.car.width/2 - 5 - i * 3;
                const exhaustY = (Math.random() - 0.5) * 8;
                this.ctx.fillStyle = `rgba(100, 100, 100, ${0.5 - i * 0.15})`;
                this.ctx.beginPath();
                this.ctx.arc(exhaustX, exhaustY, 2 + i, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
        
        // Car shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(-this.car.width/2 + 2, -this.car.height/2 + 2, this.car.width, this.car.height);
        
        // Car body gradient
        const carGradient = this.ctx.createLinearGradient(
            -this.car.width/2, -this.car.height/2,
            this.car.width/2, this.car.height/2
        );
        carGradient.addColorStop(0, this.car.color);
        carGradient.addColorStop(1, this.darkenColor(this.car.color, 0.3));
        this.ctx.fillStyle = carGradient;
        this.ctx.fillRect(-this.car.width/2, -this.car.height/2, this.car.width, this.car.height);
        
        // Car details
        // Windshield
        this.ctx.fillStyle = 'rgba(173, 216, 230, 0.8)';
        this.ctx.fillRect(this.car.width/4, -this.car.height/2 + 2, this.car.width/3, this.car.height - 4);
        
        // Headlights
        if (this.car.headlights) {
            this.ctx.fillStyle = '#fff';
            this.ctx.beginPath();
            this.ctx.arc(this.car.width/2 - 3, -this.car.height/4, 3, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(this.car.width/2 - 3, this.car.height/4, 3, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Headlight beams
            if (Math.abs(this.car.speed) > 0.5) {
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                this.ctx.beginPath();
                this.ctx.moveTo(this.car.width/2, -this.car.height/4);
                this.ctx.lineTo(this.car.width/2 + 50, -this.car.height/2);
                this.ctx.lineTo(this.car.width/2 + 50, this.car.height/2);
                this.ctx.lineTo(this.car.width/2, this.car.height/4);
                this.ctx.fill();
            }
        }
        
        // Wheels
        this.ctx.fillStyle = '#333';
        this.ctx.beginPath();
        this.ctx.arc(-this.car.width/4, -this.car.height/2 - 3, 5, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(-this.car.width/4, this.car.height/2 + 3, 5, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(this.car.width/4, -this.car.height/2 - 3, 5, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(this.car.width/4, this.car.height/2 + 3, 5, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Car outline with metallic effect
        this.ctx.strokeStyle = this.darkenColor(this.car.color, 0.5);
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(-this.car.width/2, -this.car.height/2, this.car.width, this.car.height);
        
        // Speed indicator on car
        if (Math.abs(this.car.speed) > 3) {
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            this.ctx.lineWidth = 1;
            for (let i = 0; i < 3; i++) {
                this.ctx.beginPath();
                this.ctx.moveTo(-this.car.width/2 - 10 - i * 5, (i - 1) * 3);
                this.ctx.lineTo(-this.car.width/2 - 15 - i * 5, (i - 1) * 3);
                this.ctx.stroke();
            }
        }
        
        this.ctx.restore();
    }
    
    drawSpeedLines() {
        if (Math.abs(this.car.speed) > 4) {
            this.ctx.strokeStyle = `rgba(255, 255, 255, ${Math.abs(this.car.speed) / 10})`;
            this.ctx.lineWidth = 2;
            
            for (let i = 0; i < 8; i++) {
                const x = this.canvas.width / 2 + (Math.random() - 0.5) * this.canvas.width;
                const y = this.canvas.height / 2 + (Math.random() - 0.5) * this.canvas.height;
                const length = 20 + Math.abs(this.car.speed) * 2;
                
                this.ctx.beginPath();
                this.ctx.moveTo(x, y);
                this.ctx.lineTo(x - Math.cos(this.car.angle) * length, y - Math.sin(this.car.angle) * length);
                this.ctx.stroke();
            }
        }
    }
    
    darkenColor(color, factor) {
        // Simple color darkening function
        const hex = color.replace('#', '');
        const r = Math.max(0, parseInt(hex.substr(0, 2), 16) * (1 - factor));
        const g = Math.max(0, parseInt(hex.substr(2, 2), 16) * (1 - factor));
        const b = Math.max(0, parseInt(hex.substr(4, 2), 16) * (1 - factor));
        return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
    }
    
    drawMinimap() {
        const scale = 0.075; // Scale factor for minimap
        
        // Clear minimap with dark background
        this.minimapCtx.fillStyle = '#1a4c1a';
        this.minimapCtx.fillRect(0, 0, 150, 150);
        
        // Draw world boundary
        this.minimapCtx.strokeStyle = '#333';
        this.minimapCtx.lineWidth = 2;
        this.minimapCtx.strokeRect(0, 0, this.world.width * scale, this.world.height * scale);
        
        // Draw roads on minimap
        this.minimapCtx.strokeStyle = '#666';
        this.minimapCtx.lineWidth = 3;
        this.minimapCtx.beginPath();
        this.minimapCtx.moveTo(100 * scale, 300 * scale);
        this.minimapCtx.lineTo(1900 * scale, 300 * scale);
        this.minimapCtx.moveTo(300 * scale, 100 * scale);
        this.minimapCtx.lineTo(300 * scale, 1400 * scale);
        this.minimapCtx.stroke();
        
        // Draw trees on minimap
        this.minimapCtx.fillStyle = '#0d4f0d';
        for (let tree of this.trees) {
            this.minimapCtx.beginPath();
            this.minimapCtx.arc(tree.x * scale, tree.y * scale, 2, 0, Math.PI * 2);
            this.minimapCtx.fill();
        }
        
        // Draw portfolio sections on minimap
        for (let section of this.portfolioSections) {
            this.minimapCtx.fillStyle = section.color;
            this.minimapCtx.fillRect(
                section.x * scale,
                section.y * scale,
                section.width * scale,
                section.height * scale
            );
            
            // Highlight near section
            if (this.nearSection === section) {
                this.minimapCtx.strokeStyle = '#fff';
                this.minimapCtx.lineWidth = 2;
                this.minimapCtx.strokeRect(
                    section.x * scale - 1,
                    section.y * scale - 1,
                    section.width * scale + 2,
                    section.height * scale + 2
                );
            }
        }
        
        // Draw car on minimap with direction indicator
        this.minimapCtx.save();
        this.minimapCtx.translate(this.car.x * scale, this.car.y * scale);
        this.minimapCtx.rotate(this.car.angle);
        
        // Car body
        this.minimapCtx.fillStyle = '#ff0000';
        this.minimapCtx.fillRect(-3, -2, 6, 4);
        
        // Car direction indicator
        this.minimapCtx.fillStyle = '#fff';
        this.minimapCtx.fillRect(3, -1, 2, 2);
        
        this.minimapCtx.restore();
        
        // Draw camera viewport indicator
        this.minimapCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        this.minimapCtx.lineWidth = 1;
        this.minimapCtx.strokeRect(
            this.world.camera.x * scale,
            this.world.camera.y * scale,
            this.canvas.width * scale,
            this.canvas.height * scale
        );
    }
    
    updateHUD() {
        const speedDisplay = document.getElementById('speed-display');
        const fuelDisplay = document.getElementById('fuel-display');
        
        if (speedDisplay) {
            const speed = Math.round(Math.abs(this.car.speed) * 12);
            speedDisplay.textContent = speed;
            
            // Color code speed
            if (speed > 80) {
                speedDisplay.style.color = '#ff4444';
            } else if (speed > 50) {
                speedDisplay.style.color = '#ffaa00';
            } else {
                speedDisplay.style.color = '#00ff00';
            }
        }
        
        if (fuelDisplay) {
            const fuel = Math.round(this.fuel);
            fuelDisplay.textContent = fuel;
            
            // Color code fuel
            if (fuel < 20) {
                fuelDisplay.style.color = '#ff4444';
                fuelDisplay.style.animation = 'blink 0.5s infinite';
            } else if (fuel < 50) {
                fuelDisplay.style.color = '#ffaa00';
                fuelDisplay.style.animation = 'none';
            } else {
                fuelDisplay.style.color = '#00ff00';
                fuelDisplay.style.animation = 'none';
            }
        }
        
        // Refuel at gas stations (near decorative buildings)
        for (let building of this.decorativeBuildings) {
            const distance = Math.sqrt(
                Math.pow(this.car.x - (building.x + building.width/2), 2) +
                Math.pow(this.car.y - (building.y + building.height/2), 2)
            );
            
            if (distance < 60 && this.fuel < 90) {
                this.fuel = Math.min(100, this.fuel + 0.5);
                // Visual feedback for refueling
                if (Math.random() < 0.1) {
                    console.log('⛽ Refueling...');
                }
            }
        }
    }
    
    showPortfolioSection(section) {
        const popup = document.getElementById('portfolio-popup');
        const popupBody = document.getElementById('popup-body');
        
        if (!popup || !popupBody) return;
        
        // Get content based on section type
        const content = this.getPortfolioContent(section.type);
        popupBody.innerHTML = content;
        
        popup.classList.remove('hidden');
    }
    
    hidePortfolioPopup() {
        const popup = document.getElementById('portfolio-popup');
        if (popup) {
            popup.classList.add('hidden');
        }
    }
    
    getPortfolioContent(type) {
        const content = {
            about: `
                <h3>About Me</h3>
                <p>Software Engineer with a focus on robotics and machine learning. Experienced in developing intelligent systems, automation pipelines, and applied AI solutions using Python and modern frameworks.</p>
                <p>Passionate about solving real-world problems through data-driven robotics and scalable ML models. My research spans across few-shot learning, computer vision, prosody analysis, and real-time systems.</p>
                <p>Beyond technology, I'm passionate about music creation and have completed 2 levels in Trinity Drums and 3 levels in Trinity Music Theory.</p>
            `,
            education: `
                <h3>Education</h3>
                <ul>
                    <li><strong>BTech CSE (IoT)</strong> - Shiv Nadar University Chennai (CGPA: 8.30/10)</li>
                    <li><strong>12th Grade</strong> - National Public School International Chennai (80%)</li>
                    <li><strong>10th Grade (ICSE)</strong> - Secondary Education (94%)</li>
                </ul>
            `,
            experience: `
                <h3>Work Experience</h3>
                <ul>
                    <li><strong>SDE and ML Intern</strong> - Meister-Gen Technologies (May 2025 - July 2025)</li>
                    <li><strong>Research Internship</strong> - IIT Mandi (Sep 2024 - Mar 2025)</li>
                    <li><strong>Research Internship</strong> - Shiv Nadar University (Dec 2024 - Jan 2025)</li>
                    <li><strong>Research Internship</strong> - NIT Trichy (May 2024 - July 2024)</li>
                </ul>
            `,
            skills: `
                <h3>Technical Skills</h3>
                <ul>
                    <li><strong>Robotics:</strong> Arduino, Raspberry Pi, ROS noetic</li>
                    <li><strong>AI & ML:</strong> Machine Learning, Deep Learning, Meta Learning</li>
                    <li><strong>Programming:</strong> Python, Java, C</li>
                    <li><strong>Web Dev:</strong> HTML, CSS, JavaScript, React JS, Flask</li>
                    <li><strong>Database:</strong> SQL, PL/SQL, Firebase, SQLite3</li>
                </ul>
            `,
            projects: `
                <h3>Featured Projects</h3>
                <ul>
                    <li>Automated parking system with self parking cars</li>
                    <li>Wi-Fi Controlled car with ADAS and parking assist</li>
                    <li>Secure AI Assistant with Voice and NLP Interface</li>
                    <li>Few-Shot Object Detection for Autonomous Vehicles</li>
                    <li>Real-Time Camera-Based Robotic Hand Mimicry</li>
                </ul>
            `,
            certifications: `
                <h3>Certifications & Achievements</h3>
                <ul>
                    <li>Part of two World Records</li>
                    <li>Trinity Drums (2 levels) & Music Theory (3 levels)</li>
                    <li>Conducted G20 event at college</li>
                    <li>NPTEL: Cloud Computing, Industry 4.0</li>
                    <li>AWS: Kinesis, DynamoDB, Prompt Engineering</li>
                </ul>
            `,
            blogs: `
                <h3>Featured Blogs</h3>
                <ul>
                    <li>Fitting Tor, Browser, and Linux Into a 120 MB Smart Watch</li>
                    <li>Unleash Your Inner Artist: AR-Powered Drawing Python App</li>
                    <li>Revolutionizing Parking with ParkMate</li>
                    <li>Ultimate Guide to Building Your Own JARVIS AI Assistant</li>
                </ul>
            `,
            music: `
                <h3>Music & Creativity</h3>
                <p>Explore my musical journey through original compositions and creative projects.</p>
                <ul>
                    <li>Shatter the Sky - Original electronic composition</li>
                    <li>Megatroniz-Camellia - Electronic fusion</li>
                    <li>Megatroniz-Rusted Dreams - Ambient soundscape</li>
                    <li>Megatroniz-Ecstacy - Complex rhythmic composition</li>
                </ul>
            `,
            contact: `
                <h3>Get In Touch</h3>
                <p>I'm always interested in discussing new opportunities, research collaborations, or innovative projects.</p>
                <ul>
                    <li><strong>Email:</strong> raghav.vijayanand@gmail.com</li>
                    <li><strong>Phone:</strong> +91 9566131050</li>
                    <li><strong>Website:</strong> www.energme.com</li>
                    <li><strong>GitHub:</strong> RaghavVijayanand</li>
                    <li><strong>LinkedIn:</strong> raghav-vijayanand</li>
                </ul>
            `
        };
        
        return content[type] || '<h3>Content not found</h3>';
    }
    
    gameLoop() {
        if (!this.gameActive) {
            console.log('🛑 Game loop stopped - game not active');
            return;
        }
        
        if (!this.canvas || !this.ctx) {
            console.error('❌ Game loop stopped - canvas not available');
            return;
        }
        
        try {
            this.updateCar();
            this.checkPortfolioSectionCollision();
            this.render();
            
            this.animationId = requestAnimationFrame(() => this.gameLoop());
        } catch (error) {
            console.error('❌ Game loop error:', error);
            // Try to continue the loop even if there's an error
            this.animationId = requestAnimationFrame(() => this.gameLoop());
        }
    }
}