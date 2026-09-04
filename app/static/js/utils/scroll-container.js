import { setFilter } from "../session/media/video.js";
import { sendFilterState } from "../session/session-socket.js";
import { filterTextLabel } from "../utils/filters-utils.js";

document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.getElementById("filter-wrapper");

  if (!wrapper) return;
  
  const buttons = Array.from(wrapper.querySelectorAll(".filters"));
  const totalItems = buttons.length;

  let activeIndex = 0;
  let startY = 0;
  let isDragging = false;
  let hasDragged = false;
  let currentFilter = null;

  // Calculate 3D positioning AND instantly activate the centered item
  function renderWheel() {
    requestAnimationFrame(() => {
      buttons.forEach((btn, index) => {
        let diff = index - activeIndex;

        if (diff > totalItems / 2) diff -= totalItems;
        if (diff < -totalItems / 2) diff += totalItems;

        // 3D Transformations
        const translateY = diff * 52;
        const rotateX = -diff * 28;
        const translateZ = -Math.abs(diff) * 40;
        const scale = Math.max(0.55, 1 - Math.abs(diff) * 0.2);
        const opacity = Math.max(0.25, 1 - Math.abs(diff) * 0.35);

        btn.style.transform = `translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) scale(${scale})`;
        btn.style.opacity = opacity;
        btn.style.zIndex = Math.round(100 - Math.abs(diff) * 10);

        // Active centered item checking
        if (Math.abs(diff) < 0.1) {
          btn.classList.add("ring-4", "ring-cyan-400");

          // Automatically trigger active filter state as soon as it lands in center
          const activeFilter = btn.dataset.filter;
          if (activeFilter !== currentFilter) {
            currentFilter = activeFilter;

            setFilter(activeFilter);
            sendFilterState(activeFilter);

            filterTextLabel(activeFilter);
          }
        } else {
          btn.classList.remove("ring-4", "ring-cyan-400");
        }
      });
    });
  }

  // Advance step (scrolling/dragging instantly triggers renderWheel -> instant activation)
  function step(dir) {
    activeIndex = (activeIndex + dir + totalItems) % totalItems;
    renderWheel();
  }

  // Mouse wheel scrolling
  let isThrottled = false;
  wrapper.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      if (isThrottled) return;
      isThrottled = true;

      if (e.deltaY > 0) step(1);
      else if (e.deltaY < 0) step(-1);

      setTimeout(() => {
        isThrottled = false;
      }, 90);
    },
    { passive: false },
  );

  // Touch and drag support
  wrapper.addEventListener("pointerdown", (e) => {
    isDragging = true;
    hasDragged = false;
    startY = e.clientY;
  });

  window.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    const deltaY = e.clientY - startY;

    if (Math.abs(deltaY) > 25) {
      hasDragged = true;
      step(deltaY < 0 ? 1 : -1);
      startY = e.clientY;
    }
  });

  window.addEventListener("pointerup", () => {
    isDragging = false;
  });

  // Clicking an item still brings it to the center (and activates it instantly via renderWheel)
  buttons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      if (hasDragged) return;
      activeIndex = index;
      renderWheel();
    });
  });

  // Initial call to activate default center item on load
  renderWheel();
});
