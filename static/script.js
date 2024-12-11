document.addEventListener("DOMContentLoaded", () => {
    const map = document.querySelector("img"); // The map image
    const labelsContainer = document.querySelector(".map-labels"); // The labels container
    const addLabelButton = document.getElementById("add-label-button"); // Add Label button

    let isDragging = false; // Whether the user is dragging the map
    let isAddingLabel = false; // Whether label creation mode is active
    let startX, startY; // Starting coordinates for dragging
    let currentX = 0, currentY = 0; // Current translation values
    let scale = 1; // Current zoom scale
    const maxScale = 5; // Maximum zoom level
    let minScale = 1; // Minimum zoom level, dynamically calculated

    // Calculate the minimum zoom scale to fit the map entirely in the container
    const calculateMinScale = () => {
        const containerRect = labelsContainer.getBoundingClientRect();
        return Math.min(
            containerRect.width / map.naturalWidth,
            containerRect.height / map.naturalHeight
        );
    };

    // Initialize the minimum scale
    minScale = calculateMinScale();

    // Prevent default drag behavior for the map image
    map.addEventListener("dragstart", (e) => {
        e.preventDefault();
    });

    // Handle map dragging
    labelsContainer.addEventListener("mousedown", (e) => {
        if (isAddingLabel) return; // Disable dragging in Add Label mode
        isDragging = true;
        startX = e.clientX - currentX;
        startY = e.clientY - currentY;
        labelsContainer.style.cursor = "grabbing";
    });

    labelsContainer.addEventListener("mousemove", (e) => {
        if (!isDragging) return;

        currentX = e.clientX - startX;
        currentY = e.clientY - startY;

        updateTransform();
    });

    labelsContainer.addEventListener("mouseup", () => {
        isDragging = false;
        labelsContainer.style.cursor = "grab";
    });

    labelsContainer.addEventListener("mouseleave", () => {
        isDragging = false;
        labelsContainer.style.cursor = "grab";
    });

    // Zoom the map with the mouse wheel
    labelsContainer.addEventListener("wheel", (e) => {
        e.preventDefault();

        const zoomFactor = 0.1;
        const zoomDirection = e.deltaY > 0 ? -1 : 1; // Determine zoom direction

        const newScale = Math.max(minScale, Math.min(maxScale, scale + zoomDirection * zoomFactor));
        if (newScale === scale) return;

        const rect = labelsContainer.getBoundingClientRect();
        const cursorX = e.clientX - rect.left;
        const cursorY = e.clientY - rect.top;

        currentX -= (cursorX - rect.width / 2) * (newScale / scale - 1);
        currentY -= (cursorY - rect.height / 2) * (newScale / scale - 1);

        scale = newScale;

        updateTransform();
    });

    // Update the map's position and zoom
    const updateTransform = () => {
        map.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
        labelsContainer.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
    };

    // Handle the Add Label button
    addLabelButton.addEventListener("click", () => {
        isAddingLabel = !isAddingLabel; // Toggle the label creation mode
        addLabelButton.classList.toggle("active", isAddingLabel); // Update button style
    });

    // Add a label at the clicked position on the map
    labelsContainer.addEventListener("click", (e) => {
        if (!isAddingLabel) return; // Only allow label creation in Add Label mode

        const rect = labelsContainer.getBoundingClientRect();
        const x = (e.clientX - rect.left); // Get x relative to the container
        const y = (e.clientY - rect.top); // Get y relative to the container

        const labelName = prompt("Enter label name:", "New Label");
        if (!labelName) return; // Exit if no name is provided

        const label = document.createElement("div");
        label.className = "map-label";
        label.style.left = `${x}px`;
        label.style.top = `${y}px`;
        label.textContent = labelName;
        labelsContainer.appendChild(label);

        // Exit Add Label mode after placing a label
        isAddingLabel = false;
        addLabelButton.classList.remove("active");
    });

    // Recalculate minimum scale and adjust when the window resizes
    window.addEventListener("resize", () => {
        minScale = calculateMinScale();
        if (scale < minScale) {
            scale = minScale;
            currentX = 0;
            currentY = 0;
        }
        updateTransform();
    });

    // Initialize the map's position
    const initializeMap = () => {
        scale = minScale;
        currentX = 0;
        currentY = 0;
        updateTransform();
    };

    if (map.complete) {
        initializeMap();
    } else {
        map.addEventListener("load", initializeMap);
    }
});
