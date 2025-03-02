document.addEventListener("DOMContentLoaded", async () => {
    try {
        const token = '1c4fc26e4a0067012f0976f7bf68ec00'
        const link1 = 'https://api.statorium.com/api/v1/teams/';
        const link2 = '/?season_id=1&apikey=' + token;

        const fetchPromises = [];

        for (let i = 1; i <= 20; i++) {
            const teamUrl = link1 + i + link2;
            fetchPromises.push(fetch(teamUrl).then(response => response.json()));
        }

        // Wait for all fetch requests to finish
        const responses = await Promise.all(fetchPromises);

        console.log(responses);

        const data = responses.map(response => {
            return {
                name: response.team.teamName,
                logo: response.team.logo,
            };
        });

        // Populate the carousel with images
        updateCarousel(data);

    } catch (error) {
        console.error("Error fetching images:", error);
    }
});

function updateCarousel(data) {
    const carouselInner = document.querySelector(".carousel-inner");
    const indicators = document.querySelector(".carousel-indicators");

    // Clear existing content
    carouselInner.innerHTML = "";
    indicators.innerHTML = "";

    data.forEach((team, index) => {
        const imageSrc = team.logo; // Use the logo property as imageSrc

        // Create carousel div with image
        const itemDiv = document.createElement("div");
        // Add classes to the div
        itemDiv.classList.add("carousel-item");
        // Add active class to the first item
        if (index === 0) itemDiv.classList.add("active");

        // Create image element
        const img = document.createElement("img");
        // Add attributes to the image
        img.src = imageSrc;
        // Add classes to the image
        img.classList.add("d-block", "w-100");
        img.style.maxWidth = "20%";   // Reduce size while keeping ratio
        img.style.padding = "auto auto auto auto";    // Center the image
        img.style.display = "block";
        // Add alt attribute to the image
        img.alt = `Slide ${index + 1}`;

        const caption = document.createElement("div");
        caption.classList.add("carousel-caption");

        const captionText = document.createElement("h5");
        captionText.classList.add("text");

        captionText.innerHTML = team.name; // Use the name property for the caption

        const container = document.createElement("div");
        container.classList.add("imgContainer");

        // create a tag
        const a = document.createElement("a");

        let href = createNewFile(team)
        a.href = href;
        a.id = "team" + index;

        // captionText -> caption -> a -> container, img -> container, container -> itemDiv -> carouselInner
        caption.appendChild(captionText);
        a.appendChild(caption);
        container.appendChild(a);
        container.appendChild(img);
        itemDiv.appendChild(container);
        carouselInner.appendChild(itemDiv);

        // Create carousel indicator
        const indicator = document.createElement("button");
        // Add attributes to the button
        indicator.type = "button";
        // Follow the carousel structure
        indicator.dataset.bsTarget = "#carouselExampleIndicators";
        indicator.dataset.bsSlideTo = index;
        indicator.ariaLabel = `Slide ${index + 1}`;
        // The first indicator is active and arialCurrent is true
        if (index === 0) {
            indicator.classList.add("active");
            indicator.arialCurrent = "true";
        }

        // Append indicator to the indicators
        indicators.appendChild(indicator);
    });
}

function createNewFile(team) {
    nameFile = team.name + ".html";
}

