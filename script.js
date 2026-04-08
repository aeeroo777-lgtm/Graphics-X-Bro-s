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

    // Alert for click on portfolio item
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
             const title = item.querySelector('.overlay h3').innerText;
             alert(`You clicked to see more about: ${title}\n(Here you can replace this alert with a modal popup, a new page link, or extra details!)`);
        });
    });
});
