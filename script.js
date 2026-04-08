document.addEventListener('DOMContentLoaded', () => {
    // 1. Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealSections = document.querySelectorAll('.reveal-section');
    revealSections.forEach(section => {
        revealObserver.observe(section);
    });

    // Initial check for hero section
    setTimeout(() => {
        const hero = document.getElementById('hero');
        if (hero) hero.classList.add('visible');
    }, 100);

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