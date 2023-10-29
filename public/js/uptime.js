var process = require('process');
export function updateUptime() {
    const uptimeElement = document.querySelector('.UPTIMER');
    if (uptimeElement) {
        setInterval(() => {
            const uptimeInSeconds = Math.floor(process.uptime());
            const days = Math.floor(uptimeInSeconds / 86400);
            const hours = Math.floor((uptimeInSeconds % 86400) / 3600);
            const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
            const seconds = uptimeInSeconds % 60;
            uptimeElement.textContent = `Uptime: ${days}d ${hours}h ${minutes}m ${seconds}s`;
        }, 1000);
    }
}

updateUptime()