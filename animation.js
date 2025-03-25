document.addEventListener('DOMContentLoaded', function() {
    // Particles animation in header
    const particles = document.getElementById('particles');
    
    if (particles) {
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            createParticle(particles);
        }
    }
    
    function createParticle(container) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random position, size and animation duration
        const size = Math.random() * 5 + 2;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        // Style the particle
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background-color: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1});
            border-radius: 50%;
            top: ${posY}%;
            left: ${posX}%;
            animation: float ${duration}s ease-in-out ${delay}s infinite;
            opacity: ${Math.random() * 0.5 + 0.3};
        `;
        
        container.appendChild(particle);
    }
    
    // Animate elements when they come into view
    const elementsToAnimate = document.querySelectorAll('.element-card, .table-card, .form-card, .section-header');
    
    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observe each element
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
    
    // Add dynamic typing animation to code snippets
    const codeBlocks = document.querySelectorAll('.code-content code');
    
    codeBlocks.forEach(block => {
        const originalText = block.textContent;
        let currentCharIndex = 0;
        
        block.textContent = '';
        
        const typingInterval = setInterval(() => {
            if (currentCharIndex < originalText.length) {
                block.textContent += originalText.charAt(currentCharIndex);
                currentCharIndex++;
            } else {
                clearInterval(typingInterval);
            }
        }, 20);
    });
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('.element-card, .table-card, .form-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
    
    // Add smooth scrolling animation effect to header anchor links
    const headerLinks = document.querySelectorAll('.main-nav a[href^="#"]');
    
    headerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                const targetSection = document.querySelector(href);
                
                if (targetSection) {
                    const headerHeight = document.querySelector('.main-header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update active state in navigation
                    headerLinks.forEach(navLink => navLink.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });
    
    // Update active navigation link based on scroll position
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const headerHeight = document.querySelector('.main-header').offsetHeight;
        const scrollPosition = window.scrollY + headerHeight + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                const currentId = section.getAttribute('id');
                
                headerLinks.forEach(link => {
                    link.classList.remove('active');
                    
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
});
