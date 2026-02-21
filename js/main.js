// ========================================
// ADIP RMX SHOP - Main JavaScript
// ========================================

// Global Variables
let cart = [];
let currentAudio = null;
let isPlaying = false;

// DOM Elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose = document.getElementById('cartClose');
const cartBody = document.getElementById('cartBody');
const cartFooter = document.getElementById('cartFooter');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const audioPlayer = document.getElementById('audioPlayer');
const audioElement = document.getElementById('audioElement');
const playerTitle = document.getElementById('playerTitle');
const playerPlayPause = document.getElementById('playerPlayPause');
const playerClose = document.getElementById('playerClose');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// ========================================
// Initialization
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initNavigation();
    renderFLMProducts();
    renderSamplePacks();
    renderTestimonials();
    initPaymentTabs();
    initCart();
    initAudioPlayer();
    loadCartFromStorage();
});

// ========================================
// Navbar Functions
// ========================================

function initNavbar() {
    // Scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        const icon = navToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navbar.contains(e.target)) {
            navMenu.classList.remove('active');
            const icon = navToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// ========================================
// Smooth Navigation
// ========================================

function initNavigation() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu
                navMenu.classList.remove('active');
                const icon = navToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
}

// ========================================
// Render Products
// ========================================

function renderFLMProducts() {
    const container = document.getElementById('flmProducts');
    if (!container) return;
    
    // Show first 8 products initially
    const displayProducts = flmProducts.slice(0, 8);
    
    container.innerHTML = displayProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <span class="product-genre">${product.genre}</span>
                <button class="product-play" onclick="playAudio('${product.audioUrl}', '${product.title}')">
                    <i class="fas fa-play"></i>
                </button>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-meta">
                    <span class="product-bpm">
                        <i class="fas fa-heartbeat"></i> ${product.bpm} BPM
                    </span>
                </div>
                <div class="product-price">${formatPrice(product.price)}</div>
                <div class="product-actions">
                    <a href="${getWhatsAppLink(product)}" target="_blank" class="btn btn-primary">
                        <i class="fas fa-shopping-bag"></i> Beli
                    </a>
                    <button class="btn btn-outline btn-icon" onclick="addToCart('${product.id}', 'flm')">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Load more button
    const loadMoreBtn = document.getElementById('loadMoreFlm');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            const remainingProducts = flmProducts.slice(8);
            const newHTML = remainingProducts.map(product => `
                <div class="product-card" data-id="${product.id}">
                    <div class="product-image">
                        <span class="product-genre">${product.genre}</span>
                        <button class="product-play" onclick="playAudio('${product.audioUrl}', '${product.title}')">
                            <i class="fas fa-play"></i>
                        </button>
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${product.title}</h3>
                        <div class="product-meta">
                            <span class="product-bpm">
                                <i class="fas fa-heartbeat"></i> ${product.bpm} BPM
                            </span>
                        </div>
                        <div class="product-price">${formatPrice(product.price)}</div>
                        <div class="product-actions">
                            <a href="${getWhatsAppLink(product)}" target="_blank" class="btn btn-primary">
                                <i class="fas fa-shopping-bag"></i> Beli
                            </a>
                            <button class="btn btn-outline btn-icon" onclick="addToCart('${product.id}', 'flm')">
                                <i class="fas fa-cart-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
            container.insertAdjacentHTML('beforeend', newHTML);
            this.style.display = 'none';
        });
    }
}

function renderSamplePacks() {
    const container = document.getElementById('sampleProducts');
    if (!container) return;
    
    // Show first 8 products initially
    const displayProducts = samplePacks.slice(0, 8);
    
    container.innerHTML = displayProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <span class="product-genre">${product.category}</span>
                <button class="product-play" onclick="playAudio('${product.audioUrl}', '${product.title}')">
                    <i class="fas fa-play"></i>
                </button>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-meta">
                    <span class="product-bpm">
                        <i class="fas fa-music"></i> Sample Pack
                    </span>
                </div>
                <div class="product-price">${formatPrice(product.price)}</div>
                <div class="product-actions">
                    <a href="${getWhatsAppLink(product)}" target="_blank" class="btn btn-primary">
                        <i class="fas fa-shopping-bag"></i> Beli
                    </a>
                    <button class="btn btn-outline btn-icon" onclick="addToCart('${product.id}', 'sample')">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Load more button
    const loadMoreBtn = document.getElementById('loadMoreSample');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            const remainingProducts = samplePacks.slice(8);
            const newHTML = remainingProducts.map(product => `
                <div class="product-card" data-id="${product.id}">
                    <div class="product-image">
                        <span class="product-genre">${product.category}</span>
                        <button class="product-play" onclick="playAudio('${product.audioUrl}', '${product.title}')">
                            <i class="fas fa-play"></i>
                        </button>
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${product.title}</h3>
                        <div class="product-meta">
                            <span class="product-bpm">
                                <i class="fas fa-music"></i> Sample Pack
                            </span>
                        </div>
                        <div class="product-price">${formatPrice(product.price)}</div>
                        <div class="product-actions">
                            <a href="${getWhatsAppLink(product)}" target="_blank" class="btn btn-primary">
                                <i class="fas fa-shopping-bag"></i> Beli
                            </a>
                            <button class="btn btn-outline btn-icon" onclick="addToCart('${product.id}', 'sample')">
                                <i class="fas fa-cart-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
            container.insertAdjacentHTML('beforeend', newHTML);
            this.style.display = 'none';
        });
    }
    
    // Initialize search
    initSearch();
}

// ========================================
// Render Testimonials
// ========================================

function renderTestimonials() {
    const container = document.getElementById('testimonialsGrid');
    if (!container) return;
    
    container.innerHTML = testimonials.map(testimonial => `
        <div class="testimonial-card">
            <div class="testimonial-chat">
                <div class="chat-placeholder">
                    <i class="fas fa-comments"></i>
                    <p>Bukti Chat ${testimonial.name}</p>
                </div>
            </div>
            <div class="testimonial-content">
                <div class="testimonial-header">
                    <div class="testimonial-avatar">${testimonial.avatar}</div>
                    <div class="testimonial-info">
                        <h4>${testimonial.name}</h4>
                        <span>${testimonial.role}</span>
                    </div>
                </div>
                <div class="testimonial-rating">
                    ${Array(testimonial.rating).fill('<i class="fas fa-star"></i>').join('')}
                </div>
                <p class="testimonial-text">"${testimonial.text}"</p>
            </div>
        </div>
    `).join('');
}

// ========================================
// Payment Tabs
// ========================================

function initPaymentTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.dataset.tab;
            
            // Remove active from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            
            // Add active to current
            this.classList.add('active');
            document.getElementById(`${tab}-panel`).classList.add('active');
        });
    });
}

// ========================================
// Cart Functions
// ========================================

function initCart() {
    // Open cart
    cartBtn.addEventListener('click', openCart);
    
    // Close cart
    cartOverlay.addEventListener('click', closeCart);
    cartClose.addEventListener('click', closeCart);
    
    // Checkout
    checkoutBtn.addEventListener('click', function() {
        if (cart.length > 0) {
            const total = cart.reduce((sum, item) => sum + item.price, 0);
            const link = getCartWhatsAppLink(cart, total);
            window.open(link, '_blank');
        }
    });
}

function openCart() {
    cartModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    renderCart();
}

function closeCart() {
    cartModal.classList.remove('active');
    document.body.style.overflow = '';
}

function addToCart(productId, type) {
    let product;
    if (type === 'flm') {
        product = flmProducts.find(p => p.id === productId);
    } else {
        product = samplePacks.find(p => p.id === productId);
    }
    
    if (product) {
        cart.push(product);
        saveCartToStorage();
        updateCartCount();
        showToast(`${product.title} ditambahkan ke keranjang`);
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCartToStorage();
    updateCartCount();
    renderCart();
}

function renderCart() {
    if (cart.length === 0) {
        cartBody.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-basket"></i>
                <p>Keranjang masih kosong</p>
                <a href="#produk" class="btn btn-primary" onclick="closeCart()">Belanja Sekarang</a>
            </div>
        `;
        cartFooter.style.display = 'none';
    } else {
        cartBody.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <i class="fas fa-music"></i>
                </div>
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${item.title}</h4>
                    <p class="cart-item-type">${item.genre || item.category}</p>
                    <p class="cart-item-price">${formatPrice(item.price)}</p>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
        
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        cartTotal.textContent = formatPrice(total);
        cartFooter.style.display = 'block';
    }
}

function updateCartCount() {
    cartCount.textContent = cart.length;
}

// ========================================
// Search Functions
// ========================================

function initSearch() {
    // FLM Search
    const searchFlm = document.getElementById('searchFlm');
    const clearSearchFlm = document.getElementById('clearSearchFlm');
    
    if (searchFlm) {
        searchFlm.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            filterProducts(query, 'flm');
            
            // Show/hide clear button
            if (query.length > 0) {
                clearSearchFlm.classList.add('visible');
            } else {
                clearSearchFlm.classList.remove('visible');
            }
        });
    }
    
    if (clearSearchFlm) {
        clearSearchFlm.addEventListener('click', function() {
            searchFlm.value = '';
            filterProducts('', 'flm');
            clearSearchFlm.classList.remove('visible');
        });
    }
    
    // Sample Packs Search
    const searchSample = document.getElementById('searchSample');
    const clearSearchSample = document.getElementById('clearSearchSample');
    
    if (searchSample) {
        searchSample.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            filterProducts(query, 'sample');
            
            // Show/hide clear button
            if (query.length > 0) {
                clearSearchSample.classList.add('visible');
            } else {
                clearSearchSample.classList.remove('visible');
            }
        });
    }
    
    if (clearSearchSample) {
        clearSearchSample.addEventListener('click', function() {
            searchSample.value = '';
            filterProducts('', 'sample');
            clearSearchSample.classList.remove('visible');
        });
    }
}

function filterProducts(query, type) {
    const container = type === 'flm' ? document.getElementById('flmProducts') : document.getElementById('sampleProducts');
    const products = type === 'flm' ? flmProducts : samplePacks;
    const loadMoreBtn = type === 'flm' ? document.getElementById('loadMoreFlm') : document.getElementById('loadMoreSample');
    
    if (!container) return;
    
    if (query === '') {
        // Reset to default view (show first 8)
        const displayProducts = products.slice(0, 8);
        container.innerHTML = displayProducts.map(product => createProductCard(product, type)).join('');
        if (loadMoreBtn) loadMoreBtn.style.display = 'inline-flex';
        return;
    }
    
    // Filter products
    const filtered = products.filter(product => {
        const searchField = type === 'flm' ? product.genre : product.category;
        return product.title.toLowerCase().includes(query) || 
               searchField.toLowerCase().includes(query);
    });
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="search-no-results">
                <i class="fas fa-search"></i>
                <p>Produk tidak ditemukan</p>
                <span>Coba kata kunci lain</span>
            </div>
        `;
    } else {
        container.innerHTML = filtered.map(product => createProductCard(product, type)).join('');
    }
    
    // Hide load more button when searching
    if (loadMoreBtn) loadMoreBtn.style.display = 'none';
}

function createProductCard(product, type) {
    const searchField = type === 'flm' ? product.genre : product.category;
    const bpmDisplay = type === 'flm' ? 
        `<span class="product-bpm"><i class="fas fa-heartbeat"></i> ${product.bpm} BPM</span>` :
        `<span class="product-bpm"><i class="fas fa-music"></i> Sample Pack</span>`;
    
    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <span class="product-genre">${searchField}</span>
                <button class="product-play" onclick="playAudio('${product.audioUrl}', '${product.title}')">
                    <i class="fas fa-play"></i>
                </button>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-meta">
                    ${bpmDisplay}
                </div>
                <div class="product-price">${formatPrice(product.price)}</div>
                <div class="product-actions">
                    <a href="${getWhatsAppLink(product)}" target="_blank" class="btn btn-primary">
                        <i class="fas fa-shopping-bag"></i> Beli
                    </a>
                    <button class="btn btn-outline btn-icon" onclick="addToCart('${product.id}', '${type}')">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function saveCartToStorage() {
    localStorage.setItem('adipRmxCart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const saved = localStorage.getItem('adipRmxCart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCartCount();
    }
}

// ========================================
// Audio Player
// ========================================

function initAudioPlayer() {
    playerPlayPause.addEventListener('click', togglePlayPause);
    playerClose.addEventListener('click', stopAudio);
    
    audioElement.addEventListener('ended', function() {
        isPlaying = false;
        updatePlayButton();
    });
}

function playAudio(url, title) {
    // Stop current audio if playing
    if (currentAudio && currentAudio !== url) {
        audioElement.pause();
    }
    
    currentAudio = url;
    playerTitle.textContent = title;
    
    // In a real implementation, you would set the actual audio URL
    // For demo purposes, we'll just show the player
    audioElement.src = url;
    
    audioPlayer.classList.add('active');
    
    // Try to play (will fail if no actual audio file)
    audioElement.play().then(() => {
        isPlaying = true;
        updatePlayButton();
    }).catch(() => {
        // If no audio file, just show the player UI
        isPlaying = true;
        updatePlayButton();
        showToast('Preview audio (demo mode)');
    });
}

function togglePlayPause() {
    if (!currentAudio) return;
    
    if (isPlaying) {
        audioElement.pause();
        isPlaying = false;
    } else {
        audioElement.play();
        isPlaying = true;
    }
    updatePlayButton();
}

function stopAudio() {
    audioElement.pause();
    audioElement.currentTime = 0;
    isPlaying = false;
    currentAudio = null;
    audioPlayer.classList.remove('active');
}

function updatePlayButton() {
    playerPlayPause.innerHTML = isPlaying ? 
        '<i class="fas fa-pause"></i>' : 
        '<i class="fas fa-play"></i>';
}

// ========================================
// Toast Notification
// ========================================

function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add('active');
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

// ========================================
// Utility Functions
// ========================================

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Nomor berhasil disalin!');
    }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Nomor berhasil disalin!');
    });
}

function orderService(serviceName) {
    const link = getServiceWhatsAppLink(serviceName);
    window.open(link, '_blank');
}

// ========================================
// Instructions for Adding More Products
// ========================================

/*
CARA MENAMBAHKAN PRODUK BARU:

1. TAMBAH FLM PRODUCT:
   - Buka file js/data.js
   - Cari array flmProducts
   - Tambahkan objek baru dengan format:
     {
         id: 'flm-026',  // ID unik
         title: 'Nama FLM Baru',
         genre: 'GENRE',
         bpm: 120,
         price: 90000,
         audioUrl: 'assets/audio/preview26.mp3'
     }

2. TAMBAH SAMPLE PACK:
   - Buka file js/data.js
   - Cari array samplePacks
   - Tambahkan objek baru dengan format:
     {
         id: 'sample-053',  // ID unik
         title: 'Nama Sample Pack',
         category: 'KATEGORI',
         price: 35000,
         audioUrl: 'assets/audio/sample53.mp3'
     }

3. TAMBAH TESTIMONI:
   - Buka file js/data.js
   - Cari array testimonials
   - Tambahkan objek baru dengan format:
     {
         id: 7,
         name: 'Nama Klien',
         role: 'Profesi',
         avatar: 'N',  // Inisial
         rating: 5,
         text: 'Isi testimoni...',
         chatImage: null  // atau path gambar
     }

4. GANTI NOMOR WHATSAPP:
   - Buka file js/data.js
   - Cari fungsi getWhatsAppLink, getCartWhatsAppLink, getServiceWhatsAppLink
   - Ganti 6285893523975 dengan nomor baru

5. GANTI GAMBAR LOGO:
   - Ganti file di folder images/ dengan nama yang sama
   - atau ubah path di HTML

6. TAMBAH AUDIO PREVIEW:
   - Taruh file MP3 di folder assets/audio/
   - Update audioUrl di data.js

7. REDEPLOY WEBSITE:
   - Upload semua file ke hosting
   - atau gunakan Vercel/Netlify
*/
