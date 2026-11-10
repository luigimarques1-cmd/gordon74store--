(() => {
  'use strict';
  const cfg = window.CATALOGO_CONFIG || {};
  const loja = cfg.loja || {};
  const root = document.getElementById('tenis-chuteiras').shadowRoot;
  const get = (id) => root.getElementById(id);
  const text = (value, fallback = '') => typeof value === 'string' && value.trim() ? value.trim() : fallback;
  const validUrl = (raw) => {
    if (!raw || typeof raw !== 'string') return '';
    try { const u = new URL(raw.trim(), window.location.href); return ['http:', 'https:'].includes(u.protocol) ? u.href : ''; }
    catch { return ''; }
  };
  const imageUrl = (raw) => validUrl(raw);
  const make = (tag, cls, content) => {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (content !== undefined) el.textContent = content;
    return el;
  };
  const searchItems = [];

  function setupExternalLink(element, href, showWithoutLink = false) {
    const safe = validUrl(href);
    element.hidden = !safe && !showWithoutLink;
    if (safe) { element.href = safe; element.removeAttribute('aria-disabled'); }
    else { element.removeAttribute('href'); element.setAttribute('aria-disabled', 'true'); element.title = 'Adicione o link no arquivo config.js'; }
  }

  function setupBrandAndContacts() {
    document.title = `${text(loja.nome, 'Catálogo de Chuteiras')} | Chuteiras`;
    const logo = get('storeLogo');
    const src = imageUrl(loja.logoUrl);
    if (src) {
      logo.onload = () => { logo.hidden = false; get('storeLogoFallback').hidden = true; };
      logo.onerror = () => { logo.hidden = true; get('storeLogoFallback').hidden = false; };
      logo.src = src;
    }
    const number = String(loja.whatsappNumero || '').replace(/\D/g, '');
    const wa = number.length >= 10 ? `https://wa.me/${number}?text=${encodeURIComponent(text(loja.mensagemWhatsapp, 'Olá! Vim pelo catálogo de chuteiras.'))}` : '';
    setupExternalLink(get('headerWhatsapp'), wa);
    setupExternalLink(get('floatingWhatsapp'), wa);
  }

  function addImage(holder, url, alt, fallback) {
    const src = imageUrl(url);
    if (!src) return;
    const img = document.createElement('img');
    img.alt = alt;
    img.loading = holder.id === 'heroBanner' ? 'eager' : 'lazy';
    if (holder.id === 'heroBanner') img.fetchPriority = 'high';
    img.decoding = 'async';
    img.onload = () => { if (fallback) fallback.hidden = true; };
    img.onerror = () => { img.remove(); if (fallback) fallback.hidden = false; };
    holder.append(img);
    img.src = src;
  }

  function setupBanner(holder, data, alt) {
    const info = data || {};
    const fallback = holder.querySelector('.visual-fallback');
    addImage(holder, info.image, alt, fallback);
    const href = validUrl(info.url);
    if (href) {
      holder.classList.add('is-link');
      holder.setAttribute('role', 'link');
      holder.setAttribute('tabindex', '0');
      holder.setAttribute('aria-label', `${alt} — abrir catálogo`);
      holder.style.cursor = 'pointer';
      const open = () => window.open(href, '_blank', 'noopener,noreferrer');
      holder.addEventListener('click', open);
      holder.addEventListener('keydown', (event) => { if (event.key === 'Enter') open(); });
    }
  }

  function placeholder() {
    const div = make('div', 'image-placeholder');
    div.setAttribute('aria-hidden', 'true');
    return div;
  }

  function squareCard(item, index) {
    const href = validUrl(item.url);
    const card = make(href ? 'a' : 'div', `square-card${href ? ' linked' : ''}`);
    card.id = `banner-quadrado-${index + 1}`;
    card.setAttribute('aria-label', text(item.titulo, `Banner ${index + 1}`));
    if (href) { card.href = href; card.target = '_blank'; card.rel = 'noopener noreferrer'; }
    const fallback = placeholder();
    card.append(fallback);
    addImage(card, item.image, text(item.titulo, `Banner ${index + 1}`), fallback);
    searchItems.push({ label: text(item.titulo, `Banner ${index + 1}`), type: 'Catálogo de tênis', href, id: card.id });
    return card;
  }

  function renderCarousel() {
    const target = get('squareCarousel');
    const items = (Array.isArray(cfg.carrossel) ? cfg.carrossel : []).slice(0, 12);
    items.forEach((item, i) => target.append(squareCard(item || {}, i)));
    const pages = Math.max(1, Math.ceil(items.length / 2));
    const prev = get('carouselPrevious');
    const next = get('carouselNext');
    let currentPage = 0;
    let pauseUntil = 0;
    let interacting = false;
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    function step() {
      const first = target.firstElementChild;
      if (!first) return 0;
      const cardWidth = first.getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(target).columnGap) || 0;
      return 2 * (cardWidth + gap);
    }
    function setPage(page, manual = false) {
      const wrapped = page < 0 || page >= pages;
      currentPage = ((page % pages) + pages) % pages;
      if (manual) pauseUntil = Date.now() + 6500;
      target.scrollTo({ left: currentPage * step(), behavior: wrapped || motionPreference.matches ? 'instant' : 'smooth' });
    }
    prev.addEventListener('click', () => setPage(currentPage - 1, true));
    next.addEventListener('click', () => setPage(currentPage + 1, true));
    target.addEventListener('scroll', () => {
      const width = step();
      if (width > 0) currentPage = Math.min(pages - 1, Math.max(0, Math.round(target.scrollLeft / width)));
    }, { passive: true });
    target.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') { event.preventDefault(); setPage(currentPage + 1, true); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); setPage(currentPage - 1, true); }
    });
    target.addEventListener('pointerdown', () => { interacting = true; pauseUntil = Date.now() + 6500; });
    window.addEventListener('pointerup', () => { interacting = false; });
    window.addEventListener('pointercancel', () => { interacting = false; });
    target.addEventListener('wheel', () => { pauseUntil = Date.now() + 6500; }, { passive: true });
    window.addEventListener('resize', () => target.scrollTo({ left: currentPage * step(), behavior: 'instant' }));
    // A cada 4,5 s avança duas imagens. Ao terminar, reinicia do primeiro par.
    if (items.length > 2) {
      window.setInterval(() => {
        if (document.hidden || motionPreference.matches || interacting || Date.now() < pauseUntil) return;
        if (target.matches(':hover') || target.contains(document.activeElement)) return;
        setPage(currentPage + 1);
      }, 4500);
    }
    target.scrollTo({ left: 0, behavior: 'instant' });
  }

  function circleCard(item, sectionNumber, index) {
    const href = validUrl(item.url);
    const card = make(href ? 'a' : 'div', `round-card${href ? ' linked' : ''}`);
    card.id = `secao-${sectionNumber}-categoria-${index + 1}`;
    if (href) { card.href = href; card.target = '_blank'; card.rel = 'noopener noreferrer'; }
    const thumb = make('div', 'round-thumb');
    const fallback = make('span', 'round-fallback', '⚽');
    thumb.append(fallback);
    addImage(thumb, item.image, text(item.titulo, 'Categoria de chuteiras'), fallback);
    card.append(thumb, make('span', 'round-name', text(item.titulo, `Modelo ${index + 1}`)));
    searchItems.push({ label: text(item.titulo, `Modelo ${index + 1}`), type: `Coleção ${sectionNumber}`, href, id: card.id });
    return card;
  }

  function renderCollections() {
    const root = get('collectionSections');
    (Array.isArray(cfg.secoes) ? cfg.secoes : []).slice(0, 4).forEach((section, ix) => {
      const count = ix + 1;
      const container = make('section', 'content-section collection-section');
      container.id = `colecao-${count}`;
      container.setAttribute('aria-label', text(section.titulo, `Coleção ${count}`));
      const banner = make('div', 'visual-banner collection-banner placeholder-banner');
      setupBanner(banner, section.banner, `Banner da ${text(section.titulo, `coleção ${count}`)}`);
      const grid = make('div', 'round-grid');
      const colecoes = (Array.isArray(section.colecoes) ? section.colecoes : []).slice(0, 3);
      if (colecoes.length === 2) grid.classList.add('two-items');
      colecoes.forEach((entry, i) => grid.append(circleCard(entry || {}, count, i)));
      container.append(banner, grid);
      root.append(container);
      searchItems.push({ label: text(section.titulo, `Coleção ${count}`), type: 'Marca', href: '', id: container.id });
    });
  }

  function setupMenuAndSearch() {
    const overlay = get('uiOverlay'), menu = get('sideMenu'), search = get('searchPanel');
    const menuBtn = get('menuOpen'), searchBtn = get('searchOpen');
    let focusedBefore = null;
    function closePanels() {
      const hadPanel = menu.classList.contains('open') || search.classList.contains('open');
      menu.classList.remove('open'); search.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true'); search.setAttribute('aria-hidden', 'true');
      menuBtn.setAttribute('aria-expanded', 'false'); searchBtn.setAttribute('aria-expanded', 'false');
      overlay.hidden = true; document.body.style.overflow = '';
      if (hadPanel && focusedBefore?.focus) focusedBefore.focus();
    }
    function openPanel(panel) {
      focusedBefore = document.activeElement;
      closePanels();
      overlay.hidden = false; document.body.style.overflow = 'hidden';
      panel.classList.add('open'); panel.setAttribute('aria-hidden', 'false');
      (panel === menu ? menuBtn : searchBtn).setAttribute('aria-expanded', 'true');
      (panel === menu ? get('menuClose') : get('searchInput')).focus();
    }
    menuBtn.addEventListener('click', () => openPanel(menu));
    searchBtn.addEventListener('click', () => { openPanel(search); renderSearch(''); });
    get('menuClose').addEventListener('click', closePanels);
    get('searchClose').addEventListener('click', closePanels);
    overlay.addEventListener('click', closePanels);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanels(); });

    const links = get('menuLinks');
    function addNavigation(label, destination, cls = 'menu-primary') {
      const a = make('a', cls, label);
      a.href = destination;
      if (/^https?:\/\//.test(destination)) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
      a.addEventListener('click', closePanels);
      return a;
    }
    links.append(
      addNavigation('INÍCIO', '#inicio'),
      addNavigation('CATÁLOGO DE TÊNIS', '#categorias-principais')
    );
    const titles = ['CHUTEIRAS NIKE', 'CHUTEIRAS ADIDAS', 'CHUTEIRAS PUMA', 'OUTRAS MARCAS'];
    (Array.isArray(cfg.secoes) ? cfg.secoes : []).slice(0, 4).forEach((section, idx) => {
      const detail = make('details', 'menu-group');
      const summary = make('summary', 'menu-group-title');
      summary.append(document.createTextNode(titles[idx] || text(section.titulo, `MARCA ${idx + 1}`)));
      detail.append(summary);
      const children = make('div', 'menu-group-items');
      (Array.isArray(section.colecoes) ? section.colecoes : []).slice(0, 3).forEach((item, i) => {
        const href = validUrl(item.url) || `#secao-${idx + 1}-categoria-${i + 1}`;
        children.append(addNavigation(text(item.titulo, `MODELO ${i + 1}`), href, 'menu-secondary'));
      });
      detail.append(children);
      links.append(detail);
    });

    const input = get('searchInput');
    input.addEventListener('input', () => renderSearch(input.value));
    function renderSearch(query) {
      const results = get('searchResults'); results.replaceChildren();
      const val = query.toLocaleLowerCase('pt-BR').trim();
      if (!val) { results.append(make('div', 'search-none', 'Digite um nome para encontrar rapidamente uma categoria ou coleção.')); return; }
      const found = searchItems.filter(item => item.label.toLocaleLowerCase('pt-BR').includes(val));
      if (!found.length) { results.append(make('div', 'search-none', 'Nenhuma categoria encontrada. Tente outro nome.')); return; }
      found.forEach(item => {
        const a = make('a', 'search-result', item.label);
        a.href = item.href || `#${item.id}`;
        if (item.href) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
        a.append(make('small', '', item.type + (item.href ? ' · Abrir catálogo ↗' : ' · Ver na página')));
        a.addEventListener('click', () => { if (!item.href) closePanels(); });
        results.append(a);
      });
    }
  }

  setupBanner(get('heroBanner'), cfg.topo?.bannerPrincipal, 'Banner principal');
  setupBanner(get('categoriesBanner'), cfg.topo?.bannerCategorias, 'Banner horizontal de categorias');
  renderCarousel();
  renderCollections();
  window.GORDON_FOOTWEAR_SEARCH = searchItems;
})();
