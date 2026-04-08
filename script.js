document.addEventListener('DOMContentLoaded', () => {
    const navBtns = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Initialize the first tab to be visible
    const initialActive = document.querySelector('.tab-content.active');
    if (initialActive) {
        setTimeout(() => {
            initialActive.classList.add('show');
        }, 50);
    }

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all buttons
            navBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked button
            btn.classList.add('active');

            const targetId = btn.getAttribute('data-target');

            tabContents.forEach(content => {
                if (content.id === targetId) {
                    // Show target
                    content.classList.add('active');
                    // Small delay to trigger CSS transition
                    setTimeout(() => {
                        content.classList.add('show');
                    }, 50);
                } else if (content.classList.contains('active')) {
                    // Hide currently active
                    content.classList.remove('show');
                    // Wait for fade out animation before setting display:none
                    setTimeout(() => {
                        if (!content.classList.contains('show')) {
                            content.classList.remove('active');
                        }
                    }, 400); // Wait for transition
                }
            });
            
            // Scroll back to top of container smoothly if needed
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // Modal Logic for Portfolio Items
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
        }, 300); // Wait for transition
    };

    closeBtn.addEventListener('click', closeModal);
    
    // Close on background click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
});
