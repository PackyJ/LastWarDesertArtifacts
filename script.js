const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let coordinatesSet = [
    { data: [], color: "#FF5733", file: "Coordinates3.txt" },
    { data: [], color: "#33FF57", file: "Coordinates4.txt" },
    { data: [], color: "#3357FF", file: "Coordinates5.txt" },
    { data: [], color: "#FF33A1", file: "Coordinates6.txt" }
];

// Load and draw the image on the canvas
const img = new Image();
img.src = "your-image.png";  // Replace with the path to your image
img.onload = function() {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    plotAllCoordinates();  // Plot the initial coordinates
};

// Fetch and load coordinates from the text files
coordinatesSet.forEach(set => {
    fetch(set.file)  // Replace with the correct paths to your text files
        .then(response => response.text())
        .then(data => {
            set.data = data.split("\n").map(line => {
                const [x, y] = line.split(",").map(Number);
                return { x, y };
            });
            plotAllCoordinates();  // Re-plot after loading all coordinates
        })
        .catch(error => console.error(`Error loading ${set.file}:`, error));
});

// Plot coordinates on the canvas
function plotCoordinates(coords, color) {
    coords.forEach(coord => {
        const { x, y } = coord;

        // Invert the Y-coordinate (so (0, 0) is at the bottom left)
        const invertedY = canvas.height - y;  // Invert Y to make it start from bottom-left

        ctx.beginPath();
        ctx.arc(x, invertedY, 5, 0, Math.PI * 2);
        ctx.fillStyle = color; // Use the color for the current set
        ctx.fill();
    });
}

// Plot all coordinate sets on the canvas
function plotAllCoordinates() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear canvas before redrawing
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);  // Redraw image
    coordinatesSet.forEach(set => {
        plotCoordinates(set.data, set.color);  // Plot each set with its color
    });
}

// Apply filter to show only coordinates within the specified range
function applyFilter() {
    const xMin = parseInt(document.getElementById('x_min').value);
    const xMax = parseInt(document.getElementById('x_max').value);
    const yMin = parseInt(document.getElementById('y_min').value);
    const yMax = parseInt(document.getElementById('y_max').value);

    // Filter coordinates and plot the filtered points
    coordinatesSet.forEach(set => {
        const filteredCoords = set.data.filter(coord => 
            coord.x >= xMin && coord.x <= xMax && coord.y >= yMin && coord.y <= yMax
        );
        set.data = filteredCoords;  // Update the data to only contain filtered points
    });

    plotAllCoordinates();  // Re-plot the filtered coordinates
}

// Show coordinates on hover or click
canvas.addEventListener("mousemove", function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    let found = false;

    coordinatesSet.forEach(set => {
        set.data.forEach(coord => {
            const distance = Math.sqrt(Math.pow(x - coord.x, 2) + Math.pow(y - coord.y, 2));

            // If the mouse is close to a coordinate point
            if (distance < 10) {
                showTooltip(event, coord);  // Show the tooltip with coordinates
                found = true;
            }
        });
    });

    // Hide the tooltip if no point is near
    if (!found) {
        hideTooltip();
    }
});

// Function to display tooltip with coordinates
function showTooltip(event, coord) {
    const tooltip = document.getElementById("tooltip");
    tooltip.style.left = event.clientX + 10 + "px";
    tooltip.style.top = event.clientY + 10 + "px";
    tooltip.style.display = "block";
    tooltip.textContent = `X: ${coord.x}, Y: ${coord.y}`;
}

// Hide the tooltip
function hideTooltip() {
    const tooltip = document.getElementById("tooltip");
    tooltip.style.display = "none";
}
