function loadComponent(componentId, url) {
    $(document).ready(function(){
      $(componentId).load(url);
    });
}

// Load Navbar
loadComponent('#navbar', 'components/navbar.html');
  
// Load Footer
loadComponent('#footer', 'components/footer.html');