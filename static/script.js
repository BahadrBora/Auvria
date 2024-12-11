// File: script.js
document.addEventListener("DOMContentLoaded", () => {
    const svg = document.querySelector("svg"); // Select the SVG element
    let isPanning = false; // Track panning state
    let startPoint = { x: 0, y: 0 }; // Initial pointer position
    let currentTranslate = { x: 0, y: 0 }; // Current translation

    // Mouse down to start dragging
    svg.addEventListener("mousedown", (e) => {
        isPanning = true;
        startPoint = { x: e.clientX, y: e.clientY };
    });

    // Mouse move to drag the map
    svg.addEventListener("mousemove", (e) => {
        if (!isPanning) return;
        const dx = e.clientX - startPoint.x; // Calculate movement
        const dy = e.clientY - startPoint.y;
        currentTranslate.x += dx; // Update translation
        currentTranslate.y += dy;
        svg.style.transform = `translate(${currentTranslate.x}px, ${currentTranslate.y}px)`;
        startPoint = { x: e.clientX, y: e.clientY }; // Update start point
    });

    // Mouse up to stop dragging
    svg.addEventListener("mouseup", () => {
        isPanning = false;
    });

    // Mouse out to stop dragging
    svg.addEventListener("mouseleave", () => {
        isPanning = false;
    });
    
    // Add zooming functionality
svg.addEventListener("wheel", (e) => {
    e.preventDefault();
    const scaleAmount = 0.1; // Zoom increment
    const currentScale = parseFloat(svg.getAttribute("data-scale") || 1);
    const newScale = e.deltaY < 0 ? currentScale + scaleAmount : currentScale - scaleAmount;
    svg.setAttribute("data-scale", newScale);
    svg.style.transform = `translate(${currentTranslate.x}px, ${currentTranslate.y}px) scale(${newScale})`;
});

});
