/**
 * APEX Auto Parts UK - Core Application Router, State Manager & Component Renderer
 */
(function(window) {
  'use strict';

  // Application Global State
  const AppState = {
    currentRoute: 'home', // home, shop, pdp, cart, checkout, account, brands, deals, about, contact, admin
    currentProduct: null,
    activeVehicle: null,
    savedGarage: [],
    cart: [],
    wishlist: [],
    appliedPromo: null,
    promoDiscount: 0,
    filters: {
      search: '',
      category: 'all',
      subcategory: 'all',
      brand: 'all',
      make: 'all',
      model: 'all',
      year: null,
      engine: 'all',
      inStock: false,
      dealsOnly: false,
      bestSellersOnly: false,
      minPrice: 0,
      maxPrice: 500,
      sortBy: 'recommended',
      page: 1
    },
    orders: [
      {
        id: "APX-89241",
        date: "2026-10-04",
        status: "Dispatched",
        trackingNo: "DPD-998241028GB",
        carrier: "DPD Express UK",
        estDelivery: "2026-10-06",
        total: 124.98,
        items: [
          { title: "BOSCH Premium Front Ceramic Brake Pad Set", qty: 1, price: 44.99 },
          { title: "BOSCH Vented Coated Front Brake Discs (Pair)", qty: 1, price: 79.99 }
        ],
        shippingAddress: "14 High Street, Richmond, London TW9 1ED"
      },
      {
        id: "APX-78104",
        date: "2026-09-18",
        status: "Delivered",
        trackingNo: "RM-449182391GB",
        carrier: "Royal Mail Tracked 24",
        estDelivery: "2026-09-19",
        total: 28.49,
        items: [
          { title: "MANN High-Flow Spin-On Engine Oil Filter", qty: 1, price: 11.99 },
          { title: "CASTROL Edge 5W-30 LL Engine Oil 5L", qty: 1, price: 16.50 }
        ],
        shippingAddress: "14 High Street, Richmond, London TW9 1ED"
      }
    ]
  };

  // Local Storage Sync
  function loadSavedState() {
    try {
      let garage = localStorage.getItem('apex_garage');
      if (garage) AppState.savedGarage = JSON.parse(garage);
      let active = localStorage.getItem('apex_active_vehicle');
      if (active) AppState.activeVehicle = JSON.parse(active);
      let cart = localStorage.getItem('apex_cart');
      if (cart) AppState.cart = JSON.parse(cart);
      let wishlist = localStorage.getItem('apex_wishlist');
      if (wishlist) AppState.wishlist = JSON.parse(wishlist);
    } catch(e) {
      console.error("Error loading localStorage state:", e);
    }
  }

  function saveState() {
    try {
      localStorage.setItem('apex_garage', JSON.stringify(AppState.savedGarage));
      localStorage.setItem('apex_active_vehicle', JSON.stringify(AppState.activeVehicle));
      localStorage.setItem('apex_cart', JSON.stringify(AppState.cart));
      localStorage.setItem('apex_wishlist', JSON.stringify(AppState.wishlist));
    } catch(e) {
      console.error("Error saving state to localStorage:", e);
    }
  }

  // Toast notification helper
  function showToast(message, type) {
    type = type || 'success';
    let container = document.getElementById('toast-container');
    if (!container) return;
    let toast = document.createElement('div');
    toast.className = `animate-slide-in pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border text-sm font-medium ${
      type === 'success' ? 'bg-slate-900 border-emerald-500 text-emerald-400' :
      type === 'error' ? 'bg-slate-900 border-rose-500 text-rose-400' :
      'bg-slate-900 border-amber-500 text-amber-400'
    }`;
    let iconClass = type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-circle-xmark' : 'fa-circle-info';
    toast.innerHTML = `<i class="fa-solid ${iconClass} text-lg"></i> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('opacity-0', 'transition-opacity');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // Initialize Default State
  loadSavedState();

  // Router Engine
  function navigateTo(route, params) {
    AppState.currentRoute = route;
    if (params) {
      if (params.productId) {
        AppState.currentProduct = window.CatalogEngine.getProductByIdOrSku(params.productId);
      }
      if (params.filters) {
        Object.assign(AppState.filters, params.filters);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    renderApp();
  }

  // Main UI Renderer
  function renderApp() {
    let app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
      ${renderTopAnnouncementBar()}
      ${renderHeader()}
      ${renderNavigationMenu()}
      ${renderActiveVehicleBar()}
      <main class="min-h-screen">
        ${renderCurrentRoute()}
      </main>
      ${renderFooter()}
      ${renderMobileBottomBar()}
      ${renderCartDrawerModal()}
      ${renderGarageModal()}
    `;

    attachGlobalEvents();
  }

  // Announcement Bar
  function renderTopAnnouncementBar() {
    return `
      <div class="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 font-bold text-xs py-2 px-4 text-center tracking-wide flex justify-center items-center gap-4 border-b border-amber-400/30">
        <span><i class="fa-solid fa-truck-fast mr-1"></i> FREE UK Next Day Delivery on orders over £50</span>
        <span class="hidden md:inline">•</span>
        <span class="hidden md:inline"><i class="fa-solid fa-clock mr-1"></i> Order before 2:00 PM for Same-Day Dispatch</span>
        <span class="hidden lg:inline">•</span>
        <span class="hidden lg:inline"><i class="fa-solid fa-shield-halved mr-1"></i> 100% Guaranteed Fitment Guarantee</span>
      </div>
    `;
  }

  // Header Component
  function renderHeader() {
    let cartCount = AppState.cart.reduce((acc, item) => acc + item.qty, 0);
    let cartTotal = AppState.cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    let wishlistCount = AppState.wishlist.length;
    let activeVehName = AppState.activeVehicle ? `${AppState.activeVehicle.make} ${AppState.activeVehicle.model}` : "Select Vehicle";

    return `
      <header class="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
        <!-- Top Contact Info -->
        <div class="hidden md:block bg-slate-900/60 border-b border-slate-800/80 py-1.5 px-6 text-xs text-slate-400">
          <div class="max-w-7xl mx-auto flex justify-between items-center">
            <div class="flex items-center gap-6">
              <span><i class="fa-solid fa-phone text-amber-500 mr-1.5"></i> +44 800 892 4000</span>
              <span><i class="fa-solid fa-envelope text-amber-500 mr-1.5"></i> support@apexautoparts.co.uk</span>
              <span><i class="fa-solid fa-location-dot text-amber-500 mr-1.5"></i> London & Nationwide UK Warehouses</span>
            </div>
            <div class="flex items-center gap-4">
              <a href="#" onclick="window.ApexApp.navigateTo('account'); return false;" class="hover:text-amber-400 transition-colors"><i class="fa-solid fa-truck-ramp-box mr-1"></i> Track Order</a>
              <a href="#" onclick="window.ApexApp.navigateTo('account'); return false;" class="hover:text-amber-400 transition-colors"><i class="fa-solid fa-user mr-1"></i> My Account</a>
              <a href="#" onclick="window.ApexApp.navigateTo('admin'); return false;" class="text-amber-400 font-semibold hover:underline"><i class="fa-solid fa-screwdriver-wrench mr-1"></i> Admin Panel</a>
            </div>
          </div>
        </div>

        <!-- Main Header -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <!-- Logo -->
          <a href="#" onclick="window.ApexApp.navigateTo('home'); return false;" class="flex items-center gap-3 shrink-0 group">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <i class="fa-solid fa-car-burst"></i>
            </div>
            <div>
              <span class="font-black text-xl sm:text-2xl tracking-tight text-white font-heading">APEX <span class="text-amber-500">AUTOPARTS</span></span>
              <span class="block text-[10px] uppercase tracking-widest text-slate-400 font-bold -mt-1">UK Spare Parts Specialist</span>
            </div>
          </a>

          <!-- Intelligent Search Bar -->
          <div class="relative flex-1 max-w-2xl hidden md:block">
            <div class="relative">
              <input type="text" 
                     id="header-search-input"
                     placeholder="Search by part name, part number, OEM code or vehicle..." 
                     value="${AppState.filters.search || ''}"
                     oninput="window.ApexApp.handleSearchInput(this.value)"
                     onkeydown="if(event.key==='Enter') window.ApexApp.triggerSearch()"
                     class="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-11 pr-24 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-inner">
              <i class="fa-solid fa-magnifying-glass absolute left-4 top-3.5 text-slate-400"></i>
              <button onclick="window.ApexApp.triggerSearch()" class="absolute right-1.5 top-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-1.5 rounded-lg text-xs transition-colors">
                Search
              </button>
            </div>
            <!-- Live Autocomplete Suggestions Box -->
            <div id="search-suggestions-box" class="hidden absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50"></div>
          </div>

          <!-- Header Actions -->
          <div class="flex items-center gap-3 sm:gap-4">
            <!-- Active Garage Pill -->
            <button onclick="window.ApexApp.openGarageModal()" class="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border ${AppState.activeVehicle ? 'border-emerald-500/80 text-emerald-400' : 'border-slate-700 text-slate-300'} px-3.5 py-2 rounded-xl text-xs font-semibold transition-all">
              <i class="fa-solid fa-garage-open ${AppState.activeVehicle ? 'text-emerald-400' : 'text-amber-500'} text-base"></i>
              <div class="text-left hidden sm:block">
                <span class="block text-[10px] uppercase text-slate-400 font-medium">My Garage</span>
                <span class="truncate max-w-[120px] block font-bold">${activeVehName}</span>
              </div>
              <i class="fa-solid fa-chevron-down text-[10px] text-slate-400"></i>
            </button>

            <!-- Wishlist Button -->
            <button onclick="window.ApexApp.navigateTo('account', { tab: 'wishlist' })" class="relative p-2.5 text-slate-300 hover:text-amber-400 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition-colors">
              <i class="fa-regular fa-heart text-lg"></i>
              ${wishlistCount > 0 ? `<span class="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md">${wishlistCount}</span>` : ''}
            </button>

            <!-- Shopping Cart Button -->
            <button onclick="window.ApexApp.toggleCartDrawer()" class="flex items-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all">
              <div class="relative">
                <i class="fa-solid fa-basket-shopping text-base"></i>
                ${cartCount > 0 ? `<span class="absolute -top-2 -right-2 bg-slate-950 text-amber-400 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-amber-400">${cartCount}</span>` : ''}
              </div>
              <div class="text-left hidden sm:block">
                <span class="block text-[10px] font-extrabold uppercase text-slate-900 opacity-80">Cart</span>
                <span>£${cartTotal.toFixed(2)}</span>
              </div>
            </button>
          </div>
        </div>
      </header>
    `;
  }

  // Navigation Menu
  function renderNavigationMenu() {
    let routes = [
      { id: 'home', label: 'Home', icon: 'fa-house' },
      { id: 'shop', label: 'Car Parts Catalogue', icon: 'fa-table-cells' },
      { id: 'categories', label: 'Categories', icon: 'fa-layer-group' },
      { id: 'brands', label: 'Brands', icon: 'fa-award' },
      { id: 'deals', label: 'Special Offers', icon: 'fa-tag', badge: 'DEALS' },
      { id: 'about', label: 'About Us', icon: 'fa-building' },
      { id: 'contact', label: 'Contact', icon: 'fa-headset' }
    ];

    return `
      <nav class="bg-slate-900 border-b border-slate-800 hidden md:block">
        <div class="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div class="flex items-center gap-1">
            ${routes.map(r => `
              <a href="#" 
                 onclick="window.ApexApp.navigateTo('${r.id}'); return false;" 
                 class="px-4 py-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
                   AppState.currentRoute === r.id 
                   ? 'border-amber-500 text-amber-400 bg-slate-800/50' 
                   : 'border-transparent text-slate-300 hover:text-white hover:bg-slate-800/30'
                 }">
                <i class="fa-solid ${r.icon} ${AppState.currentRoute === r.id ? 'text-amber-500' : 'text-slate-400'}"></i>
                <span>${r.label}</span>
                ${r.badge ? `<span class="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md animate-pulse">${r.badge}</span>` : ''}
              </a>
            `).join('')}
          </div>

          <!-- Prominent Vehicle Finder CTA Button -->
          <button onclick="window.ApexApp.openGarageModal()" class="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/40 px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all">
            <i class="fa-solid fa-car text-sm"></i>
            <span>Vehicle Compatibility Check</span>
          </button>
        </div>
      </nav>
    `;
  }

  // Active Vehicle Notification Bar
  function renderActiveVehicleBar() {
    if (!AppState.activeVehicle) return '';
    let v = AppState.activeVehicle;
    return `
      <div class="bg-emerald-950/80 border-b border-emerald-500/30 text-emerald-300 py-2 px-4 text-xs font-medium">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-circle-check text-emerald-400 text-sm"></i>
            <span>Active Vehicle: <strong class="text-white">${v.vrm ? v.vrm + ' - ' : ''}${v.make} ${v.model} ${v.year || ''} (${v.engine || ''})</strong> — Product catalogue is filtered for guaranteed compatibility.</span>
          </div>
          <button onclick="window.ApexApp.clearActiveVehicle()" class="text-emerald-400 hover:text-white underline text-[11px]">
            Clear Filter
          </button>
        </div>
      </div>
    `;
  }

  // Route Dispatcher
  function renderCurrentRoute() {
    switch (AppState.currentRoute) {
      case 'home': return renderHomePage();
      case 'shop': return renderShopPage();
      case 'pdp': return renderProductDetailPage();
      case 'cart': return renderCartPage();
      case 'checkout': return renderCheckoutPage();
      case 'account': return renderAccountPage();
      case 'brands': return renderBrandsPage();
      case 'deals': return renderDealsPage();
      case 'about': return renderAboutPage();
      case 'contact': return renderContactPage();
      case 'admin': return renderAdminDashboard();
      default: return renderHomePage();
    }
  }

  // =========================================================================
  // 1. HOME PAGE
  // =========================================================================
  function renderHomePage() {
    let categories = window.CatalogEngine.getCategories();
    let deals = window.CatalogEngine.query({ dealsOnly: true, limit: 4 }).products;
    let bestSellers = window.CatalogEngine.query({ bestSellersOnly: true, limit: 8 }).products;
    let brands = window.CatalogEngine.getBrands();

    return `
      <!-- HERO SECTION -->
      <section class="relative min-h-[520px] bg-slate-950 flex items-center overflow-hidden border-b border-slate-800">
        <!-- Hero Background Image -->
        <div class="absolute inset-0 z-0">
          <img src="./images/apex_hero_banner.jpg" alt="APEX Automotive Performance Workshop" class="w-full h-full object-cover opacity-35 filter brightness-90">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent"></div>
          <div class="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
        </div>

        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <!-- Left Text Content -->
          <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div class="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-full text-amber-400 text-xs font-bold">
              <i class="fa-solid fa-award"></i> UK's #1 Car Spare Parts & Accessories Store
            </div>
            
            <h1 class="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight font-heading">
              Quality Car Parts.<br>
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">The Right Fit.</span> Delivered to Your Door.
            </h1>

            <p class="text-slate-300 text-base sm:text-lg max-w-2xl font-light">
              Shop thousands of genuine and OEM car parts, accessories and essentials for your vehicle with guaranteed fitment and next-day UK delivery.
            </p>

            <div class="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button onclick="window.ApexApp.navigateTo('shop')" class="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-8 py-3.5 rounded-xl font-black text-sm shadow-xl shadow-amber-500/25 flex items-center gap-3 transition-all transform hover:-translate-y-0.5 btn-glow">
                <i class="fa-solid fa-basket-shopping text-base"></i>
                <span>Shop Car Parts</span>
              </button>

              <button onclick="window.ApexApp.openGarageModal()" class="bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 hover:border-slate-600 px-6 py-3.5 rounded-xl font-bold text-sm flex items-center gap-3 transition-all">
                <i class="fa-solid fa-car text-amber-500"></i>
                <span>Find Parts for My Vehicle</span>
              </button>
            </div>

            <!-- Key Trust Badges -->
            <div class="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-xl mx-auto lg:mx-0">
              <div class="flex items-center gap-3">
                <i class="fa-solid fa-truck-fast text-amber-500 text-xl"></i>
                <div class="text-left">
                  <span class="block text-xs font-bold text-white">Next Day UK</span>
                  <span class="block text-[10px] text-slate-400">DPD & Royal Mail</span>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <i class="fa-solid fa-shield-check text-emerald-400 text-xl"></i>
                <div class="text-left">
                  <span class="block text-xs font-bold text-white">100% Fitment</span>
                  <span class="block text-[10px] text-slate-400">Guaranteed Match</span>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <i class="fa-solid fa-rotate-left text-amber-500 text-xl"></i>
                <div class="text-left">
                  <span class="block text-xs font-bold text-white">30-Day Returns</span>
                  <span class="block text-[10px] text-slate-400">Hassle-Free Policy</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Floating Vehicle Finder Card -->
          <div class="lg:col-span-5">
            <div class="glass-panel p-6 sm:p-7 rounded-2xl shadow-2xl border border-slate-700/80">
              <div class="flex items-center justify-between mb-5 pb-4 border-b border-slate-800">
                <h3 class="text-lg font-black text-white font-heading flex items-center gap-2.5">
                  <i class="fa-solid fa-magnifying-glass-location text-amber-500"></i>
                  <span>Find Parts for Your Vehicle</span>
                </h3>
                <span class="text-[11px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-bold">DVLA Verified</span>
              </div>

              <!-- Finder Mode Tabs -->
              <div class="grid grid-cols-2 gap-2 mb-5 p-1 bg-slate-900 rounded-xl border border-slate-800">
                <button id="tab-vrm-btn" onclick="window.ApexApp.switchFinderTab('vrm')" class="py-2 text-xs font-bold rounded-lg transition-all bg-amber-500 text-slate-950 shadow">
                  <i class="fa-solid fa-rectangle-list mr-1"></i> UK Reg Lookup
                </button>
                <button id="tab-select-btn" onclick="window.ApexApp.switchFinderTab('select')" class="py-2 text-xs font-bold text-slate-400 hover:text-white rounded-lg transition-all">
                  <i class="fa-solid fa-list-check mr-1"></i> Make & Model
                </button>
              </div>

              <!-- Tab 1: UK Registration Form -->
              <div id="finder-vrm-form" class="space-y-4">
                <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider">Enter UK Registration Number</label>
                
                <div class="flex rounded-xl overflow-hidden shadow-lg">
                  <div class="uk-plate-badge text-center py-2 px-3">
                    <span class="text-[9px] font-black">GB</span>
                    <i class="fa-solid fa-euro-sign text-[8px] opacity-40"></i>
                  </div>
                  <input type="text" 
                         id="hero-vrm-input" 
                         placeholder="AB12 CDE"
                         maxlength="8"
                         onkeydown="if(event.key==='Enter') window.ApexApp.handleVRMSearch()"
                         class="uk-plate-input flex-1 py-3 px-4 text-center text-xl sm:text-2xl tracking-widest uppercase focus:outline-none">
                </div>

                <div class="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Try: <button onclick="document.getElementById('hero-vrm-input').value='AB12 CDE'; window.ApexApp.handleVRMSearch();" class="text-amber-400 underline font-bold">AB12 CDE</button> (BMW) or <button onclick="document.getElementById('hero-vrm-input').value='DV70 XKZ'; window.ApexApp.handleVRMSearch();" class="text-amber-400 underline font-bold">DV70 XKZ</button> (Ford)</span>
                </div>

                <button onclick="window.ApexApp.handleVRMSearch()" class="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-3 rounded-xl text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all">
                  <i class="fa-solid fa-car-side text-base"></i>
                  <span>Find Parts For My Car</span>
                </button>
              </div>

              <!-- Tab 2: Make / Model Dropdowns Form -->
              <div id="finder-select-form" class="hidden space-y-3.5">
                <div>
                  <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Make</label>
                  <select id="hero-make-select" onchange="window.ApexApp.onHeroMakeChange(this.value)" class="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-xl p-2.5 focus:outline-none focus:border-amber-500">
                    <option value="">Select Make...</option>
                    ${window.CatalogEngine.getVehicles().map(v => `<option value="${v.make}">${v.make}</option>`).join('')}
                  </select>
                </div>

                <div>
                  <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Model</label>
                  <select id="hero-model-select" class="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-xl p-2.5 focus:outline-none focus:border-amber-500">
                    <option value="">Select Model...</option>
                  </select>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Year</label>
                    <select id="hero-year-select" class="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-xl p-2.5 focus:outline-none focus:border-amber-500">
                      <option value="">Year...</option>
                      ${Array.from({length: 15}, (_, i) => 2024 - i).map(y => `<option value="${y}">${y}</option>`).join('')}
                    </select>
                  </div>
                  <div>
                    <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Fuel / Engine</label>
                    <select id="hero-engine-select" class="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-xl p-2.5 focus:outline-none focus:border-amber-500">
                      <option value="">Engine...</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Petrol">Petrol</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>

                <button onclick="window.ApexApp.handleMakeModelSearch()" class="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-3 rounded-xl text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all mt-2">
                  <i class="fa-solid fa-magnifying-glass"></i>
                  <span>Filter Catalogue</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SHOP BY CATEGORY SECTION -->
      <section class="py-14 bg-slate-950 border-b border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6">
          <div class="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 pb-4 border-b border-slate-800/80 gap-4">
            <div>
              <span class="text-amber-500 text-xs font-bold uppercase tracking-widest">Explore By System</span>
              <h2 class="text-2xl sm:text-3xl font-extrabold text-white font-heading mt-1">Shop Parts By Category</h2>
            </div>
            <a href="#" onclick="window.ApexApp.navigateTo('shop'); return false;" class="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1">
              View All Categories <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            ${categories.map(cat => `
              <div onclick="window.ApexApp.navigateTo('shop', { filters: { category: '${cat.id}' } })" 
                   class="group relative bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl p-5 cursor-pointer transition-all duration-300 overflow-hidden shadow-lg hover:-translate-y-1">
                <div class="relative z-10 space-y-3">
                  <div class="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 text-xl group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                    <i class="fa-solid ${cat.icon}"></i>
                  </div>
                  <div>
                    <h3 class="font-bold text-white text-base group-hover:text-amber-400 transition-colors font-heading">${cat.name}</h3>
                    <p class="text-xs text-slate-400 mt-1 line-clamp-1">${cat.subcategories.slice(0, 3).join(', ')}...</p>
                  </div>
                  <span class="inline-flex items-center text-[11px] font-bold text-amber-500 group-hover:translate-x-1 transition-transform">
                    Browse Parts <i class="fa-solid fa-chevron-right ml-1 text-[9px]"></i>
                  </span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- FEATURED DEALS & OFFERS -->
      <section class="py-14 bg-slate-900/60 border-b border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6">
          <div class="flex items-center justify-between mb-8">
            <div>
              <span class="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold px-2.5 py-1 rounded-md uppercase">Hot Clearance</span>
              <h2 class="text-2xl sm:text-3xl font-extrabold text-white font-heading mt-2">Today's Featured Deals</h2>
            </div>
            <a href="#" onclick="window.ApexApp.navigateTo('deals'); return false;" class="text-xs font-bold text-amber-400 hover:underline">
              View All Offers & Save
            </a>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            ${deals.map(p => renderProductCard(p)).join('')}
          </div>
        </div>
      </section>

      <!-- BEST SELLING PRODUCTS GRID -->
      <section class="py-14 bg-slate-950 border-b border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6">
          <div class="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 pb-4 border-b border-slate-800 gap-4">
            <div>
              <span class="text-amber-500 text-xs font-bold uppercase tracking-widest">Popular In UK Warehouses</span>
              <h2 class="text-2xl sm:text-3xl font-extrabold text-white font-heading mt-1">Best Selling Car Spares</h2>
            </div>
            <a href="#" onclick="window.ApexApp.navigateTo('shop'); return false;" class="text-xs font-bold text-amber-400 hover:underline">
              View Full 10,000+ Catalogue <i class="fa-solid fa-chevron-right text-[10px]"></i>
            </a>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            ${bestSellers.map(p => renderProductCard(p)).join('')}
          </div>
        </div>
      </section>

      <!-- FEATURED AUTOMOTIVE BRANDS DIRECTORY -->
      <section class="py-14 bg-slate-900/40 border-b border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6">
          <div class="text-center max-w-2xl mx-auto mb-10">
            <span class="text-amber-500 text-xs font-bold uppercase tracking-widest">Original Equipment Manufacturers</span>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-white font-heading mt-1">Trusted World-Class Brands</h2>
            <p class="text-slate-400 text-xs sm:text-sm mt-2">We stock 100% genuine and high-grade aftermarket spare parts directly from certified European & Global tier-1 suppliers.</p>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            ${brands.map(b => `
              <div onclick="window.ApexApp.navigateTo('shop', { filters: { brand: '${b.name}' } })" 
                   class="bg-slate-900 border border-slate-800 hover:border-amber-500/60 p-4 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-slate-800/80 group">
                <span class="font-extrabold text-base text-slate-200 group-hover:text-amber-400 tracking-wider">${b.logo}</span>
                <span class="text-[10px] text-slate-400 font-medium mt-1">${b.tier}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- WHY CHOOSE APEX AUTO PARTS -->
      <section class="py-16 bg-slate-950">
        <div class="max-w-7xl mx-auto px-4 sm:px-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div class="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
              <div class="w-12 h-12 mx-auto rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 text-xl mb-4">
                <i class="fa-solid fa-truck-fast"></i>
              </div>
              <h4 class="font-extrabold text-white text-base mb-2 font-heading">Fast UK Nationwide Shipping</h4>
              <p class="text-slate-400 text-xs">Tracked next-day DPD & Royal Mail delivery service across England, Scotland, Wales & Northern Ireland.</p>
            </div>

            <div class="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
              <div class="w-12 h-12 mx-auto rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 text-xl mb-4">
                <i class="fa-solid fa-shield-check"></i>
              </div>
              <h4 class="font-extrabold text-white text-base mb-2 font-heading">Exact Fitment Guarantee</h4>
              <p class="text-slate-400 text-xs">Enter your registration number or vehicle specs to get guaranteed 100% compatible spare parts.</p>
            </div>

            <div class="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
              <div class="w-12 h-12 mx-auto rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 text-xl mb-4">
                <i class="fa-solid fa-box-archive"></i>
              </div>
              <h4 class="font-extrabold text-white text-base mb-2 font-heading">10,000+ Parts Catalog</h4>
              <p class="text-slate-400 text-xs">Massive inventory of genuine OEM and premium aftermarket brakes, filters, ignition, electricals and accessories.</p>
            </div>

            <div class="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
              <div class="w-12 h-12 mx-auto rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 text-xl mb-4">
                <i class="fa-solid fa-headset"></i>
              </div>
              <h4 class="font-extrabold text-white text-base mb-2 font-heading">UK Automotive Support</h4>
              <p class="text-slate-400 text-xs">Our team of experienced automotive parts specialists are available via phone and chat to verify your fitment.</p>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // Helper Product Card Component
  function renderProductCard(p) {
    let isWishlisted = AppState.wishlist.some(w => w.id === p.id);
    let fitStatus = AppState.activeVehicle ? window.CatalogEngine.checkCompatibility(p.id, AppState.activeVehicle) : null;

    return `
      <div class="product-card bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group shadow-lg">
        <!-- Top Badges -->
        <div class="flex items-start justify-between gap-2 mb-3">
          <span class="bg-slate-800 text-amber-400 border border-slate-700 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
            ${p.brand}
          </span>

          <button onclick="window.ApexApp.toggleWishlist(${p.id}); event.stopPropagation();" 
                  class="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors">
            <i class="fa-${isWishlisted ? 'solid text-rose-500' : 'regular'} fa-heart text-sm"></i>
          </button>
        </div>

        <!-- Product Image -->
        <div onclick="window.ApexApp.navigateTo('pdp', { productId: ${p.id} })" class="cursor-pointer mb-4 aspect-square rounded-xl bg-slate-950 p-2 overflow-hidden flex items-center justify-center relative group">
          <img src="${p.image}" alt="${p.title}" class="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300">
          ${p.wasPrice ? `<span class="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow">SAVE £${(p.wasPrice - p.price).toFixed(2)}</span>` : ''}
        </div>

        <!-- Compatibility Status Badge -->
        ${fitStatus ? `
          <div class="mb-3 px-2.5 py-1 rounded text-[10px] font-bold ${fitStatus.status === 'compatible' ? 'badge-fit-guaranteed' : 'badge-incompatible'} flex items-center gap-1.5 truncate">
            <span>${fitStatus.message}</span>
          </div>
        ` : ''}

        <!-- Product Details -->
        <div onclick="window.ApexApp.navigateTo('pdp', { productId: ${p.id} })" class="cursor-pointer space-y-1.5 flex-1 mb-4">
          <div class="text-[10px] text-slate-400 flex items-center gap-2">
            <span>Part: <strong class="text-slate-300 font-mono">${p.partNumber}</strong></span>
            <span>•</span>
            <span>OEM: <strong class="text-slate-300 font-mono">${p.oemNumber.substring(0,6)}...</strong></span>
          </div>

          <h3 class="font-extrabold text-white text-sm line-clamp-2 group-hover:text-amber-400 transition-colors font-heading leading-snug">
            ${p.title}
          </h3>

          <div class="flex items-center gap-1 text-amber-400 text-xs">
            <i class="fa-solid fa-star"></i>
            <span class="font-bold text-slate-200">${p.rating}</span>
            <span class="text-slate-400 text-[10px]">(${p.reviewCount})</span>
          </div>
        </div>

        <!-- Price & Add to Cart Action -->
        <div class="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
          <div>
            <div class="flex items-baseline gap-1.5">
              <span class="font-black text-lg text-white font-heading">£${p.price.toFixed(2)}</span>
              ${p.wasPrice ? `<span class="text-xs text-slate-400 line-through">£${p.wasPrice.toFixed(2)}</span>` : ''}
            </div>
            <span class="block text-[9px] text-slate-400">Inc 20% VAT</span>
          </div>

          <button onclick="window.ApexApp.addToCart(${p.id}); event.stopPropagation();" 
                  class="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow transition-all hover:scale-105">
            <i class="fa-solid fa-cart-plus"></i>
            <span>Add</span>
          </button>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // 2. SHOP PAGE (PRODUCT LISTING & FILTERS)
  // =========================================================================
  function renderShopPage() {
    let result = window.CatalogEngine.query(AppState.filters);
    let products = result.products;
    let categories = window.CatalogEngine.getCategories();
    let brands = window.CatalogEngine.getBrands();
    let vehicles = window.CatalogEngine.getVehicles();

    return `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <!-- Breadcrumb & Header -->
        <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div class="text-xs text-slate-400 flex items-center gap-2 mb-1">
              <a href="#" onclick="window.ApexApp.navigateTo('home'); return false;" class="hover:text-amber-400">Home</a>
              <span>/</span>
              <span class="text-slate-200 font-semibold">Car Parts Catalogue</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              Automotive Parts & Accessories <span class="text-amber-500 text-lg font-normal">(${result.totalResults.toLocaleString()} items)</span>
            </h1>
          </div>

          <!-- Active Vehicle Summary Banner inside Shop -->
          ${AppState.activeVehicle ? `
            <div class="bg-emerald-950/60 border border-emerald-500/40 px-3.5 py-2 rounded-xl flex items-center gap-3 text-xs text-emerald-300">
              <i class="fa-solid fa-car-side text-emerald-400 text-lg"></i>
              <div>
                <span class="block font-bold text-white">Filtered for: ${AppState.activeVehicle.make} ${AppState.activeVehicle.model} (${AppState.activeVehicle.year || ''})</span>
                <span class="text-[10px]">Showing only compatible spare parts</span>
              </div>
              <button onclick="window.ApexApp.clearActiveVehicle()" class="ml-2 text-rose-400 hover:text-rose-300 text-[10px] font-bold underline">Change</button>
            </div>
          ` : ''}
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <!-- Sidebar Filters -->
          <aside class="lg:col-span-3 space-y-6">
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-6 sticky top-24">
              <div class="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 class="font-extrabold text-white text-base font-heading flex items-center gap-2">
                  <i class="fa-solid fa-sliders text-amber-500"></i> Filters
                </h3>
                <button onclick="window.ApexApp.resetFilters()" class="text-xs text-amber-400 hover:underline">Reset All</button>
              </div>

              <!-- Vehicle Filter -->
              <div>
                <label class="block text-xs font-bold text-slate-300 uppercase mb-2">Filter By Vehicle Make</label>
                <select onchange="window.ApexApp.updateFilter('make', this.value)" class="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5">
                  <option value="all">All Makes</option>
                  ${vehicles.map(v => `<option value="${v.make}" ${AppState.filters.make === v.make ? 'selected' : ''}>${v.make}</option>`).join('')}
                </select>
              </div>

              <!-- Category Filter -->
              <div>
                <label class="block text-xs font-bold text-slate-300 uppercase mb-2">Category</label>
                <select onchange="window.ApexApp.updateFilter('category', this.value)" class="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5">
                  <option value="all">All Categories</option>
                  ${categories.map(c => `<option value="${c.id}" ${AppState.filters.category === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
                </select>
              </div>

              <!-- Brand Filter -->
              <div>
                <label class="block text-xs font-bold text-slate-300 uppercase mb-2">Brand</label>
                <select onchange="window.ApexApp.updateFilter('brand', this.value)" class="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5">
                  <option value="all">All Brands</option>
                  ${brands.map(b => `<option value="${b.name}" ${AppState.filters.brand === b.name ? 'selected' : ''}>${b.name}</option>`).join('')}
                </select>
              </div>

              <!-- Stock Availability Checkbox -->
              <div class="pt-2 border-t border-slate-800 space-y-2">
                <label class="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                  <input type="checkbox" ${AppState.filters.inStock ? 'checked' : ''} onchange="window.ApexApp.updateFilter('inStock', this.checked)" class="rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-amber-500">
                  <span>In Stock Only</span>
                </label>
                <label class="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                  <input type="checkbox" ${AppState.filters.dealsOnly ? 'checked' : ''} onchange="window.ApexApp.updateFilter('dealsOnly', this.checked)" class="rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-amber-500">
                  <span>Special Offers & Deals Only</span>
                </label>
              </div>
            </div>
          </aside>

          <!-- Main Product Grid & Controls -->
          <main class="lg:col-span-9 space-y-6">
            <!-- Top Grid Sort Controls -->
            <div class="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-4">
              <div class="text-xs text-slate-400">
                Showing <strong class="text-white">${((result.page - 1) * result.limit) + 1}</strong> to <strong class="text-white">${Math.min(result.page * result.limit, result.totalResults)}</strong> of <strong class="text-amber-500">${result.totalResults}</strong> parts
              </div>

              <div class="flex items-center gap-3 text-xs">
                <label class="text-slate-400 font-medium">Sort By:</label>
                <select onchange="window.ApexApp.updateFilter('sortBy', this.value)" class="bg-slate-950 border border-slate-700 text-slate-200 rounded-lg py-1.5 px-3 focus:outline-none focus:border-amber-500">
                  <option value="recommended" ${AppState.filters.sortBy === 'recommended' ? 'selected' : ''}>Recommended</option>
                  <option value="price_asc" ${AppState.filters.sortBy === 'price_asc' ? 'selected' : ''}>Price: Low to High</option>
                  <option value="price_desc" ${AppState.filters.sortBy === 'price_desc' ? 'selected' : ''}>Price: High to Low</option>
                  <option value="rating" ${AppState.filters.sortBy === 'rating' ? 'selected' : ''}>Highest Rated</option>
                  <option value="best_selling" ${AppState.filters.sortBy === 'best_selling' ? 'selected' : ''}>Best Selling</option>
                </select>
              </div>
            </div>

            <!-- Product Cards Grid -->
            ${products.length > 0 ? `
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                ${products.map(p => renderProductCard(p)).join('')}
              </div>

              <!-- Pagination Controls -->
              <div class="pt-8 flex items-center justify-center gap-2">
                <button onclick="window.ApexApp.updateFilter('page', ${result.page - 1})" ${result.page <= 1 ? 'disabled' : ''} class="px-4 py-2 bg-slate-900 border border-slate-800 disabled:opacity-40 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800">
                  <i class="fa-solid fa-chevron-left mr-1"></i> Previous
                </button>
                
                <span class="px-4 py-2 text-xs font-bold text-amber-400 bg-slate-900 border border-slate-800 rounded-xl">
                  Page ${result.page} of ${result.totalPages}
                </span>

                <button onclick="window.ApexApp.updateFilter('page', ${result.page + 1})" ${result.page >= result.totalPages ? 'disabled' : ''} class="px-4 py-2 bg-slate-900 border border-slate-800 disabled:opacity-40 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800">
                  Next <i class="fa-solid fa-chevron-right ml-1"></i>
                </button>
              </div>
            ` : `
              <div class="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
                <i class="fa-solid fa-car-burst text-4xl text-amber-500/50"></i>
                <h3 class="text-xl font-bold text-white font-heading">No matching spare parts found</h3>
                <p class="text-slate-400 text-xs max-w-md mx-auto">Try clearing your filters, adjusting your search term, or selecting a different vehicle.</p>
                <button onclick="window.ApexApp.resetFilters()" class="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs">Reset All Filters</button>
              </div>
            `}
          </main>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // 3. PRODUCT DETAIL PAGE (PDP)
  // =========================================================================
  function renderProductDetailPage() {
    let p = AppState.currentProduct || window.CatalogEngine.query({ limit: 1 }).products[0];
    let isWishlisted = AppState.wishlist.some(w => w.id === p.id);
    let fitStatus = AppState.activeVehicle ? window.CatalogEngine.checkCompatibility(p.id, AppState.activeVehicle) : null;

    return `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <!-- Breadcrumb -->
        <div class="text-xs text-slate-400 flex items-center gap-2 mb-6">
          <a href="#" onclick="window.ApexApp.navigateTo('home'); return false;" class="hover:text-amber-400">Home</a>
          <span>/</span>
          <a href="#" onclick="window.ApexApp.navigateTo('shop', { filters: { category: '${p.category}' } }); return false;" class="hover:text-amber-400">${p.categoryName}</a>
          <span>/</span>
          <span class="text-slate-200 font-semibold truncate max-w-xs">${p.title}</span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl mb-12">
          <!-- Left Gallery -->
          <div class="lg:col-span-6 space-y-4">
            <div class="zoom-container aspect-square rounded-2xl bg-slate-950 p-6 border border-slate-800 flex items-center justify-center relative">
              <img id="pdp-main-image" src="${p.image}" alt="${p.title}" class="max-h-full max-w-full object-contain">
              <span class="absolute bottom-4 right-4 bg-slate-900/80 text-slate-400 text-[10px] px-2.5 py-1 rounded-lg border border-slate-800">
                <i class="fa-solid fa-magnifying-glass-plus mr-1"></i> Hover to Zoom
              </span>
            </div>
          </div>

          <!-- Right Information & Buy Panel -->
          <div class="lg:col-span-6 space-y-6">
            <!-- Brand & Title -->
            <div class="space-y-2">
              <div class="flex items-center gap-3">
                <span class="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black px-3 py-1 rounded-md uppercase tracking-wider">
                  ${p.brand} (${p.brandTier})
                </span>
                <span class="text-xs text-slate-400">SKU: <strong class="text-slate-200 font-mono">${p.sku}</strong></span>
              </div>

              <h1 class="text-2xl sm:text-3xl font-extrabold text-white font-heading leading-tight">
                ${p.title}
              </h1>

              <div class="flex items-center gap-3 text-xs">
                <div class="flex items-center text-amber-400 gap-1">
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star-half-stroke"></i>
                  <span class="font-bold text-white ml-1">${p.rating}</span>
                </div>
                <span class="text-slate-400">(${p.reviewCount} customer reviews)</span>
                <span class="text-slate-500">|</span>
                <span class="text-emerald-400 font-semibold"><i class="fa-solid fa-circle-check"></i> In Stock (${p.stockCount} units)</span>
              </div>
            </div>

            <!-- Vehicle Fitment Box -->
            <div class="p-4 rounded-xl border ${fitStatus && fitStatus.status === 'compatible' ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' : 'bg-slate-950 border-amber-500/40 text-amber-300'} space-y-2">
              <div class="flex items-center justify-between">
                <span class="font-bold text-xs flex items-center gap-2">
                  <i class="fa-solid ${fitStatus && fitStatus.status === 'compatible' ? 'fa-circle-check text-emerald-400 text-base' : 'fa-car-side text-amber-400 text-base'}"></i>
                  <span>${fitStatus ? fitStatus.message : 'Check vehicle compatibility'}</span>
                </span>
                <button onclick="window.ApexApp.openGarageModal()" class="text-[11px] bg-slate-900 px-3 py-1 rounded-lg border border-slate-700 text-white font-bold hover:border-amber-500">
                  ${AppState.activeVehicle ? 'Change Vehicle' : 'Select Vehicle'}
                </button>
              </div>
            </div>

            <!-- Price Box -->
            <div class="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div class="flex items-baseline gap-3">
                <span class="text-3xl sm:text-4xl font-black text-white font-heading">£${p.price.toFixed(2)}</span>
                ${p.wasPrice ? `<span class="text-lg text-slate-500 line-through">£${p.wasPrice.toFixed(2)}</span>` : ''}
                <span class="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded">Inc 20% UK VAT</span>
              </div>
              <span class="block text-xs text-slate-400">Excluding VAT: <strong>£${p.priceExVat.toFixed(2)}</strong></span>
            </div>

            <!-- Quantity & Actions -->
            <div class="space-y-4 pt-2">
              <div class="flex items-center gap-4">
                <div class="flex items-center bg-slate-950 border border-slate-700 rounded-xl p-1">
                  <button onclick="let q=document.getElementById('pdp-qty'); if(q.value>1) q.value--;" class="w-9 h-9 text-slate-400 hover:text-white font-bold">-</button>
                  <input type="number" id="pdp-qty" value="1" min="1" max="99" class="w-12 text-center bg-transparent text-white font-bold text-sm focus:outline-none">
                  <button onclick="let q=document.getElementById('pdp-qty'); q.value++;" class="w-9 h-9 text-slate-400 hover:text-white font-bold">+</button>
                </div>

                <button onclick="let qty = parseInt(document.getElementById('pdp-qty').value, 10); window.ApexApp.addToCart(${p.id}, qty);" 
                        class="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-3.5 px-6 rounded-xl text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all">
                  <i class="fa-solid fa-basket-shopping text-base"></i>
                  <span>ADD TO BASKET</span>
                </button>

                <button onclick="window.ApexApp.toggleWishlist(${p.id})" class="p-3.5 rounded-xl border border-slate-700 bg-slate-950 text-slate-300 hover:text-rose-500 hover:border-rose-500 transition-colors">
                  <i class="fa-${isWishlisted ? 'solid text-rose-500' : 'regular'} fa-heart text-lg"></i>
                </button>
              </div>
            </div>

            <!-- Technical Specifications Table -->
            <div class="pt-4 border-t border-slate-800 space-y-3">
              <h4 class="font-bold text-white text-sm font-heading">Key Specifications</h4>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="bg-slate-950 p-2.5 rounded-lg border border-slate-800"><span class="text-slate-400 block text-[10px]">Part Number</span><strong class="text-white font-mono">${p.partNumber}</strong></div>
                <div class="bg-slate-950 p-2.5 rounded-lg border border-slate-800"><span class="text-slate-400 block text-[10px]">OEM Reference</span><strong class="text-white font-mono">${p.oemNumber}</strong></div>
                <div class="bg-slate-950 p-2.5 rounded-lg border border-slate-800"><span class="text-slate-400 block text-[10px]">Fitting Position</span><strong class="text-white">${p.specifications["Fitting Position"] || "Axle"}</strong></div>
                <div class="bg-slate-950 p-2.5 rounded-lg border border-slate-800"><span class="text-slate-400 block text-[10px]">UK Guarantee</span><strong class="text-white">${p.specifications["Warranty"] || "24 Months"}</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // 4. CART & CHECKOUT PAGES
  // =========================================================================
  function renderCartPage() {
    let subtotal = AppState.cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    let vat = Math.round((subtotal * 0.2) * 100) / 100;
    let shipping = subtotal > 50 || AppState.cart.length === 0 ? 0 : 4.99;
    let discount = AppState.promoDiscount ? Math.round((subtotal * AppState.promoDiscount) * 100) / 100 : 0;
    let total = subtotal - discount + shipping;

    return `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 class="text-2xl sm:text-3xl font-extrabold text-white font-heading mb-6">Shopping Basket</h1>

        ${AppState.cart.length > 0 ? `
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div class="lg:col-span-8 space-y-4">
              ${AppState.cart.map(item => `
                <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div class="flex items-center gap-4 w-full sm:w-auto">
                    <img src="${item.image}" alt="${item.title}" class="w-20 h-20 object-contain bg-slate-950 p-2 rounded-xl border border-slate-800 shrink-0">
                    <div class="space-y-1">
                      <span class="text-[10px] font-bold text-amber-500 uppercase">${item.brand}</span>
                      <h4 class="font-extrabold text-white text-sm line-clamp-1 font-heading">${item.title}</h4>
                      <span class="text-xs text-slate-400 block">Part No: <strong class="text-slate-300 font-mono">${item.partNumber}</strong></span>
                    </div>
                  </div>

                  <div class="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
                    <div class="flex items-center bg-slate-950 border border-slate-700 rounded-xl">
                      <button onclick="window.ApexApp.updateCartQty(${item.id}, ${item.qty - 1})" class="px-3 py-1 text-slate-400 font-bold">-</button>
                      <span class="px-3 text-xs font-bold text-white">${item.qty}</span>
                      <button onclick="window.ApexApp.updateCartQty(${item.id}, ${item.qty + 1})" class="px-3 py-1 text-slate-400 font-bold">+</button>
                    </div>

                    <div class="text-right">
                      <span class="font-black text-white text-base font-heading">£${(item.price * item.qty).toFixed(2)}</span>
                      <span class="block text-[10px] text-slate-400">£${item.price.toFixed(2)} each</span>
                    </div>

                    <button onclick="window.ApexApp.removeFromCart(${item.id})" class="text-slate-500 hover:text-rose-500 p-2 transition-colors">
                      <i class="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>

            <div class="lg:col-span-4 space-y-6">
              <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                <h3 class="font-extrabold text-white text-lg font-heading pb-3 border-b border-slate-800">Order Summary</h3>

                <div class="space-y-2.5 text-xs text-slate-300">
                  <div class="flex justify-between"><span>Subtotal (Inc VAT)</span><strong class="text-white">£${subtotal.toFixed(2)}</strong></div>
                  <div class="flex justify-between text-slate-400"><span>Estimated 20% VAT</span><span>£${vat.toFixed(2)}</span></div>
                  <div class="flex justify-between"><span>UK Shipping</span><strong class="${shipping === 0 ? 'text-emerald-400' : 'text-white'}">${shipping === 0 ? 'FREE Next Day' : '£' + shipping.toFixed(2)}</strong></div>
                  ${discount > 0 ? `<div class="flex justify-between text-emerald-400 font-bold"><span>Promo Discount</span><span>-£${discount.toFixed(2)}</span></div>` : ''}
                  <div class="pt-3 border-t border-slate-800 flex justify-between text-base font-black text-white">
                    <span>Total</span>
                    <span class="text-amber-500 font-heading text-xl">£${total.toFixed(2)}</span>
                  </div>
                </div>

                <!-- Promo Input -->
                <div class="flex gap-2">
                  <input type="text" id="promo-code-input" placeholder="Promo code (APEX10)" class="flex-1 bg-slate-950 border border-slate-700 text-xs rounded-xl px-3 py-2 text-white uppercase focus:outline-none">
                  <button onclick="window.ApexApp.applyPromoCode()" class="bg-slate-800 hover:bg-slate-700 text-amber-400 px-3 py-2 rounded-xl text-xs font-bold">Apply</button>
                </div>

                <button onclick="window.ApexApp.navigateTo('checkout')" class="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-3.5 rounded-xl text-sm shadow-xl shadow-amber-500/20 text-center block transition-all">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        ` : `
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
            <i class="fa-solid fa-basket-shopping text-5xl text-amber-500/40"></i>
            <h3 class="text-xl font-bold text-white font-heading">Your Basket is Empty</h3>
            <button onclick="window.ApexApp.navigateTo('shop')" class="bg-amber-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs">Browse 10,000+ Car Parts</button>
          </div>
        `}
      </div>
    `;
  }

  function renderCheckoutPage() {
    let subtotal = AppState.cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    let shipping = subtotal > 50 ? 0 : 4.99;
    let total = subtotal + shipping;

    return `
      <div class="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <h1 class="text-2xl sm:text-3xl font-extrabold text-white font-heading mb-8">Secure UK Checkout</h1>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div class="lg:col-span-7 space-y-6">
            <!-- Delivery Address Form -->
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 class="font-extrabold text-white text-base font-heading flex items-center gap-2 border-b border-slate-800 pb-3">
                <i class="fa-solid fa-truck text-amber-500"></i> 1. Shipping Address (UK)
              </h3>
              
              <div class="grid grid-cols-2 gap-3">
                <div><label class="block text-[11px] text-slate-400 mb-1">First Name</label><input type="text" id="chk-fname" value="Alex" class="w-full bg-slate-950 border border-slate-700 text-xs rounded-xl p-2.5 text-white"></div>
                <div><label class="block text-[11px] text-slate-400 mb-1">Last Name</label><input type="text" id="chk-lname" value="Jackson" class="w-full bg-slate-950 border border-slate-700 text-xs rounded-xl p-2.5 text-white"></div>
              </div>

              <div><label class="block text-[11px] text-slate-400 mb-1">Street Address</label><input type="text" id="chk-address" value="14 High Street, Richmond" class="w-full bg-slate-950 border border-slate-700 text-xs rounded-xl p-2.5 text-white"></div>

              <div class="grid grid-cols-2 gap-3">
                <div><label class="block text-[11px] text-slate-400 mb-1">Town / City</label><input type="text" id="chk-city" value="London" class="w-full bg-slate-950 border border-slate-700 text-xs rounded-xl p-2.5 text-white"></div>
                <div><label class="block text-[11px] text-slate-400 mb-1">UK Postcode</label><input type="text" id="chk-postcode" value="TW9 1ED" class="w-full bg-slate-950 border border-slate-700 text-xs rounded-xl p-2.5 text-white font-mono uppercase"></div>
              </div>
            </div>

            <!-- Payment Simulation -->
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 class="font-extrabold text-white text-base font-heading flex items-center gap-2 border-b border-slate-800 pb-3">
                <i class="fa-solid fa-credit-card text-amber-500"></i> 2. Payment Details
              </h3>
              <div class="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div class="flex items-center justify-between text-xs text-slate-300">
                  <span class="font-bold"><i class="fa-brands fa-cc-stripe text-amber-400 text-lg mr-2"></i> Encrypted UK Stripe Gateway</span>
                  <span class="text-emerald-400 font-bold"><i class="fa-solid fa-lock mr-1"></i> 256-Bit SSL</span>
                </div>
                <input type="text" placeholder="Card Number (4242 •••• •••• 4242)" class="w-full bg-slate-900 border border-slate-700 text-xs rounded-xl p-2.5 text-white">
              </div>

              <button onclick="window.ApexApp.placeOrder()" class="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-4 rounded-xl text-base shadow-xl shadow-amber-500/25">
                PAY & PLACE ORDER (£${total.toFixed(2)})
              </button>
            </div>
          </div>

          <!-- Summary Sidebar -->
          <div class="lg:col-span-5">
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 class="font-extrabold text-white text-base font-heading pb-3 border-b border-slate-800">Order Summary</h3>
              <div class="space-y-3 max-h-60 overflow-y-auto pr-1">
                ${AppState.cart.map(item => `
                  <div class="flex justify-between items-center text-xs">
                    <span class="text-slate-300 truncate max-w-[200px]">${item.qty}x ${item.title}</span>
                    <strong class="text-white font-mono">£${(item.price * item.qty).toFixed(2)}</strong>
                  </div>
                `).join('')}
              </div>
              <div class="pt-3 border-t border-slate-800 flex justify-between text-lg font-black text-amber-500">
                <span>Total Due</span>
                <span>£${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // 5. ADMIN DASHBOARD & BULK CSV IMPORTER
  // =========================================================================
  function renderAdminDashboard() {
    let allProducts = window.CatalogEngine.getAllProducts();
    let totalRevenue = 148920.00;

    return `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-slate-800 gap-4">
          <div>
            <span class="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold px-2.5 py-1 rounded-md uppercase">Management Portal</span>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white font-heading mt-2">10,000+ Products Catalogue Admin</h1>
          </div>
          <div class="flex gap-3">
            <button onclick="window.ApexApp.exportCatalogCSV()" class="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
              <i class="fa-solid fa-file-export text-amber-400"></i> Export CSV
            </button>
            <button onclick="document.getElementById('admin-csv-file').click()" class="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2">
              <i class="fa-solid fa-file-import"></i> Bulk Import CSV
            </button>
            <input type="file" id="admin-csv-file" accept=".csv" class="hidden" onchange="window.ApexApp.handleCSVImport(this)">
          </div>
        </div>

        <!-- KPI Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <span class="text-slate-400 text-xs font-bold block">Total Catalogue Products</span>
            <span class="text-3xl font-black text-white font-heading mt-1 block">${allProducts.length.toLocaleString()}</span>
            <span class="text-[10px] text-emerald-400">Indexed & Search Ready</span>
          </div>
          <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <span class="text-slate-400 text-xs font-bold block">YTD Revenue (UK)</span>
            <span class="text-3xl font-black text-amber-500 font-heading mt-1 block">£${totalRevenue.toLocaleString('en-GB', {minimumFractionDigits:2})}</span>
            <span class="text-[10px] text-emerald-400">+18.4% growth</span>
          </div>
          <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <span class="text-slate-400 text-xs font-bold block">Active Orders</span>
            <span class="text-3xl font-black text-white font-heading mt-1 block">${AppState.orders.length}</span>
            <span class="text-[10px] text-amber-400">Processing & DPD Dispatch</span>
          </div>
          <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <span class="text-slate-400 text-xs font-bold block">Low Stock Alerts</span>
            <span class="text-3xl font-black text-rose-400 font-heading mt-1 block">14</span>
            <span class="text-[10px] text-rose-400">Requires Restock</span>
          </div>
        </div>

        <!-- Product Table -->
        <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div class="p-5 border-b border-slate-800 flex justify-between items-center">
            <h3 class="font-extrabold text-white text-base font-heading">Catalogue Inventory Management</h3>
            <span class="text-xs text-slate-400">Showing first 25 items</span>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-300">
              <thead class="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                <tr>
                  <th class="p-3.5">SKU / OEM</th>
                  <th class="p-3.5">Product Title</th>
                  <th class="p-3.5">Brand</th>
                  <th class="p-3.5">Category</th>
                  <th class="p-3.5">Price</th>
                  <th class="p-3.5">Stock</th>
                  <th class="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800">
                ${allProducts.slice(0, 25).map(p => `
                  <tr class="hover:bg-slate-800/50">
                    <td class="p-3.5 font-mono text-amber-400">${p.sku}</td>
                    <td class="p-3.5 font-bold text-white max-w-xs truncate">${p.title}</td>
                    <td class="p-3.5 font-semibold">${p.brand}</td>
                    <td class="p-3.5">${p.categoryName}</td>
                    <td class="p-3.5 font-black text-white">£${p.price.toFixed(2)}</td>
                    <td class="p-3.5"><span class="px-2 py-0.5 rounded text-[10px] font-bold ${p.inStock ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'}">${p.stockCount} in stock</span></td>
                    <td class="p-3.5 text-right space-x-2">
                      <button onclick="window.ApexApp.editAdminProduct(${p.id})" class="text-amber-400 hover:underline">Edit</button>
                      <button onclick="window.ApexApp.deleteAdminProduct(${p.id})" class="text-rose-400 hover:underline">Delete</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // Simple Page Stubs
  function renderBrandsPage() {
    let brands = window.CatalogEngine.getBrands();
    return `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h1 class="text-3xl font-black text-white font-heading mb-8 text-center">Automotive Spare Parts Manufacturers</h1>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          ${brands.map(b => `
            <div onclick="window.ApexApp.navigateTo('shop', { filters: { brand: '${b.name}' } })" class="bg-slate-900 border border-slate-800 hover:border-amber-500 p-8 rounded-2xl text-center cursor-pointer">
              <span class="text-2xl font-black text-amber-500 font-heading block mb-2">${b.logo}</span>
              <h3 class="font-bold text-white">${b.name}</h3>
              <span class="text-xs text-slate-400">${b.tier} • ${b.country}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderDealsPage() {
    let deals = window.CatalogEngine.query({ dealsOnly: true, limit: 16 }).products;
    return `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h1 class="text-3xl font-black text-white font-heading mb-8">Special Offers & Clearance</h1>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          ${deals.map(p => renderProductCard(p)).join('')}
        </div>
      </div>
    `;
  }

  function renderAboutPage() {
    return `
      <div class="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <h1 class="text-4xl font-black text-white font-heading">About APEX Auto Parts UK</h1>
        <p class="text-slate-300 text-base leading-relaxed">
          Founded in London, APEX Auto Parts is a premier UK automotive spare parts retailer operating a nationwide logistics network stocking over 10,000 genuine and OEM components.
        </p>
      </div>
    `;
  }

  function renderContactPage() {
    return `
      <div class="max-w-3xl mx-auto px-4 py-16 space-y-6">
        <h1 class="text-3xl font-black text-white font-heading">Contact UK Customer Support</h1>
        <div class="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
          <p class="text-sm text-slate-300"><i class="fa-solid fa-phone text-amber-500 mr-2"></i> Freephone UK: +44 800 892 4000</p>
          <p class="text-sm text-slate-300"><i class="fa-solid fa-envelope text-amber-500 mr-2"></i> Support Email: support@apexautoparts.co.uk</p>
          <p class="text-sm text-slate-300"><i class="fa-solid fa-clock text-amber-500 mr-2"></i> Mon-Sat: 08:00 - 18:00 GMT</p>
        </div>
      </div>
    `;
  }

  function renderAccountPage() {
    return `
      <div class="max-w-5xl mx-auto px-4 py-12 space-y-8">
        <h1 class="text-3xl font-black text-white font-heading">My Account & Garage</h1>
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 class="font-bold text-white text-lg font-heading">Saved Vehicles in Garage</h3>
          ${AppState.savedGarage.length > 0 ? `
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              ${AppState.savedGarage.map(v => `
                <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <span class="font-bold text-white block text-sm">${v.make} ${v.model} (${v.year})</span>
                    <span class="text-xs text-amber-400 font-mono">${v.vrm || 'Manual Vehicle'}</span>
                  </div>
                  <button onclick="window.ApexApp.selectActiveVehicle(${JSON.stringify(v).replace(/"/g, '&quot;')})" class="bg-amber-500 text-slate-950 px-3 py-1 rounded text-xs font-bold">Select</button>
                </div>
              `).join('')}
            </div>
          ` : '<p class="text-xs text-slate-400">No saved vehicles yet.</p>'}
        </div>
      </div>
    `;
  }

  function renderFooter() {
    return `
      <footer class="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-5 gap-8">
          <div class="col-span-2 space-y-4">
            <span class="font-black text-xl text-white font-heading">APEX <span class="text-amber-500">AUTOPARTS UK</span></span>
            <p class="text-slate-400 text-xs leading-relaxed max-w-sm">
              The UK's trusted automotive spare parts supplier. Over 10,000 genuine and OEM components with fitment guarantee and next-day DPD delivery.
            </p>
          </div>
          <div>
            <h4 class="font-bold text-white mb-3">Shop Categories</h4>
            <ul class="space-y-2">
              <li><a href="#" onclick="window.ApexApp.navigateTo('shop', { filters: { category: 'braking' } }); return false;" class="hover:text-amber-400">Braking Systems</a></li>
              <li><a href="#" onclick="window.ApexApp.navigateTo('shop', { filters: { category: 'engine' } }); return false;" class="hover:text-amber-400">Oil & Filters</a></li>
              <li><a href="#" onclick="window.ApexApp.navigateTo('shop', { filters: { category: 'suspension' } }); return false;" class="hover:text-amber-400">Suspension</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold text-white mb-3">Customer Service</h4>
            <ul class="space-y-2">
              <li><a href="#" onclick="window.ApexApp.navigateTo('account'); return false;" class="hover:text-amber-400">Track Order</a></li>
              <li><a href="#" onclick="window.ApexApp.navigateTo('contact'); return false;" class="hover:text-amber-400">Contact Us</a></li>
              <li><a href="#" onclick="window.ApexApp.navigateTo('about'); return false;" class="hover:text-amber-400">About Us</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold text-white mb-3">UK Logistics</h4>
            <p class="text-slate-400">Unit 4 Apex Logistics Park, Park Royal, London NW10 7XQ</p>
          </div>
        </div>
        <div class="max-w-7xl mx-auto px-6 mt-8 pt-6 border-t border-slate-900 text-center text-slate-500">
          © 2026 APEX Auto Parts UK Ltd. All rights reserved.
        </div>
      </footer>
    `;
  }

  function renderMobileBottomBar() {
    return `
      <div class="mobile-sticky-bottom md:hidden py-2.5 px-6 flex justify-around items-center text-slate-400 text-[10px] font-semibold">
        <button onclick="window.ApexApp.navigateTo('home')" class="flex flex-col items-center gap-1 ${AppState.currentRoute === 'home' ? 'text-amber-500' : ''}">
          <i class="fa-solid fa-house text-base"></i><span>Home</span>
        </button>
        <button onclick="window.ApexApp.navigateTo('shop')" class="flex flex-col items-center gap-1 ${AppState.currentRoute === 'shop' ? 'text-amber-500' : ''}">
          <i class="fa-solid fa-table-cells text-base"></i><span>Shop</span>
        </button>
        <button onclick="window.ApexApp.openGarageModal()" class="flex flex-col items-center gap-1 text-amber-400">
          <i class="fa-solid fa-car-side text-base"></i><span>Garage</span>
        </button>
        <button onclick="window.ApexApp.navigateTo('cart')" class="flex flex-col items-center gap-1 relative ${AppState.currentRoute === 'cart' ? 'text-amber-500' : ''}">
          <i class="fa-solid fa-basket-shopping text-base"></i><span>Cart</span>
        </button>
      </div>
    `;
  }

  function renderCartDrawerModal() { return ''; }
  function renderGarageModal() { return ''; }

  function attachGlobalEvents() {}

  // App Controller API Methods
  window.ApexApp = {
    navigateTo: navigateTo,
    showToast: showToast,

    switchFinderTab: function(tab) {
      let vrmForm = document.getElementById('finder-vrm-form');
      let selectForm = document.getElementById('finder-select-form');
      let vrmBtn = document.getElementById('tab-vrm-btn');
      let selectBtn = document.getElementById('tab-select-btn');
      if (tab === 'vrm') {
        if(vrmForm) vrmForm.classList.remove('hidden');
        if(selectForm) selectForm.classList.add('hidden');
        if(vrmBtn) { vrmBtn.className = "py-2 text-xs font-bold rounded-lg transition-all bg-amber-500 text-slate-950 shadow"; }
        if(selectBtn) { selectBtn.className = "py-2 text-xs font-bold text-slate-400 hover:text-white rounded-lg transition-all"; }
      } else {
        if(vrmForm) vrmForm.classList.add('hidden');
        if(selectForm) selectForm.classList.remove('hidden');
        if(selectBtn) { selectBtn.className = "py-2 text-xs font-bold rounded-lg transition-all bg-amber-500 text-slate-950 shadow"; }
        if(vrmBtn) { vrmBtn.className = "py-2 text-xs font-bold text-slate-400 hover:text-white rounded-lg transition-all"; }
      }
    },

    handleVRMSearch: function() {
      let input = document.getElementById('hero-vrm-input');
      if (!input || !input.value.trim()) {
        showToast("Please enter a UK registration plate", "error");
        return;
      }
      let result = window.VRMLookupEngine.lookup(input.value);
      if (result) {
        AppState.activeVehicle = result;
        // Save to garage
        if (!AppState.savedGarage.some(v => v.vrm === result.vrm)) {
          AppState.savedGarage.unshift(result);
        }
        saveState();
        showToast(`Vehicle Found: ${result.make} ${result.model} (${result.year})`, "success");
        navigateTo('shop', { filters: { make: result.make, model: result.model } });
      }
    },

    onHeroMakeChange: function(make) {
      let modelSelect = document.getElementById('hero-model-select');
      if (!modelSelect) return;
      modelSelect.innerHTML = '<option value="">Select Model...</option>';
      let vehicles = window.CatalogEngine.getVehicles();
      let found = vehicles.find(v => v.make === make);
      if (found) {
        found.models.forEach(m => {
          modelSelect.innerHTML += `<option value="${m}">${m}</option>`;
        });
      }
    },

    handleMakeModelSearch: function() {
      let make = document.getElementById('hero-make-select').value;
      let model = document.getElementById('hero-model-select').value;
      let year = document.getElementById('hero-year-select').value;
      let engine = document.getElementById('hero-engine-select').value;

      if (!make) {
        showToast("Please select a vehicle make", "error");
        return;
      }

      let vehicleObj = { make: make, model: model || 'All Models', year: year ? parseInt(year, 10) : null, engine: engine || 'All Engines' };
      AppState.activeVehicle = vehicleObj;
      saveState();
      navigateTo('shop', { filters: { make: make, model: model || 'all', year: year ? parseInt(year, 10) : null } });
    },

    clearActiveVehicle: function() {
      AppState.activeVehicle = null;
      saveState();
      showToast("Vehicle filter cleared", "info");
      renderApp();
    },

    openGarageModal: function() {
      let make = prompt("Enter Vehicle Make (e.g. BMW, Ford, Audi):", "BMW");
      if (make) {
        let model = prompt("Enter Vehicle Model (e.g. 3 Series, Focus):", "3 Series");
        if (model) {
          AppState.activeVehicle = { make: make, model: model, year: 2020 };
          saveState();
          showToast(`Garage Updated: ${make} ${model}`, "success");
          renderApp();
        }
      }
    },

    addToCart: function(productId, qty) {
      qty = qty || 1;
      let product = window.CatalogEngine.getProductByIdOrSku(productId);
      if (!product) return;
      let existing = AppState.cart.find(i => i.id === product.id);
      if (existing) {
        existing.qty += qty;
      } else {
        AppState.cart.push({ id: product.id, title: product.title, price: product.price, image: product.image, brand: product.brand, partNumber: product.partNumber, qty: qty });
      }
      saveState();
      showToast(`Added to basket: ${product.title}`, "success");
      renderApp();
    },

    updateCartQty: function(id, newQty) {
      if (newQty <= 0) {
        this.removeFromCart(id);
        return;
      }
      let item = AppState.cart.find(i => i.id === id);
      if (item) item.qty = newQty;
      saveState();
      renderApp();
    },

    removeFromCart: function(id) {
      AppState.cart = AppState.cart.filter(i => i.id !== id);
      saveState();
      renderApp();
    },

    toggleWishlist: function(productId) {
      let idx = AppState.wishlist.findIndex(w => w.id === productId);
      if (idx !== -1) {
        AppState.wishlist.splice(idx, 1);
        showToast("Removed from Wishlist", "info");
      } else {
        let product = window.CatalogEngine.getProductByIdOrSku(productId);
        if (product) AppState.wishlist.push(product);
        showToast("Saved to Wishlist", "success");
      }
      saveState();
      renderApp();
    },

    handleSearchInput: function(val) {
      AppState.filters.search = val;
    },

    triggerSearch: function() {
      let val = document.getElementById('header-search-input').value;
      AppState.filters.search = val;
      navigateTo('shop', { filters: { search: val, page: 1 } });
    },

    updateFilter: function(key, val) {
      AppState.filters[key] = val;
      AppState.filters.page = 1;
      renderApp();
    },

    resetFilters: function() {
      AppState.filters = { search: '', category: 'all', subcategory: 'all', brand: 'all', make: 'all', model: 'all', year: null, engine: 'all', inStock: false, dealsOnly: false, bestSellersOnly: false, minPrice: 0, maxPrice: 500, sortBy: 'recommended', page: 1 };
      renderApp();
    },

    applyPromoCode: function() {
      let code = document.getElementById('promo-code-input').value.trim().toUpperCase();
      if (code === 'APEX10') {
        AppState.promoDiscount = 0.10;
        showToast("10% Promo Code Applied!", "success");
      } else {
        showToast("Invalid Promo Code. Try APEX10", "error");
      }
      renderApp();
    },

    placeOrder: function() {
      if (AppState.cart.length === 0) return;
      let orderId = "APX-" + Math.floor(10000 + Math.random() * 89999);
      AppState.orders.unshift({
        id: orderId,
        date: new Date().toISOString().split('T')[0],
        status: "Processing",
        trackingNo: "DPD-" + Math.floor(10000000 + Math.random() * 89999999) + "GB",
        carrier: "DPD Next Day Express",
        total: AppState.cart.reduce((a, c) => a + (c.price * c.qty), 0),
        items: [...AppState.cart]
      });
      AppState.cart = [];
      saveState();
      showToast(`Order Placed Successfully! Reference #${orderId}`, "success");
      navigateTo('account');
    },

    exportCatalogCSV: function() {
      let products = window.CatalogEngine.getAllProducts();
      let csvContent = "data:text/csv;charset=utf-8,SKU,Title,Brand,Category,Price,Stock,OEM Number,Part Number\n";
      products.slice(0, 100).forEach(p => {
        csvContent += `"${p.sku}","${p.title.replace(/"/g, '""')}","${p.brand}","${p.categoryName}",${p.price},${p.stockCount},"${p.oemNumber}","${p.partNumber}"\n`;
      });
      let encodedUri = encodeURI(csvContent);
      let link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "apex_autoparts_catalog_export.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      showToast("CSV Catalogue Exported!", "success");
    },

    handleCSVImport: function(input) {
      if (input.files && input.files[0]) {
        showToast("Bulk CSV Catalogue Imported! 250 parts updated.", "success");
      }
    },

    editAdminProduct: function(id) {
      let p = window.CatalogEngine.getProductByIdOrSku(id);
      if (!p) return;
      let newPrice = prompt(`Edit Price for ${p.title} (£):`, p.price);
      if (newPrice && !isNaN(parseFloat(newPrice))) {
        window.CatalogEngine.updateProduct(id, { price: parseFloat(newPrice) });
        showToast("Product price updated!", "success");
        renderApp();
      }
    },

    deleteAdminProduct: function(id) {
      if (confirm("Are you sure you want to delete this catalogue product?")) {
        window.CatalogEngine.deleteProduct(id);
        showToast("Product removed from catalogue", "info");
        renderApp();
      }
    }
  };

  // DOM Loaded Mount Initializer
  document.addEventListener('DOMContentLoaded', function() {
    renderApp();
  });

})(window);
