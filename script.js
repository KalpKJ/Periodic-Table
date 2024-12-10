

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
            el.style.height = 'auto';

            // Restore font for symbols
            symbol.style.fontSize = '1.5em';
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
const themeToggleButton = document.getElementById('theme-toggle');
const body = document.body;

// Set initial icon based on the current theme
document.addEventListener('DOMContentLoaded', () => {
    themeToggleButton.textContent = body.classList.contains('light-theme') ? '☀️' : '🌙';
});

// Toggle theme and update the icon
themeToggleButton.addEventListener('click', () => {
    body.classList.toggle('light-theme');

    // Update the button icon
    themeToggleButton.textContent = body.classList.contains('light-theme') ? '☀️' : '🌙';
});


const periodicTable = document.getElementById('periodic-table');
const mptToggleButton = document.getElementById('mpt-toggle');
let isMPTView = false;

function applyMPTView() {
    const periodicTable = document.getElementById('periodic-table');
    periodicTable.classList.add('mpt-view');

    // Detailed MPT positioning mapping
    const elementPositions = {
        1:   { column: 1,  row: 1 },   // H
        2:   { column: 18, row: 1 },   // He
        3:   { column: 1,  row: 2 },   // Li
        4:   { column: 2,  row: 2 },   // Be
        5:   { column: 13, row: 2 },   // B
        6:   { column: 14, row: 2 },   // C
        7:   { column: 15, row: 2 },   // N
        8:   { column: 16, row: 2 },   // O
        9:   { column: 17, row: 2 },   // F
        10:  { column: 18, row: 2 },   // Ne
        11:  { column: 1,  row: 3 },   // Na
        12:  { column: 2,  row: 3 },   // Mg
        13:  { column: 13, row: 3 },   // Al
        14:  { column: 14, row: 3 },   // Si
        15:  { column: 15, row: 3 },   // P
        16:  { column: 16, row: 3 },   // S
        17:  { column: 17, row: 3 },   // Cl
        18:  { column: 18, row: 3 },   // Ar
        // Add more elements as needed
    };

    // Transition Metals (Periods 4-7, Groups 3-12)
    const transitionMetals = [
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30,  // Period 4
        39, 40, 41, 42, 43, 44, 45, 46, 47, 48,  // Period 5
        57, 72, 73, 74, 75, 76, 77, 78, 79, 80,  // Period 6
        89, 104, 105, 106, 107, 108, 109, 110, 111, 112  // Period 7
    ];

    // Lanthanides and Actinides
    const lanthanides = Array.from({length: 15}, (_, i) => 57 + i);
    const actinides = Array.from({length: 15}, (_, i) => 89 + i);

    elementsData.forEach((element) => {
        const elementDiv = document.querySelector(`[data-atomic-number="${element.atomicNumber}"]`);
        if (!elementDiv) return;

        let column, row;

        // Predefined positions for first 18 elements
        if (elementPositions[element.atomicNumber]) {
            column = elementPositions[element.atomicNumber].column;
            row = elementPositions[element.atomicNumber].row;
        } 
        // Transition Metals
        else if (transitionMetals.includes(element.atomicNumber)) {
            const metalIndex = transitionMetals.indexOf(element.atomicNumber);
            const period = Math.floor(metalIndex / 10) + 4;
            const groupOffset = metalIndex % 10;
            column = groupOffset + 3;
            row = period;
        }
        // Main Group Metals (Groups 1-2 and 13-18)
        else if (element.groupBlock === 'Alkali Metal') {
            column = 1;
            row = element.atomicNumber <= 3 ? 2 : 3;
        }
        else if (element.groupBlock === 'Alkaline Earth Metal') {
            column = 2;
            row = element.atomicNumber <= 4 ? 2 : 3;
        }
        else if (element.groupBlock === 'Post-transition Metal') {
            column = 13 + (element.atomicNumber - 13);
            row = element.atomicNumber <= 13 ? 3 : 4;
        }
        // Halogens
        else if (element.groupBlock === 'Halogen') {
            column = 17;
            row = Math.floor((element.atomicNumber - 9) / 2) + 2;
        }
        // Noble Gases
        else if (element.groupBlock === 'Noble Gas') {
            column = 18;
            row = Math.floor((element.atomicNumber - 2) / 2) + 1;
        }
        // Lanthanides
        else if (lanthanides.includes(element.atomicNumber)) {
            column = lanthanides.indexOf(element.atomicNumber) + 3;
            row = 9;
        }
        // Actinides
        else if (actinides.includes(element.atomicNumber)) {
            column = actinides.indexOf(element.atomicNumber) + 3;
            row = 10;
        }
        // Default fallback
        else {
            column = element.group || 1;
            row = element.period || 1;
        }

        // Apply positioning
        elementDiv.style.gridColumnStart = column;
        elementDiv.style.gridRowStart = row;
        elementDiv.style.display = 'flex';
    });

    // Set up Lanthanides and Actinides rows
    const lanthanideRow = document.querySelector('.lanthanides-row');
    const actinideRow = document.querySelector('.actinides-row');
    
    if (lanthanideRow) {
        lanthanideRow.style.gridRow = '9';
        lanthanideRow.style.gridColumnStart = '3';
        lanthanideRow.style.gridColumnEnd = '18';
    }
    
    if (actinideRow) {
        actinideRow.style.gridRow = '10';
        actinideRow.style.gridColumnStart = '3';
        actinideRow.style.gridColumnEnd = '18';
    }
}

function revertToDefaultView() {
    const periodicTable = document.getElementById('periodic-table');
    periodicTable.classList.remove('mpt-view');

    // Reset all element positions
    document.querySelectorAll('.element').forEach((el) => {
        el.style.gridColumnStart = '';
        el.style.gridRowStart = '';
        el.style.display = '';
    });

    // Reset Lanthanides and Actinides rows
    const lanthanideRow = document.querySelector('.lanthanides-row');
    const actinideRow = document.querySelector('.actinides-row');
    
    if (lanthanideRow) {
        lanthanideRow.style.gridRow = '';
        lanthanideRow.style.gridColumnStart = '';
        lanthanideRow.style.gridColumnEnd = '';
    }
    
    if (actinideRow) {
        actinideRow.style.gridRow = '';
        actinideRow.style.gridColumnStart = '';
        actinideRow.style.gridColumnEnd = '';
    }
}


// Function to revert to the default layout
function revertToDefaultView() {
    periodicTable.classList.remove('mpt-view'); // Remove MPT layout class

    // Reset inline styles for all elements
    document.querySelectorAll('.element').forEach((el) => {
        el.style.gridColumnStart = '';
        el.style.gridRowStart = '';
    });
}
// Toggle between views
mptToggleButton.addEventListener('click', () => {
    isMPTView = !isMPTView;

    if (isMPTView) {
        applyMPTView();
        mptToggleButton.textContent = 'Revert View';
    } else {
        revertToDefaultView();
        mptToggleButton.textContent = 'Toggle MPT View';
    }
});
document.getElementById('login-btn').addEventListener('click', () => {
    alert('Log In button clicked!');
    // Add modal or navigation logic here
});

document.getElementById('signup-btn').addEventListener('click', () => {
    alert('Sign Up button clicked!');
    // Add modal or navigation logic here
});