/* Integração da vitrine de tênis e chuteiras no FINAL da landing page de camisas.
   Shadow DOM isola os estilos originais sem duplicar cabeçalho e WhatsApp. */
(() => {
  const container = document.getElementById('conteudo');
  if (!container) return;
  const section = document.createElement('section');
  section.id = 'tenis-chuteiras';
  section.setAttribute('aria-label', 'Catálogos de tênis e chuteiras');
  container.append(section);
  const root = section.attachShadow({mode:'open'});
  root.innerHTML = `
    <link rel="stylesheet" href="./tenis/style.css">
    <style>
      :host { display:block; width:100%; background:#080808; color:#fff;
        font-family:Inter,Arial,Helvetica,sans-serif; -webkit-font-smoothing:antialiased;
        --bg:#080808; --panel:#111; --panel2:#191919; --line:#282828;
        --white:#fff; --muted:#aaa; --accent:#f0f0f0; --accent-soft:#d4d4d4;
        --max:1180px; --radius:13px; --carousel-gap:14px; }
      .hero-wrap,.content-section { scroll-margin-top:155px; }
      .hero-wrap { padding-top:16px; }
      @media(max-width:640px) { :host{--carousel-gap:9px;} .hero-wrap,.content-section { scroll-margin-top:115px; } }
    </style>
    <section class="hero-wrap" id="tenis-banner-principal" aria-label="Banner inicial de tênis">
      <div id="heroBanner" class="visual-banner hero-banner placeholder-banner"></div>
    </section>
    <section class="content-section catalog-section" id="categorias-principais" aria-label="Catálogo de tênis">
      <div id="categoriesBanner" class="visual-banner category-banner placeholder-banner"></div>
      <div class="carousel-shell" aria-label="Carrossel de catálogos de tênis">
        <button class="carousel-control" id="carouselPrevious" type="button" aria-label="Ver banners anteriores">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 5-7 7 7 7"/></svg>
        </button>
        <div id="squareCarousel" class="square-carousel" tabindex="0" role="region" aria-roledescription="carrossel" aria-label="Onze banners de catálogo; dois por vez"></div>
        <button class="carousel-control" id="carouselNext" type="button" aria-label="Ver próximos banners">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 5 7 7-7 7"/></svg>
        </button>
      </div>
    </section>
    <div id="collectionSections" aria-label="Coleções de chuteiras"></div>
  `;
})();
