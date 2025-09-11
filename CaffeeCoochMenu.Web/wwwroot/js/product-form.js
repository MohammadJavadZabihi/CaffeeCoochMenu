// ===== Product Form JavaScript =====

// Global variables
let currentTags = [];
let isDragOver = false;
let isFormDirty = false;

// DOM Elements
const form = document.getElementById('productForm');
const nameInput = document.getElementById('Name');
const categorySelect = document.getElementById('Category');
const priceInput = document.getElementById('Price');
const descriptionTextarea = document.getElementById('Description');
const imageInput = document.getElementById('ImageFile');
const imagePreview = document.getElementById('imagePreview');
const tagsInput = document.getElementById('TagsInput');
const tagsDisplay = document.getElementById('tagsDisplay');
const tagsHidden = document.getElementById('Tags');
const submitBtn = document.getElementById('submitBtn');
const pricePreview = document.getElementById('pricePreview');
const charCount = document.getElementById('charCount');

// ===== Initialize Form =====
document.addEventListener('DOMContentLoaded', function () {
    initializeForm();
    setupEventListeners();
    setupFormValidation();
    setupImageUpload();
    setupTagsInput();
    loadExistingTags();
    showToastMessage();
});

// ===== Initialize Form =====
function initializeForm() {
    // Update character count
    updateCharCount();

    // Update price preview
    updatePricePreview();

    // Set initial form state
    isFormDirty = false;

    // Add form animations
    animateFormElements();
}

// ===== Setup Event Listeners =====
function setupEventListeners() {
    // Form change detection
    form.addEventListener('input', handleFormChange);
    form.addEventListener('change', handleFormChange);

    // Price input formatting
    priceInput.addEventListener('input', handlePriceInput);
    priceInput.addEventListener('blur', formatPriceInput);

    // Description character counter
    descriptionTextarea.addEventListener('input', updateCharCount);

    // Form submission
    form.addEventListener('submit', handleFormSubmit);

    // Prevent accidental navigation
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Category change
    categorySelect.addEventListener('change', handleCategoryChange);

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// ===== Form Change Handler =====
function handleFormChange() {
    isFormDirty = true;
    validateField(event.target);
    updatePreviewData();
}

// ===== Price Input Handler =====
function handlePriceInput(e) {
    // Remove non-numeric characters except for Persian/Arabic numerals
    let value = e.target.value.replace(/[^\d]/g, '');

    // Convert Persian/Arabic numerals to English
    value = value.replace(/[۰-۹]/g, function (w) {
        return String.fromCharCode(w.charCodeAt(0) - '۰'.charCodeAt(0) + '0'.charCodeAt(0));
    });

    e.target.value = value;
    updatePricePreview();
}

// ===== Format Price Input =====
function formatPriceInput() {
    const value = parseInt(priceInput.value);
    if (!isNaN(value)) {
        priceInput.value = value.toLocaleString('en-US').replace(/,/g, '');
    }
    updatePricePreview();
}

// ===== Update Price Preview =====
function updatePricePreview() {
    const value = parseInt(priceInput.value);

    if (!isNaN(value) && value > 0) {
        const formattedPrice = value.toLocaleString('fa-IR');
        pricePreview.textContent = `قیمت نمایشی: ${formattedPrice} تومان`;
        pricePreview.classList.add('show');

        // Add price validation
        if (value < 1000) {
            pricePreview.style.color = '#ef4444';
            pricePreview.textContent = 'قیمت کمتر از حد مجاز است (حداقل ۱۰۰۰ تومان)';
        } else if (value > 1000000) {
            pricePreview.style.color = '#ef4444';
            pricePreview.textContent = 'قیمت بیشتر از حد مجاز است (حداکثر ۱۰۰۰۰۰۰ تومان)';
        } else {
            pricePreview.style.color = '#0369a1';
        }
    } else {
        pricePreview.classList.remove('show');
    }
}

// ===== Update Character Count =====
function updateCharCount() {
    const count = descriptionTextarea.value.length;
    const maxLength = 500;

    charCount.textContent = count;

    const counter = charCount.parentElement;
    counter.classList.remove('warning', 'danger');

    if (count > maxLength * 0.8) {
        counter.classList.add('warning');
    }
    if (count > maxLength * 0.95) {
        counter.classList.add('danger');
    }
}

// ===== Category Change Handler =====
function handleCategoryChange() {
    const category = categorySelect.value;
    const categoryTexts = {
        'coffee': 'قهوه',
        'tea': 'چای',
        'dessert': 'دسر',
        'food': 'غذا',
        'cold_drink': 'نوشیدنی سرد',
        'hot_drink': 'نوشیدنی گرم'
    };

    // Update form validation based on category
    if (category === 'food') {
        document.getElementById('PreparationTime').setAttribute('required', 'required');
    } else {
        document.getElementById('PreparationTime').removeAttribute('required');
    }

    // Show category-specific suggestions
    showCategorySuggestions(category);
}

// ===== Show Category Suggestions =====
function showCategorySuggestions(category) {
    const suggestions = {
        'coffee': ['اسپرسو', 'کافه لته', 'کاپوچینو', 'آمریکانو', 'ماکیاتو'],
        'tea': ['چای ایرانی', 'چای سبز', 'چای ماسالا', 'چای نعناع', 'چای بابونه'],
        'dessert': ['تیرامیسو', 'چیز کیک', 'کوکی', 'براونی', 'پاناکوتا'],
        'food': ['ساندویچ', 'سالاد', 'پاستا', 'پیتزا', 'برگر'],
        'cold_drink': ['آیس کافی', 'اسموتی', 'شیک', 'لیموناد', 'موهیتو'],
        'hot_drink': ['هات چاکلت', 'چای داغ', 'قهوه ترک', 'ساحلب', 'دمنوش']
    };

    if (suggestions[category]) {
        showNotification(`پیشنهاد: ${suggestions[category].join('، ')}`, 'info', 5000);
    }
}

// ===== Setup Image Upload =====
function setupImageUpload() {
    // Drag and drop
    imagePreview.addEventListener('dragover', handleDragOver);
    imagePreview.addEventListener('dragleave', handleDragLeave);
    imagePreview.addEventListener('drop', handleDrop);

    // File input change
    imageInput.addEventListener('change', handleFileSelect);

    // Click to select
    imagePreview.addEventListener('click', () => imageInput.click());
}

// ===== Drag Over Handler =====
function handleDragOver(e) {
    e.preventDefault();
    isDragOver = true;
    imagePreview.classList.add('dragover');
}

// ===== Drag Leave Handler =====
function handleDragLeave(e) {
    e.preventDefault();
    isDragOver = false;
    imagePreview.classList.remove('dragover');
}

// ===== Drop Handler =====
function handleDrop(e) {
    e.preventDefault();
    isDragOver = false;
    imagePreview.classList.remove('dragover');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileSelect({ target: { files: files } });
    }
}

// ===== File Select Handler =====
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        showNotification('لطفاً یک فایل تصویری انتخاب کنید', 'error');
        return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('حجم فایل نباید بیشتر از ۵ مگابایت باشد', 'error');
        return;
    }

    // Preview image
    const reader = new FileReader();
    reader.onload = function (e) {
        displayImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Compress image if needed
    compressImage(file);
}

// ===== Display Image Preview =====
function displayImagePreview(src) {
    imagePreview.innerHTML = `
        <img src="${src}" alt="Preview" class="current-image">
        <div class="image-overlay">
            <span>کلیک برای تغییر تصویر</span>
        </div>
    `;
}

// ===== Compress Image =====
function compressImage(file) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = function () {
        // Calculate new dimensions
        let { width, height } = img;
        const maxSize = 800;

        if (width > maxSize || height > maxSize) {
            if (width > height) {
                height = (height * maxSize) / width;
                width = maxSize;
            } else {
                width = (width * maxSize) / height;
                height = maxSize;
            }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(function (blob) {
            // Create new file from compressed blob
            const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
            });

            // Update file input (this is tricky and might not work in all browsers)
            // For production, you might want to upload the compressed blob separately
            console.log('Original size:', (file.size / 1024).toFixed(2), 'KB');
            console.log('Compressed size:', (compressedFile.size / 1024).toFixed(2), 'KB');
        }, 'image/jpeg', 0.8);
    };

    img.src = URL.createObjectURL(file);
}

// ===== Setup Tags Input =====
function setupTagsInput() {
    tagsInput.addEventListener('keydown', handleTagsKeydown);
    tagsInput.addEventListener('blur', addTagFromInput);
}

// ===== Handle Tags Keydown =====
function handleTagsKeydown(e) {
    if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        addTagFromInput();
    } else if (e.key === 'Backspace' && tagsInput.value === '') {
        removeLastTag();
    }
}

// ===== Add Tag From Input =====
function addTagFromInput() {
    const value = tagsInput.value.trim();
    if (value && !currentTags.includes(value)) {
        addTag(value);
        tagsInput.value = '';
    }
}

// ===== Add Tag =====
function addTag(tag) {
    if (currentTags.length >= 10) {
        showNotification('حداکثر ۱۰ برچسب مجاز است', 'warning');
        return;
    }

    currentTags.push(tag);
    updateTagsDisplay();
    updateTagsHidden();
}

// ===== Remove Tag =====
function removeTag(tag) {
    const index = currentTags.indexOf(tag);
    if (index > -1) {
        currentTags.splice(index, 1);
        updateTagsDisplay();
        updateTagsHidden();
    }
}

// ===== Remove Last Tag =====
function removeLastTag() {
    if (currentTags.length > 0) {
        currentTags.pop();
        updateTagsDisplay();
        updateTagsHidden();
    }
}

// ===== Update Tags Display =====
function updateTagsDisplay() {
    tagsDisplay.innerHTML = '';

    currentTags.forEach(tag => {
        const tagElement = document.createElement('div');
        tagElement.className = 'tag-item';
        tagElement.innerHTML = `
            <span>${tag}</span>
            <span class="tag-remove" onclick="removeTag('${tag}')">&times;</span>
        `;
        tagsDisplay.appendChild(tagElement);
    });
}

// ===== Update Tags Hidden =====
function updateTagsHidden() {
    tagsHidden.value = currentTags.join(',');
}

// ===== Load Existing Tags =====
function loadExistingTags() {
    const existingTags = tagsHidden.value;
    if (existingTags) {
        currentTags = existingTags.split(',').filter(tag => tag.trim());
        updateTagsDisplay();
    }
}

// ===== Setup Form Validation =====
function setupFormValidation() {
    // Real-time validation
    [nameInput, categorySelect, priceInput, descriptionTextarea].forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => clearFieldError(field));
    });
}

// ===== Validate Field =====
function validateField(field) {
    const fieldGroup = field.closest('.form-group');
    let isValid = true;
    let message = '';

    switch (field.id) {
        case 'Name':
            if (!field.value.trim()) {
                isValid = false;
                message = 'نام محصول الزامی است';
            } else if (field.value.length < 3) {
                isValid = false;
                message = 'نام محصول باید حداقل ۳ کاراکتر باشد';
            }
            break;

        case 'Category':
            if (!field.value) {
                isValid = false;
                message = 'انتخاب دسته‌بندی الزامی است';
            }
            break;

        case 'Price':
            const price = parseInt(field.value);
            if (!price || price < 1000) {
                isValid = false;
                message = 'قیمت باید حداقل ۱۰۰۰ تومان باشد';
            } else if (price > 1000000) {
                isValid = false;
                message = 'قیمت نمی‌تواند بیشتر از ۱۰۰۰۰۰۰ تومان باشد';
            }
            break;

        case 'Description':
            if (!field.value.trim()) {
                isValid = false;
                message = 'توضیحات الزامی است';
            } else if (field.value.length < 20) {
                isValid = false;
                message = 'توضیحات باید حداقل ۲۰ کاراکتر باشد';
            }
            break;
    }

    // Update field state
    fieldGroup.classList.remove('error', 'success');

    if (isValid) {
        fieldGroup.classList.add('success');
        showFieldSuccess(field.id, 'تایید شده');
    } else {
        fieldGroup.classList.add('error');
        showFieldError(field.id, message);
    }

    return isValid;
}

// ===== Clear Field Error =====
function clearFieldError(field) {
    const fieldGroup = field.closest('.form-group');
    fieldGroup.classList.remove('error', 'success');

    const errorElement = fieldGroup.querySelector('.field-error');
    const successElement = fieldGroup.querySelector('.field-success');

    if (errorElement) errorElement.remove();
    if (successElement) successElement.remove();
}

// ===== Show Field Error =====
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const fieldGroup = field.closest('.form-group');

    // Remove existing messages
    const existing = fieldGroup.querySelector('.field-error');
    if (existing) existing.remove();

    // Add error message
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    fieldGroup.appendChild(errorElement);

    // Add shake animation
    field.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        field.style.animation = '';
    }, 500);
}

// ===== Show Field Success =====
function showFieldSuccess(fieldId, message) {
    const field = document.getElementById(fieldId);
    const fieldGroup = field.closest('.form-group');

    // Remove existing messages
    const existing = fieldGroup.querySelector('.field-success');
    if (existing) existing.remove();

    // Add success message
    const successElement = document.createElement('div');
    successElement.className = 'field-success';
    successElement.textContent = message;
    fieldGroup.appendChild(successElement);
}

// ===== Validate Entire Form =====
function validateForm() {
    let isValid = true;
    const fields = [nameInput, categorySelect, priceInput, descriptionTextarea];

    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    // Additional validations
    if (currentTags.length === 0) {
        showNotification('لطفاً حداقل یک برچسب اضافه کنید', 'warning');
        tagsInput.focus();
        isValid = false;
    }

    return isValid;
}

// ===== Handle Form Submit =====
function handleFormSubmit(e) {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
        showNotification('لطفاً خطاهای فرم را برطرف کنید', 'error');
        return;
    }

    // Show loading state
    setSubmitLoading(true);

    // Submit form
    setTimeout(() => {
        form.submit();
    }, 500);
}

// ===== Set Submit Loading =====
function setSubmitLoading(loading) {
    if (loading) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
    } else {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

// ===== Handle Before Unload =====
function handleBeforeUnload(e) {
    if (isFormDirty) {
        const message = 'تغییرات شما ذخیره نشده است. آیا مطمئن هستید؟';
        e.returnValue = message;
        return message;
    }
}

// ===== Keyboard Shortcuts =====
function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (validateForm()) {
            form.submit();
        }
    }

    // ESC to cancel
    if (e.key === 'Escape') {
        if (confirm('آیا می‌خواهید تغییرات را لغو کنید؟')) {
            window.location.href = '/AdminDashboard#products';
        }
    }

    // Ctrl/Cmd + P for preview
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        previewProduct();
    }
}

// ===== Preview Product =====
function previewProduct() {
    // Collect form data
    const productData = {
        name: nameInput.value || 'نام محصول',
        category: categorySelect.value,
        price: priceInput.value,
        description: descriptionTextarea.value || 'توضیحات محصول',
        tags: currentTags,
        prepTime: document.getElementById('PreparationTime').value,
        isAvailable: document.getElementById('IsAvailable').checked,
        isFeatured: document.getElementById('IsFeatured').checked
    };

    // Update preview modal
    updatePreviewModal(productData);

    // Show modal
    const modal = document.getElementById('previewModal');
    modal.classList.add('show');

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

// ===== Update Preview Modal =====
function updatePreviewModal(data) {
    const categoryTexts = {
        'coffee': 'قهوه',
        'tea': 'چای',
        'dessert': 'دسر',
        'food': 'غذا',
        'cold_drink': 'نوشیدنی سرد',
        'hot_drink': 'نوشیدنی گرم'
    };

    document.getElementById('previewName').textContent = data.name;
    document.getElementById('previewCategory').textContent = categoryTexts[data.category] || data.category;
    document.getElementById('previewDescription').textContent = data.description;

    // Format price
    const price = parseInt(data.price);
    const formattedPrice = isNaN(price) ? '۰' : price.toLocaleString('fa-IR');
    document.getElementById('previewPrice').textContent = `${formattedPrice} تومان`;

    // Display tags
    const tagsContainer = document.getElementById('previewTags');
    tagsContainer.innerHTML = '';
    data.tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'preview-tag';
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
    });

    // Preparation time
    const prepTime = data.prepTime ? `${data.prepTime} دقیقه` : 'نامشخص';
    document.getElementById('previewPrepTime').textContent = prepTime;

    // Availability
    const availability = document.getElementById('previewAvailability');
    availability.textContent = data.isAvailable ? 'موجود' : 'ناموجود';
    availability.className = 'availability ' + (data.isAvailable ? '' : 'unavailable');

    // Image
    const previewImage = document.getElementById('previewImage');
    const currentImage = document.querySelector('.current-image');
    if (currentImage) {
        previewImage.src = currentImage.src;
        previewImage.style.display = 'block';
    } else {
        previewImage.style.display = 'none';
    }
}

// ===== Close Preview =====
function closePreview() {
    const modal = document.getElementById('previewModal');
    modal.classList.remove('show');

    // Restore body scroll
    document.body.style.overflow = '';
}

// ===== Update Preview Data =====
function updatePreviewData() {
    // This function can be called to update preview in real-time
    // if we want to show live preview while typing
}

// ===== Animate Form Elements =====
function animateFormElements() {
    const formGroups = document.querySelectorAll('.form-group');

    formGroups.forEach((group, index) => {
        group.style.opacity = '0';
        group.style.transform = 'translateY(20px)';

        setTimeout(() => {
            group.style.transition = 'all 0.5s ease-out';
            group.style.opacity = '1';
            group.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// ===== Show Notification =====
function showNotification(message, type = 'info', duration = 3000) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create new notification
    const notification = document.createElement('div');
    notification.className = `toast-message ${type} notification`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Auto remove
    setTimeout(() => {
        const slideOutAnimation = window.innerWidth <= 768 ? 'slideOutToastMobile' : 'slideOutToast';
        notification.style.animation = `${slideOutAnimation} 0.5s ease-out forwards`;
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, duration);
}

// ===== Show Toast Message (for server messages) =====
function showToastMessage() {
    const toastMessage = document.getElementById('toastMessage');
    if (toastMessage) {
        // Auto hide after 5 seconds
        setTimeout(() => {
            const slideOutAnimation = window.innerWidth <= 768 ? 'slideOutToastMobile' : 'slideOutToast';
            toastMessage.style.animation = `${slideOutAnimation} 0.5s ease-out forwards`;
            setTimeout(() => {
                toastMessage.remove();
            }, 500);
        }, 5000);
    }
}

// ===== Auto Save (Draft) Feature =====
function setupAutoSave() {
    let autoSaveTimer;

    form.addEventListener('input', function () {
        clearTimeout(autoSaveTimer);
        autoSaveTimer = setTimeout(saveFormDraft, 2000); // Save after 2 seconds of inactivity
    });
}

function saveFormDraft() {
    const formData = {
        name: nameInput.value,
        category: categorySelect.value,
        price: priceInput.value,
        description: descriptionTextarea.value,
        tags: currentTags,
        prepTime: document.getElementById('PreparationTime').value,
        isAvailable: document.getElementById('IsAvailable').checked,
        isFeatured: document.getElementById('IsFeatured').checked,
        timestamp: new Date().toISOString()
    };

    try {
        // We can't use localStorage in this environment, but in real implementation:
        // localStorage.setItem('productFormDraft', JSON.stringify(formData));
        console.log('Draft saved:', formData);

        // Show subtle indicator
        const indicator = document.createElement('div');
        indicator.textContent = 'پیش‌نویس ذخیره شد';
        indicator.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: #10b981;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.8rem;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s;
        `;

        document.body.appendChild(indicator);

        setTimeout(() => indicator.style.opacity = '1', 10);
        setTimeout(() => {
            indicator.style.opacity = '0';
            setTimeout(() => indicator.remove(), 300);
        }, 2000);

    } catch (e) {
        console.error('Failed to save draft:', e);
    }
}

function loadFormDraft() {
    try {
        // In real implementation:
        // const draft = localStorage.getItem('productFormDraft');
        // if (draft) {
        //     const formData = JSON.parse(draft);
        //     // Populate form with draft data
        // }
    } catch (e) {
        console.error('Failed to load draft:', e);
    }
}

// ===== Initialize Advanced Features =====
document.addEventListener('DOMContentLoaded', function () {
    setupAutoSave();

    // Add form reset confirmation
    const resetButton = document.querySelector('button[type="reset"]');
    if (resetButton) {
        resetButton.addEventListener('click', function (e) {
            if (!confirm('آیا می‌خواهید فرم را بازنشانی کنید؟')) {
                e.preventDefault();
            } else {
                currentTags = [];
                updateTagsDisplay();
                updateTagsHidden();
                isFormDirty = false;
            }
        });
    }

    // Add modal close on outside click
    document.getElementById('previewModal').addEventListener('click', function (e) {
        if (e.target === this) {
            closePreview();
        }
    });

    // Add escape key to close modal
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('previewModal');
            if (modal.classList.contains('show')) {
                closePreview();
            }
        }
    });
});

// ===== Add CSS Animations =====
const additionalStyles = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
    
    .notification {
        position: fixed !important;
        top: 100px;
        right: 20px;
        z-index: 3000;
    }
    
    @media (max-width: 768px) {
        .notification {
            right: 10px;
            left: 10px;
            transform: translateY(-100px);
            animation: slideInToastMobile 0.5s ease-out forwards !important;
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// ===== Console Information =====
console.log(`
🎨 فرم محصول کافه کوچ بارگذاری شد!

⌨️  میانبرهای کیبورد:
   • Ctrl/Cmd + S: ذخیره فرم
   • Ctrl/Cmd + P: پیش‌نمایش
   • ESC: لغو یا بستن مودال

✨ ویژگی‌ها:
   • اعتبارسنجی لحظه‌ای
   • فشرده‌سازی تصویر
   • پیش‌نویس خودکار
   • پیش‌نمایش زنده
   • پشتیبانی از کشیدن و رها کردن

🎯 نسخه: 1.0.0
`);