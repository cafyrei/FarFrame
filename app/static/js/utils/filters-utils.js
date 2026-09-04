const filters = [
  {
    name: "none",
    image: "/static/images/visuals/filter-placeholder.svg",
  },
  {
    name: "grayscale",
    image: "/static/images/visuals/filter-placeholder.svg",
  },
  {
    name: "sepia",
    image: "/static/images/visuals/filter-placeholder.svg",
  },
  {
    name: "vintage",
    image: "/static/images/visuals/filter-placeholder.svg",
  },
  {
    name: "vivid",
    image: "/static/images/visuals/filter-placeholder.svg",
  },
];

function createFilterButtons() {
  const videoFilter = document.getElementById("video-filter");

  filters.forEach((filter) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className =
      "filters absolute transition-all duration-300 ease-out";

    button.dataset.filter = filter.name;

    const image = document.createElement("img");

    image.src = filter.image;
    image.alt = filter.name;
    image.className =
      "filter-image w-14 h-14 rounded-full border-2 border-white pointer-events-none";

    button.appendChild(image);
    videoFilter.appendChild(button);
  });
}

export function filterTextLabel(label) {
  const videoGrid = document.getElementById("video-grid");
  if (!videoGrid) return;

  const existingLabel = document.getElementById("filter-label");
  if (existingLabel) {
    existingLabel.remove();
  }

  const template = document.createElement("div");

  template.innerHTML = `
    <div id="filter-label" class="absolute inset-0 flex items-center justify-center uppercase text-5xl font-bold text-white p-2 pointer-events-none transition-opacity duration-500 ease-out opacity-100 drop-shadow-lg">
      ${label}
    </div>
  `.trim();


  const labelElement = template.firstElementChild;
  
  videoGrid.appendChild(labelElement);
  setTimeout(() => {
    labelElement.classList.remove("opacity-100");
    labelElement.classList.add("opacity-0");

    setTimeout(() => {
      labelElement.remove();
    }, 500);
  }, 600);
}

createFilterButtons();