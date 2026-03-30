
document.addEventListener('DOMContentLoaded', () => {

  const sidebar = document.getElementById('sidebar');
  const hamburger = document.getElementById('hamburger');
  const sidebarClose = document.getElementById('sidebar-close');
  const overlay = document.getElementById('overlay');
  const themeToggle = document.getElementById('theme-toggle');
  const year = document.getElementById('year');


  const cartDrawer = document.getElementById('cart-drawer');
  const cartButtonTop = document.getElementById('cart-button');
  const cartButtonSide = document.getElementById('cart-button-side');
  const cartClose = document.getElementById('cart-close');
  const cartItemsEl = document.getElementById('cart-items');
  const cartTotalEl = document.getElementById('cart-total');
  const cartCountTop = document.getElementById('cart-count');
  const cartCountSide = document.getElementById('cart-count-side');
  const checkoutBtn = document.getElementById('checkout-btn');
  const liveRegion = document.getElementById('live-region');


  const modalBtn = document.getElementById('modal-btn');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');
  const modalCloseBtn = document.getElementById('modal-close-btn');

 
  const carouselContainer = document.getElementById('carousel-container');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const dotsContainer = document.getElementById('carousel-dots');
  const items = document.querySelectorAll('.carousel-item');


  const money = (n) => 'R' + Number(n).toFixed(2);


  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('show');
    overlay.hidden = false;
    hamburger.setAttribute('aria-expanded', 'true');
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
    hamburger.setAttribute('aria-expanded', 'false');
    setTimeout(() => { overlay.hidden = !overlay.classList.contains('show'); }, 300);
  }
  hamburger?.addEventListener('click', openSidebar);
  sidebarClose?.addEventListener('click', closeSidebar);
  overlay?.addEventListener('click', () => {
    closeSidebar();
    closeCart();
  });

 
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      closeSidebar();
    });
  });

 
  let currentIndex = 0;


  items.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot';
    dot.type = 'button';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Go to item ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });
  const dots = [...document.querySelectorAll('.dot')];

  function goToSlide(index) {
    if (index < 0) index = items.length - 1;
    if (index >= items.length) index = 0;
    carouselContainer.style.transform = `translateX(-${index * 100}%)`;
    currentIndex = index;
    dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
  }
  prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

  let carouselInterval = setInterval(() => goToSlide(currentIndex + 1), 5000);
  carouselContainer.addEventListener('mouseenter', () => clearInterval(carouselInterval));
  carouselContainer.addEventListener('mouseleave', () => {
    carouselInterval = setInterval(() => goToSlide(currentIndex + 1), 5000);
  });


  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => toggleAccordion(header));
    header.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggleAccordion(header);
      }
    });
  });
  function toggleAccordion(header) {
    const item = header.parentElement;
    const expanded = header.getAttribute('aria-expanded') === 'true';
    header.setAttribute('aria-expanded', String(!expanded));
    item.classList.toggle('active');
  }


  function openModal() {
    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  modalBtn?.addEventListener('click', openModal);
  modalClose?.addEventListener('click', closeModal);
  modalCloseBtn?.addEventListener('click', closeModal);
  modalOverlay?.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modalOverlay.classList.contains('active')) closeModal();
      if (cartDrawer.classList.contains('open')) closeCart();
    }
  });

 
  const savedTheme = localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeToggle) themeToggle.textContent = '☀️';
  }
  themeToggle?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    if (current === 'dark') {
      document.documentElement.removeAttribute('data-theme');
      themeToggle.textContent = '🌙';
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeToggle.textContent = '☀️';
      localStorage.setItem('theme', 'dark');
    }
  });


  const STORAGE_KEY = 'bb_cart_v1';
  let cart = loadCart();

  function loadCart() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch { return {}; }
  }
  function saveCart() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }
  function cartCount() {
    return Object.values(cart).reduce((sum, it) => sum + it.qty, 0);
  }
  function cartTotal() {
    return Object.values(cart).reduce((sum, it) => sum + (it.price * it.qty), 0);
  }
  function announce(msg) {
    liveRegion.textContent = ''; 
    setTimeout(() => { liveRegion.textContent = msg; }, 50);
  }

  function renderCart() {
    cartItemsEl.innerHTML = '';
    const entries = Object.values(cart);
    if (!entries.length) {
      cartItemsEl.innerHTML = `<li class="cart-item" aria-live="polite">Your cart is empty.</li>`;
    } else {
      entries.forEach(item => {
        const li = document.createElement('li');
        li.className = 'cart-item';
        li.setAttribute('data-id', item.id);
        li.innerHTML = `
          <img src="${item.image}" alt="${item.name}">
          <div>
            <p class="cart-item-title">${item.name}</p>
            <p class="cart-item-price">${money(item.price)}</p>
            <div class="qty-control" aria-label="Change quantity">
              <button class="qty-btn" data-action="dec" aria-label="Decrease">−</button>
              <span aria-live="polite">${item.qty}</span>
              <button class="qty-btn" data-action="inc" aria-label="Increase">+</button>
              <button class="remove-btn" data-action="remove" aria-label="Remove item">Remove</button>
            </div>
          </div>
          <strong>${money(item.price * item.qty)}</strong>
        `;
        cartItemsEl.appendChild(li);
      });
    }
    const total = cartTotal();
    cartTotalEl.textContent = money(total);
    cartCountTop.textContent = String(cartCount());
    cartCountSide.textContent = String(cartCount());
    saveCart();
  }

  function addToCart(product) {
    const { id, name, price, image } = product;
    if (!cart[id]) cart[id] = { id, name, price, image, qty: 0 };
    cart[id].qty += 1;
    renderCart();
    announce(`${name} added to cart.`);
    openCart();
  }
  function changeQty(id, delta) {
    if (!cart[id]) return;
    cart[id].qty += delta;
    if (cart[id].qty <= 0) delete cart[id];
    renderCart();
  }
  function removeItem(id) {
    if (!cart[id]) return;
    const name = cart[id].name;
    delete cart[id];
    renderCart();
    announce(`${name} removed from cart.`);
  }


  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.currentTarget.closest('.product');
      const product = {
        id: card.dataset.id,
        name: card.dataset.name,
        price: parseFloat(card.dataset.price),
        image: card.dataset.image
      };
      addToCart(product);
    });
  });


  function openCart() {
    cartDrawer.classList.add('open');
    overlay.classList.add('show');
    overlay.hidden = false;
    cartDrawer.setAttribute('aria-hidden', 'false');
  }
  function closeCart() {
    cartDrawer.classList.remove('open');
    cartDrawer.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('show');
    setTimeout(() => { overlay.hidden = !overlay.classList.contains('show'); }, 300);
  }
  [cartButtonTop, cartButtonSide].forEach(btn => btn?.addEventListener('click', openCart));
  cartClose?.addEventListener('click', closeCart);


  cartItemsEl.addEventListener('click', (e) => {
    const actionBtn = e.target.closest('button');
    if (!actionBtn) return;
    const action = actionBtn.dataset.action;
    const li = actionBtn.closest('.cart-item');
    const id = li?.dataset.id;
    if (!id) return;

    if (action === 'inc') changeQty(id, +1);
    if (action === 'dec') changeQty(id, -1);
    if (action === 'remove') removeItem(id);
  });


  checkoutBtn.addEventListener('click', () => {
    if (cartCount() === 0) {
      announce('Your cart is empty.');
      return;
    }
    alert('Checkout is a demo in this prototype. Integrate your payment provider here.');
  });

 
  renderCart();
  year.textContent = new Date().getFullYear();
});
