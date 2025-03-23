// premierleague id = 39
// champion league id = 2
// bundesliga id = 78
// laliga id = 140
// serie a id = 135

document.addEventListener("DOMContentLoaded", async function () {
    let raw = await call();
    let data = raw; // `raw` already contains parsed JSON data  

    let leagues = [];
    data.forEach((value) => { leagues.push(value.league); });
    carousel(leagues);

    let leaguesNav = [];
    leagues.forEach((value) => {if(value.id === 39 || value.id === 2 || value.id === 78 || value.id === 140 || value.id === 135) { leaguesNav.push(value); }});
    leaguenavCreate(leaguesNav);
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
        h5.classList.add('leagueName');
        h5.textContent = value.name;

        // Append elements
        caption.appendChild(h5);
        inner.appendChild(img);
        inner.appendChild(caption);
        carouselIndicators.appendChild(indicators);
        carouselInner.appendChild(inner);
    });
}

function leaguenavCreate(array) {
    console.log(array);
    let ulnav = document.querySelector('.ul-nav');

    array.forEach((value, index) => {
        let linav = document.createElement('li');
        let buttonnav = document.createElement('button');

        // Set button text
        buttonnav.textContent = value.name;

        // Add default border for all buttons
        buttonnav.style.border = '2px solid #F4A97A';

        // Add click event listener
        buttonnav.addEventListener('click', function() {
            // Update all buttons to inactive border
            document.querySelectorAll('.ul-nav button').forEach(btn => {
                btn.classList.remove('active');
                btn.style.border = '2px solid #F4A97A';
            });

            // Set clicked button to active style
            buttonnav.classList.add('active');
            buttonnav.style.border = '2px solid #D35A86';

            // Move the clicked button's <li> to the top
            ulnav.prepend(linav);

            createLeagues(value.id);
        });

        // Set the first button as active by default
        if (index === 0) {
            buttonnav.classList.add('active');
            buttonnav.style.border = '2px solid #D35A86';
        }

        linav.appendChild(buttonnav);
        ulnav.appendChild(linav);
    });
}

async function createLeagues(id) {
    
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