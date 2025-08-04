/**
 * Initialize all functionality when the page loads
 */
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    setCurrentYear();
    // Initialize sidebar toggle
   // function toggleSidebar() 
    
    // Highlight current page in navigation
    highlightCurrentPage();
    
    // Initialize search functionality
    initSearch();
    
    // Initialize image loading
    initImageLoading();
    
    // Initialize mobile detection
    detectMobile();
});

/**
 * Sets the current year in footer copyright
 */
function setCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/**
 * Highlights current page in navigation
 */
function highlightCurrentPage() {
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.menu-tab').forEach(tab => {
        if (tab.getAttribute('href') === currentPage) {
            tab.classList.add('active');
        }
    });
}



/**
 * Initialize search functionality
 */
function initSearch() {
    const searchInput = document.getElementById('menu-search');
    const searchButton = document.getElementById('search-button');
    if (!searchInput || !searchButton) return;
    
    const menuItems = document.querySelectorAll('.menu-item');
    
    // Create search results container
    const searchResultsContainer = document.createElement('div');
    searchResultsContainer.className = 'search-results-container';
    document.querySelector('main').prepend(searchResultsContainer);
    
    // Create search results grid
    const searchResultsGrid = document.createElement('div');
    searchResultsGrid.className = 'search-results-grid';
    searchResultsContainer.appendChild(searchResultsGrid);
    
    // Create no results message
    const noResults = document.createElement('div');
    noResults.className = 'no-results';
    noResults.textContent = 'No items found matching your search';
    searchResultsContainer.appendChild(noResults);
    
    // Create search info element
    const searchInfo = document.createElement('p');
    searchInfo.className = 'search-results-info';
    searchInfo.style.display = 'none';
    searchResultsContainer.appendChild(searchInfo);
    
    // Hide initially
    searchResultsContainer.style.display = 'none';
    
    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        let foundItems = 0;
        
        // Clear previous results
        searchResultsGrid.innerHTML = '';
        
        if (searchTerm === '') {
            // Show all original content if search is empty
            searchResultsContainer.style.display = 'none';
            document.querySelectorAll('.category').forEach(cat => {
                cat.style.display = '';
            });
            document.querySelectorAll('.menu-item').forEach(item => {
                item.style.display = '';
            });
            searchInfo.style.display = 'none';
            noResults.style.display = 'none';
            return;
        }
        
        // Hide all original categories and items
        document.querySelectorAll('.category').forEach(cat => {
            cat.style.display = 'none';
        });
        
        // Show search results container
        searchResultsContainer.style.display = 'block';
        
        // Search through menu items
        menuItems.forEach(item => {
            const itemName = item.querySelector('.item-name').textContent.toLowerCase();
            const itemDesc = item.querySelector('.item-description').textContent.toLowerCase();
            const itemTags = Array.from(item.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
            
            if (itemName.includes(searchTerm) || 
                itemDesc.includes(searchTerm) || 
                itemTags.some(tag => tag.includes(searchTerm))) {
                
                // Clone the item to show in search results
                const itemClone = item.cloneNode(true);
                itemClone.style.display = '';
                searchResultsGrid.appendChild(itemClone);
                foundItems++;
            }
        });
        
        // Show search info
        if (foundItems > 0) {
            searchInfo.textContent = `Found ${foundItems} items matching "${searchTerm}"`;
            searchInfo.style.display = 'block';
            noResults.style.display = 'none';
        } else {
            searchInfo.style.display = 'none';
            noResults.style.display = 'block';
        }
    }
    
    // Event listeners
    searchInput.addEventListener('input', debounce(performSearch, 300));
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
}

/**
 * Initialize lazy loading for images
 */
function initImageLoading() {
    const images = document.querySelectorAll('.item-image[data-src]');
    if (images.length === 0) return;
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.onload = () => {
                        img.classList.add('loaded');
                        img.removeAttribute('data-src');
                    };
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '200px'
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
            img.onload = () => img.classList.add('loaded');
        });
    }
}

/**
 * Debounce function to limit how often a function can execute
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

/**
 * Detect mobile devices
 */
function detectMobile() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        document.body.classList.add('is-mobile');
    }
}