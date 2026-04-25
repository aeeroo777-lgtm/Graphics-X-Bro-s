document.addEventListener('DOMContentLoaded', () => {
    // ===================================================================
    // 1. SCROLL PROGRESS BAR
    // ===================================================================
    const scrollProgressBar = document.getElementById('scrollProgress');
    
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
        document.documentElement.style.setProperty('--scroll-progress', progress.toFixed(4));
    }

    // ===================================================================
    // 2. 3D SCROLL ANIMATION ENGINE
    // ===================================================================
    const allAnimatedElements = document.querySelectorAll(
        '.reveal-element, .reveal-left, .reveal-right, .reveal-flip, .reveal-zoom, .reveal-rotate'
    );

    // Use IntersectionObserver for triggering reveal animations
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Animate counters if hero stats become visible
                if (entry.target.classList.contains('hero-stats') && !countersAnimated) {
                    animateCounters();
                    countersAnimated = true;
                }
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    });

    allAnimatedElements.forEach(el => {
        revealObserver.observe(el);
    });

    // ===================================================================
    // 3. PARALLAX DEPTH SCROLL EFFECT (per-section)
    // ===================================================================
    const sections = document.querySelectorAll('.section-scroll');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, { threshold: 0.05 });

    sections.forEach(s => sectionObserver.observe(s));

    // Scroll-linked parallax — uses CSS custom properties to avoid overriding reveal transforms
    function updateParallax() {
        const scrollY = window.pageYOffset;
        const viewportH = window.innerHeight;

        // Hero parallax — only after it's been revealed
        const heroContent = document.querySelector('.hero-content');
        if (heroContent && heroContent.classList.contains('visible') && scrollY < viewportH) {
            const heroParallax = scrollY * 0.3;
            const heroScale = 1 - (scrollY / viewportH) * 0.08;
            const heroOpacity = 1 - (scrollY / viewportH) * 0.6;
            heroContent.style.transform = `translateY(${heroParallax}px) scale(${heroScale})`;
            heroContent.style.opacity = Math.max(heroOpacity, 0);
        }

        const heroStats = document.querySelector('.hero-stats');
        if (heroStats && heroStats.classList.contains('visible') && scrollY < viewportH) {
            const statsParallax = scrollY * 0.15;
            heroStats.style.transform = `translateY(${statsParallax}px)`;
        }
    }

    // ===================================================================
    // 4. SCROLL EVENT — Combines progress, parallax, nav highlight
    // ===================================================================
    let ticking = false;
    let countersAnimated = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateScrollProgress();
                updateParallax();
                updateNavHighlight();
                updateBackToTop();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial call
    updateScrollProgress();

    // ===================================================================
    // 5. NAV HIGHLIGHT (SCROLL SPY)
    // ===================================================================
    const navSections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-btn');

    function updateNavHighlight() {
        let current = '';
        const scrollY = window.pageYOffset;

        navSections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
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
    }

    // ===================================================================
    // 6. BACK TO TOP BUTTON
    // ===================================================================
    function updateBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');
        if (backToTopBtn) {
            if (window.pageYOffset > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
    }

    // ===================================================================
    // 7. HERO ELEMENTS — Staggered on-load reveal
    // ===================================================================
    setTimeout(() => {
        const heroElements = document.querySelectorAll('#hero .reveal-element');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('visible');
                if (el.classList.contains('hero-stats') && !countersAnimated) {
                    animateCounters();
                    countersAnimated = true;
                }
            }, index * 250);
        });
    }, 100);

    // ===================================================================
    // 8. COUNTER ANIMATION
    // ===================================================================
    function animateCounters() {
        const counters = document.querySelectorAll('.counter');
        const speed = 2000;

        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const start = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / speed, 1);
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

    // ===================================================================
    // 9. TYPEWRITER EFFECT
    // ===================================================================
    const typewriterElement = document.querySelector('.typewriter');
    if (typewriterElement) {
        const text = typewriterElement.innerText;
        typewriterElement.innerText = '';
        let i = 0;

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

    // ===================================================================
    // 10. BACKGROUND PARTICLES
    // ===================================================================
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
            const numParticles = Math.min((width * height) / 15000, 100);

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
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

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

                    p.x -= dx * 0.01;
                    p.y -= dy * 0.01;

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

    // ===================================================================
    // 11. 3D TILT EFFECT ON CARDS (Mouse-driven)
    // ===================================================================
    const tiltElements = document.querySelectorAll('.bento-item, .portfolio-item, .testimonial-card');

    tiltElements.forEach(el => {
        el.addEventListener('mousemove', e => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(15px)`;
            el.style.transition = 'transform 0.1s ease';
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)`;
            el.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
        });
    });

    // ===================================================================
    // 12. SMOOTH SCROLLING FOR ANCHOR LINKS
    // ===================================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
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

    // ===================================================================
    // 13. MODAL LOGIC FOR PORTFOLIO ITEMS
    // ===================================================================
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const modal = document.getElementById('project-modal');
    const closeBtn = document.querySelector('.close-btn');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-description');

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

            if (projectDetails[title]) {
                modalDesc.innerText = projectDetails[title];
            } else {
                modalDesc.innerText = 'Detailed case study and high-res imagery loading soon...';
            }

            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('show');
                document.body.style.overflow = 'hidden';
            }, 10);
        });
    });

    const closeModal = () => {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 400);
    };

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    // ===================================================================
    // 14. ASSIGN FLOAT DELAYS FOR SUBTLE IDLE ANIMATION
    // ===================================================================
    document.querySelectorAll('.bento-item, .step, .testimonial-card').forEach((el, i) => {
        el.style.setProperty('--float-delay', `${i * 0.5}s`);
    });
});
