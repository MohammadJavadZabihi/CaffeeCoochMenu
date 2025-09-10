// ===== Global Variables =====
let currentSection = 'dashboard';
let isMobile = window.innerWidth <= 768;

// ===== DOM Content Loaded =====
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
    handleResponsiveDesign();
    showToastMessage();
});

// ===== Window Resize Handler =====
window.addEventListener('resize', function () {
    isMobile = window.innerWidth <= 768;
    handleResponsiveDesign();
});

// ===== Initialize Application =====
function initializeApp() {
    // Set initial active section
    showSection('dashboard');

    // Add smooth transitions
    document.body.classList.add('loaded');

    // Initialize animations
    initializeAnimations();

    // Setup event listeners
    setupEventListeners();
}

// ===== Setup Event Listeners =====
function setupEventListeners() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleSidebar);
    }

    // Close sidebar on overlay click (mobile)
    document.addEventListener('click', function (e) {
        const sidebar = document.getElementById('sidebar');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');

        if (isMobile && sidebar.classList.contains('active')) {
            if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                toggleSidebar();
            }
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function (e) {
        // ESC to close mobile sidebar
        if (e.key === 'Escape' && isMobile) {
            const sidebar = document.getElementById('sidebar');
            if (sidebar.classList.contains('active')) {
                toggleSidebar();
            }
        }
    });
}

// ===== Handle Responsive Design =====
function handleResponsiveDesign() {
    const sidebar = document.getElementById('sidebar');

    if (!isMobile) {
        sidebar.classList.remove('active');
    }
}

// admin-dashboard.js
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');

    if (!sidebar || !mobileMenuBtn) return; // اگه وجود نداشتن از اجرا جلوگیری کن

    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');

        const spans = mobileMenuBtn.querySelectorAll('span');
        if (sidebar.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
});



// ===== Toggle Sidebar (Mobile) =====
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');

    sidebar.classList.toggle('active');

    // Animate hamburger menu
    if (mobileMenuBtn) {
        mobileMenuBtn.classList.toggle('active');
        const spans = mobileMenuBtn.querySelectorAll('span');

        if (sidebar.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }
}

// ===== Show Section =====
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Update menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });

    // Find and activate corresponding menu item
    const menuItems = document.querySelectorAll('.menu-item a');
    menuItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === `#${sectionName}`) {
            item.parentElement.classList.add('active');
        }
    });

    currentSection = sectionName;

    // Close mobile sidebar after selection
    if (isMobile) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar.classList.contains('active')) {
            toggleSidebar();
        }
    }

    // Initialize section-specific features
    if (sectionName === 'products') {
        initializeProductsSection();
    } else if (sectionName === 'orders') {
        initializeOrdersSection();
    }
}

 //===== Initialize Products Section =====
function initializeProductsSection() {
    // Add search functionality
    const searchInput = document.querySelector('#products-section .search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function (e) {
            searchProducts(e.target.value);
        }, 300));
    }

    // Add filter functionality
    const filterSelect = document.querySelector('#products-section .filter-select');
    if (filterSelect) {
        filterSelect.addEventListener('change', function (e) {
            filterProducts(e.target.value);
        });
    }
}

// ===== Initialize Orders Section =====
function initializeOrdersSection() {
    // Add real-time status updates
    const statusSelects = document.querySelectorAll('.status-select');
    statusSelects.forEach(select => {
        select.addEventListener('change', function () {
            const orderId = this.dataset.orderId || this.getAttribute('onchange').match(/\d+/)[0];
            updateOrderStatusUI(orderId, this.value);
        });
    });
}

// ===== Filter Products =====
function filterProducts(category) {
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const productCategory = card.dataset.category;

        if (category === 'all' || productCategory === category) {
            card.style.display = 'block';
            card.style.animation = 'slideIn 0.3s ease-out';
        } else {
            card.style.display = 'none';
        }
    });

    // Update results count
    const visibleCards = document.querySelectorAll('.product-card[style="display: block;"], .product-card:not([style])');
    console.log(`نمایش ${visibleCards.length} محصول`);
}

// ===== Search Products =====
function searchProducts(query) {
    const productCards = document.querySelectorAll('.product-card');
    const searchTerm = query.toLowerCase().trim();

    productCards.forEach(card => {
        const productName = card.querySelector('h4').textContent.toLowerCase();
        const productCategory = card.querySelector('.product-category').textContent.toLowerCase();

        if (searchTerm === '' || productName.includes(searchTerm) || productCategory.includes(searchTerm)) {
            card.style.display = 'block';
            card.style.animation = 'slideIn 0.3s ease-out';
        } else {
            card.style.display = 'none';
        }
    });
}

// ===== Filter Orders =====
function filterOrders(status) {
    const orderRows = document.querySelectorAll('.table-row[data-status]');

    orderRows.forEach(row => {
        const orderStatus = row.dataset.status;

        if (status === 'all' || orderStatus === status) {
            row.style.display = 'grid';
            row.style.animation = 'slideIn 0.3s ease-out';
        } else {
            row.style.display = 'none';
        }
    });
}

// ===== Update Order Status UI =====
function updateOrderStatusUI(orderId, newStatus) {
    const orderRow = document.querySelector(`[data-order-id="${orderId}"]`);
    if (orderRow) {
        const statusSpan = orderRow.querySelector('.order-status');
        if (statusSpan) {
            // Remove old status classes
            statusSpan.className = statusSpan.className.replace(/status-\w+/g, '');
            // Add new status class
            statusSpan.classList.add(`status-${newStatus}`);

            // Update status text
            const statusTexts = {
                'pending': 'در انتظار',
                'processing': 'در حال آماده‌سازی',
                'ready': 'آماده تحویل',
                'completed': 'تکمیل شده',
                'cancelled': 'لغو شده'
            };
            statusSpan.textContent = statusTexts[newStatus] || newStatus;

            // Add update animation
            statusSpan.style.animation = 'pulse 0.5s ease-out';
            setTimeout(() => {
                statusSpan.style.animation = '';
            }, 500);
        }
    }
}

// ===== Modal Functions =====
function showAddProductModal() {
    showNotification('فرم افزودن محصول باز خواهد شد', 'info');
}

function showAddUserModal() {
    showNotification('فرم افزودن کاربر باز خواهد شد', 'info');
}

function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

// ===== Product Functions =====
function editProduct(productId) {
    showNotification(`ویرایش محصول با شناسه ${productId}`, 'info');
}

function deleteProduct(productId) {
    if (confirm('آیا از حذف این محصول مطمئن هستید؟')) {
        showNotification(`محصول با شناسه ${productId} حذف شد`, 'success');
        // Add delete animation
        const productCard = document.querySelector(`[data-product-id="${productId}"]`);
        if (productCard) {
            productCard.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                productCard.remove();
            }, 300);
        }
    }
}

// ===== Order Functions =====
function viewOrder(orderId) {
    showNotification(`نمایش جزئیات سفارش ${orderId}`, 'info');
}

function updateOrderStatus(orderId, status) {
    updateOrderStatusUI(orderId, status);
    showNotification(`وضعیت سفارش ${orderId} به روزرسانی شد`, 'success');
}

// ===== User Functions =====
function editUser(userId) {
    showNotification(`ویرایش کاربر با شناسه ${userId}`, 'info');
}

function toggleUserStatus(userId) {
    const userRow = document.querySelector(`[data-user-id="${userId}"]`);
    if (userRow) {
        const statusSpan = userRow.querySelector('.user-status');
        const toggleBtn = userRow.querySelector('.btn-toggle');

        if (statusSpan.classList.contains('status-active')) {
            statusSpan.classList.remove('status-active');
            statusSpan.classList.add('status-inactive');
            statusSpan.textContent = 'غیرفعال';
            toggleBtn.textContent = 'فعال';
            showNotification(`کاربر ${userId} غیرفعال شد`, 'info');
        } else {
            statusSpan.classList.remove('status-inactive');
            statusSpan.classList.add('status-active');
            statusSpan.textContent = 'فعال';
            toggleBtn.textContent = 'غیرفعال';
            showNotification(`کاربر ${userId} فعال شد`, 'success');
        }

        // Add animation
        statusSpan.style.animation = 'pulse 0.5s ease-out';
        setTimeout(() => {
            statusSpan.style.animation = '';
        }, 500);
    }
}

// ===== Initialize Animations =====
function initializeAnimations() {
    // Animate stat cards on load
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        setTimeout(() => {
            card.style.transition = 'all 0.5s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Animate menu items
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';

        setTimeout(() => {
            item.style.transition = 'all 0.3s ease-out';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 50);
    });
}

// ===== Show Toast Message =====
function showToastMessage() {
    const toastMessage = document.getElementById('toastMessage');
    if (toastMessage) {
        // Auto hide after 5 seconds
        setTimeout(() => {
            toastMessage.style.animation = 'slideOutToast 0.5s ease-out forwards';
            setTimeout(() => {
                toastMessage.remove();
            }, 500);
        }, 5000);
    }
}

// ===== Show Notification =====
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create new notification
    const notification = document.createElement('div');
    notification.className = `toast-message ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = isMobile ? 'slideOutToastMobile 0.5s ease-out forwards' : 'slideOutToast 0.5s ease-out forwards';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// ===== Utility Functions =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== Add CSS Animations =====
const additionalStyles = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.9);
        }
    }
    
    @keyframes pulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
        100% {
            transform: scale(1);
        }
    }
    
    @keyframes slideOutToast {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    @keyframes slideOutToastMobile {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(-100px);
            opacity: 0;
        }
    }
    
    .loaded .stat-card {
        transition: all 0.3s ease-out;
    }
    
    .loaded .menu-item {
        transition: all 0.3s ease-out;
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// ===== Advanced Features =====

// Real-time updates simulation
function startRealTimeUpdates() {
    if (currentSection === 'dashboard') {
        // Simulate real-time stats updates
        setInterval(updateDashboardStats, 30000); // Update every 30 seconds
    }
}

function updateDashboardStats() {
    const statCards = document.querySelectorAll('.stat-card h3');

    statCards.forEach((stat, index) => {
        const currentValue = parseInt(stat.textContent.replace(/[^\d]/g, ''));
        const randomChange = Math.floor(Math.random() * 10) - 5; // -5 to +5
        const newValue = Math.max(0, currentValue + randomChange);

        // Animate the change
        stat.style.transform = 'scale(1.1)';
        stat.style.color = randomChange > 0 ? '#10b981' : (randomChange < 0 ? '#ef4444' : '#1e293b');

        setTimeout(() => {
            if (index === 0) stat.textContent = newValue.toLocaleString('fa-IR') + ' تومان';
            else if (index === 1) stat.textContent = newValue.toString();
            else if (index === 2) stat.textContent = newValue.toString();
            else if (index === 3) stat.textContent = (newValue / 10).toFixed(1);

            stat.style.transform = 'scale(1)';
            setTimeout(() => {
                stat.style.color = '#1e293b';
            }, 1000);
        }, 200);
    });
}

// Enhanced search with highlights
function highlightSearchResults(element, searchTerm) {
    const text = element.textContent;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    element.innerHTML = text.replace(regex, '<mark style="background: #fef3c7; padding: 2px 4px; border-radius: 4px;">$1</mark>');
}

function removeHighlights(element) {
    const marks = element.querySelectorAll('mark');
    marks.forEach(mark => {
        mark.outerHTML = mark.innerHTML;
    });
}

// Enhanced search products with highlights
function searchProductsEnhanced(query) {
    const productCards = document.querySelectorAll('.product-card');
    const searchTerm = query.toLowerCase().trim();

    productCards.forEach(card => {
        const nameElement = card.querySelector('h4');
        const categoryElement = card.querySelector('.product-category');

        // Remove previous highlights
        removeHighlights(nameElement);
        removeHighlights(categoryElement);

        const productName = nameElement.textContent.toLowerCase();
        const productCategory = categoryElement.textContent.toLowerCase();

        if (searchTerm === '') {
            card.style.display = 'block';
        } else if (productName.includes(searchTerm) || productCategory.includes(searchTerm)) {
            card.style.display = 'block';

            // Add highlights
            if (productName.includes(searchTerm)) {
                highlightSearchResults(nameElement, searchTerm);
            }
            if (productCategory.includes(searchTerm)) {
                highlightSearchResults(categoryElement, searchTerm);
            }

            card.style.animation = 'slideIn 0.3s ease-out';
        } else {
            card.style.display = 'none';
        }
    });

    // Update search results count
    const visibleCards = document.querySelectorAll('.product-card[style*="block"]');
    const searchInfo = document.querySelector('.search-results-info');

    if (searchInfo) {
        searchInfo.remove();
    }

    if (searchTerm && visibleCards.length >= 0) {
        const resultsInfo = document.createElement('div');
        resultsInfo.className = 'search-results-info';
        resultsInfo.style.cssText = 'margin: 1rem 0; padding: 0.5rem 1rem; background: #f0f9ff; border-left: 4px solid #0ea5e9; border-radius: 8px; color: #0369a1;';
        resultsInfo.textContent = `${visibleCards.length} محصول یافت شد برای "${query}"`;

        const productsGrid = document.querySelector('.products-grid');
        productsGrid.parentNode.insertBefore(resultsInfo, productsGrid);
    }
}

// Keyboard navigation
function setupKeyboardNavigation() {
    document.addEventListener('keydown', function (e) {
        // Ctrl/Cmd + numbers for quick section switching
        if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '5') {
            e.preventDefault();
            const sections = ['dashboard', 'products', 'orders', 'users', 'settings'];
            const sectionIndex = parseInt(e.key) - 1;
            if (sections[sectionIndex]) {
                showSection(sections[sectionIndex]);
            }
        }

        // Alt + S for search focus
        if (e.altKey && e.key === 's') {
            e.preventDefault();
            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
                searchInput.focus();
            }
        }
    });
}

// Export data functionality
function exportData(type) {
    let data = [];
    let filename = '';

    switch (type) {
        case 'orders':
            data = extractOrdersData();
            filename = 'orders_export.csv';
            break;
        case 'products':
            data = extractProductsData();
            filename = 'products_export.csv';
            break;
        case 'users':
            data = extractUsersData();
            filename = 'users_export.csv';
            break;
    }

    if (data.length > 0) {
        downloadCSV(data, filename);
        showNotification(`داده‌های ${type} با موفقیت صادر شد`, 'success');
    }
}

function extractOrdersData() {
    const orders = [];
    const orderRows = document.querySelectorAll('#orders-section .table-row');

    orderRows.forEach(row => {
        const cells = row.children;
        if (cells.length >= 6) {
            orders.push({
                'شماره سفارش': cells[0].textContent.trim(),
                'مشتری': cells[1].textContent.trim(),
                'تاریخ': cells[2].textContent.trim(),
                'مبلغ': cells[3].textContent.trim(),
                'وضعیت': cells[4].textContent.trim()
            });
        }
    });

    return orders;
}

function extractProductsData() {
    const products = [];
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const name = card.querySelector('h4')?.textContent || '';
        const category = card.querySelector('.product-category')?.textContent || '';
        const price = card.querySelector('.product-price')?.textContent || '';

        products.push({
            'نام محصول': name,
            'دسته‌بندی': category,
            'قیمت': price
        });
    });

    return products;
}

function extractUsersData() {
    const users = [];
    const userRows = document.querySelectorAll('#users-section .table-row');

    userRows.forEach(row => {
        const cells = row.children;
        if (cells.length >= 6) {
            users.push({
                'نام کاربر': cells[0].textContent.trim(),
                'ایمیل': cells[1].textContent.trim(),
                'تاریخ عضویت': cells[2].textContent.trim(),
                'نقش': cells[3].textContent.trim(),
                'وضعیت': cells[4].textContent.trim()
            });
        }
    });

    return users;
}

function downloadCSV(data, filename) {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Print functionality
function printSection(sectionName) {
    const section = document.getElementById(`${sectionName}-section`);
    if (!section) return;

    const printWindow = window.open('', '_blank');
    const sectionHTML = section.innerHTML;

    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="fa" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>پرینت ${sectionName}</title>
            <style>
                body { font-family: Tahoma, Arial; direction: rtl; }
                .btn-primary, .btn-edit, .btn-delete, .btn-view, .btn-toggle { display: none; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
                .no-print { display: none; }
                @media print {
                    body { font-size: 12px; }
                    .page-break { page-break-before: always; }
                }
            </style>
        </head>
        <body>
            <h1>کافه رؤیا - ${sectionName}</h1>
            <p>تاریخ چاپ: ${new Date().toLocaleDateString('fa-IR')}</p>
            ${sectionHTML}
        </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 250);
}

// Initialize advanced features on load
document.addEventListener('DOMContentLoaded', function () {
    setupKeyboardNavigation();
    startRealTimeUpdates();
});


// Enhanced mobile experience
if (isMobile) {
    // Add swipe gestures for section navigation
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
    });

    function handleSwipeGesture() {
        const swipeThreshold = 100;
        const sections = ['dashboard', 'products', 'orders', 'users', 'settings'];
        const currentIndex = sections.indexOf(currentSection);

        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - next section
            const nextIndex = (currentIndex + 1) % sections.length;
            showSection(sections[nextIndex]);
        }

        if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right - previous section
            const prevIndex = (currentIndex - 1 + sections.length) % sections.length;
            showSection(sections[prevIndex]);
        }
    }
}

// Add loading states for form submissions
function addLoadingState(button) {
    const originalText = button.textContent;
    button.textContent = 'در حال پردازش...';
    button.disabled = true;
    button.style.opacity = '0.7';

    return function removeLoadingState() {
        button.textContent = originalText;
        button.disabled = false;
        button.style.opacity = '1';
    };
}

// Form validation helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^09\d{9}$/;
    return re.test(phone);
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
        let errorElement = field.parentNode.querySelector('.field-error');

        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.style.cssText = 'color: #ef4444; font-size: 0.8rem; margin-top: 5px;';
            field.parentNode.appendChild(errorElement);
        }

        errorElement.textContent = message;
        field.style.borderColor = '#ef4444';

        // Auto remove after 5 seconds
        setTimeout(() => {
            errorElement.remove();
            field.style.borderColor = '';
        }, 5000);
    }
}

// Performance monitoring
function measurePerformance(functionName, func) {
    return function (...args) {
        const start = performance.now();
        const result = func.apply(this, args);
        const end = performance.now();
        console.log(`${functionName} took ${end - start} milliseconds`);
        return result;
    };
}

// Console welcome message
console.log(`
🎉 خوش آمدید به پنل مدیریت کافه رؤیا!

📌 میانبرهای کیبورد:
   • Ctrl/Cmd + 1-5: تغییر سریع بخش‌ها
   • Alt + S: فوکوس بر جستجو
   • ESC: بستن منو موبایل

💡 نکات:
   • از swipe برای تغییر بخش‌ها در موبایل استفاده کنید
   • داده‌ها هر 30 ثانیه به‌روزرسانی می‌شوند
   • از دکمه‌های صادرات و پرینت استفاده کنید

🚀 نسخه: 1.0.0
`);

// Initialize app
console.log('✅ پنل مدیریت کافه رؤیا با موفقیت بارگذاری شد');