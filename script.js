document.addEventListener('DOMContentLoaded', () => {
    // 1. Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.15 
    };

    let countersAnimated = false;

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate counters if hero section is visible
                if (entry.target.classList.contains('hero-stats') && !countersAnimated) {
                    animateCounters();
                    countersAnimated = true;
                }
                
                // Optional: unobserve after revealing if you don't want it to repeat
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-element');
    revealElements.forEach((el, index) => {
        // Add a slight stagger effect based on index for grouped elements
        if(el.closest('.bento-grid') || el.closest('.portfolio-grid') || el.closest('.process-steps') || el.closest('.testimonials-grid')) {
            el.style.transitionDelay = `${(index % 4) * 0.1}s`;
        }
        revealObserver.observe(el);
    });

    // Initial check for hero elements to show immediately on load
    setTimeout(() => {
        const heroElements = document.querySelectorAll('#hero .reveal-element');
        heroElements.forEach((el, index) => {
             setTimeout(() => {
                 el.classList.add('visible');
                 if(el.classList.contains('hero-stats') && !countersAnimated) {
                     animateCounters();
                     countersAnimated = true;
                 }
             }, index * 200);
        });
    }, 100);

    // 1.5 Counter Animation Function
    function animateCounters() {
        const counters = document.querySelectorAll('.counter');
        const speed = 2000; // Total duration in ms
        
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const start = performance.now();
            
            function updateCounter(currentTime) {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / speed, 1);
                
                // Ease out quad
                const easeOutQuad = progress * (2 - progress);
                
                const currentVal = Math.floor(target * easeOutQuad);
                counter.innerText = currentVal;
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target;
                }
            }
            requestAnimationFrame(updateCounter);
        });
    }

    // 1.6 Typewriter Effect for Hero
    const typewriterElement = document.querySelector('.typewriter');
    if (typewriterElement) {
        const text = typewriterElement.innerText;
        typewriterElement.innerText = '';
        let i = 0;
        
        // Wait for page load animations to start
        setTimeout(() => {
            function typeWriter() {
                if (i < text.length) {
                    typewriterElement.innerHTML += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 50);
                }
            }
            typeWriter();
        }, 800);
    }

    // 1.7 Background Particles Animation (Upgraded)
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        const mouse = { x: -1000, y: -1000 };

        function initCanvas() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;

            particles = [];
            const numParticles = Math.min((width * height) / 15000, 100); // Responsive number of particles
            
            for (let i = 0; i < numParticles; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    radius: Math.random() * 1.5 + 0.5,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    baseAlpha: Math.random() * 0.3 + 0.1
                });
            }
        }

        window.addEventListener('resize', () => {
            // Debounce resize
            clearTimeout(window.resizeTimer);
            window.resizeTimer = setTimeout(initCanvas, 200);
        });
        
        initCanvas();

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = -1000;
            mouse.y = -1000;
        });

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);
            
            particles.forEach(p => {
                // Update position
                p.x += p.vx;
                p.y += p.vy;
                
                // Wrap around edges
                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;
                
                // Mouse interaction
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                const maxDist = 150;
                let alpha = p.baseAlpha;
                let size = p.radius;
                
                if (dist < maxDist) {
                    const influence = (maxDist - dist) / maxDist;
                    alpha += influence * 0.5;
                    size += influence * 1.5;
                    
                    // Slightly repel from mouse
                    p.x -= dx * 0.01;
                    p.y -= dy * 0.01;
                    
                    // Draw connecting lines near mouse
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${influence * 0.1})`;
                    ctx.stroke();
                }
                
                ctx.beginPath();
                ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.fill();
            });
            
            requestAnimationFrame(animateCanvas);
        }
        animateCanvas();
    }

    // 2. Scroll-Spy for Navbar highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-btn');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150; // Offset for navbar
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
        
        // Back to top button visibility
        const backToTopBtn = document.getElementById('backToTop');
        if (backToTopBtn) {
            if (scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
    });

    // 2.5 3D Tilt Effect on Cards (Improved)
    const tiltElements = document.querySelectorAll('.bento-item, .portfolio-item, .testimonial-card');
    
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', e => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;  
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Smoother, less intense tilt
            const rotateX = ((y - centerY) / centerY) * -5; 
            const rotateY = ((x - centerX) / centerX) * 5;
            
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            el.style.transition = 'transform 0.1s ease'; // Fast transition to follow mouse
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)`;
            el.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
        });
    });

    // 3. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                     top: offsetPosition,
                     behavior: "smooth"
                });
            }
        });
    });

    // 4. Modal Logic for Portfolio Items
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const modal = document.getElementById('project-modal');
    const closeBtn = document.querySelector('.close-btn');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-description');

    // Sample data mapping
    const projectDetails = {
        'Cinematic Edits': 'Transformed over 5 hours of raw footage into a punchy, engaging 10-minute vlog. Enhanced visuals with custom LUTs and synchronized pacing with the music.',
        'Brand Identity': 'Developed a cohesive brand package including primary logo, alternate marks, typography guidelines, and social media templates.',
        'Color Grading': 'Applied a moody, cinematic teal-and-orange grade to flat log footage, completely changing the atmosphere of the scene.',
        'High-CTR Thumbnails': 'A series of vibrant, high-contrast thumbnails paired with curiosity-inducing text that boosted the client\'s click-through rate by 150%.',
        'Social Banners': 'Designed scalable banner art optimized for Twitter, YouTube, and LinkedIn, ensuring consistent branding across all touchpoints.'
    };

    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
             const title = item.querySelector('.overlay h3').innerText;
             modalTitle.innerText = title;
             
             if(projectDetails[title]) {
                 modalDesc.innerText = projectDetails[title];
             } else {
                 modalDesc.innerText = 'Detailed case study and high-res imagery loading soon...';
             }
             
             // Show modal
             modal.style.display = 'flex';
             // Small delay to allow display to apply before fading in
             setTimeout(() => {
                 modal.classList.add('show');
                 document.body.style.overflow = 'hidden'; // Prevent background scrolling
             }, 10);
        });
    });

    const closeModal = () => {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 400); // Wait for transition
    };

    if(closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Close on background click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
});
