document.addEventListener('DOMContentLoaded', () => {
    // 1. Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // lower threshold so it triggers earlier
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-element');
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Initial check for hero elements
    setTimeout(() => {
        const heroElements = document.querySelectorAll('#hero .reveal-element');
        heroElements.forEach(el => el.classList.add('visible'));
    }, 100);

    // 1.5 Background Dots Animation
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let dots = [];
        const spacing = 45; // Space between dots
        const mouse = { x: -1000, y: -1000 };

        function initCanvas() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;

            dots = [];
            for (let x = 0; x < width; x += spacing) {
                for (let y = 0; y < height; y += spacing) {
                    dots.push({ x, y });
                }
            }
        }

        window.addEventListener('resize', initCanvas);
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
            
            dots.forEach(dot => {
                const dx = mouse.x - dot.x;
                const dy = mouse.y - dot.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                const maxDist = 200;
                let size = 1.0;
                let opacity = 0.15;
                
                if (dist < maxDist) {
                    const influence = (maxDist - dist) / maxDist;
                    size = 1.0 + influence * 2.5; // Scale up near mouse
                    opacity = 0.15 + influence * 0.7; // Brighten near mouse
                }
                
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                ctx.fill();
            });
            
            requestAnimationFrame(animateCanvas);
        }
        animateCanvas();
    }

    // 2. Scroll-Spy for Navbar highlighting
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-btn');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // 3. Smooth Scrolling for Navbar Links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Modal Logic for Portfolio Items
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const modal = document.getElementById('project-modal');
    const closeBtn = document.querySelector('.close-btn');
    const modalTitle = document.getElementById('modal-title');

    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
             const title = item.querySelector('.overlay h3').innerText;
             modalTitle.innerText = title;
             
             // Show modal
             modal.style.display = 'flex';
             // Small delay to allow display to apply before fading in
             setTimeout(() => {
                 modal.classList.add('show');
             }, 10);
        });
    });

    const closeModal = () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 400); // Wait for transition
    };

    closeBtn.addEventListener('click', closeModal);
    
    // Close on background click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
});