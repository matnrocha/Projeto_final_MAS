function generateCountdownTimer(encomenda) {
    const countdownContainer = document.getElementById(`${encomenda.codigo}-timer`);
    if (!countdownContainer) return;

    const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = encomenda.createdAt + 48 * 60 * 60 * 1000 - now; // 48 hours in milliseconds

        if (distance < 0) {
            countdownContainer.innerHTML = "00:00:00";
            countdownContainer.style.color = "red";
            clearInterval(interval);
            return;
        }

        const totalHours = Math.floor(distance / (60 * 60 * 1000));
        const minutes = Math.floor((distance % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((distance % (60 * 1000)) / 1000);

        countdownContainer.innerHTML = `${totalHours}h ${minutes}m ${seconds}s`;
        countdownContainer.style.color = "green";
    }, 1000);
}