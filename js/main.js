function loadComponent(componentId, url) {
    document.addEventListener('DOMContentLoaded', function() {
        const element = document.querySelector(componentId);
        if (element) {
            fetch(url)
                .then(response => response.text())
                .then(data => {
                    element.innerHTML = data;
                })
                .catch(error => console.error('Error loading component:', error));
        }
    });
}

// Load Navbar
loadComponent('#navbar', 'components/navbar.html');

// Load Footer
loadComponent('#footer', 'components/footer.html');