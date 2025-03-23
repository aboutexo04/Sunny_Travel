console.log('Script loaded');

// Function to fetch and display recommendations
async function fetchRecommendations(searchTerm) {
    try {
        const response = await fetch('travel_recommendation_api.json');
        const data = await response.json();
        console.log('Fetched data:', data);
        
        // Filter the data based on search term
        const filteredData = filterByKeyword(data, searchTerm);
        displayRecommendations(filteredData);
    } catch (error) {
        console.error('Error fetching recommendations:', error);
    }
}

// Function to filter data by keyword
function filterByKeyword(data, searchTerm) {
    if (!searchTerm) return data;
    
    searchTerm = searchTerm.toLowerCase().trim();
    
    // Only accept these three specific keywords
    const validKeywords = ['beach', 'temple', 'country'];
    
    if (!validKeywords.includes(searchTerm)) {
        return []; // Return empty array if keyword is not valid
    }

    // Filter based on keyword
    const filteredData = data.destinations.filter(country => {
        return country.cities.some(city => {
            const description = city.description.toLowerCase();
            return description.includes(searchTerm);
        });
    });

    return filteredData;
}

// Function to display recommendations
function displayRecommendations(data) {
    const grid = document.getElementById('recommendations-grid');
    grid.innerHTML = '';

    if (data.length === 0) {
        grid.innerHTML = '<p class="no-results">No matching destinations found.</p>';
        return;
    }

    data.forEach(country => {
        country.cities.forEach(city => {
            const card = createCityCard(city);
            grid.appendChild(card);
        });
    });
}

// Function to create a card for each city
function createCityCard(city) {
    const card = document.createElement('div');
    card.className = 'recommendation-card';
    
    card.innerHTML = `
        <div class="card-image">
            <img src="${city.imageUrl}" alt="${city.name}">
        </div>
        <div class="card-content">
            <h3>${city.name}</h3>
            <p>${city.description}</p>
        </div>
    `;
    
    return card;
}

// Navigation functionality
const navLinks = document.querySelectorAll('nav a');
const sections = document.querySelectorAll('section');

console.log('Nav links:', navLinks);
console.log('Sections:', sections);

// Add click event listeners to navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default anchor behavior
        
        // Remove active class from all sections
        sections.forEach(section => {
            section.style.display = 'none';
        });
        
        // Get the target section id from the href
        const targetId = link.getAttribute('href').substring(1);
        
        // Show the target section
        document.getElementById(targetId).style.display = 'block';
    });
});

// Show home section by default
window.onload = () => {
    sections.forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById('home').style.display = 'block';
};

// Update the search form submission handler
document.querySelector('.search-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const searchInput = document.querySelector('.search-input');
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    // Only allow the three specific keywords
    if (!['beach', 'temple', 'country'].includes(searchTerm)) {
        alert('Please search for: beach, temple, or country');
        return;
    }

    // Hide all other sections
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show search results section
    document.getElementById('search-results').style.display = 'block';
    
    // Fetch and display filtered recommendations
    fetchRecommendations(searchTerm);
});

// Handle clear button
document.querySelector('button[type="button"]').addEventListener('click', function() {
    document.querySelector('.search-input').value = '';
    document.getElementById('search-results').style.display = 'none';
    document.getElementById('home').style.display = 'block';
}); 