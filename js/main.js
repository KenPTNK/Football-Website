document.addEventListener("DOMContentLoaded", async function () {
    let raw = await call();
    let data = raw; // `raw` already contains parsed JSON
    console.log(data);
    
    let leaguesCarousel = [];
    data.forEach((value) => { leaguesCarousel.push(value.league); });
    
    carousel(leaguesCarousel);
});

function carousel(array) {
    let carouselIndicators = document.querySelector('.carousel-indicators');
    let carouselInner = document.querySelector('.carousel-inner'); // Fixed typo

    array.forEach((value, index) => {
        // Create indicators
        let indicators = document.createElement('button');
        indicators.type = "button";
        indicators.setAttribute('data-bs-target', '#carouselExampleIndicators');
        indicators.setAttribute('data-bs-slide-to', index.toString());
        indicators.setAttribute('aria-label', `Slide ${index}`);
        if (index === 0) {
            indicators.classList.add('active');
        }

        // Create inner item
        let inner = document.createElement('div');
        inner.classList.add('carousel-item');
        if (index === 0) {
            inner.classList.add('active');
        }

        let img = document.createElement('img');
        img.src = value.logo;
        img.classList.add('d-block', 'w-100');

        // Create caption
        let caption = document.createElement('div');
        caption.classList.add('carousel-caption', 'd-none', 'd-md-block');
        let h5 = document.createElement('h5');
        h5.textContent = value.name;

        // Append elements
        caption.appendChild(h5);
        inner.appendChild(img);
        inner.appendChild(caption);
        carouselIndicators.appendChild(indicators);
        carouselInner.appendChild(inner);
    });
}

async function call() {
    try {
        // let response = await fetch('https://v3.football.api-sports.io/leagues', {
        //     method: 'GET',
        //     headers: {
        //         "x-rapidapi-host": "v3.football.api-sports.io",
        //         "x-rapidapi-key": "99ef879facec031cb5721b03daaca547"
        //     }
        // });
        let response = await fetch("./js/data.json"); // Fixed quotes
        console.log(response);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let data = await response.json();
        return data;
    } catch (err) {
        console.error('Fetch error:', err);
    }
}

function toggleMenu() {
    const mobileNav = document.getElementById('mobileNav');
    mobileNav.style.display = mobileNav.style.display === 'block' ? 'none' : 'block';
}
