document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to current tab
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Modal functionality
    const modals = document.querySelectorAll('.modal');
    const closeModalBtns = document.querySelectorAll('.close-modal, .close-btn');
    
    function openModal(modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    function closeAllModals() {
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = 'auto';
    }
    
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    window.addEventListener('click', function(event) {
        modals.forEach(modal => {
            if (event.target === modal) {
                closeAllModals();
            }
        });
    });
    
    // HTML Elements CRUD functionality
    const htmlModal = document.getElementById('html-modal');
    const htmlForm = document.getElementById('html-form');
    const htmlModalTitle = document.getElementById('html-modal-title');
    const htmlIdInput = document.getElementById('html-id');
    const htmlTitleInput = document.getElementById('html-title');
    const htmlElementTypeInput = document.getElementById('html-element-type');
    const htmlDescriptionInput = document.getElementById('html-description');
    const htmlCodeInput = document.getElementById('html-code');
    
    // Add new HTML element
    document.getElementById('add-html-btn').addEventListener('click', function() {
        htmlModalTitle.textContent = 'Add HTML Element';
        htmlForm.reset();
        htmlIdInput.value = '';
        openModal(htmlModal);
    });
    
    // Edit HTML element
    document.querySelectorAll('.edit-html-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            htmlModalTitle.textContent = 'Edit HTML Element';
            
            // Fetch element data
            fetch(`/api/html_examples/${id}`)
                .then(response => response.json())
                .then(data => {
                    htmlIdInput.value = data.id;
                    htmlTitleInput.value = data.title;
                    htmlElementTypeInput.value = data.element_type;
                    htmlDescriptionInput.value = data.description;
                    htmlCodeInput.value = data.html_code;
                    openModal(htmlModal);
                })
                .catch(error => console.error('Error fetching HTML element:', error));
        });
    });
    
    // Save HTML element
    document.getElementById('save-html-btn').addEventListener('click', function() {
        const id = htmlIdInput.value;
        const data = {
            title: htmlTitleInput.value,
            element_type: htmlElementTypeInput.value,
            description: htmlDescriptionInput.value,
            html_code: htmlCodeInput.value
        };
        
        let url = '/api/html_examples';
        let method = 'POST';
        
        if (id) {
            url = `/api/html_examples/${id}`;
            method = 'PUT';
        }
        
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                closeAllModals();
                window.location.reload();
            }
        })
        .catch(error => console.error('Error saving HTML element:', error));
    });
    
    // Delete HTML element
    const confirmDialog = document.getElementById('confirm-dialog');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    let deleteItemId = null;
    let deleteItemType = null;
    
    document.querySelectorAll('.delete-html-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            deleteItemId = this.getAttribute('data-id');
            deleteItemType = 'html';
            openModal(confirmDialog);
        });
    });
    
    // Table Examples CRUD functionality
    const tableModal = document.getElementById('table-modal');
    const tableForm = document.getElementById('table-form');
    const tableModalTitle = document.getElementById('table-modal-title');
    const tableIdInput = document.getElementById('table-id');
    const tableTitleInput = document.getElementById('table-title');
    const tableTypeInput = document.getElementById('table-type');
    const tableDescriptionInput = document.getElementById('table-description');
    const tableCodeInput = document.getElementById('table-code');
    
    // Add new Table example
    document.getElementById('add-table-btn').addEventListener('click', function() {
        tableModalTitle.textContent = 'Add Table Example';
        tableForm.reset();
        tableIdInput.value = '';
        openModal(tableModal);
    });
    
    // Edit Table example
    document.querySelectorAll('.edit-table-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            tableModalTitle.textContent = 'Edit Table Example';
            
            // Fetch table data
            fetch(`/api/table_examples/${id}`)
                .then(response => response.json())
                .then(data => {
                    tableIdInput.value = data.id;
                    tableTitleInput.value = data.title;
                    tableTypeInput.value = data.table_type;
                    tableDescriptionInput.value = data.description;
                    tableCodeInput.value = data.html_code;
                    openModal(tableModal);
                })
                .catch(error => console.error('Error fetching Table example:', error));
        });
    });
    
    // Save Table example
    document.getElementById('save-table-btn').addEventListener('click', function() {
        const id = tableIdInput.value;
        const data = {
            title: tableTitleInput.value,
            table_type: tableTypeInput.value,
            description: tableDescriptionInput.value,
            html_code: tableCodeInput.value
        };
        
        let url = '/api/table_examples';
        let method = 'POST';
        
        if (id) {
            url = `/api/table_examples/${id}`;
            method = 'PUT';
        }
        
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                closeAllModals();
                window.location.reload();
            }
        })
        .catch(error => console.error('Error saving Table example:', error));
    });
    
    // Delete Table example
    document.querySelectorAll('.delete-table-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            deleteItemId = this.getAttribute('data-id');
            deleteItemType = 'table';
            openModal(confirmDialog);
        });
    });
    
    // Form Examples CRUD functionality
    const formModal = document.getElementById('form-modal');
    const formExampleForm = document.getElementById('form-example-form');
    const formModalTitle = document.getElementById('form-modal-title');
    const formIdInput = document.getElementById('form-id');
    const formTitleInput = document.getElementById('form-title');
    const formTypeInput = document.getElementById('form-type');
    const formDescriptionInput = document.getElementById('form-description');
    const formCodeInput = document.getElementById('form-code');
    
    // Add new Form example
    document.getElementById('add-form-btn').addEventListener('click', function() {
        formModalTitle.textContent = 'Add Form Example';
        formExampleForm.reset();
        formIdInput.value = '';
        openModal(formModal);
    });
    
    // Edit Form example
    document.querySelectorAll('.edit-form-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            formModalTitle.textContent = 'Edit Form Example';
            
            // Fetch form data
            fetch(`/api/form_examples/${id}`)
                .then(response => response.json())
                .then(data => {
                    formIdInput.value = data.id;
                    formTitleInput.value = data.title;
                    formTypeInput.value = data.form_type;
                    formDescriptionInput.value = data.description;
                    formCodeInput.value = data.html_code;
                    openModal(formModal);
                })
                .catch(error => console.error('Error fetching Form example:', error));
        });
    });
    
    // Save Form example
    document.getElementById('save-form-btn').addEventListener('click', function() {
        const id = formIdInput.value;
        const data = {
            title: formTitleInput.value,
            form_type: formTypeInput.value,
            description: formDescriptionInput.value,
            html_code: formCodeInput.value
        };
        
        let url = '/api/form_examples';
        let method = 'POST';
        
        if (id) {
            url = `/api/form_examples/${id}`;
            method = 'PUT';
        }
        
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                closeAllModals();
                window.location.reload();
            }
        })
        .catch(error => console.error('Error saving Form example:', error));
    });
    
    // Delete Form example
    document.querySelectorAll('.delete-form-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            deleteItemId = this.getAttribute('data-id');
            deleteItemType = 'form';
            openModal(confirmDialog);
        });
    });
    
    // Confirm Delete action
    confirmDeleteBtn.addEventListener('click', function() {
        let url;
        
        switch (deleteItemType) {
            case 'html':
                url = `/api/html_examples/${deleteItemId}`;
                break;
            case 'table':
                url = `/api/table_examples/${deleteItemId}`;
                break;
            case 'form':
                url = `/api/form_examples/${deleteItemId}`;
                break;
        }
        
        fetch(url, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                closeAllModals();
                window.location.reload();
            }
        })
        .catch(error => console.error('Error deleting item:', error));
    });
});
