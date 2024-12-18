document.getElementById('reviewForm').addEventListener('submit', function(event) {
    event.preventDefault();
    if (!this.checkValidity()) {
        this.classList.add('was-validated');
        return;
    }

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const review = document.getElementById('review').value;
    const rating = document.querySelector('input[name="rating"]:checked').value;

    const reviewContainer = document.getElementById('reviewsContainer');
    const reviewDiv = document.createElement('div');
    reviewDiv.classList.add('list-group-item');

    let stars = '⭐'.repeat(rating);

    reviewDiv.innerHTML = `
        <h5>${name}</h5>
        <p>${review}</p>
        <small class="text-muted">Email: ${email}</small>
        <p class="mt-2">Avaliação: ${stars}</p>
    `;

    reviewContainer.prepend(reviewDiv);

    // Save review to session storage
    let reviews = JSON.parse(sessionStorage.getItem('reviews')) || [];
    reviews.push({ name, email, review, rating });
    sessionStorage.setItem('reviews', JSON.stringify(reviews));

    // Limpa o formulário
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('review').value = '';
    document.querySelector('input[name="rating"]:checked').checked = false;
    this.classList.remove('was-validated');
});