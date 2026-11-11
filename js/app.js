/**
 * DealHub - Main Application Logic
 * Modular Vanilla JavaScript Architecture with LocalStorage Persistence
 */

// -------------------------------------------------------------
// 1. STATE & STORAGE MANAGEMENT
// -------------------------------------------------------------
class DealStore {
  constructor() {
    this.STORAGE_KEY = 'dealhub_deals_v12';
    this.THEME_KEY = 'dealhub_theme';
    this.REGION_KEY = 'dealhub_region';
    this.deals = this.loadDeals();
    this.currentCategory = 'all';
    this.searchQuery = '';
    this.currentFilter = 'all'; // all, prime, under25, trending
    this.currentRegion = localStorage.getItem(this.REGION_KEY) || 'US';
    this.theme = localStorage.getItem(this.THEME_KEY) || 'light';
  }

  loadDeals() {
    const BACKUP_KEY = 'dealhub_user_posts_backup';
    const KNOWN_KEYS = [
      'dealhub_deals_v12',
      'dealhub_deals_v11',
      'dealhub_deals_v10',
      'dealhub_deals_v9',
      'dealhub_deals_v8',
      'dealhub_deals_v7',
      'dealhub_deals_v6',
      'dealhub_deals_v5',
      'dealhub_deals_v4',
      'dealhub_deals_v3',
      'dealhub_deals_v2',
      'dealhub_deals_v1',
      'dealhub_deals'
    ];

    const initialIds = new Set(INITIAL_DEALS.map(d => d.id));
    const userDealsMap = new Map();

    // 1. Check persistent user posts backup
    try {
      const backup = localStorage.getItem(BACKUP_KEY);
      if (backup) {
        const parsedBackup = JSON.parse(backup);
        if (Array.isArray(parsedBackup)) {
          parsedBackup.forEach(d => {
            if (d && d.id) userDealsMap.set(d.id, d);
          });
        }
      }
    } catch (e) {
      console.warn('Backup parse error', e);
    }

    // 2. Scan all known and legacy localStorage keys for user custom posts
    try {
      const allKeys = new Set(KNOWN_KEYS);
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith('dealhub_deals') || k.includes('dealhub'))) {
          allKeys.add(k);
        }
      }

      allKeys.forEach(key => {
        try {
          const val = localStorage.getItem(key);
          if (val) {
            const arr = JSON.parse(val);
            if (Array.isArray(arr)) {
              arr.forEach(deal => {
                if (deal && deal.id && !initialIds.has(deal.id)) {
                  if (!userDealsMap.has(deal.id)) {
                    userDealsMap.set(deal.id, deal);
                  }
                }
              });
            }
          }
        } catch (err) {}
      });
    } catch (e) {}

    // 3. Load active deals from primary storage key
    let baseDeals = [];
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          baseDeals = parsed;
        }
      }
    } catch (e) {}

    if (baseDeals.length === 0) {
      baseDeals = [...INITIAL_DEALS];
    }

    // 4. Merge any recovered user posts at the top of the feed
    if (userDealsMap.size > 0) {
      const existingIds = new Set(baseDeals.map(d => d.id));
      const recovered = Array.from(userDealsMap.values()).filter(d => !existingIds.has(d.id));
      if (recovered.length > 0) {
        baseDeals = [...recovered, ...baseDeals];
        console.log(`[DealHub] Auto-recovered ${recovered.length} custom user post(s) from previous session!`);
      }
    }

    // 5. Sync back to current key and backup
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(baseDeals));
      const userOnly = baseDeals.filter(d => !initialIds.has(d.id));
      if (userOnly.length > 0) {
        localStorage.setItem(BACKUP_KEY, JSON.stringify(userOnly));
      }
    } catch (e) {}

    return baseDeals;
  }

  saveDeals() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.deals));
      const BACKUP_KEY = 'dealhub_user_posts_backup';
      const initialIds = new Set(INITIAL_DEALS.map(d => d.id));
      const userOnly = this.deals.filter(d => !initialIds.has(d.id));
      localStorage.setItem(BACKUP_KEY, JSON.stringify(userOnly));
    } catch (e) {
      console.error('Failed to save deals to localStorage', e);
    }
  }

  addDeal(dealData) {
    const isFatima = dealData.trackingTag === 'fatimasstudios-20';
    const authorProfile = isFatima 
      ? (window.FATIMA_AUTHOR || {
          name: "Fatima's Studios",
          handle: '@fatimasstudios',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
          verified: true
        })
      : (window.YAHYA_AUTHOR || {
          name: 'Yahya Amir Anwer',
          handle: '@yahyaamir',
          avatar: 'public/Image.jpg',
          verified: true
        });

    const newDeal = {
      id: 'deal-' + Date.now(),
      author: authorProfile,
      title: dealData.title.trim(),
      category: dealData.category,
      price: parseFloat(dealData.price) || 0,
      originalPrice: parseFloat(dealData.originalPrice) || 0,
      rating: parseFloat(dealData.rating) || 5.0,
      reviewsCount: Math.floor(Math.random() * 4000) + 120,
      prime: dealData.prime !== false,
      tag: dealData.tag || 'Top Pick',
      imageUrl: (dealData.imageUrl && dealData.imageUrl.trim()) || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
      affiliateLink: this.formatAffiliateLink(dealData.affiliateLink, dealData.trackingTag),
      reviewText: (dealData.reviewText && dealData.reviewText.trim()) || 'Curated recommendation — verified product quality and buyer reviews on Amazon.',
      timestamp: 'Just now',
      likes: 1,
      hasLiked: true,
      comments: []
    };

    this.deals.unshift(newDeal);
    this.saveDeals();

    // Auto-persist directly to project file on disk if running on dev server
    if (window.location.protocol.startsWith('http')) {
      fetch('/api/save-deal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDeal)
      }).then(r => r.json()).then(res => {
        if (res?.success) {
          console.log('[DealHub] Deal permanently saved to data.js on disk!');
        }
      }).catch(() => {});
    }

    return newDeal;
  }

  formatAffiliateLink(url, customTag, targetRegion = null) {
    const trackingTag = customTag || window.AMAZON_TRACKING_ID || 'yahyaamir786-20';
    const region = targetRegion || this.currentRegion || 'US';
    const marketplace = window.AMAZON_MARKETPLACES?.[region] || { domain: 'amazon.com' };

    if (!url) return `https://www.${marketplace.domain}?tag=${trackingTag}`;
    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl;
    }
    // Dynamic International OneLink Geo-Routing
    if (marketplace.domain && marketplace.domain !== 'amazon.com') {
      cleanUrl = cleanUrl.replace(/amazon\.(com|co\.uk|de|fr|it|es|ca|com\.au|in|ae|nl|pl|se)/g, marketplace.domain);
    }
    if (cleanUrl.includes('tag=')) {
      cleanUrl = cleanUrl.replace(/tag=[^&]+/g, `tag=${trackingTag}`);
    } else {
      cleanUrl += (cleanUrl.includes('?') ? '&' : '?') + `tag=${trackingTag}`;
    }
    return cleanUrl;
  }

  toggleLike(dealId) {
    const deal = this.deals.find(d => d.id === dealId);
    if (!deal) return null;

    if (deal.hasLiked) {
      deal.likes = Math.max(0, deal.likes - 1);
      deal.hasLiked = false;
    } else {
      deal.likes += 1;
      deal.hasLiked = true;
    }
    this.saveDeals();
    return deal;
  }

  addComment(dealId, text) {
    const deal = this.deals.find(d => d.id === dealId);
    if (!deal || !text.trim()) return null;

    const newComment = {
      id: 'c-' + Date.now(),
      user: 'You',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      text: text.trim(),
      time: 'Just now'
    };

    if (!deal.comments) deal.comments = [];
    deal.comments.push(newComment);
    this.saveDeals();
    return newComment;
  }

  deleteDeal(dealId) {
    this.deals = this.deals.filter(d => d.id !== dealId);
    this.saveDeals();
  }

  resetDefaults(keepUserPosts = true) {
    const initialIds = new Set(INITIAL_DEALS.map(d => d.id));
    if (keepUserPosts) {
      const customDeals = this.deals.filter(d => !initialIds.has(d.id));
      this.deals = [...customDeals, ...INITIAL_DEALS];
    } else {
      this.deals = [...INITIAL_DEALS];
      try {
        localStorage.removeItem('dealhub_user_posts_backup');
      } catch (e) {}
    }
    this.saveDeals();
  }

  exportDealsJSON() {
    const jsonStr = JSON.stringify(this.deals, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dealhub-deals-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  importDealsJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) throw new Error('File must contain an array of deals');
      const existingIds = new Set(this.deals.map(d => d.id));
      let count = 0;
      parsed.forEach(deal => {
        if (deal && deal.id && !existingIds.has(deal.id)) {
          this.deals.unshift(deal);
          existingIds.add(deal.id);
          count++;
        }
      });
      this.saveDeals();
      return count;
    } catch (e) {
      throw e;
    }
  }

  getFilteredDeals() {
    return this.deals.filter(deal => {
      // Category filter
      if (this.currentCategory !== 'all' && deal.category !== this.currentCategory) {
        return false;
      }
      // Search query filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        const matchesTitle = deal.title.toLowerCase().includes(query);
        const matchesReview = deal.reviewText.toLowerCase().includes(query);
        const matchesTag = deal.tag && deal.tag.toLowerCase().includes(query);
        const matchesCat = deal.category.toLowerCase().includes(query);
        if (!matchesTitle && !matchesReview && !matchesTag && !matchesCat) {
          return false;
        }
      }
      // Sub-filter chips
      if (this.currentFilter === 'prime' && !deal.prime) return false;
      if (this.currentFilter === 'under25' && deal.price > 25) return false;
      if (this.currentFilter === 'trending' && deal.tag !== 'Trending' && deal.tag !== 'Hot Deal') return false;

      return true;
    });
  }
}

// -------------------------------------------------------------
// 2. TOAST NOTIFICATION SERVICE
// -------------------------------------------------------------
const Toast = {
  container: null,

  init() {
    this.container = document.getElementById('toast-container');
  },

  show(message, type = 'success', duration = 3500) {
    if (!this.container) this.init();

    const toast = document.createElement('div');
    const iconName = type === 'success' ? 'check-circle' : type === 'error' ? 'alert-circle' : 'info';
    const bgClass = type === 'success' 
      ? 'bg-emerald-600 text-white' 
      : type === 'error' 
        ? 'bg-rose-600 text-white' 
        : 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900';

    toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl ${bgClass} toast-animate text-sm font-medium border border-white/10 z-50 transition-all`;
    toast.innerHTML = `
      <i data-lucide="${iconName}" class="w-5 h-5 flex-shrink-0"></i>
      <span class="flex-1">${message}</span>
      <button class="opacity-70 hover:opacity-100 transition p-1" onclick="this.parentElement.remove()">
        <i data-lucide="x" class="w-4 h-4"></i>
      </button>
    `;

    this.container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
};

// -------------------------------------------------------------
// 3. UI CONTROLLER & RENDERER
// -------------------------------------------------------------
class DealHubUI {
  constructor(store) {
    this.store = store;
    this.initTheme();
    this.bindElements();
    this.renderCategoryNav();
    this.renderHeroBanner();
    this.renderFeed();
    this.bindEvents();
  }

  initTheme() {
    const isDark = this.store.theme === 'dark' || 
      (!('dealhub_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
      this.store.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      this.store.theme = 'light';
    }
  }

  toggleTheme() {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      this.store.theme = 'light';
    } else {
      document.documentElement.classList.add('dark');
      this.store.theme = 'dark';
    }
    localStorage.setItem(this.store.THEME_KEY, this.store.theme);
    this.updateThemeIcons();
  }

  updateThemeIcons() {
    const isDark = document.documentElement.classList.contains('dark');
    document.querySelectorAll('.theme-toggle-icon').forEach(icon => {
      icon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
    });
    if (window.lucide) window.lucide.createIcons();
  }

  bindElements() {
    this.categoryNav = document.getElementById('category-nav');
    this.mobileCategoryNav = document.getElementById('mobile-category-nav');
    this.heroSection = document.getElementById('hero-section');
    this.feedContainer = document.getElementById('feed-container');
    this.searchInput = document.getElementById('search-input');
    this.mobileSearchInput = document.getElementById('mobile-search-input');
    this.clearSearchBtn = document.getElementById('clear-search-btn');
    this.dealsCountBadge = document.getElementById('deals-count-badge');
    
    // Lightbox Modal
    this.lightboxModal = document.getElementById('lightbox-modal');
    this.lightboxImg = document.getElementById('lightbox-image');
    this.lightboxTitle = document.getElementById('lightbox-title');
    this.lightboxLink = document.getElementById('lightbox-link');
    this.lightboxPrice = document.getElementById('lightbox-price');

    // Mobile Drawer
    this.mobileDrawer = document.getElementById('mobile-drawer');
    this.drawerBackdrop = document.getElementById('drawer-backdrop');
    this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
    this.closeDrawerBtn = document.getElementById('close-drawer-btn');

    // Category Nav Scroll Buttons
    this.catScrollLeft = document.getElementById('cat-scroll-left');
    this.catScrollRight = document.getElementById('cat-scroll-right');

    // International Regional Marketplace Selectors
    this.regionStoreSelect = document.getElementById('region-store-select');
    this.mobileRegionStoreSelect = document.getElementById('mobile-region-store-select');
  }

  bindEvents() {
    // Regional Marketplace Change Handler
    const handleRegionChange = (e) => {
      const newRegion = e.target.value;
      this.store.currentRegion = newRegion;
      localStorage.setItem(this.store.REGION_KEY, newRegion);
      if (this.regionStoreSelect) this.regionStoreSelect.value = newRegion;
      if (this.mobileRegionStoreSelect) this.mobileRegionStoreSelect.value = newRegion;
      this.renderHeroBanner();
      this.renderFeed();
      const market = window.AMAZON_MARKETPLACES?.[newRegion];
      Toast.show(`Marketplace switched to ${market?.flag || ''} ${market?.name || newRegion} (${market?.domain || ''})`, 'info', 2500);
    };

    if (this.regionStoreSelect) {
      this.regionStoreSelect.value = this.store.currentRegion;
      this.regionStoreSelect.addEventListener('change', handleRegionChange);
    }
    if (this.mobileRegionStoreSelect) {
      this.mobileRegionStoreSelect.value = this.store.currentRegion;
      this.mobileRegionStoreSelect.addEventListener('change', handleRegionChange);
    }

    // Theme toggle buttons
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => this.toggleTheme());
    });

    // Search inputs
    const handleSearch = (e) => {
      this.store.searchQuery = e.target.value.trim();
      if (this.clearSearchBtn) {
        this.clearSearchBtn.classList.toggle('hidden', !this.store.searchQuery);
      }
      this.renderFeed();
    };

    if (this.searchInput) {
      this.searchInput.addEventListener('input', handleSearch);
    }
    if (this.mobileSearchInput) {
      this.mobileSearchInput.addEventListener('input', (e) => {
        if (this.searchInput) this.searchInput.value = e.target.value;
        handleSearch(e);
      });
    }
    if (this.clearSearchBtn) {
      this.clearSearchBtn.addEventListener('click', () => {
        if (this.searchInput) this.searchInput.value = '';
        if (this.mobileSearchInput) this.mobileSearchInput.value = '';
        this.store.searchQuery = '';
        this.clearSearchBtn.classList.add('hidden');
        this.renderFeed();
      });
    }

    // Keyboard shortcut (Cmd/Ctrl + K to focus search)
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        this.searchInput?.focus();
      }
      if (e.key === 'Escape') {
        this.closeLightbox();
        this.closeMobileDrawer();
      }
    });

    // Mobile drawer toggles
    this.mobileMenuBtn?.addEventListener('click', () => this.openMobileDrawer());
    this.closeDrawerBtn?.addEventListener('click', () => this.closeMobileDrawer());
    this.drawerBackdrop?.addEventListener('click', () => this.closeMobileDrawer());

    // Category Nav Scroll Buttons & Mouse Wheel
    this.catScrollLeft?.addEventListener('click', () => {
      this.categoryNav?.scrollBy({ left: -220, behavior: 'smooth' });
    });
    this.catScrollRight?.addEventListener('click', () => {
      this.categoryNav?.scrollBy({ left: 220, behavior: 'smooth' });
    });

    this.categoryNav?.addEventListener('wheel', (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        this.categoryNav.scrollLeft += e.deltaY;
      }
    }, { passive: false });

    this.categoryNav?.addEventListener('scroll', () => this.updateScrollButtons());
    window.addEventListener('resize', () => this.updateScrollButtons());

    // Data Management: Export Backup
    document.getElementById('export-data-btn')?.addEventListener('click', () => {
      this.store.exportDealsJSON();
      Toast.show('DealHub posts backup downloaded!', 'success');
    });

    // Data Management: Import Backup
    const importFileInput = document.getElementById('import-data-file');
    importFileInput?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const count = this.store.importDealsJSON(event.target.result);
          this.renderFeed();
          this.renderCategoryNav();
          Toast.show(`Successfully imported ${count} post(s)!`, 'success');
        } catch (err) {
          Toast.show('Failed to import backup: ' + err.message, 'error');
        }
        importFileInput.value = '';
      };
      reader.readAsText(file);
    });

    // Safe Reset Data button in footer (preserves user posts)
    document.getElementById('reset-data-btn')?.addEventListener('click', () => {
      const initialIds = new Set(INITIAL_DEALS.map(d => d.id));
      const hasCustom = this.store.deals.some(d => !initialIds.has(d.id));
      if (hasCustom) {
        if (confirm('Reset demo deals while KEEPING your custom posts? (Click OK to keep your posts, or Cancel to keep current state)')) {
          this.store.resetDefaults(true);
          this.renderFeed();
          Toast.show('Default deals refreshed (your custom posts were preserved!)', 'success');
        }
      } else {
        if (confirm('Reset deals back to initial default database?')) {
          this.store.resetDefaults(false);
          this.renderFeed();
          Toast.show('Database restored to default verified recommendations', 'info');
        }
      }
    });
  }

  // -------------------------------------------------------------
  // NAVIGATION & HERO
  // -------------------------------------------------------------
  renderCategoryNav() {
    const createNavHTML = (isMobile = false) => {
      return CATEGORIES.map(cat => {
        const isActive = this.store.currentCategory === cat.id;
        const count = cat.id === 'all' 
          ? this.store.deals.length 
          : this.store.deals.filter(d => d.category === cat.id).length;

        if (isMobile) {
          return `
            <button 
              type="button"
              onclick="window.dealHubApp.setCategory('${cat.id}')"
              class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive 
                  ? 'bg-blue-600 text-white font-semibold shadow-sm' 
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }"
            >
              <div class="flex items-center gap-3">
                <i data-lucide="${cat.icon}" class="w-4 h-4"></i>
                <span>${cat.name}</span>
              </div>
              <span class="text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}">
                ${count}
              </span>
            </button>
          `;
        }

        return `
          <button 
            type="button"
            id="cat-tab-${cat.id}"
            onclick="window.dealHubApp.setCategory('${cat.id}')"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 relative flex-shrink-0 ${
              isActive 
                ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/30' 
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
            }"
          >
            <i data-lucide="${cat.icon}" class="w-3.5 h-3.5 flex-shrink-0"></i>
            <span>${cat.name}</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              isActive ? 'bg-white/25 text-white' : 'bg-slate-200/80 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
            }">
              ${count}
            </span>
          </button>
        `;
      }).join('');
    };

    if (this.categoryNav) {
      this.categoryNav.innerHTML = createNavHTML(false);
    }
    if (this.mobileCategoryNav) {
      this.mobileCategoryNav.innerHTML = createNavHTML(true);
    }
    if (window.lucide) window.lucide.createIcons();
    setTimeout(() => this.updateScrollButtons(), 50);
  }

  updateScrollButtons() {
    if (!this.categoryNav) return;
    const { scrollLeft, scrollWidth, clientWidth } = this.categoryNav;
    const hasOverflow = scrollWidth > clientWidth + 4;
    if (this.catScrollLeft) {
      this.catScrollLeft.classList.toggle('hidden', !hasOverflow || scrollLeft <= 10);
    }
    if (this.catScrollRight) {
      this.catScrollRight.classList.toggle('hidden', !hasOverflow || (scrollLeft + clientWidth >= scrollWidth - 10));
    }
  }

  setCategory(catId) {
    this.store.currentCategory = catId;
    this.store.currentFilter = 'all';
    this.renderCategoryNav();
    this.renderHeroBanner();
    this.renderFeed();
    this.closeMobileDrawer();
    document.getElementById(`cat-tab-${catId}`)?.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
  }

  setSubFilter(filterName) {
    this.store.currentFilter = filterName;
    this.renderHeroBanner();
    this.renderFeed();
  }

  renderHeroBanner() {
    if (!this.heroSection) return;
    const catId = this.store.currentCategory;
    const hero = HERO_CONFIG[catId] || HERO_CONFIG['all'];
    const seo = window.INTERNATIONAL_SEO_CONFIG?.[catId] || window.INTERNATIONAL_SEO_CONFIG?.['all'];

    this.updateSEOMetadata(catId);

    const filterChips = [
      { id: 'all', label: 'All Items' },
      { id: 'prime', label: '⚡ Prime Eligible' },
      { id: 'under25', label: '🏷️ Under $25' },
      { id: 'trending', label: '🔥 Trending Only' }
    ];

    const currentMarket = window.AMAZON_MARKETPLACES?.[this.store.currentRegion] || { name: 'United States', flag: '🇺🇸', domain: 'amazon.com' };

    this.heroSection.innerHTML = `
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r ${hero.gradient} text-white shadow-md p-6 sm:p-8 animate-fade-in border border-white/10">
        <!-- Background subtle glow/decorative elements -->
        <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div class="absolute -left-10 -top-10 w-48 h-48 bg-black/10 rounded-full blur-xl pointer-events-none"></div>
        
        <div class="relative z-10 max-w-3xl">
          <div class="flex flex-wrap items-center gap-2 mb-3">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold tracking-wide">
              <span>${hero.badge}</span>
              <span class="w-1 h-1 rounded-full bg-white/60"></span>
              <span class="text-white/90">${hero.stats}</span>
            </span>
            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/25 backdrop-blur-md text-[11px] font-medium text-white/90">
              <span>${currentMarket.flag} Marketplace: ${currentMarket.domain}</span>
            </span>
          </div>

          <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-white drop-shadow-sm">
            ${seo?.title ? seo.title.split('|')[0].trim() : hero.title}
          </h1>

          <p class="text-white/85 text-sm sm:text-base leading-relaxed mb-4 font-normal">
            ${seo?.description || hero.subtitle}
          </p>

          <!-- Quick Filter Pills -->
          <div class="flex flex-wrap items-center gap-2 pt-1 mb-4">
            <span class="text-xs font-medium text-white/70 mr-1 hidden sm:inline">Filter:</span>
            ${filterChips.map(chip => `
              <button 
                type="button"
                onclick="window.dealHubApp.setSubFilter('${chip.id}')"
                class="text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                  this.store.currentFilter === chip.id
                    ? 'bg-white text-slate-900 shadow font-semibold scale-105'
                    : 'bg-white/15 hover:bg-white/25 text-white backdrop-blur-sm'
                }"
              >
                ${chip.label}
              </button>
            `).join('')}
          </div>

          <!-- International Technical Specs & Regional Adapters Box -->
          ${seo?.regionalAdapters ? `
            <div class="pt-4 border-t border-white/20 grid grid-cols-1 md:grid-cols-3 gap-2.5 text-left text-xs">
              <div class="bg-black/20 backdrop-blur-xs rounded-xl p-3 border border-white/10">
                <div class="flex items-center gap-1 font-bold text-white mb-1">
                  <span>🇺🇸 🇨🇦 North America</span>
                </div>
                <p class="text-[11px] text-white/80 leading-snug">${seo.regionalAdapters.us_ca}</p>
              </div>
              <div class="bg-black/20 backdrop-blur-xs rounded-xl p-3 border border-white/10">
                <div class="flex items-center gap-1 font-bold text-white mb-1">
                  <span>🇬🇧 🇪🇺 UK & Europe</span>
                </div>
                <p class="text-[11px] text-white/80 leading-snug">${seo.regionalAdapters.uk_eu}</p>
              </div>
              <div class="bg-black/20 backdrop-blur-xs rounded-xl p-3 border border-white/10">
                <div class="flex items-center gap-1 font-bold text-white mb-1">
                  <span>🌏 Global / Tier 2 (IN, PK, ME)</span>
                </div>
                <p class="text-[11px] text-white/80 leading-snug">${seo.regionalAdapters.tier2}</p>
              </div>
            </div>
          ` : ''}

          <!-- Native European Search Queries -->
          ${seo?.euKeywords ? `
            <div class="mt-3 flex flex-wrap items-center gap-1 text-[10px] text-white/80">
              <span class="font-bold text-white/90 mr-1">🇪🇺 Native EU Queries:</span>
              <span class="bg-white/15 px-2 py-0.5 rounded">🇩🇪 ${seo.euKeywords.de}</span>
              <span class="bg-white/15 px-2 py-0.5 rounded">🇫🇷 ${seo.euKeywords.fr}</span>
              <span class="bg-white/15 px-2 py-0.5 rounded">🇮🇹 ${seo.euKeywords.it}</span>
              <span class="bg-white/15 px-2 py-0.5 rounded">🇪🇸 ${seo.euKeywords.es}</span>
              <span class="bg-white/15 px-2 py-0.5 rounded">🇳🇱 ${seo.euKeywords.nl}</span>
              <span class="bg-white/15 px-2 py-0.5 rounded">🇵🇱 ${seo.euKeywords.pl}</span>
              <span class="bg-white/15 px-2 py-0.5 rounded">🇸🇪 ${seo.euKeywords.se}</span>
            </div>
          ` : ''}

          <!-- Medical Disclaimer if Health Care -->
          ${seo?.medicalDisclaimer ? `
            <div class="mt-3 inline-flex items-center gap-1.5 bg-amber-500/25 border border-amber-300/40 rounded-lg px-3 py-1 text-xs text-amber-100">
              <i data-lucide="alert-circle" class="w-3.5 h-3.5 flex-shrink-0"></i>
              <span><strong>Medical Notice:</strong> ${seo.medicalDisclaimer}</span>
            </div>
          ` : ''}

        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  }

  updateSEOMetadata(catId) {
    const seo = window.INTERNATIONAL_SEO_CONFIG?.[catId] || window.INTERNATIONAL_SEO_CONFIG?.['all'];
    if (!seo) return;

    if (seo.title) {
      document.title = seo.title;
      const titleEl = document.getElementById('seo-page-title');
      if (titleEl) titleEl.textContent = seo.title;
      document.getElementById('og-title')?.setAttribute('content', seo.title);
      document.getElementById('tw-title')?.setAttribute('content', seo.title);
    }

    if (seo.description) {
      document.getElementById('seo-meta-desc')?.setAttribute('content', seo.description);
      document.getElementById('og-desc')?.setAttribute('content', seo.description);
      document.getElementById('tw-desc')?.setAttribute('content', seo.description);
    }

    const canonicalEl = document.getElementById('seo-canonical');
    const path = catId === 'all' ? '' : `${catId}/`;
    if (canonicalEl) canonicalEl.setAttribute('href', `https://dealhub.com/${path}`);

    const keywordsEl = document.getElementById('seo-meta-keywords');
    if (keywordsEl && seo.primaryKeyword) {
      const allKws = [seo.primaryKeyword, ...(seo.longTailKeywords || []), ...(seo.lsiKeywords || [])];
      keywordsEl.setAttribute('content', allKws.join(', '));
    }
  }

  updateStructuredData(deals, catId) {
    const jsonLdEl = document.getElementById('dynamic-jsonld');
    if (!jsonLdEl) return;

    const seo = window.INTERNATIONAL_SEO_CONFIG?.[catId] || window.INTERNATIONAL_SEO_CONFIG?.['all'];
    const currentMarket = window.AMAZON_MARKETPLACES?.[this.store.currentRegion] || { currency: '$', domain: 'amazon.com', rate: 1.0 };

    const schema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": seo?.title || "DealHub Curated Amazon Deals",
      "description": seo?.description || "Curated Amazon Deals and Product Reviews",
      "numberOfItems": deals.length,
      "itemListElement": deals.map((deal, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": deal.title,
          "image": [deal.imageUrl],
          "description": deal.reviewText,
          "category": deal.category,
          "offers": {
            "@type": "Offer",
            "price": deal.price > 0 ? (deal.price * (currentMarket.rate || 1.0)).toFixed(2) : "0.00",
            "priceCurrency": currentMarket.currency === '£' ? 'GBP' : currentMarket.currency === '€' ? 'EUR' : currentMarket.currency === '₹' ? 'INR' : currentMarket.currency === 'AED' ? 'AED' : currentMarket.currency === 'C$' ? 'CAD' : currentMarket.currency === 'A$' ? 'AUD' : currentMarket.currency === 'zł' ? 'PLN' : currentMarket.currency === 'kr' ? 'SEK' : 'USD',
            "availability": "https://schema.org/InStock",
            "url": this.store.formatAffiliateLink(deal.affiliateLink, deal.author?.handle?.includes('fatima') ? 'fatimasstudios-20' : 'yahyaamir786-20', this.store.currentRegion)
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": deal.rating || 4.8,
            "reviewCount": deal.reviewsCount || 1000,
            "bestRating": 5,
            "worstRating": 1
          },
          "review": {
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": deal.author?.name || "Yahya Amir Anwer"
            },
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": deal.rating || 4.8
            },
            "reviewBody": deal.reviewText
          }
        }
      }))
    };

    jsonLdEl.textContent = JSON.stringify(schema, null, 2);
  }

  // -------------------------------------------------------------
  // FEED & CARD RENDERING
  // -------------------------------------------------------------
  renderFeed() {
    if (!this.feedContainer) return;
    const deals = this.store.getFilteredDeals();

    if (this.dealsCountBadge) {
      this.dealsCountBadge.textContent = `${deals.length} deals`;
    }

    this.updateStructuredData(deals, this.store.currentCategory);

    if (deals.length === 0) {
      this.feedContainer.innerHTML = `
        <div class="bg-white dark:bg-slate-800/80 rounded-2xl p-10 text-center border border-slate-200 dark:border-slate-700 shadow-sm">
          <div class="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-400">
            <i data-lucide="search-x" class="w-8 h-8"></i>
          </div>
          <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">No Amazon Deals Found</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-5">
            ${this.store.searchQuery 
              ? `No deals match your search for "${this.store.searchQuery}". Try different keywords or clear your query.` 
              : 'There are no deals matching the selected category and filter.'}
          </p>
          <button 
            type="button" 
            onclick="window.dealHubApp.clearFilters()"
            class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
          >
            <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
            Reset All Filters
          </button>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    this.feedContainer.innerHTML = deals.map(deal => this.renderDealCard(deal)).join('');
    if (window.lucide) window.lucide.createIcons();
  }

  clearFilters() {
    this.store.searchQuery = '';
    this.store.currentCategory = 'all';
    this.store.currentFilter = 'all';
    if (this.searchInput) this.searchInput.value = '';
    if (this.mobileSearchInput) this.mobileSearchInput.value = '';
    if (this.clearSearchBtn) this.clearSearchBtn.classList.add('hidden');
    this.renderCategoryNav();
    this.renderHeroBanner();
    this.renderFeed();
  }

  renderDealCard(deal) {
    const market = window.AMAZON_MARKETPLACES?.[this.store.currentRegion] || { name: 'United States', domain: 'amazon.com', currency: '$', rate: 1.0, flag: '🇺🇸' };
    const trackingTag = deal.author?.handle?.includes('fatima') ? 'fatimasstudios-20' : 'yahyaamir786-20';
    const localizedLink = this.store.formatAffiliateLink(deal.affiliateLink, trackingTag, this.store.currentRegion);

    const convertedPrice = (deal.price && deal.price > 0) ? (deal.price * (market.rate || 1.0)) : null;
    const convertedOriginalPrice = (deal.originalPrice && deal.originalPrice > 0) ? (deal.originalPrice * (market.rate || 1.0)) : null;

    const hasDiscount = convertedOriginalPrice && convertedPrice && convertedOriginalPrice > convertedPrice;
    const discountPercent = hasDiscount 
      ? Math.round(((convertedOriginalPrice - convertedPrice) / convertedOriginalPrice) * 100) 
      : 0;
    const savingsAmount = hasDiscount 
      ? (convertedOriginalPrice - convertedPrice).toFixed(2) 
      : 0;

    // Tag styling
    let tagBg = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
    if (deal.tag === 'Hot Deal') {
      tagBg = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800';
    } else if (deal.tag === 'Best Value') {
      tagBg = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800';
    } else if (deal.tag === 'Trending') {
      tagBg = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800';
    }

    // Category label
    const catObj = CATEGORIES.find(c => c.id === deal.category) || { name: deal.category };

    // Format review keywords with subtle highlight
    const formattedReview = this.formatReviewText(deal.reviewText);

    return `
      <article 
        id="card-${deal.id}" 
        class="deal-card bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden mb-6"
      >
        <!-- CARD HEADER -->
        <div class="px-4 pt-4 pb-3 sm:px-5 sm:pt-5 sm:pb-4 border-b border-slate-100 dark:border-slate-700/60">
          <div class="flex items-start justify-between gap-2">

            <!-- Left: Avatar + Author info -->
            <div class="flex items-center gap-3 min-w-0">
              <div class="relative flex-shrink-0">
                <img 
                  src="${deal.author.avatar}" 
                  alt="${deal.author.name}" 
                  class="w-11 h-11 rounded-full object-cover ring-2 ring-white dark:ring-slate-700 shadow-sm"
                  loading="lazy"
                />
                ${deal.author.verified ? `
                  <span class="absolute -bottom-0.5 -right-0.5 bg-blue-500 rounded-full p-0.5 ring-1 ring-white dark:ring-slate-800">
                    <i data-lucide="check" class="w-2.5 h-2.5 text-white stroke-[3]"></i>
                  </span>
                ` : ''}
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span class="font-bold text-sm text-slate-900 dark:text-slate-100 leading-tight">${deal.author.name}</span>
                </div>
                <div class="flex items-center gap-1.5 mt-0.5 flex-wrap">
                  <span class="text-[11px] text-slate-400 dark:text-slate-500 font-medium">${deal.author.handle}</span>
                  <span class="text-slate-300 dark:text-slate-600 text-[10px]">•</span>
                  <span class="text-[11px] text-slate-400 dark:text-slate-500">${deal.timestamp}</span>
                </div>
              </div>
            </div>

            <!-- Right: Badges + Dropdown -->
            <div class="flex items-center gap-1.5 flex-shrink-0">
              <!-- Tag badge -->
              <span class="inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-lg border shadow-xs ${tagBg}">
                ${deal.tag}
              </span>
              <!-- Category badge — always visible -->
              <span class="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100/80 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-slate-600/50">
                <i data-lucide="tag" class="w-3 h-3 opacity-60"></i>
                <span class="hidden xs:inline">${catObj.name}</span>
                <span class="xs:hidden">${catObj.name.split(' ')[0]}</span>
              </span>
              <!-- 3-dot menu -->
              <div class="relative dropdown-container">
                <button 
                  type="button" 
                  onclick="window.dealHubApp.toggleCardMenu('${deal.id}')"
                  class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  aria-label="Options"
                >
                  <i data-lucide="more-horizontal" class="w-5 h-5"></i>
                </button>
                <div 
                  id="menu-${deal.id}" 
                  class="hidden absolute right-0 mt-1 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-30 text-xs"
                >
                <button 
                  onclick="window.dealHubApp.copyAffiliateLink('${localizedLink}')"
                  class="w-full text-left px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/70 flex items-center gap-2"
                >
                  <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                  Copy Amazon Link (${market.domain})
                </button>
                <button 
                  onclick="window.dealHubApp.shareDealCard('${deal.id}', '${encodeURIComponent(deal.title)}')"
                  class="w-full text-left px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/70 flex items-center gap-2"
                >
                  <i data-lucide="share-2" class="w-3.5 h-3.5"></i>
                  Share Deal Post
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- REVIEW TEXT -->
        <div class="px-4 sm:px-6 pt-4 pb-3">
          <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            ${formattedReview}
          </p>
        </div>

        <!-- PRODUCT MEDIA / HERO IMAGE -->
        <div class="relative mx-4 sm:mx-6 h-64 sm:h-80 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-700/50 product-image-container group cursor-pointer flex items-center justify-center p-3 sm:p-4" onclick="window.dealHubApp.openLightbox('${deal.id}')">
          <img 
            src="${deal.imageUrl}" 
            alt="${deal.title}" 
            class="max-h-full max-w-full w-auto h-auto object-contain mx-auto group-hover:scale-105 transition-transform duration-300 drop-shadow-xs"
            loading="lazy"
          />
          <!-- Discount badge overlay -->
          ${hasDiscount ? `
            <div class="absolute top-3 left-3 bg-rose-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1 z-10">
              <span>-${discountPercent}%</span>
              <span class="text-[10px] font-medium opacity-90">OFF</span>
            </div>
          ` : ''}

          <!-- Zoom pill badge -->
          <div class="absolute bottom-3 right-3 bg-slate-900/75 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 pointer-events-none z-10">
            <i data-lucide="maximize-2" class="w-3 h-3"></i>
            <span>Click to Zoom</span>
          </div>
        </div>

        <!-- HIGH-CONVERTING AMAZON AFFILIATE CTA BOX -->
        <div class="m-4 sm:m-6 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/70 dark:from-slate-800/90 dark:to-slate-900/90 border border-slate-200/90 dark:border-slate-700/80 shadow-inner">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <!-- Left Info -->
            <div class="flex-1 min-w-0">
              <a 
                href="${localizedLink}" 
                target="_blank" 
                rel="noopener sponsored"
                class="block text-base font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2 mb-1.5"
                title="${deal.title}"
              >
                ${deal.title}
              </a>

              <!-- Rating & Prime -->
              <div class="flex flex-wrap items-center gap-3 text-xs mb-2">
                <div class="flex items-center text-amber-500 font-semibold gap-1">
                  <div class="flex text-amber-400">
                    ${this.renderStars(deal.rating)}
                  </div>
                  <span class="text-slate-700 dark:text-slate-300 ml-1 font-bold">${deal.rating}</span>
                  <span class="text-slate-400">(${deal.reviewsCount.toLocaleString()})</span>
                </div>

                ${deal.prime ? `
                  <div class="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400">
                    <i data-lucide="check" class="w-3.5 h-3.5 stroke-[3]"></i>
                    <span class="italic font-extrabold tracking-tight">prime</span>
                    <span class="text-[10px] text-slate-500 dark:text-slate-400 font-normal">One-Day</span>
                  </div>
                ` : ''}
              </div>

              <!-- Price Box -->
              <div class="flex items-baseline gap-2">
                ${convertedPrice && convertedPrice > 0 ? `
                  <span class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    ${market.currency}${convertedPrice.toFixed(2)}
                  </span>
                  ${hasDiscount ? `
                    <span class="text-sm text-slate-400 line-through">
                      ${market.currency}${convertedOriginalPrice.toFixed(2)}
                    </span>
                    <span class="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      (Save ${market.currency}${savingsAmount})
                    </span>
                  ` : ''}
                ` : `
                  <span class="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-100/80 dark:bg-amber-950/50 px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-800">
                    <i data-lucide="tag" class="w-3.5 h-3.5"></i>
                    Check Price on Amazon (${market.domain})
                  </span>
                `}
              </div>
            </div>

            <!-- Right High-Visibility Conversion CTA -->
            <div class="flex flex-col sm:flex-row md:flex-col items-stretch md:items-end justify-center gap-1.5 flex-shrink-0">
              <a 
                href="${localizedLink}" 
                target="_blank" 
                rel="noopener sponsored"
                class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-95 text-slate-950 font-extrabold text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-150 group border border-amber-400"
              >
                <span>Check Price on Amazon</span>
                <i data-lucide="external-link" class="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"></i>
              </a>
              <span class="text-[11px] text-center md:text-right text-slate-400 dark:text-slate-500 font-medium">
                ${market.flag} Amazon ${market.name} · Fast Prime Checkout
              </span>
            </div>

          </div>
        </div>

          </div>
        </div>

        <!-- INTERACTIVE FOOTER (LIKES, COMMENTS, SHARE) -->
        <div class="px-4 sm:px-6 py-3 bg-slate-50/60 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          
          <div class="flex items-center gap-4">
            <!-- Like Button -->
            <button 
              type="button"
              onclick="window.dealHubApp.toggleLike('${deal.id}')"
              class="flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition ${
                deal.hasLiked ? 'text-rose-600 font-bold' : ''
              }"
            >
              <i data-lucide="heart" class="w-4 h-4 ${deal.hasLiked ? 'fill-rose-600 heart-pop' : ''}"></i>
              <span id="likes-count-${deal.id}">${deal.likes}</span>
            </button>

            <!-- Comments Toggle -->
            <button 
              type="button"
              onclick="window.dealHubApp.toggleComments('${deal.id}')"
              class="flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition"
            >
              <i data-lucide="message-circle" class="w-4 h-4"></i>
              <span id="comments-count-${deal.id}">${deal.comments ? deal.comments.length : 0} Comments</span>
            </button>
          </div>

          <!-- Share Button -->
          <div class="flex items-center gap-2">
            <button 
              type="button"
              onclick="window.dealHubApp.shareDealCard('${deal.id}', '${encodeURIComponent(deal.title)}')"
              class="flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition text-slate-500 dark:text-slate-400 hover:text-blue-600"
              title="Share deal"
            >
              <i data-lucide="share" class="w-4 h-4"></i>
              <span class="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>

        <!-- COMMENTS EXPANDABLE DRAWER -->
        <div id="comments-drawer-${deal.id}" class="hidden border-t border-slate-100 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-900/50 p-4 sm:p-5">
          <div class="space-y-3 mb-4 max-h-60 overflow-y-auto" id="comments-list-${deal.id}">
            ${this.renderCommentsList(deal.comments || [])}
          </div>

          <!-- Comment Input Field -->
          <form onsubmit="window.dealHubApp.handleCommentSubmit(event, '${deal.id}')" class="flex items-center gap-2">
            <input 
              type="text" 
              id="comment-input-${deal.id}"
              placeholder="Write a helpful comment or ask a question..." 
              class="flex-1 px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button 
              type="submit" 
              class="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center gap-1"
            >
              <span>Post</span>
              <i data-lucide="send" class="w-3 h-3"></i>
            </button>
          </form>
        </div>

      </article>
    `;
  }

  renderStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    let stars = '';

    for (let i = 0; i < fullStars; i++) {
      stars += `<svg class="w-3.5 h-3.5 fill-current text-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
    }
    if (halfStar) {
      stars += `<svg class="w-3.5 h-3.5 fill-current text-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars += `<svg class="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>`;
    }
    return stars;
  }

  formatReviewText(text) {
    if (!text) return '';
    // Format hashtags or dollar amounts
    return text
      .replace(/(\$\d+(\.\d{2})?)/g, '<span class="font-bold text-emerald-600 dark:text-emerald-400">$1</span>')
      .replace(/(#[a-zA-Z0-9_-]+)/g, '<span class="text-blue-600 dark:text-blue-400 font-medium hover:underline cursor-pointer">$1</span>');
  }

  renderCommentsList(comments) {
    if (!comments || comments.length === 0) {
      return `<p class="text-xs text-slate-400 dark:text-slate-500 italic">No comments yet. Be the first to share your experience!</p>`;
    }
    return comments.map(c => `
      <div class="flex items-start gap-2.5 text-xs">
        <img src="${c.avatar}" class="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700" alt="${c.user}">
        <div class="bg-white dark:bg-slate-800 rounded-xl p-2.5 flex-1 border border-slate-200/70 dark:border-slate-700/50 shadow-2xs">
          <div class="flex items-center justify-between mb-0.5">
            <span class="font-bold text-slate-800 dark:text-slate-200">${c.user}</span>
            <span class="text-[10px] text-slate-400">${c.time}</span>
          </div>
          <p class="text-slate-600 dark:text-slate-300 leading-normal">${c.text}</p>
        </div>
      </div>
    `).join('');
  }

  // -------------------------------------------------------------
  // CARD ACTIONS
  // -------------------------------------------------------------
  toggleLike(dealId) {
    const updated = this.store.toggleLike(dealId);
    if (!updated) return;

    const countElem = document.getElementById(`likes-count-${dealId}`);
    if (countElem) countElem.textContent = updated.likes;

    // Refresh card like button icon state
    const card = document.getElementById(`card-${dealId}`);
    if (card) {
      const btn = card.querySelector(`button[onclick*="toggleLike('${dealId}')"]`);
      const icon = btn?.querySelector('svg, i');
      if (btn) {
        btn.classList.toggle('text-rose-600', updated.hasLiked);
        btn.classList.toggle('font-bold', updated.hasLiked);
      }
      if (icon) {
        icon.classList.toggle('fill-rose-600', updated.hasLiked);
        icon.classList.add('heart-pop');
        setTimeout(() => icon.classList.remove('heart-pop'), 400);
      }
    }
  }

  toggleComments(dealId) {
    const drawer = document.getElementById(`comments-drawer-${dealId}`);
    if (drawer) {
      drawer.classList.toggle('hidden');
      if (!drawer.classList.contains('hidden')) {
        document.getElementById(`comment-input-${dealId}`)?.focus();
      }
    }
  }

  handleCommentSubmit(e, dealId) {
    e.preventDefault();
    const input = document.getElementById(`comment-input-${dealId}`);
    if (!input || !input.value.trim()) return;

    const text = input.value.trim();
    const newComment = this.store.addComment(dealId, text);
    input.value = '';

    const list = document.getElementById(`comments-list-${dealId}`);
    const deal = this.store.deals.find(d => d.id === dealId);
    if (list && deal) {
      list.innerHTML = this.renderCommentsList(deal.comments);
    }

    const count = document.getElementById(`comments-count-${dealId}`);
    if (count && deal) {
      count.textContent = `${deal.comments.length} Comments`;
    }

    Toast.show('Comment posted!', 'success', 2000);
  }

  toggleCardMenu(dealId) {
    const menu = document.getElementById(`menu-${dealId}`);
    if (!menu) return;

    // Close any other open dropdowns
    document.querySelectorAll('[id^="menu-"]').forEach(m => {
      if (m !== menu) m.classList.add('hidden');
    });

    menu.classList.toggle('hidden');

    // Click outside handler
    const closeListener = (event) => {
      if (!menu.contains(event.target) && !event.target.closest(`button[onclick*="toggleCardMenu('${dealId}')"]`)) {
        menu.classList.add('hidden');
        document.removeEventListener('click', closeListener);
      }
    };
    setTimeout(() => document.addEventListener('click', closeListener), 10);
  }

  copyAffiliateLink(link) {
    navigator.clipboard.writeText(link).then(() => {
      Toast.show('Amazon affiliate link copied to clipboard!', 'success');
    }).catch(() => {
      Toast.show('Failed to copy link', 'error');
    });
  }

  shareDealCard(dealId, encodedTitle) {
    const url = window.location.href.split('#')[0] + `#card-${dealId}`;
    const title = decodeURIComponent(encodedTitle);

    if (navigator.share) {
      navigator.share({
        title: `DealHub Amazon Deal: ${title}`,
        url: url
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        Toast.show('Deal link copied to clipboard!', 'info');
      });
    }
  }

  deleteDeal(dealId) {
    if (confirm('Are you sure you want to delete this recommendation post?')) {
      this.store.deleteDeal(dealId);
      this.renderFeed();
      this.renderCategoryNav();
      Toast.show('Deal removed from feed', 'info');
    }
  }

  // -------------------------------------------------------------
  // LIGHTBOX MODAL
  // -------------------------------------------------------------
  openLightbox(dealId) {
    const deal = this.store.deals.find(d => d.id === dealId);
    if (!deal || !this.lightboxModal) return;

    const market = window.AMAZON_MARKETPLACES?.[this.store.currentRegion] || { name: 'United States', domain: 'amazon.com', currency: '$', rate: 1.0, flag: '🇺🇸' };
    const trackingTag = deal.author?.handle?.includes('fatima') ? 'fatimasstudios-20' : 'yahyaamir786-20';
    const localizedLink = this.store.formatAffiliateLink(deal.affiliateLink, trackingTag, this.store.currentRegion);
    const convertedPrice = (deal.price && deal.price > 0) ? (deal.price * (market.rate || 1.0)) : null;

    this.lightboxImg.src = deal.imageUrl;
    this.lightboxTitle.textContent = deal.title;
    this.lightboxLink.href = localizedLink;
    this.lightboxLink.innerHTML = `<span>Check Price on Amazon (${market.domain})</span> <i data-lucide="external-link" class="w-4 h-4 ml-1"></i>`;
    this.lightboxPrice.textContent = (convertedPrice && convertedPrice > 0) 
      ? `${market.currency}${convertedPrice.toFixed(2)}` 
      : `Check on Amazon (${market.domain})`;

    this.lightboxModal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    if (window.lucide) window.lucide.createIcons();
  }

  closeLightbox() {
    if (!this.lightboxModal) return;
    this.lightboxModal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }

  // -------------------------------------------------------------
  // MOBILE DRAWER
  // -------------------------------------------------------------
  openMobileDrawer() {
    this.mobileDrawer?.classList.remove('-translate-x-full');
    this.drawerBackdrop?.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }

  closeMobileDrawer() {
    this.mobileDrawer?.classList.add('-translate-x-full');
    this.drawerBackdrop?.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
}

// -------------------------------------------------------------
// APP INITIALIZATION
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  Toast.init();
  const store = new DealStore();
  window.dealHubApp = new DealHubUI(store);
  if (window.lucide) window.lucide.createIcons();
});

