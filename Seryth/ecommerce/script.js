/* =========================================
   NEXUS E-Commerce — JavaScript
   ========================================= */

'use strict';

// ---- Product Data ----
const products = [
  { id: 1, name: 'SoundMax Pro', category: 'audio', price: 299, oldPrice: 399, rating: '★★★★★', reviews: '1,284', badge: 'Bestseller', desc: 'Active noise-cancelling with 40hr battery & premium leather ear pads', img: 'images/product_1.png' },
  { id: 2, name: 'ChronoX Watch', category: 'wearables', price: 499, oldPrice: 649, rating: '★★★★★', reviews: '876', badge: 'New', desc: '1.9" AMOLED, health tracking, GPS & 7-day battery life', img: 'images/product_2.png' },
  { id: 3, name: 'LuxAudio Pods', category: 'audio', price: 189, oldPrice: 249, rating: '★★★★½', reviews: '2,103', badge: '–25%', desc: 'Spatial audio, 36hr total playback & wireless charging case', img: 'images/product_3.png' },
  { id: 4, name: 'AuraSpeaker', category: 'audio', price: 149, oldPrice: 199, rating: '★★★★★', reviews: '562', badge: '', desc: '360° immersive sound, IPX7 waterproof & 20hr playtime', img: 'images/product_4.png' },
  { id: 5, name: 'Aether SL Laptop', category: 'computing', price: 1799, oldPrice: 2199, rating: '★★★★★', reviews: '3,491', badge: 'Top Pick', desc: '14" 4K OLED, M3 chip, 32GB RAM & ultra-thin 9.9mm profile', img: 'images/product_5.png' },
  { id: 6, name: 'Velocity Pro KB', category: 'accessories', price: 229, oldPrice: 299, rating: '★★★★★', reviews: '1,847', badge: 'Hot', desc: 'Per-key RGB, hot-swap switches & aluminum CNC frame', img: 'images/product_6.png' },
];

// ---- State ----
let cart = JSON.parse(localStorage.getItem('nexus-cart') || '[]');
let mobileMenuOpen = false;
let cartOpen = false;

// ---- DOM References ----
const navbar = document.getElementById('navbar');
const btnMenu = document.getElementById('btn-menu');
const mobileMenu = document.getElementById('mobile-menu');
const btnCart = document.getElementById('btn-cart');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartClose = document.getElementById('cart-close');
const cartItemsEl = document.getElementById('cart-items');
const cartEmpty = document.getElementById('cart-empty');
const cartFooter = document.getElementById('cart-footer');
const cartBadge = document.getElementById('cart-badge');
const cartTotalAmount = document.getElementById('cart-total-amount');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const modalContent = document.getElementById('modal-content');
const toast = document.getElementById('toast');
const newsletterForm = document.getElementById('newsletter-form');
const btnCheckout = document.getElementById('btn-checkout');

// ---- Navbar Scroll ----
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// ---- Mobile Menu ----
btnMenu.addEventListener('click', () => {
  mobileMenuOpen = !mobileMenuOpen;
  mobileMenu.classList.toggle('open', mobileMenuOpen);
  btnMenu.setAttribute('aria-expanded', mobileMenuOpen);
  // Animate hamburger
  const spans = btnMenu.querySelectorAll('span');
  if (mobileMenuOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenuOpen = false;
    mobileMenu.classList.remove('open');
    btnMenu.setAttribute('aria-expanded', 'false');
    const spans = btnMenu.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

// ---- Cart Sidebar ----
function openCart() {
  cartOpen = true;
  cartSidebar.classList.add('open');
  cartOverlay.classList.add('active');
  cartSidebar.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartOpen = false;
  cartSidebar.classList.remove('open');
  cartOverlay.classList.remove('active');
  cartSidebar.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

btnCart.addEventListener('click', () => cartOpen ? closeCart() : openCart());
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// ---- Cart Logic ----
function saveCart() {
  localStorage.setItem('nexus-cart', JSON.stringify(cart));
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function updateCartBadge() {
  const count = getCartCount();
  cartBadge.textContent = count;
  cartBadge.style.transform = 'scale(1.4)';
  setTimeout(() => { cartBadge.style.transform = ''; }, 300);
}

function updateCartTotal() {
  cartTotalAmount.textContent = `$${getCartTotal().toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
}

function renderCart() {
  // Clear existing items (keep empty state)
  Array.from(cartItemsEl.children).forEach(child => {
    if (child.id !== 'cart-empty') child.remove();
  });

  if (cart.length === 0) {
    cartEmpty.style.display = 'flex';
    cartFooter.style.display = 'none';
  } else {
    cartEmpty.style.display = 'none';
    cartFooter.style.display = 'block';

    cart.forEach(item => {
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.setAttribute('data-cart-item', item.id);
      el.innerHTML = `
        <img src="${item.img}" alt="${item.name}" class="cart-item-img" />
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${item.price}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" data-action="dec" data-id="${item.id}" aria-label="Decrease quantity">−</button>
            <span class="qty-number">${item.qty}</span>
            <button class="qty-btn" data-action="inc" data-id="${item.id}" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button class="cart-item-remove" data-id="${item.id}" aria-label="Remove ${item.name} from cart">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      `;
      cartItemsEl.appendChild(el);
    });

    updateCartTotal();
  }

  updateCartBadge();
}

cartItemsEl.addEventListener('click', (e) => {
  const qtyBtn = e.target.closest('.qty-btn');
  const removeBtn = e.target.closest('.cart-item-remove');

  if (qtyBtn) {
    const id = parseInt(qtyBtn.dataset.id);
    const action = qtyBtn.dataset.action;
    const itemIdx = cart.findIndex(i => i.id === id);
    if (itemIdx === -1) return;

    if (action === 'inc') {
      cart[itemIdx].qty++;
    } else if (action === 'dec') {
      cart[itemIdx].qty--;
      if (cart[itemIdx].qty <= 0) {
        cart.splice(itemIdx, 1);
      }
    }
    saveCart();
    renderCart();
  }

  if (removeBtn) {
    const id = parseInt(removeBtn.dataset.id);
    cart = cart.filter(i => i.id !== id);
    saveCart();
    renderCart();
    showToast('Item removed from cart');
  }
});

// ---- Add to Cart ----
function addToCart(id, name, price, img) {
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id, name, price, qty: 1, img });
  }
  saveCart();
  renderCart();
  showToast(`✓ ${name} added to cart!`);
}

document.querySelectorAll('.btn-add-cart').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const id = parseInt(btn.dataset.id);
    const name = btn.dataset.name;
    const price = parseFloat(btn.dataset.price);
    const img = btn.dataset.img;
    addToCart(id, name, price, img);

    // Visual feedback
    btn.classList.add('added');
    const originalText = btn.innerHTML;
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Added!`;
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.classList.remove('added');
    }, 2000);
  });
});

// ---- Category Filter ----
document.querySelectorAll('.pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');

    const filter = pill.dataset.filter;
    document.querySelectorAll('.product-card').forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'fade-in-up 0.4s ease both';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ---- Quick View Modal ----
document.querySelectorAll('.btn-quick-view').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const id = parseInt(btn.dataset.id);
    const product = products.find(p => p.id === id);
    if (!product) return;
    openModal(product);
  });
});

function openModal(product) {
  modalContent.innerHTML = `
    <div class="modal-inner">
      <img src="${product.img}" alt="${product.name}" class="modal-img" />
      <div class="modal-details">
        <div class="modal-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</div>
        <h3 class="modal-name" id="modal-product-name">${product.name}</h3>
        <p class="modal-desc">${product.desc}</p>
        <div class="modal-rating">
          <span class="stars">${product.rating}</span>
          <span class="review-count">(${product.reviews} reviews)</span>
        </div>
        <div class="modal-price">
          <span class="price-current">$${product.price}</span>
          <span class="price-old">$${product.oldPrice}</span>
        </div>
        <button class="modal-btn" id="modal-add-btn" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-img="${product.img}">
          Add to Cart
        </button>
      </div>
    </div>
  `;

  modalOverlay.classList.add('open');
  modalOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  document.getElementById('modal-add-btn').addEventListener('click', () => {
    addToCart(product.id, product.name, product.price, product.img);
    closeModal();
  });
}

function closeModal() {
  modalOverlay.classList.remove('open');
  modalOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

// ESC key handling
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (modalOverlay.classList.contains('open')) closeModal();
    if (cartOpen) closeCart();
    if (mobileMenuOpen) {
      mobileMenuOpen = false;
      mobileMenu.classList.remove('open');
    }
  }
});

// ---- Toast Notification ----
let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('show');
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// ---- Newsletter ----
newsletterForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const emailInput = document.getElementById('newsletter-email');
  const email = emailInput.value.trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('⚠️ Please enter a valid email address');
    emailInput.focus();
    return;
  }

  const btn = document.getElementById('btn-subscribe');
  btn.textContent = '✓ Subscribed!';
  btn.style.background = 'linear-gradient(135deg, #10b981, #06b6d4)';
  emailInput.value = '';
  showToast('🎉 Welcome to NEXUS! Check your inbox.');

  setTimeout(() => {
    btn.textContent = 'Subscribe';
    btn.style.background = '';
  }, 4000);
});

// ---- Checkout ----
if (btnCheckout) {
  btnCheckout.addEventListener('click', () => {
    if (cart.length === 0) return;
    showToast('🚀 Redirecting to secure checkout...');
    setTimeout(() => {
      cart = [];
      saveCart();
      renderCart();
      closeCart();
      showToast('✓ Order placed successfully! Thank you!');
    }, 1800);
  });
}

// ---- Intersection Observer for animations ----
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Animate cards on scroll
document.querySelectorAll('.product-card, .feature-card, .testimonial-card').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`;
  observer.observe(el);
});

// ---- Smooth scroll for nav links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ---- Product card click opens quick view ----
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('click', (e) => {
    if (e.target.closest('.btn-add-cart') || e.target.closest('.btn-quick-view')) return;
    const quickViewBtn = card.querySelector('.btn-quick-view');
    if (quickViewBtn) quickViewBtn.click();
  });
});

// ---- Active nav link on scroll ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  const scrollPos = window.scrollY + 120;
  sections.forEach(section => {
    if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${section.id}`) {
          link.style.color = 'var(--text-primary)';
        }
      });
    }
  });
}, { passive: true });

// ---- Search button (demo) ----
document.getElementById('btn-search').addEventListener('click', () => {
  showToast('🔍 Search coming soon!');
});

// ---- Init ----
renderCart();
console.log('🚀 NEXUS Store loaded successfully!');
