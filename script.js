const elementsData = [
    {
        name: "Hydrogen",
        symbol: "H",
        atomicNumber:1,
        category: "Nonmetal",
        state: "Gas",
        discoveryYear: "1766",
        uses: "Fuel cells, fertilizers, rocket fuel",
        weight: 1.008,
        period: 1,
        group: 1
    },
    {
        name: "Helium",
        symbol: "He",
        atomicNumber: 2,
        category: "Noble Gas",
        state: "Gas",
        discoveryYear: 1895,
        uses: "Balloons, cooling systems, MRI machines",
        weight: 4.003,
        period: 1,
        group: 18
    }
];

function createPeriodicTable(){
    const table = document.getElementById('periodic-table');
    table.innerHTML = ''; // Clear existing content
    elementsData.forEach(element =>{
        const elementDiv = document.createElement('div');
        elementDiv.classList.add('element',  element.category.toLowerCase().replace(' ', '-'));
        elementDiv.setAttribute('data-atomic-number', element.atomicNumber);
        elementDiv.setAttribute('data-category', element.category);
        elementDiv.innerHTML = `
        <span class="symbol">${element.symbol}</span>
        <span class="atomic-number">${element.atomicNumber}</span>
        
    `;

   
        // Add click event to show details
        elementDiv.addEventListener('click', () => showElementDetails(element));

        // Add subtle hover effect
        elementDiv.addEventListener('mouseenter', (e) => {
            e.currentTarget.classList.add('element-hover');
        });

        elementDiv.addEventListener('mouseleave', (e) => {
            e.currentTarget.classList.remove('element-hover');
        });

        table.appendChild(elementDiv);
    });
}

// Function to show detailed element information
function showElementDetails(element) {
    const detailsContainer = document.getElementById('element-details');
    
    // Create a more comprehensive details view
    detailsContainer.innerHTML = `
        <div class="element-details-header">
            <h2>${element.name}</h2>
            <span class="element-symbol">${element.symbol}</span>
        </div>
        <div class="element-details-content">
            <div class="detail-grid">
                <div class="detail-item">
                    <strong>Atomic Number:</strong>
                    <span>${element.atomicNumber}</span>
                </div>
                <div class="detail-item">
                    <strong>Category:</strong>
                    <span>${element.category}</span>
                </div>
                <div class="detail-item">
                    <strong>State at Room Temperature:</strong>
                    <span>${element.state}</span>
                </div>
                <div class="detail-item">
                    <strong>Atomic Weight:</strong>
                    <span>${element.weight}</span>
                </div>
                <div class="detail-item">
                    <strong>Discovery Year:</strong>
                    <span>${element.discoveryYear}</span>
                </div>
                <div class="detail-item">
                    <strong>Period:</strong>
                    <span>${element.period}</span>
                </div>
                <div class="detail-item">
                    <strong>Group:</strong>
                    <span>${element.group}</span>
                </div>
            </div>
            <div class="element-description">
                <h3>Description</h3>
                <p>${element.description}</p>
            </div>
            <div class="element-uses">
                <h3>Uses</h3>
                <p>${element.uses}</p>
            </div>
        </div>
    `;

    // Scroll to details section
    detailsContainer.scrollIntoView({ behavior: 'smooth' });

    // Highlight selected element
    document.querySelectorAll('.element').forEach(el => {
        el.classList.remove('element-selected');
    });
    
    const selectedElement = document.querySelector(`.element[data-atomic-number="${element.atomicNumber}"]`);
    if (selectedElement) {
        selectedElement.classList.add('element-selected');
    }
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const elements = document.querySelectorAll('.element');
        
        elements.forEach(element => {
            const elementData = elementsData.find(e => 
                e.atomicNumber === parseInt(element.dataset.atomicNumber)
            );
            
            const matches = 
                elementData.name.toLowerCase().includes(query) ||
                elementData.symbol.toLowerCase().includes(query);
            
            element.style.display = matches ? 'flex' : 'none';
        });
    });
}

// Category filtering
function setupCategoryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            const elements = document.querySelectorAll('.element');
            
            elements.forEach(element => {
                if (category === 'all' || element.dataset.category === category) {
                    element.style.display = 'flex';
                } else {
                    element.style.display = 'none';
                }
            });
        });
    });
}

// View mode toggle
function setupViewModeToggle() {
    const viewModeSelect = document.getElementById('view-mode');
    viewModeSelect.addEventListener('change', () => {
        const mode = viewModeSelect.value;
        const elements = document.querySelectorAll('.element');
        
        elements.forEach((element, index) => {
            const elementData = elementsData[index];
            
            switch(mode) {
                case 'default':
                    element.textContent = elementData.symbol;
                    break;
                case 'state':
                    element.textContent = elementData.state;
                    break;
                case 'discovery':
                    element.textContent = elementData.discoveryYear;
                    break;
            }
        });
    });
}


function initPage() {
    createPeriodicTable();
    setupSearch();
    setupCategoryFilters();
    setupViewModeToggle();
}

// Run initialization when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initPage);