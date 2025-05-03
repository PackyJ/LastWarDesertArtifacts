const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let coordinatesSet = [
    { data: [], color: "#FF5733", file: "Coordinates3.txt" },
    { data: [], color: "#33FF57", file: "Coordinates4.txt" },
    { data: [], color: "#3357FF", file: "Coordinates5.txt" },
    { data: [], color: "#FF33A1", file: "Coordinates6.txt" }
];

const img = new Image();
img.src = "Season3.png"; // Replace with your image file
img.onload = function () {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    plotAllCoordinates();
};

// Load coordinates from files
coordinatesSet.forEach(set => {
    fetch(set.file)
        .then(response => response.text())
        .then(data => {
            set.data = data.split("\n").map(line => {
                const [x, y] = line.split(",").map(Number);
                return { x, y };
            });
            plotAllCoordinates();
        })
        .catch(error => console.error(`Error loading ${set.file}:`, error));
});

// Plot individual coordinates
function plotCoordinates(coords, color) {
    coords.forEach(coord => {
        const { x, y } = coord;
        const drawY = canvas.height - y;

        ctx.beginPath();
        ctx.arc(x, drawY, 3, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    });
}

// Plot all sets
function plotAllCoordinates() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    coordinatesSet.forEach(set => {
        plotCoordinates(set.data, set.color);
    });
}

// Filter function
function applyFilter() {
    const xMin = parseInt(document.getElementById('x_min').value);
    const xMax = parseInt(document.getElementById('x_max').value);
    const yMin = parseInt(document.getElementById('y_min').value);
    const yMax = parseInt(document.getElementById('y_max').value);

    coordinatesSet.forEach(set => {
        set.data = set.data.filter(coord =>
            coord.x >= xMin && coord.x <= xMax &&
            coord.y >= yMin && coord.y <= yMax
        );
    });

    plotAllCoordinates();
}

// Mouse hover: detect and show tooltip
canvas.addEventListener("mousemove", function (event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    let found = false;

    coordinatesSet.forEach(set => {
        set.data.forEach(coord => {
            const coordScreenY = canvas.height - coord.y;
            const distance = Math.sqrt(
                Math.pow(mouseX - coord.x, 2) + Math.pow(mouseY - coordScreenY, 2)
            );

            if (distance < 6) {
                showTooltip(event, coord);
                found = true;
            }
        });
    });

    if (!found) {
        hideTooltip();
    }
});

// Tooltip display
function showTooltip(event, coord) {
    const tooltip = document.getElementById("tooltip");
    const rect = canvas.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    tooltip.style.left = `${rect.left + x + 10}px`;
    tooltip.style.top = `${rect.top + y + 10}px`;
    tooltip.style.display = "block";
    tooltip.textContent = `X: ${coord.x}, Y: ${coord.y}`;
}

function hideTooltip() {
    const tooltip = document.getElementById("tooltip");
    tooltip.style.display = "none";
}
