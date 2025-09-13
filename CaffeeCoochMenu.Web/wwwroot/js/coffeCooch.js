// Global Variables
let menuItems = [];
let categories = [];
let currentCategory = 'all';

// Theme Management
function toggleTheme() {
    const html = document.documentElement;
    const themeIcon = document.getElementById('theme-icon');

    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        themeIcon.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    } else {
        html.classList.add('dark');
        themeIcon.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    }
}

// Initialize theme from localStorage
//function initTheme() {
//    const savedTheme = localStorage.getItem('theme');
//    const themeIcon = document.getElementById('theme-icon');

//    if (savedTheme === 'light') {
//        document.documentElement.classList.remove('dark');
//        themeIcon.textContent = '🌙';
//    } else {
//        document.documentElement.classList.add('dark');
//        themeIcon.textContent = '☀️';
//    }
//}

// Show Loading
function showLoading() {
    document.getElementById('loading').style.display = 'flex';
    document.getElementById('category-tabs').style.display = 'none';
    document.getElementById('menu-grid').style.display = 'none';
    document.getElementById('empty-state').style.display = 'none';
    document.getElementById('error-message').style.display = 'none';
}

function switchCategoryWithoutRefresh(categoryName, element) {
    // Prevent default link behavior
    event.preventDefault();

    // Update active tab
    document.querySelectorAll('.tab-button').forEach(tab => {
        tab.classList.remove('active');
    });
    element.classList.add('active');

    // Update URL without refresh
    const newUrl = categoryName ? `/${categoryName}` : '/';
    history.pushState({ category: categoryName }, '', newUrl);

    // Filter products (if you want to handle filtering via JavaScript)
    filterProductsByCategory(categoryName);
}

// Function to filter products by category (client-side filtering)
function filterProductsByCategory(categoryName) {
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach(item => {
        // You'll need to add data attributes to products in the view
        const productCategory = item.dataset.category;

        if (!categoryName || categoryName === '' || productCategory === categoryName) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });

    // Check if any items are visible
    const visibleItems = document.querySelectorAll('.menu-item[style="display: block"], .menu-item:not([style*="display: none"])');
    const emptyState = document.querySelector('.empty-state');
    const menuGrid = document.querySelector('.menu-grid');

    if (visibleItems.length === 0) {
        menuGrid.style.display = 'none';
        emptyState.style.display = 'block';
    } else {
        menuGrid.style.display = 'grid';
        emptyState.style.display = 'none';
    }
}

// Show Error
function showError(message = 'خطا در بارگذاری داده‌ها. لطفاً صفحه را رفرش کنید.') {
    hideLoading();
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// ===============================================
// BACKEND INTEGRATION FUNCTIONS
// ===============================================

// Fetch Data from ASP.NET Core Backend
async function fetchData() {
    try {
        showLoading();

        // Replace these URLs with your actual ASP.NET Core endpoints
        const [categoriesResponse, menuResponse] = await Promise.all([
            fetch('/api/categories'), // Your categories endpoint
            fetch('/api/menuitems')   // Your menu items endpoint
        ]);

        if (!categoriesResponse.ok || !menuResponse.ok) {
            throw new Error('Failed to fetch data from server');
        }

        categories = await categoriesResponse.json();
        menuItems = await menuResponse.json();

        // Initialize the UI with fetched data
        initializeUI();

    } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to demo data for development
        loadDemoData();
    }
}

// Load Demo Data (for development/testing)
function loadDemoData() {
    // Demo categories - replace with your actual category structure
    categories = [
        { id: 'all', name: 'همه', imageUrl: '/images/categories/all.png', displayOrder: 0 },
        { id: 'hot-drinks', name: 'نوشیدنی‌های گرم', imageUrl: '/images/categories/hot-drinks.png', displayOrder: 1 },
        { id: 'cold-drinks', name: 'نوشیدنی‌های سرد', imageUrl: '/images/categories/cold-drinks.png', displayOrder: 2 },
        { id: 'food', name: 'غذا', imageUrl: '/images/categories/food.png', displayOrder: 3 },
        { id: 'desserts', name: 'دسر', imageUrl: '/images/categories/desserts.png', displayOrder: 4 }
    ];

    // Demo menu items - replace with your actual menu structure
    menuItems = [
        {
            id: 1,
            name: "قهوه ترک",
            description: "قهوه سنتی ترک با طعم غنی و عطر فوق‌العاده، همراه با شکلات کوچک",
            price: 25000,
            formattedPrice: "۲۵,۰۰۰ تومان",
            imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop&crop=center",
            categoryId: "hot-drinks",
            isPopular: true,
            isAvailable: true,
            displayOrder: 1
        },
        {
            id: 2,
            name: "چای سنتی",
            description: "چای ایرانی درجه یک با عطر بهاران، همراه با قند و نبات",
            price: 15000,
            formattedPrice: "۱۵,۰۰۰ تومان",
            imageUrl: "https://images.unsplash.com/photo-1558618133-fbd79c2cd2f5?w=400&h=300&fit=crop&crop=center",
            categoryId: "hot-drinks",
            isPopular: true,
            isAvailable: true,
            displayOrder: 2
        },
        {
            id: 3,
            name: "دوغ سنتی",
            description: "دوغ خانگی با نعنا و خیار، نوشیدنی خنک و طبیعی",
            price: 12000,
            formattedPrice: "۱۲,۰۰۰ تومان",
            imageUrl: "https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400&h=300&fit=crop&crop=center",
            categoryId: "cold-drinks",
            isPopular: true,
            isAvailable: true,
            displayOrder: 1
        },
        {
            id: 4,
            name: "کشک بادمجان",
            description: "غذای سنتی ایرانی با بادمجان کبابی، کشک و سیر داغ",
            price: 45000,
            formattedPrice: "۴۵,۰۰۰ تومان",
            imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center",
            categoryId: "food",
            isPopular: true,
            isAvailable: true,
            displayOrder: 1
        },
        {
            id: 5,
            name: "فالوده شیرازی",
            description: "دسر سنتی ایرانی با نشاسته، شیر یخ، شربت گلاب و بستنی",
            price: 22000,
            formattedPrice: "۲۲,۰۰۰ تومان",
            imageUrl: "https://images.unsplash.com/photo-1563379091339-03246963d96a?w=400&h=300&fit=crop&crop=center",
            categoryId: "desserts",
            isPopular: true,
            isAvailable: true,
            displayOrder: 1
        }
    ];

    initializeUI();
}

// ===============================================
// UI FUNCTIONS
// ===============================================

// Initialize UI with fetched data
function initializeUI() {
    //renderCategories();
    //renderMenuItems();
}

// Render Categories Tabs
function renderCategories() {
    const tabsContainer = document.getElementById('tabs-container');
    const categoryTabs = document.getElementById('category-tabs');

    // Sort categories by displayOrder
    const sortedCategories = categories.sort((a, b) => a.displayOrder - b.displayOrder);

    tabsContainer.innerHTML = sortedCategories.map(category =>
        `<button class="tab-button ${category.id === 'all' ? 'active' : ''}" onclick="filterCategory('${category.id}')">
            <img src="${category.imageUrl || '/images/categories/default.png'}" alt="${category.name}" class="category-icon" onerror="this.src='/images/categories/default.png'">
            <span>${category.name}</span>
        </button>`
    ).join('');

    categoryTabs.style.display = 'block';
}

// Create Menu Item HTML
function createMenuItemHTML(item) {
    // Handle unavailable items
    const unavailableClass = !item.isAvailable ? 'opacity-50' : '';
    const unavailableText = !item.isAvailable ? '<div class="text-red-500">موقتاً در دسترس نیست</div>' : '';

    return `
    <div class="menu-item ${unavailableClass}">
        <div class="menu-item-image-container">
            <img src="${item.imageUrl || '/images/products/placeholder.jpg'}" alt="${item.name}" loading="lazy" onerror="this.src='/images/products/placeholder.jpg'">
            ${item.isPopular ? '<div class="popular-badge">محبوب</div>' : ''}
        </div>
        <div class="menu-item-content">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            ${unavailableText}
            <div class="menu-item-price">${item.formattedPrice || formatPrice(item.price)}</div>
        </div>
    </div>
    `;
}

// Format Price (if not provided by backend)
function formatPrice(price) {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
}

// Filter Menu Items by Category
function filterCategory(categoryId) {
    currentCategory = categoryId;

    // Update active tab
    const tabs = document.querySelectorAll('.tab-button');
    tabs.forEach(tab => tab.classList.remove('active'));
    event.target.closest('.tab-button').classList.add('active');

    renderMenuItems();
}

// Render Menu Items
function renderMenuItems() {
    // Filter items based on selected category
    let filteredItems = currentCategory === 'all'
        ? menuItems.filter(item => item.isAvailable !== false) // Show available items
        : menuItems.filter(item => item.categoryId === currentCategory);

    // Sort by displayOrder and then by name
    filteredItems.sort((a, b) => {
        if (a.displayOrder !== b.displayOrder) {
            return (a.displayOrder || 999) - (b.displayOrder || 999);
        }
        return a.name.localeCompare(b.name, 'fa');
    });

    const menuGrid = document.getElementById('menu-grid');
    const emptyState = document.getElementById('empty-state');

    if (filteredItems.length === 0) {
        menuGrid.style.display = 'none';
        emptyState.style.display = 'block';
    } else {
        menuGrid.style.display = 'grid';
        emptyState.style.display = 'none';
        menuGrid.innerHTML = filteredItems.map(createMenuItemHTML).join('');
    }
}

// ===============================================
// INITIALIZATION
// ===============================================

// Initialize the page
function init() {
    //initTheme();
    fetchData(); // This will load data from backend or fallback to demo data
}

// Run initialization when page loads
document.addEventListener('DOMContentLoaded', init);

// ===============================================
// UTILITY FUNCTIONS FOR ASP.NET CORE INTEGRATION
// ===============================================

// Refresh data (call this from ASP.NET Core if needed)
window.refreshMenuData = function () {
    fetchData();
};

// Update single menu item (call this from ASP.NET Core for real-time updates)
window.updateMenuItem = function (updatedItem) {
    const index = menuItems.findIndex(item => item.id === updatedItem.id);
    if (index !== -1) {
        menuItems[index] = updatedItem;
        if (currentCategory === 'all' || currentCategory === updatedItem.categoryId) {
            renderMenuItems();
        }
    }
};

// Add new menu item (call this from ASP.NET Core)
window.addMenuItem = function (newItem) {
    menuItems.push(newItem);
    if (currentCategory === 'all' || currentCategory === newItem.categoryId) {
        renderMenuItems();
    }
};

// Remove menu item (call this from ASP.NET Core)
window.removeMenuItem = function (itemId) {
    menuItems = menuItems.filter(item => item.id !== itemId);
    renderMenuItems();
};