document.addEventListener('DOMContentLoaded', () => {

  /* ============ OFF-CANVAS RESPONSIVE SIDEBAR ============ */
  const burgerBtn = document.getElementById('burgerBtn');
  const sidebar = document.getElementById('mobileSidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  const closeBtn = document.getElementById('sidebarCloseBtn');

  function openSidebar() {
    sidebar?.classList.add('open');
    backdrop?.classList.add('open');
    document.body.classList.add('sidebar-open');
  }

  function closeSidebar() {
    sidebar?.classList.remove('open');
    backdrop?.classList.remove('open');
    document.body.classList.remove('sidebar-open');
  }

  burgerBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    openSidebar();
  });

  closeBtn?.addEventListener('click', closeSidebar);
  backdrop?.addEventListener('click', closeSidebar);

  // Close sidebar on pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar?.classList.contains('open')) {
      closeSidebar();
    }
  });

  // Close sidebar when clicking any navigation link inside
  sidebar?.querySelectorAll('.sidebar-nav a')?.forEach(link => {
    link.addEventListener('click', () => {
      closeSidebar();
    });
  });

  /* ============ GALLERY SLIDER ============ */
  const hero = document.getElementById('heroImage');
  const thumbs = Array.from(document.querySelectorAll('.thumb'));
  const heroColors = [
    'linear-gradient(135deg,#DCEBFB 0%,#BFDCF7 60%,#A8CFF3 100%)',
    'linear-gradient(135deg,#D6F0E4 0%,#B7E2C9 60%,#9BD3B4 100%)',
    'linear-gradient(135deg,#F7E4D6 0%,#F0C9A8 60%,#E8B588 100%)'
  ];
  let currentImg = 0;

  function setImage(i){
    currentImg = (i + heroColors.length) % heroColors.length;
    hero.style.background = heroColors[currentImg];
    thumbs.forEach((t, idx) => t.classList.toggle('active', idx === currentImg));
  }

  document.getElementById('prevImg')?.addEventListener('click', () => setImage(currentImg - 1));
  document.getElementById('nextImg')?.addEventListener('click', () => setImage(currentImg + 1));
  thumbs.forEach((t, idx) => t.addEventListener('click', () => setImage(idx)));

  /* ============ FLOOR PLANS ============ */
  const plans = {
    '1br': {
      name: '1 Bedroom Apartment',
      desc: 'A walk-in closet and a bathroom with a vanity, toilet, and walk-in shower are also included in the attached bedroom.',
      price: '$300',
      beds: '🛏 1',
      baths: '🛁 1',
      size: '654 sq ft',
      image: 'floorplanone.png'
    },
    '2br': {
      name: '2 Bedrooms Apartment',
      desc: 'A spacious layout with two full bedrooms, an open plan kitchen and living area, and a shared bathroom with a walk-in shower.',
      price: '$450',
      beds: '🛏 2',
      baths: '🛁 1',
      size: '890 sq ft',
      image: 'floorplantwo.png'
    },
    '3br': {
      name: '3 Bedrooms Apartment',
      desc: 'An expansive apartment offering three bedrooms, an open-concept living space, modern kitchen, and two full bathrooms.',
      price: '$600',
      beds: '🛏 3',
      baths: '🛁 2',
      size: '1200 sq ft',
      image: 'floorplanthree.png'
    }
  };

  const fpTabs = document.querySelectorAll('.fp-tab');
  const fpDrawing = document.getElementById('fpDrawing');

  function renderPlan(key){
    const p = plans[key];
    if (!p) return;
    const fpName = document.getElementById('fpName');
    if (!fpName) return;
    fpName.textContent = p.name;
    document.getElementById('fpDesc').textContent = p.desc;
    document.getElementById('fpPrice').textContent = p.price;
    document.getElementById('fpBeds').textContent = p.beds;
    document.getElementById('fpBaths').textContent = p.baths;
    document.getElementById('fpSize').textContent = p.size;
    fpDrawing.innerHTML = `<img src="${p.image}" alt="${p.name} Floor Plan" style="width: 100%; max-width: 480px; height: auto; display: block; border-radius: 8px;">`;
  }

  fpTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      fpTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderPlan(tab.dataset.plan);
    });
  });
  renderPlan('1br');

  /* ============ MAP TOGGLE ============ */
  document.querySelectorAll('.map-toggle button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.map-toggle button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  /* ============ TOUR MODE TOGGLE ============ */
  document.querySelectorAll('.tour-toggle button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tour-toggle button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  /* ============ TOUR FORM SUBMIT ============ */
  const tourForm = document.getElementById('tourForm');
  tourForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('tourMsg').textContent = 'Thanks! Your tour request has been sent — we will confirm shortly.';
    tourForm.reset();
  });

  /* ============ AGENT CONTACT FORMS ============ */
  document.querySelectorAll('.contact-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = form.querySelector('.form-msg');
      msg.textContent = 'Message sent! The agent will get back to you soon.';
      form.reset();
    });
  });

  /* ============ FIND YOUR HOME FORM ============ */
  document.querySelector('.find-form')?.addEventListener('submit', (e) => e.preventDefault());

  /* ============ MORTGAGE CALCULATOR ============ */
  const mTerm = document.getElementById('mTerm');
  const mInterest = document.getElementById('mInterest');
  const mPrice = document.getElementById('mPrice');
  const mDown = document.getElementById('mDown');
  const donutFg = document.getElementById('donutFg');
  const RADIUS = 62;
  const CIRC = 2 * Math.PI * RADIUS;
  if (donutFg) donutFg.style.strokeDasharray = `${CIRC} ${CIRC}`;

  function formatMoney(n){
    return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: n % 1 !== 0 ? 2 : 0 });
  }

  function calcMortgage(){
    if (!mTerm || !mInterest || !mPrice || !mDown) return;
    const years = parseFloat(mTerm.value) || 10;
    const rate = parseFloat(mInterest.value) || 0;
    const price = parseFloat(mPrice.value) || 0;
    let down = parseFloat(mDown.value) || 0;
    if (down > price) { down = price; mDown.value = price; }

    const principal = Math.max(price - down, 0);
    const monthlyRate = rate / 100 / 12;
    const n = years * 12;

    let monthly = 0;
    if (principal > 0 && monthlyRate > 0) {
      monthly = principal * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    } else if (principal > 0) {
      monthly = principal / n;
    }
    const taxesAndDues = 850 + 425;
    const totalMonthly = monthly + taxesAndDues;

    document.getElementById('mMonthly').textContent = formatMoney(Math.round(totalMonthly));
    document.getElementById('mPrincipal').textContent = formatMoney(Math.round(monthly * 100) / 100);
    document.getElementById('mYearsOut').textContent = years;
    document.getElementById('mInterestOut').textContent = rate + '%';

    const downPct = price > 0 ? Math.round((down / price) * 100) : 0;
    document.getElementById('mDownPct').textContent = downPct + '%';

    // Donut: portion representing down payment vs financed amount
    const financedPct = price > 0 ? Math.min(principal / price, 1) : 0;
    const offset = CIRC * (1 - financedPct);
    if (donutFg) donutFg.style.strokeDashoffset = offset;
  }

  [mTerm, mInterest, mPrice, mDown].forEach(el => el?.addEventListener('input', calcMortgage));
  calcMortgage();

  /* ============ FEATURED PROPERTIES SLIDER ============ */
  const featured = [
    { title: 'Villa on Hollywood Boulevard', addr: 'Harrisons Lane, Hollywood, FL 33095, USA', gradient: 'linear-gradient(135deg,#DCEBFB,#A8CFF3)' },
    { title: 'Single Home at Florida 5', addr: 'Miami-Dade County, Pinecrest, FL, USA', gradient: 'linear-gradient(135deg,#F7E4D6,#E8B588)' },
    { title: 'Villa in Coral Gables', addr: 'Deering Bay Drive, Coral Gables, FL 33158, USA', gradient: 'linear-gradient(135deg,#D6F0E4,#9BD3B4)' }
  ];
  let featIdx = 0;
  const featTitle = document.getElementById('featTitle');
  const featAddr = document.getElementById('featAddr');
  const featuredSlide = document.getElementById('featuredSlide');
  const dots = document.querySelectorAll('#featuredDots span');

  function renderFeatured(){
    if (!featTitle) return;
    const f = featured[featIdx];
    featTitle.textContent = f.title;
    featAddr.textContent = f.addr;
    featuredSlide.style.background = f.gradient;
    dots.forEach((d, i) => d.classList.toggle('active', i === featIdx));
  }
  document.getElementById('featuredNext')?.addEventListener('click', () => {
    featIdx = (featIdx + 1) % featured.length;
    renderFeatured();
  });
  dots.forEach((d, i) => d.addEventListener('click', () => { featIdx = i; renderFeatured(); }));
  renderFeatured();

  /* ============ SIMILAR PROPERTIES ============ */
  const similarTabBtns = document.querySelectorAll('#similarTabs button');
  const similarTabContents = document.querySelectorAll('.similar-tab-content');

  similarTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons and hide all contents
      similarTabBtns.forEach(b => b.classList.remove('active'));
      similarTabContents.forEach(c => c.style.display = 'none');
      
      // Add active class to clicked button and show corresponding content
      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      document.getElementById(targetId).style.display = 'block';
    });
  });

  /* ============ GALLERY PAGE LOGIC ============ */
  const galleryTabs = document.querySelectorAll('#galleryTabs button');
  const galleryPanes = document.querySelectorAll('.gallery-tab-pane');
  const galleryPagination = document.getElementById('galleryPagination');
  
  if (galleryTabs.length > 0 && galleryPanes.length > 0) {
    // Inject overlay to all gallery items
    document.querySelectorAll('.gallery-item-thumb').forEach(thumb => {
      if(!thumb.querySelector('.gallery-overlay')) {
        const titleEl = thumb.nextElementSibling;
        const title = titleEl ? titleEl.textContent.trim() : 'Property Details';
        thumb.innerHTML += `
          <div class="gallery-overlay">
            <a href="property-details.html?property=${encodeURIComponent(title)}" class="btn btn-primary overlay-btn">View Details</a>
            <a href="property-details.html?property=${encodeURIComponent(title)}" class="btn btn-white overlay-btn">Property Details Page</a>
          </div>
        `;
      }
    });

    let currentPage = 1;
    const itemsPerPage = 5;

    function renderGallery() {
      // Find the active pane
      let activePane = null;
      galleryPanes.forEach(pane => {
        if (pane.style.display === 'block') {
          activePane = pane;
        }
      });
      if (!activePane) return;

      const allItems = Array.from(activePane.querySelectorAll('.gallery-item'));
      
      // Hide all items first
      allItems.forEach(item => item.style.display = 'none');

      const totalPages = Math.ceil(allItems.length / itemsPerPage);
      if (currentPage > totalPages) currentPage = totalPages || 1;

      // Show only items for current page
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const currentItems = allItems.slice(start, end);

      currentItems.forEach(item => item.style.display = 'flex');

      // Render pagination
      let pagHtml = '';
      const displayTotalPages = totalPages > 0 ? totalPages : 1;
      
      for (let i = 1; i <= displayTotalPages; i++) {
        pagHtml += `<button class="${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
      }
      if (currentPage < displayTotalPages) {
        pagHtml += `<button class="next-btn" data-page="${currentPage + 1}">Next &rsaquo;</button>`;
      }
      
      galleryPagination.innerHTML = pagHtml;

      // Bind pagination events
      galleryPagination.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
          currentPage = parseInt(btn.getAttribute('data-page'));
          renderGallery();
        });
      });
    }

    galleryTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from buttons
        galleryTabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Hide all panes
        galleryPanes.forEach(p => p.style.display = 'none');
        
        // Show target pane
        const targetId = btn.getAttribute('data-tab');
        document.getElementById(targetId).style.display = 'block';

        // Reset page and render
        currentPage = 1;
        renderGallery();
      });
    });

    renderGallery();
  }

  /* ============ PROPERTIES LIST PAGE LOGIC ============ */
  const viewGridBtn = document.getElementById('viewGrid');
  const viewListBtn = document.getElementById('viewList');
  const propertiesView = document.getElementById('propertiesView');
  
  if (viewGridBtn && viewListBtn && propertiesView) {
    viewGridBtn.addEventListener('click', () => {
      viewGridBtn.classList.add('active');
      viewListBtn.classList.remove('active');
      propertiesView.classList.remove('list-view');
      propertiesView.classList.add('grid-view');
    });
    viewListBtn.addEventListener('click', () => {
      viewListBtn.classList.add('active');
      viewGridBtn.classList.remove('active');
      propertiesView.classList.remove('grid-view');
      propertiesView.classList.add('list-view');
    });
  }

  /* ============ MEDIA MODALS ============ */
  const mediaModal = document.getElementById('mediaModal');
  const closeModalBtn = document.getElementById('closeModal');
  const modalGallery = document.getElementById('modalGallery');
  const modalVideo = document.getElementById('modalVideo');
  
  if (mediaModal) {
    // Open Image Gallery Modal
    document.querySelectorAll('.camera-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        modalVideo.style.display = 'none';
        modalGallery.style.display = 'block';
        mediaModal.style.display = 'flex';
      });
    });

    // Open Video Modal
    document.querySelectorAll('.video-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        modalGallery.style.display = 'none';
        modalVideo.style.display = 'flex';
        mediaModal.style.display = 'flex';
      });
    });

    // Close Modal
    closeModalBtn.addEventListener('click', () => {
      mediaModal.style.display = 'none';
    });
    mediaModal.addEventListener('click', (e) => {
      if(e.target === mediaModal) mediaModal.style.display = 'none';
    });

    // Basic Modal Gallery functionality (Cycle backgrounds)
    const modalImage = document.getElementById('modalImage');
    const modalPrev = document.getElementById('modalPrev');
    const modalNext = document.getElementById('modalNext');
    const placeholderColors = ['#DCEBFB', '#D6F0E4', '#F7E4D6', '#E1E9F3'];
    let modalImgIdx = 0;

    if (modalPrev && modalNext) {
      modalPrev.addEventListener('click', () => {
        modalImgIdx = (modalImgIdx - 1 + placeholderColors.length) % placeholderColors.length;
        modalImage.style.backgroundColor = placeholderColors[modalImgIdx];
      });
      modalNext.addEventListener('click', () => {
        modalImgIdx = (modalImgIdx + 1) % placeholderColors.length;
        modalImage.style.backgroundColor = placeholderColors[modalImgIdx];
      });
    }
  }

  /* ============ ABOUT TABS HORIZONTAL SCROLL & ARROWS ============ */
  const aboutTabs = document.getElementById('aboutTabs');
  const tabLeftBtn = document.getElementById('aboutTabLeft');
  const tabRightBtn = document.getElementById('aboutTabRight');

  if (aboutTabs && tabLeftBtn && tabRightBtn) {
    tabLeftBtn.addEventListener('click', (e) => {
      e.preventDefault();
      aboutTabs.scrollBy({ left: -140, behavior: 'smooth' });
    });

    tabRightBtn.addEventListener('click', (e) => {
      e.preventDefault();
      aboutTabs.scrollBy({ left: 140, behavior: 'smooth' });
    });

    function updateTabArrows() {
      const maxScroll = aboutTabs.scrollWidth - aboutTabs.clientWidth;
      if (maxScroll <= 0) {
        tabLeftBtn.style.opacity = '0.35';
        tabLeftBtn.style.pointerEvents = 'none';
        tabRightBtn.style.opacity = '0.35';
        tabRightBtn.style.pointerEvents = 'none';
        return;
      }
      tabLeftBtn.style.opacity = aboutTabs.scrollLeft <= 5 ? '0.35' : '1';
      tabLeftBtn.style.pointerEvents = aboutTabs.scrollLeft <= 5 ? 'none' : 'auto';
      
      tabRightBtn.style.opacity = (aboutTabs.scrollLeft >= maxScroll - 5) ? '0.35' : '1';
      tabRightBtn.style.pointerEvents = (aboutTabs.scrollLeft >= maxScroll - 5) ? 'none' : 'auto';
    }

    aboutTabs.addEventListener('scroll', updateTabArrows);
    window.addEventListener('resize', updateTabArrows);
    setTimeout(updateTabArrows, 100);
  }
});

/* ============ MAIN CONTACT FORM ============ */
const mainContactForm = document.getElementById('mainContactForm');
if (mainContactForm) {
  mainContactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = document.getElementById('mainContactMsg');
    if (msg) {
      msg.textContent = 'Thanks for reaching out! We will get back to you shortly.';
    }
    mainContactForm.reset();
  });
}

