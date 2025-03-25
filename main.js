document.addEventListener('DOMContentLoaded', function() {
    // Navigation highlighting
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const container = this.closest('div.filter-tabs');
            const filterBtns = container.querySelectorAll('.filter-btn');
            filterBtns.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Find the corresponding grid container
            const gridContainer = container.nextElementSibling;
            const items = gridContainer.children;
            
            for (let item of items) {
                if (filter === 'all' || item.getAttribute('data-type') === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            }
        });
    });
    
    // Modal functionality
    const modal = document.getElementById('code-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal, .close-btn');
    const htmlEditor = document.getElementById('html-editor');
    const previewContainer = document.getElementById('preview-container');
    const runCodeBtn = document.getElementById('run-code');
    const resetCodeBtn = document.getElementById('reset-code');
    
    // Try button functionality
    const tryButtons = document.querySelectorAll('.try-btn');
    tryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const code = this.getAttribute('data-code');
            openModal(code);
        });
    });
    
    function openModal(code) {
        htmlEditor.value = code;
        updatePreview(code);
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    runCodeBtn.addEventListener('click', function() {
        const code = htmlEditor.value;
        updatePreview(code);
    });
    
    resetCodeBtn.addEventListener('click', function() {
        const originalCode = htmlEditor.getAttribute('data-original');
        htmlEditor.value = originalCode;
        updatePreview(originalCode);
    });
    
    function updatePreview(code) {
        previewContainer.innerHTML = code;
        // Store original code for reset
        htmlEditor.setAttribute('data-original', code);
        
        // Disable form submissions in preview
        const forms = previewContainer.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                alert('This is just a demo form. Submission is disabled.');
            });
        });
    }
    
    // Copy code functionality
    const copyButtons = document.querySelectorAll('.copy-btn');
    const copyNotification = document.getElementById('copy-notification');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const code = this.getAttribute('data-code');
            navigator.clipboard.writeText(code).then(function() {
                showCopyNotification();
            });
        });
    });
    
    function showCopyNotification() {
        copyNotification.classList.add('show');
        setTimeout(() => {
            copyNotification.classList.remove('show');
        }, 2000);
    }
    
    // Flash messages auto-dismiss
    const flashMessages = document.querySelectorAll('.alert');
    if (flashMessages) {
        flashMessages.forEach(message => {
            setTimeout(() => {
                message.style.opacity = '0';
                setTimeout(() => {
                    message.style.display = 'none';
                }, 300);
            }, 5000);
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
