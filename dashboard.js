function updateClock() {
    const now = new Date();

    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    const timeString = `${hours}:${minutes}:${seconds}`;
    
    document.getElementById('digital-clock').textContent = timeString;
}

updateClock();
setInterval(updateClock, 1000);

document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.switch input');

    if (toggle) {
        toggle.addEventListener('change', () => {
            // Remove #bodyContent from this list because it's inside #body
            // If you invert the parent, the child flips automatically.
            const elements = document.querySelectorAll('#header, #body');
            
            elements.forEach(el => {
                el.classList.toggle('inverted');
            });
        });
    }
});

async function getWeather() {
    const lat = 45.52; 
    const lon = -122.67;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        const temp = data.current_weather.temperature;
        const code = data.current_weather.weathercode;

        document.getElementById('temperature').textContent = `${temp}°F`;
        document.getElementById('location').textContent = "Portland, OR";
        document.getElementById('description').textContent = decodeWeather(code);
    } catch (error) {
        document.getElementById('description').textContent = "Weather unavailable";
    }
}

function decodeWeather(code) {
    const codes = {
        0: "Clear Sky",
        1: "Mainly Clear",
        2: "Partly Cloudy",
        3: "Overcast",
        45: "Foggy",
        61: "Slight Rain",
        71: "Slight Snow"
    };
    return codes[code] || "Variable Conditions";
}
getWeather();
setInterval(getWeather, 1800000); // 1,800,000 milliseconds = 30 minutes

// Drawing Board Logic - Wrapped in an event listener to ensure the page is ready
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('drawBoard');
    const clearBtn = document.getElementById('customClearBtn'); // Your new button

    if (canvas) {
        const ctx = canvas.getContext('2d');
        let drawing = false;

        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000';

        function startDrawing(e) {
            drawing = true;
            draw(e);
        }

        function stopDrawing() {
            drawing = false;
            ctx.beginPath();
        }

        function draw(e) {
            if (!drawing) return;
        
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
        
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
            const x = (clientX - rect.left) * scaleX;
            const y = (clientY - rect.top) * scaleY;
        
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
        }

        function clearCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            console.log("Canvas cleared!");
        }

        // --- Event Listeners ---
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        window.addEventListener('mouseup', stopDrawing); 
        
        // Listener for your new custom button
        if (clearBtn) {
            clearBtn.addEventListener('click', clearCanvas);
        }
    }
});

const scareBtn = document.getElementById('scareBtn');
const overlay = document.getElementById('scareOverlay');
const sound = document.getElementById('scareSound');

if (scareBtn && overlay) {
    scareBtn.addEventListener('click', () => {
        // Show the overlay
        overlay.style.display = 'flex';
        
        // Play the sound (browsers allow sound since it's a user click)
        if (sound) {
            sound.play();
        }

        // Hide it automatically after 1.5 seconds so they can keep using the site
        setTimeout(() => {
            overlay.style.display = 'none';
            if (sound) {
                sound.pause();
                sound.currentTime = 0; 
            }
        }, 1500);
    });
}

function updateYearProgress() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear() + 1, 0, 1);
    
    // Calculate progress
    const progress = (now - start) / (end - start);
    const percentage = (progress * 100).toFixed(2);

    // Update UI
    const fill = document.getElementById('year-bar-fill');
    const text = document.getElementById('year-text');

    if (fill && text) {
        fill.style.width = percentage + "%";
        text.textContent = `${now.getFullYear()} is ${percentage}% complete`;
    }
}

// Run once and then update every hour
updateYearProgress();
setInterval(updateYearProgress, 3600000);