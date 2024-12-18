document.addEventListener('DOMContentLoaded', function() {
    const reviews = JSON.parse(sessionStorage.getItem('reviews')) || [];
    const reviewContainer = document.getElementById('reviewsContainer');

    reviews.forEach(review => {
        const reviewDiv = document.createElement('div');
        reviewDiv.classList.add('list-group-item');

        let stars = '⭐'.repeat(review.rating);

        reviewDiv.innerHTML = `
            <h5>${review.name}</h5>
            <p>${review.review}</p>
            <small class="text-muted">Email: ${review.email}</small>
            <p class="mt-2">Avaliação: ${stars}</p>
        `;

        reviewContainer.prepend(reviewDiv);
    });
});
