// Global Variables
let menuItems = [];
let categories = [];
let currentUser = null;
let editingItem = null;
let editingCategory = null;

// ===============================================
// AUTHENTICATION
// ===============================================

// Login Function
async function login(username, password) {
    localStorage.setItem('adminToken', 'demo-token');
    showPage('admin-page');
    await loadDemoData();
}

// Logout Function
function logout() {
    if (confirm('آیا از خروج اطمینان دارید؟')) {
        currentUser = null;
        localStorage.removeItem('adminToken');
        showPage('login-page');
        clearForms();
    }
}

// Check Authentication
function checkAuth() {
    const token = localStorage.getItem('adminToken');
    if (token) {
        // In production, verify token with backend
        currentUser = { username: 'admin', name: 'مدیر سیستم' };
        showPage('admin-page');
        loadDemoData();
    } else {
        showPage('login-page');
    }
}

// ===============================================
// DATA MANAGEMENT
// ===============================================

// Load Data from Backend
async function loadData() {
    try {
        const [categoriesResponse, menuResponse] = await Promise.all([
            fetch('/api/admin/categories', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                    'Content-Type': 'application/json'
                }
            }),
            fetch('/api/admin/menuitems', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                    'Content-Type': 'application/json'
                }
            })
        ]);

        if (!categoriesResponse.ok || !menuResponse.ok) {
            throw new Error('Failed to fetch data');
        }

        categories = await categoriesResponse.json();
        menuItems = await menuResponse.json();

        updateUI();

    } catch (error) {
        console.error('Error loading data:', error);
        loadDemoData(); // Fallback to demo data
    }
}

// Load Demo Data for Development
function loadDemoData() {
    categories = [
        { id: 'hot-drinks', name: 'نوشیدنی‌های گرم', displayOrder: 1 },
        { id: 'cold-drinks', name: 'نوشیدنی‌های سرد', displayOrder: 2 },
        { id: 'food', name: 'غذا', displayOrder: 3 },
        { id: 'desserts', name: 'دسر', displayOrder: 4 }
    ];

    menuItems = [
        {
            id: 1,
            name: "قهوه ترک",
            description: "قهوه سنتی ترک با طعم غنی و عطر فوق‌العاده",
            price: 25000,
            formattedPrice: "۲۵,۰۰۰ تومان",
            imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop",
            categoryId: "hot-drinks",
            isPopular: true,
            isAvailable: true,
            displayOrder: 1
        },
        {
            id: 2,
            name: "چای سنتی",
            description: "چای ایرانی درجه یک با عطر بهاران",
            price: 15000,
            formattedPrice: "۱۵,۰۰۰ تومان",
            imageUrl: "https://images.unsplash.com/photo-1558618133-fbd79c2cd2f5?w=400&h=300&fit=crop",
            categoryId: "hot-drinks",
            isPopular: true,
            isAvailable: true,
            displayOrder: 2
        },
        {
            id: 3,
            name: "دوغ سنتی",
            description: "دوغ خانگی با نعنا و خیار",
            price: 12000,
            formattedPrice: "۱۲,۰۰۰ تومان",
            imageUrl: "https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400&h=300&fit=crop",
            categoryId: "cold-drinks",
            isPopular: false,
            isAvailable: true,
            displayOrder: 1
        }
    ];

    updateUI();
}

// ===============================================
// CRUD OPERATIONS - MENU ITEMS
// ===============================================

// Save Menu Item
async function saveMenuItem(itemData) {
    try {
        showLoading('product-save-loading');

        const isEditing = editingItem !== null;
        const url = isEditing
            ? `/api/admin/menuitems/${editingItem.id}`
            : '/api/admin/menuitems';

        const method = isEditing ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(itemData)
        });

        if (!response.ok) {
            throw new Error('Failed to save item');
        }

        const savedItem = await response.json();

        if (isEditing) {
            const index = menuItems.findIndex(item => item.id === editingItem.id);
            menuItems[index] = savedItem;
            showAlert('product-alert', 'محصول با موفقیت به‌روزرسانی شد.', 'success');
        } else {
            menuItems.push(savedItem);
            showAlert('product-alert', 'محصول با موفقیت اضافه شد.', 'success');
        }

        updateUI();
        setTimeout(() => closeModal('product-modal'), 1500);

    } catch (error) {
        console.error('Error saving item:', error);

        // Demo save for development
        const newItem = {
            id: isEditing ? editingItem.id : Date.now(),
            name: itemData.name,
            description: itemData.description,
            price: itemData.price,
            formattedPrice: formatPrice(itemData.price),
            imageUrl: itemData.imageUrl || 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop',
            categoryId: itemData.categoryId,
            isPopular: itemData.isPopular,
            isAvailable: itemData.isAvailable,
            displayOrder: itemData.displayOrder || 0
        };

        if (isEditing) {
            const index = menuItems.findIndex(item => item.id === editingItem.id);
            menuItems[index] = newItem;
            showAlert('product-alert', 'محصول با موفقیت به‌روزرسانی شد.', 'success');
        } else {
            menuItems.push(newItem);
            showAlert('product-alert', 'محصول با موفقیت اضافه شد.', 'success');
        }

        updateUI();
        setTimeout(() => closeModal('product-modal'), 1500);

    } finally {
        hideLoading('product-save-loading');
    }
}

// Delete Menu Item
async function deleteMenuItem(itemId) {
    if (!confirm('آیا از حذف این محصول اطمینان دارید؟')) {
        return;
    }

    try {
        const response = await fetch(`/api/admin/menuitems/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete item');
        }

        menuItems = menuItems.filter(item => item.id !== itemId);
        updateUI();

    } catch (error) {
        console.error('Error deleting item:', error);

        // Demo delete for development
        menuItems = menuItems.filter(item => item.id !== itemId);
        updateUI();
    }
}

// ===============================================
// CRUD OPERATIONS - CATEGORIES
// ===============================================

// Save Category
async function saveCategory(categoryData) {
    try {
        showLoading('category-save-loading');

        const isEditing = editingCategory !== null;
        const url = isEditing
            ? `/api/admin/categories/${editingCategory.id}`
            : '/api/admin/categories';

        const method = isEditing ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(categoryData)
        });

        if (!response.ok) {
            throw new Error('Failed to save category');
        }

        const savedCategory = await response.json();

        if (isEditing) {
            const index = categories.findIndex(cat => cat.id === editingCategory.id);
            categories[index] = savedCategory;
            showAlert('category-alert', 'دسته‌بندی با موفقیت به‌روزرسانی شد.', 'success');
        } else {
            categories.push(savedCategory);
            showAlert('category-alert', 'دسته‌بندی با موفقیت اضافه شد.', 'success');
        }

        updateUI();
        setTimeout(() => closeModal('category-modal'), 1500);

    } catch (error) {
        console.error('Error saving category:', error);

        // Demo save for development
        const newCategory = {
            id: isEditing ? editingCategory.id : generateCategoryId(categoryData.name),
            name: categoryData.name,
            displayOrder: categoryData.displayOrder || 0
        };

        if (isEditing) {
            const index = categories.findIndex(cat => cat.id === editingCategory.id);
            categories[index] = newCategory;
            showAlert('category-alert', 'دسته‌بندی با موفقیت به‌روزرسانی شد.', 'success');
        } else {
            categories.push(newCategory);
            showAlert('category-alert', 'دسته‌بندی با موفقیت اضافه شد.', 'success');
        }

        updateUI();
        setTimeout(() => closeModal('category-modal'), 1500);

    } finally {
        hideLoading('category-save-loading');
    }
}

// Delete Category
async function deleteCategory(categoryId) {
    const itemsInCategory = menuItems.filter(item => item.categoryId === categoryId);

    if (itemsInCategory.length > 0) {
        alert(`نمی‌توان این دسته‌بندی را حذف کرد زیرا ${itemsInCategory.length} محصول در آن وجود دارد.`);
        return;
    }

    if (!confirm('آیا از حذف این دسته‌بندی اطمینان دارید؟')) {
        return;
    }

    try {
        const response = await fetch(`/api/admin/categories/${categoryId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete category');
        }

        categories = categories.filter(cat => cat.id !== categoryId);
        updateUI();

    } catch (error) {
        console.error('Error deleting category:', error);

        // Demo delete for development
        categories = categories.filter(cat => cat.id !== categoryId);
        updateUI();
    }
}

// ===============================================
// UI FUNCTIONS
// ===============================================

// Update Dashboard Statistics
function updateDashboard() {
    document.getElementById('total-items').textContent = menuItems.length;
    document.getElementById('total-categories').textContent = categories.length;
    document.getElementById('popular-items').textContent = menuItems.filter(item => item.isPopular).length;
    document.getElementById('available-items').textContent = menuItems.filter(item => item.isAvailable).length;
}

// Render Menu Items Table
function renderMenuItems() {
    const tbody = document.getElementById('menu-items-tbody');

    tbody.innerHTML = menuItems
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
        .map(item => {
            const category = categories.find(cat => cat.id === item.categoryId);
            const categoryName = category ? category.name : 'نامشخص';

            return `
                        <tr>
                            <td>
                                <img src="${item.imageUrl || '/images/placeholder.jpg'}" alt="${item.name}" 
                                     onerror="this.src='/images/placeholder.jpg'">
                            </td>
                            <td>${item.name}</td>
                            <td>${categoryName}</td>
                            <td>${item.formattedPrice || formatPrice(item.price)}</td>
                            <td>
                                <span class="badge ${item.isAvailable ? 'badge-success' : 'badge-destructive'}">
                                    ${item.isAvailable ? 'موجود' : 'ناموجود'}
                                </span>
                            </td>
                            <td>
                                <span class="badge ${item.isPopular ? 'badge-success' : 'badge-secondary'}">
                                    ${item.isPopular ? 'محبوب' : 'عادی'}
                                </span>
                            </td>
                            <td>
                                <button class="btn btn-secondary" style="margin-left: 0.5rem; padding: 0.25rem 0.5rem; font-size: 0.75rem;" 
                                        onclick="editMenuItem(${item.id})">ویرایش</button>
                                <button class="btn btn-destructive" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" 
                                        onclick="deleteMenuItem(${item.id})">حذف</button>
                            </td>
                        </tr>
                    `;
        }).join('');
}

// Render Categories Table
function renderCategories() {
    const tbody = document.getElementById('categories-tbody');

    tbody.innerHTML = categories
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
        .map(category => {
            const itemCount = menuItems.filter(item => item.categoryId === category.id).length;

            return `
                        <tr>
                            <td>${category.name}</td>
                            <td>${category.displayOrder || 0}</td>
                            <td>${itemCount} محصول</td>
                            <td>
                                <button class="btn btn-secondary" style="margin-left: 0.5rem; padding: 0.25rem 0.5rem; font-size: 0.75rem;" 
                                        onclick="editCategory('${category.id}')">ویرایش</button>
                                <button class="btn btn-destructive" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" 
                                        onclick="deleteCategory('${category.id}')">حذف</button>
                            </td>
                        </tr>
                    `;
        }).join('');
}

// Update Category Select Options
function updateCategorySelect() {
    const select = document.getElementById('product-category');
    select.innerHTML = '<option value="">انتخاب کنید</option>' +
        categories
            .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
            .map(category => `<option value="${category.id}">${category.name}</option>`)
            .join('');
}

// Update All UI Components
function updateUI() {
    updateDashboard();
    renderMenuItems();
    renderCategories();
    updateCategorySelect();
}

// ===============================================
// MODAL FUNCTIONS
// ===============================================

// Open Modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');

    if (modalId === 'product-modal') {
        updateCategorySelect();
        if (editingItem === null) {
            document.getElementById('product-modal-title').textContent = 'افزودن محصول جدید';
            clearProductForm();
        } else {
            document.getElementById('product-modal-title').textContent = 'ویرایش محصول';
            fillProductForm(editingItem);
        }
    }

    if (modalId === 'category-modal') {
        if (editingCategory === null) {
            document.getElementById('category-modal-title').textContent = 'افزودن دسته‌بندی جدید';
            clearCategoryForm();
        } else {
            document.getElementById('category-modal-title').textContent = 'ویرایش دسته‌بندی';
            fillCategoryForm(editingCategory);
        }
    }
}

// Close Modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');

    if (modalId === 'product-modal') {
        editingItem = null;
        clearProductForm();
        hideAlert('product-alert');
    }

    if (modalId === 'category-modal') {
        editingCategory = null;
        clearCategoryForm();
        hideAlert('category-alert');
    }
}

// ===============================================
// FORM FUNCTIONS
// ===============================================

// Edit Menu Item
function editMenuItem(itemId) {
    editingItem = menuItems.find(item => item.id === itemId);
    openModal('product-modal');
}

// Edit Category
function editCategory(categoryId) {
    editingCategory = categories.find(cat => cat.id === categoryId);
    openModal('category-modal');
}

// Clear Product Form
function clearProductForm() {
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
    document.getElementById('product-available').checked = true;
    hideAlert('product-alert');
}

// Fill Product Form
function fillProductForm(item) {
    document.getElementById('product-id').value = item.id;
    document.getElementById('product-name').value = item.name;
    document.getElementById('product-description').value = item.description;
    document.getElementById('product-price').value = item.price;
    document.getElementById('product-category').value = item.categoryId;
    document.getElementById('product-image').value = item.imageUrl || '';
    document.getElementById('product-order').value = item.displayOrder || 0;
    document.getElementById('product-popular').checked = item.isPopular;
    document.getElementById('product-available').checked = item.isAvailable;
}

// Clear Category Form
function clearCategoryForm() {
    document.getElementById('category-form').reset();
    document.getElementById('category-id').value = '';
    hideAlert('category-alert');
}

// Fill Category Form
function fillCategoryForm(category) {
    document.getElementById('category-id').value = category.id;
    document.getElementById('category-name').value = category.name;
    document.getElementById('category-order').value = category.displayOrder || 0;
}

// ===============================================
// UTILITY FUNCTIONS
// ===============================================

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

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.getElementById('theme-icon');

    if (savedTheme === 'light') {
        document.documentElement.classList.remove('dark');
        themeIcon.textContent = '🌙';
    } else {
        document.documentElement.classList.add('dark');
        themeIcon.textContent = '☀️';
    }
}

// Show/Hide Pages
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// Show Admin Section
function showSection(sectionName) {
    // Update navigation
    document.querySelectorAll('.nav-button').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Show section
    document.querySelectorAll('.admin-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionName + '-section').style.display = 'block';
}

// Format Price
function formatPrice(price) {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
}

// Generate Category ID
function generateCategoryId(name) {
    return name.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '') + '-' + Date.now();
}

// Show Alert
function showAlert(alertId, message, type) {
    const alert = document.getElementById(alertId);
    alert.textContent = message;
    alert.className = `alert alert-${type} show`;
}

// Hide Alert
function hideAlert(alertId) {
    const alert = document.getElementById(alertId);
    alert.classList.remove('show');
}

// Show/Hide Loading
function showLoading(loadingId) {
    document.getElementById(loadingId).style.display = 'inline-block';
}

function hideLoading(loadingId) {
    document.getElementById(loadingId).style.display = 'none';
}

// Clear All Forms
function clearForms() {
    clearProductForm();
    clearCategoryForm();
}

// ===============================================
// EVENT LISTENERS
// ===============================================

// Login Form Submit
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    localStorage.setItem('adminToken', 'demo-token');
    showPage('admin-page');
    await loadDemoData();
});

// Product Form Submit
document.getElementById('product-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById('product-name').value,
        description: document.getElementById('product-description').value,
        price: parseInt(document.getElementById('product-price').value),
        categoryId: document.getElementById('product-category').value,
        imageUrl: document.getElementById('product-image').value,
        displayOrder: parseInt(document.getElementById('product-order').value) || 0,
        isPopular: document.getElementById('product-popular').checked,
        isAvailable: document.getElementById('product-available').checked
    };

    saveMenuItem(formData);
});

// Category Form Submit
document.getElementById('category-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById('category-name').value,
        displayOrder: parseInt(document.getElementById('category-order').value) || 0
    };

    saveCategory(formData);
});

// Close modals when clicking outside
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function (e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });
});

// ===============================================
// INITIALIZATION
// ===============================================

document.addEventListener('DOMContentLoaded', async function () {
    initTheme();
    currentUser = { username: 'admin', name: 'مدیر سیستم' };
    showPage('admin-page');
    await loadDemoData();
});
