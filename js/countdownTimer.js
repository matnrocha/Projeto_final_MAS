function generateCountdownTimer(encomenda) {
    const countdownContainer = document.getElementById(`${encomenda.codigo}-timer`);
    if (!countdownContainer) return;

    const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = encomenda.createdAt + 48 * 60 * 60 * 1000 - now; // 48 hours in milliseconds

        if (distance < 0) {
            countdownContainer.innerHTML = "Time's up!";
            clearInterval(interval);
            return;
        }

        const hours = Math.floor((distance % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const minutes = Math.floor((distance % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((distance % (60 * 1000)) / 1000);

        countdownContainer.innerHTML = `${hours}h ${minutes}m ${seconds}s`;
    }, 1000);
}
