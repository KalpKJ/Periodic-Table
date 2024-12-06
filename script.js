

let elementsData = [];
let selectedElement = null;

async function loadElementsData() {
    try {
        const response = await fetch('elements-data.json'); // Fetch the JSON file
        if (!response.ok) {
            throw new Error(`Failed to load elements data: ${response.statusText}`);
        }
        elementsData = await response.json(); // Parse the JSON
        initPage(); // Initialize the page after loading data
    } catch (error) {
        console.error('Error loading elements data:', error);
    }
}


function createPeriodicTable(){
    const table = document.getElementById('periodic-table');
    table.innerHTML = ''; // Clear existing content

    elementsData.forEach(element => {
        const elementDiv = document.createElement('div');
        elementDiv.classList.add('element', element.groupBlock.toLowerCase().replaceAll(' ', '-'));
        elementDiv.setAttribute('data-atomic-number', element.atomicNumber);
        elementDiv.setAttribute('data-group-block', element.groupBlock);
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
        <h2>${element.name} (${element.symbol})</h2>
    </div>
    <div class="element-details-content">
        <div class="detail-grid">
            <div class="detail-item"><strong>Atomic Number:</strong> ${element.atomicNumber}</div>
            <div class="detail-item"><strong>Atomic Mass:</strong> ${element.atomicMass}</div>
            <div class="detail-item"><strong>Group Block:</strong> ${element.groupBlock}</div>
            <div class="detail-item"><strong>Standard State:</strong> ${element.standardState}</div>
            <div class="detail-item"><strong>Electronegativity:</strong> ${element.electronegativity || 'N/A'}</div>
            <div class="detail-item"><strong>Electron Configuration:</strong> ${element.electronicConfiguration}</div>
            <div class="detail-item"><strong>Melting Point:</strong> ${element.meltingPoint || 'N/A'} K</div>
            <div class="detail-item"><strong>Boiling Point:</strong> ${element.boilingPoint || 'N/A'} K</div>
            <div class="detail-item"><strong>Density:</strong> ${element.density || 'N/A'} g/cm³</div>
            <div class="detail-item"><strong>Year Discovered:</strong> ${element.yearDiscovered}</div>
            <div class="detail-item"><strong>Bonding Type:</strong> ${element.bondingType}</div>
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
            
            // element.style.display = matches ? 'flex' : 'none';
            element.style.opacity = matches ? '1' : '0.3';
        });
    });
}

// Category filtering
function setupCategoryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');

            const category = button.dataset.category;
            const elements = document.querySelectorAll('.element');
            
            elements.forEach(element => {
                if (category === 'all' || element.dataset.groupBlock.toLowerCase() === category.toLowerCase()) {
                    element.style.opacity = 1;
                } else {
                    element.style.opacity = 0.3;
                }
            });
        });
    });

    // Set 'All' button as active by default
    const allButton = document.querySelector('.filter-btn[data-category="all"]');
    if (allButton) {
        allButton.classList.add('active');
    }
}



function initPage() {
    createPeriodicTable();
    setupSearch();
    setupCategoryFilters();
}

// Run initialization when DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadElementsData);

const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.getElementById('sidebar');

sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open'); // Toggle the 'open' class
});

document.querySelectorAll('.sidebar-option').forEach(option => {
    option.addEventListener('click', handleSidebarOption);
});

function handleSidebarOption(event) {
    const action = event.target.dataset.action;
    switch (action) {
        case 'toggle-atomic-number':
            toggleAtomicNumbers();
            break;
        case 'toggle-element-names':
            toggleElementNames();
            break;
        case 'color-scheme-default':
        case 'color-scheme-high-contrast':
        case 'color-scheme-grayscale':
            changeColorScheme(action);
            break;
        case 'view-mode-full':
        case 'view-mode-compact':
            changeViewMode(action);
            break;
    }
}

function toggleAtomicNumbers() {
    document.querySelectorAll('.atomic-number').forEach(el => {
        el.style.display = el.style.display === 'none' ? 'block' : 'none';
    });
}

function toggleElementNames() {
    document.querySelectorAll('.element').forEach(el => {
        const symbol = el.querySelector('.symbol');
        
        // Check if currently showing the name
        if (symbol.dataset.displayMode !== 'name') {
            // Store the original symbol
            symbol.dataset.originalSymbol = symbol.textContent;

            // Find the full name
            const elementData = elementsData.find(e => e.symbol === symbol.dataset.originalSymbol);

            if (elementData) {
                // Switch to name
                symbol.textContent = elementData.name;
                symbol.dataset.displayMode = 'name';

                // Adjust box size for names
                el.style.width = '100px'; // Adjust width
                el.style.height = '120px'; // Adjust height

                // Adjust font for names
                symbol.style.fontSize = '1em'; 
            }
        } else {
            // Switch back to symbol
            symbol.textContent = symbol.dataset.originalSymbol;
            symbol.dataset.displayMode = 'symbol';

            // Restore box size for symbols
            el.style.width = '80px';
            el.style.height = '100px';

            // Restore font for symbols
            symbol.style.fontSize = '1.2em';
        }
    });
}
function changeColorScheme(scheme) {
    document.body.className = scheme;
}

function changeViewMode(mode) {
    const table = document.getElementById('periodic-table');
    table.className = mode;
}