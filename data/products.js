/* Suspiros del Alma — Catálogo v3
   Fuente viva: Google Sheets publicado como CSV.
   Este archivo NO contiene datos privados. */
window.SDA_CATALOG_CONFIG = {
  productsCsv: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRmVrGzFLuB3osIvpJcxWxkgPIGO6pJhxQVXiJaEnWPkNssnXLjIaXz-CfDC2ojHZ2aUM39LUNmMIMG/pub?gid=1733573905&single=true&output=csv",
  variantsCsv: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRmVrGzFLuB3osIvpJcxWxkgPIGO6pJhxQVXiJaEnWPkNssnXLjIaXz-CfDC2ojHZ2aUM39LUNmMIMG/pub?gid=1920172241&single=true&output=csv",
  imagesCsv: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRmVrGzFLuB3osIvpJcxWxkgPIGO6pJhxQVXiJaEnWPkNssnXLjIaXz-CfDC2ojHZ2aUM39LUNmMIMG/pub?gid=996668068&single=true&output=csv",
  whatsapp: "5491139384518",
  locale: "es-AR",
  currency: "ARS"
};

(() => {
  const CONFIG = window.SDA_CATALOG_CONFIG;

  function parseCSV(text) {
    const rows = [];
    let row = [], cell = "", quoted = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (quoted) {
        if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
        else if (ch === '"') quoted = false;
        else cell += ch;
      } else {
        if (ch === '"') quoted = true;
        else if (ch === ',') { row.push(cell); cell = ""; }
        else if (ch === '\n') { row.push(cell); rows.push(row); row = []; cell = ""; }
        else if (ch !== '\r') cell += ch;
      }
    }
    if (cell.length || row.length) { row.push(cell); rows.push(row); }
    return rows.filter(r => r.some(v => String(v).trim() !== ""));
  }

  function objectsFromCSV(text) {
    const rows = parseCSV(text);
    if (!rows.length) return [];
    const headers = rows[0].map(h => String(h).trim());
    return rows.slice(1).map(values => {
      const out = {};
      headers.forEach((h, i) => out[h] = values[i] ?? "");
      return out;
    });
  }

  const clean = v => String(v ?? "").trim();
  const yes = v => ["SI","SÍ","TRUE","1","YES"].includes(clean(v).toUpperCase());

  function numberValue(value) {
    let s = clean(value);
    if (!s) return null;
    s = s.replace(/\s/g, "").replace(/[$€£]/g, "");
    const comma = s.lastIndexOf(",");
    const dot = s.lastIndexOf(".");
    if (comma >= 0 && dot >= 0) {
      if (comma > dot) s = s.replace(/\./g, "").replace(",", ".");
      else s = s.replace(/,/g, "");
    } else if (comma >= 0) {
      const after = s.length - comma - 1;
      if (after === 3 || /^-?\d{1,3}(,\d{3})+$/.test(s)) s = s.replace(/,/g, "");
      else s = s.replace(",", ".");
    } else if (dot >= 0) {
      const after = s.length - dot - 1;
      if (after === 3 || /^-?\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, "");
    }
    s = s.replace(/[^0-9.-]/g, "");
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  }

  function splitPipe(value) {
    return clean(value).split("|").map(x => x.trim()).filter(Boolean);
  }

  function unique(arr) {
    return [...new Set(arr.filter(Boolean))];
  }

  function fallbackProducts() {
    return [
      ["colgante-ama-y-se-feliz","Colgante “Ama y sé feliz”","colgante","Decoración","assets/productos/colgante-ama-y-se-feliz.png"],
      ["colgante-arriesgate-equivocate-y-vive","Colgante “Arriesgate, equivocate y vive”","colgante","Decoración","assets/productos/colgante-arriesgate-equivocate-y-vive.png"],
      ["colgante-disfruta-la-vida","Colgante “Disfruta la vida”","colgante","Decoración","assets/productos/colgante-disfruta-la-vida.png"],
      ["colgante-todo-vale-la-pena","Colgante “Todo vale la pena”","colgante","Decoración","assets/productos/colgante-todo-vale-la-pena.png"],
      ["cascada-humo-gato-maneki-neko","Cascada de humo Gato Maneki Neko","cascada_humo","Cascadas y conitos","assets/productos/porta-sahumerio-gato-maneki-neko.png"],
      ["cascada-humo-om-mandala","Cascada de humo Om Mandala","cascada_humo","Cascadas y conitos","assets/productos/porta-sahumerio-om-mandala.png"],
      ["cascada-humo-mariposa","Cascada de humo Mariposa","cascada_humo","Cascadas y conitos","assets/productos/porta-sahumerio-mariposa.png"],
      ["cascada-humo-buda","Cascada de humo Buda","cascada_humo","Cascadas y conitos","assets/productos/porta-sahumerio-buda.png"],
      ["cascada-humo-om","Cascada de humo Om","cascada_humo","Cascadas y conitos","assets/productos/porta-sahumerio-om.png"],
      ["mix-defumacion-artesanal","Mix de defumación artesanal","defumacion","Defumación","assets/productos/mix-defumacion-artesanal.png"],
      ["difusor-auto-colgante","Difusor para auto colgante","difusor_auto","Difusores y aromas","assets/productos/difusores-auto-fragancias.png"],
      ["difusor-ambiental-varillas","Difusor ambiental con varillas","difusor_ambiental","Difusores y aromas","assets/productos/difusores-ambientales-con-varillas.png"],
      ["hornillo-ceramica-lila","Hornillo de cerámica lila","hornillo","Hornillos","assets/productos/hornillo-ceramica-lila.png"],
      ["hornillo-ceramica-fucsia","Hornillo de cerámica fucsia","hornillo","Hornillos","assets/productos/hornillo-ceramica-fucsia.png"],
      ["hornillo-buda-blanco","Hornillo Buda blanco","hornillo","Hornillos","assets/productos/hornillo-buda-blanco.png"],
      ["set-regalo-hornillo-rosa","Set de regalo con hornillo rosa","set_regalo","Combos y regalos","assets/productos/set-regalo-hornillo-rosa.png"],
      ["oferta-sahumerios-24-paquetes-1200-unidades","Oferta mayorista: 24 paquetes de sahumerios artesanales","oferta_mayorista","Sahumerios","assets/productos/oferta-sahumerios-24-paquetes-1200-unidades.png"],
      ["promo-sahumerios-artesanales-premium","Sahumerios artesanales premium","promo_sahumerios","Sahumerios","assets/productos/promo-sahumerios-artesanales-premium.png"]
    ].map((r, i) => ({
      id:r[0], name:r[1], slug:r[0], type:r[2], brand:"Suspiros del Alma",
      primaryCategory:r[3], categories:[r[3]], short:"Catálogo Suspiros del Alma.",
      description:"Consultanos por disponibilidad, variantes y precio actualizado.",
      price:null, showPrice:false, stock:null, minStock:null,
      featured:i<10, new:true, offer:r[0].includes("oferta") || r[0].includes("promo"),
      combo:r[0].includes("set-regalo"), image:r[4], images:[{url:r[4],path:r[4],alt:r[1],order:1}], order:i+1,
      variants:[], variantRows:[], aroma:"", color:"", presentation:"Unidad",
      material:"", usage:"", care:"", shipping:"", tags:[r[1],r[3]].join(" ").toLowerCase()
    }));
  }

  async function fetchCSV(url) {
    const res = await fetch(url + (url.includes("?") ? "&" : "?") + "_=" + Date.now(), {
      method: "GET",
      cache: "no-store"
    });
    if (!res.ok) throw new Error(`No se pudo leer Google Sheets (${res.status})`);
    return objectsFromCSV(await res.text());
  }

  async function loadCatalog() {
    try {
      const [productRows, variantRows] = await Promise.all([
        fetchCSV(CONFIG.productsCsv),
        fetchCSV(CONFIG.variantsCsv)
      ]);

      let imageRows = [];
      if (CONFIG.imagesCsv) {
        try {
          imageRows = await fetchCSV(CONFIG.imagesCsv);
        } catch (imageError) {
          console.warn("Suspiros del Alma: la hoja IMAGENES todavía no está disponible como CSV público. El catálogo seguirá usando imágenes principales y de variantes.", imageError);
        }
      }

      const variantsByProduct = new Map();
      variantRows.filter(r => yes(r.activo)).forEach(r => {
        const id = clean(r.id_producto);
        if (!variantsByProduct.has(id)) variantsByProduct.set(id, []);
        variantsByProduct.get(id).push({
          id: clean(r.id_variante),
          type: clean(r.tipo_variante),
          value: clean(r.valor_variante),
          sku: clean(r.sku),
          price: numberValue(r.precio_minorista),
          wholesalePrice: numberValue(r.precio_mayorista),
          stock: clean(r.stock) === "" ? null : numberValue(r.stock),
          active: yes(r.activo),
          image: clean(r.imagen_variante)
        });
      });

      const imagesByProduct = new Map();
      imageRows.filter(r => yes(r.activa)).forEach(r => {
        const id = clean(r.id_producto);
        const path = clean(r.ruta_web);
        const publicUrl = clean(r.url_publica);
        const url = path || publicUrl;
        if (!id || !url) return;
        if (!imagesByProduct.has(id)) imagesByProduct.set(id, []);
        imagesByProduct.get(id).push({
          id: clean(r.id_imagen),
          filename: clean(r.nombre_archivo),
          path,
          publicUrl,
          url,
          alt: clean(r.texto_alt),
          order: numberValue(r.orden) ?? 999
        });
      });
      imagesByProduct.forEach(list => list.sort((a,b) => a.order - b.order));

      const products = productRows
        .filter(r => yes(r.activo))
        .map((r, index) => {
          const id = clean(r.id);
          const vrows = variantsByProduct.get(id) || [];
          const primary = clean(r.categoria_principal) || "Productos";
          const secondary = splitPipe(r.categorias_secundarias);
          const price = numberValue(r.precio_minorista);
          const stock = clean(r.stock) === "" ? null : numberValue(r.stock);
          const minStock = clean(r.stock_minimo) === "" ? null : numberValue(r.stock_minimo);
          const variants = unique(vrows.map(v => v.value));
          const fragSheet = splitPipe(r.fragancia);
          const allVariants = unique([...variants, ...fragSheet]);
          const mainImage = clean(r.imagen_principal);
          const gallery = [...(imagesByProduct.get(id) || [])];
          if (mainImage && !gallery.some(img => img.url === mainImage || img.path === mainImage)) {
            gallery.unshift({id:`main-${id}`,filename:mainImage.split('/').pop(),path:mainImage,publicUrl:"",url:mainImage,alt:clean(r.nombre)||id,order:0});
          }

          return {
            id,
            name: clean(r.nombre) || id,
            slug: clean(r.slug) || id,
            type: clean(r.tipo_producto),
            brand: clean(r.marca) || "Suspiros del Alma",
            primaryCategory: primary,
            categories: unique([primary, ...secondary]),
            short: clean(r.descripcion_corta),
            description: clean(r.descripcion_larga) || clean(r.descripcion_corta),
            price,
            wholesalePrice: numberValue(r.precio_mayorista),
            showPrice: yes(r.mostrar_precio) && price !== null && price > 0,
            stock,
            minStock,
            stockStatus: clean(r.estado_stock),
            featured: yes(r.destacado),
            new: yes(r.novedad),
            offer: yes(r.oferta),
            combo: yes(r.combo),
            color: clean(r.color),
            presentation: clean(r.presentacion),
            image: mainImage,
            images: gallery,
            order: numberValue(r.orden) ?? index + 1,
            aroma: clean(r.fragancia),
            material: clean(r.material),
            usage: clean(r.uso),
            care: clean(r.cuidados),
            shipping: clean(r.envio),
            seoTitle: clean(r.seo_titulo),
            seoDescription: clean(r.seo_descripcion),
            variants: allVariants,
            variantRows: vrows,
            tags: unique([
              clean(r.nombre), clean(r.marca), primary, ...secondary,
              clean(r.tipo_producto), clean(r.fragancia), clean(r.color),
              ...allVariants
            ]).join(" ").toLowerCase()
          };
        })
        .sort((a,b) => a.order - b.order);

      if (!products.length) throw new Error("La hoja PRODUCTOS no devolvió registros activos.");

      window.PRODUCTS = products;
      window.VARIANTS = variantRows;
      window.PRODUCT_IMAGES = imageRows;
      window.SDA_DATA_SOURCE = {
        ok: true, source: "Google Sheets", loadedAt: new Date().toISOString(),
        products: products.length, variants: variantRows.length, images: imageRows.length
      };
      return {products, variants: variantRows, images: imageRows};
    } catch (error) {
      console.error("Suspiros del Alma: no se pudo cargar Google Sheets.", error);
      const products = fallbackProducts();
      window.PRODUCTS = products;
      window.VARIANTS = [];
      window.PRODUCT_IMAGES = [];
      window.SDA_DATA_SOURCE = {
        ok: false, source: "Respaldo local", error: String(error),
        loadedAt: new Date().toISOString(), products: products.length, variants: 0, images: 0
      };
      return {products, variants: [], images: []};
    }
  }

  window.SDA_DATA_READY = loadCatalog();

})();

/* Carruseles y galería — cargados después de que app.js y producto.js terminaron. */
window.addEventListener('load', () => {
  if (!document.getElementById('sda-carousel-styles')) {
    const style = document.createElement('style');
    style.id = 'sda-carousel-styles';
    style.textContent = "/* Suspiros del Alma \u2014 carruseles de cat\u00e1logo y galer\u00eda de producto */\n.product-carousel-groups {\n  display: grid !important;\n  grid-template-columns: 1fr !important;\n  gap: 34px !important;\n}\n\n.type-carousel {\n  min-width: 0;\n}\n\n.type-carousel-heading {\n  display: flex;\n  align-items: end;\n  justify-content: space-between;\n  gap: 18px;\n  margin-bottom: 14px;\n}\n\n.type-carousel-heading h3 {\n  font-size: clamp(28px, 3vw, 38px);\n  margin-top: 3px;\n}\n\n.type-carousel-controls {\n  display: flex;\n  gap: 8px;\n}\n\n.type-carousel-controls button,\n.product-media-arrow {\n  width: 42px;\n  height: 42px;\n  border: 1px solid var(--line);\n  border-radius: 50%;\n  background: rgba(255,255,255,.95);\n  color: var(--deep);\n  font-size: 28px;\n  line-height: 1;\n  cursor: pointer;\n  box-shadow: 0 7px 20px rgba(37,63,63,.08);\n}\n\n.type-carousel.single-item .type-carousel-controls { display: none; }\n\n.type-carousel-viewport {\n  overflow-x: auto;\n  overscroll-behavior-inline: contain;\n  scrollbar-width: none;\n  scroll-snap-type: x mandatory;\n  border-radius: 22px;\n}\n.type-carousel-viewport::-webkit-scrollbar { display: none; }\n\n.type-carousel-track {\n  display: flex;\n  gap: 18px;\n  width: max-content;\n  padding: 4px 2px 14px;\n}\n\n.type-carousel-track .product-card {\n  flex: 0 0 clamp(235px, 22vw, 300px);\n  width: clamp(235px, 22vw, 300px);\n  scroll-snap-align: start;\n}\n\n.product-photo img,\n.product-media-image {\n  transition: opacity .22s ease;\n}\n.carousel-fade { opacity: .25; }\n\n.related-carousel-groups .type-carousel-heading h3 { display: none; }\n.related-carousel-groups .type-carousel-heading { justify-content: flex-end; margin-bottom: 10px; }\n\n/* Galer\u00eda de cada ficha */\n.product-media-carousel {\n  width: 100%;\n}\n\n.product-media-stage {\n  position: relative;\n  width: 100%;\n  aspect-ratio: 4 / 5;\n  border-radius: 28px;\n  overflow: hidden;\n  background: linear-gradient(145deg, #e5f6f2, #f3ead9);\n  display: grid;\n  place-items: center;\n}\n\n.product-media-image {\n  width: 100%;\n  height: 100%;\n  object-fit: contain;\n  background: #f7f4ee;\n}\n\n.product-media-arrow {\n  position: absolute;\n  top: 50%;\n  transform: translateY(-50%);\n  z-index: 3;\n}\n.product-media-arrow.prev { left: 14px; }\n.product-media-arrow.next { right: 14px; }\n\n.product-media-counter {\n  position: absolute;\n  right: 14px;\n  bottom: 14px;\n  z-index: 3;\n  background: rgba(255,255,255,.88);\n  backdrop-filter: blur(6px);\n  border: 1px solid rgba(255,255,255,.9);\n  border-radius: 999px;\n  padding: 6px 10px;\n  font-size: 11px;\n  font-weight: 700;\n}\n\n.product-media-thumbs {\n  display: flex;\n  gap: 8px;\n  margin-top: 12px;\n  overflow-x: auto;\n  scrollbar-width: none;\n  padding-bottom: 2px;\n}\n.product-media-thumbs::-webkit-scrollbar { display: none; }\n.product-media-thumb {\n  flex: 0 0 72px;\n  width: 72px;\n  height: 72px;\n  padding: 0;\n  border: 2px solid transparent;\n  border-radius: 14px;\n  overflow: hidden;\n  background: #fff;\n  cursor: pointer;\n  opacity: .72;\n}\n.product-media-thumb.active {\n  border-color: var(--teal);\n  opacity: 1;\n}\n.product-media-thumb img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n\n@media (max-width: 760px) {\n  .product-carousel-groups { gap: 28px !important; }\n  .type-carousel-heading { align-items: center; }\n  .type-carousel-heading h3 { font-size: 30px; }\n  .type-carousel-track .product-card {\n    flex-basis: min(78vw, 285px);\n    width: min(78vw, 285px);\n  }\n  .type-carousel-controls button { width: 38px; height: 38px; }\n  .product-media-stage { aspect-ratio: 1 / 1.18; border-radius: 22px; }\n  .product-media-thumb { flex-basis: 60px; width: 60px; height: 60px; }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .product-photo img,\n  .product-media-image { transition: none; }\n}\n";
    document.head.appendChild(style);
  }

(async () => {
  const app = await (window.SDA_APP_READY || Promise.resolve(window.SDA));
  const PRODUCTS = window.PRODUCTS || [];
  if (!app || !PRODUCTS.length) return;

  const productById = new Map(PRODUCTS.map(p => [p.id, p]));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const timers = new WeakMap();

  const prettyType = value => {
    const raw = String(value || '').trim();
    if (!raw) return 'Otros productos';
    const aliases = {
      'colgante': 'Colgantes',
      'colgantes': 'Colgantes',
      'hornillo': 'Hornillos',
      'hornillos': 'Hornillos',
      'cascada_humo': 'Cascadas de humo',
      'cascada-de-humo': 'Cascadas de humo',
      'difusor_auto': 'Difusores para auto',
      'difusor_ambiental': 'Difusores ambientales',
      'promo_sahumerios': 'Sahumerios',
      'oferta_mayorista': 'Ofertas mayoristas',
      'bienestar': 'Bienestar',
      'cuidado_personal': 'Cuidado personal',
      'set_regalo': 'Sets y regalos',
      'defumacion': 'Defumación'
    };
    const key = raw.toLowerCase();
    if (aliases[key]) return aliases[key];
    const text = raw.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  function productGroup(p) {
    const source = [p.type, p.name, p.primaryCategory, ...(p.categories || [])].join(' ').toLowerCase();
    if (source.includes('hornillo')) return 'hornillo';
    if (source.includes('colgante')) return 'colgante';
    if (source.includes('cascada')) return 'cascada_humo';
    if (source.includes('difusor') && source.includes('auto')) return 'difusor_auto';
    if (source.includes('difusor')) return 'difusor_ambiental';
    if (source.includes('sahumerio')) return 'sahumerios';
    if (source.includes('defum')) return 'defumacion';
    if (source.includes('alumbre') || source.includes('bienestar') || source.includes('cuidado personal')) return 'bienestar';
    if (source.includes('set') || source.includes('regalo') || source.includes('combo')) return 'set_regalo';
    return p.type || p.primaryCategory || p.categories?.[0] || 'Otros productos';
  }

  function uniqueImages(p) {
    const list = [
      ...(Array.isArray(p.images) ? p.images.map(i => typeof i === 'string' ? i : i.url || i.path) : []),
      p.image,
      ...(Array.isArray(p.variantRows) ? p.variantRows.map(v => v.image) : [])
    ].filter(Boolean);
    return [...new Set(list)];
  }

  function setupCardPreview(card) {
    const id = card.dataset.id;
    const p = productById.get(id);
    const img = card.querySelector('.product-photo img');
    if (!p || !img) return;
    const images = uniqueImages(p);
    if (images.length < 2 || reducedMotion) return;

    let index = Math.max(0, images.indexOf(img.getAttribute('src')));
    let paused = false;
    let visible = true;

    const advance = () => {
      if (paused || !visible) return;
      index = (index + 1) % images.length;
      img.classList.add('carousel-fade');
      window.setTimeout(() => {
        img.src = images[index];
        img.classList.remove('carousel-fade');
      }, 140);
    };

    const start = () => {
      if (timers.has(card)) return;
      const timer = window.setInterval(advance, 3200 + Math.floor(Math.random() * 900));
      timers.set(card, timer);
    };
    const stop = () => {
      const timer = timers.get(card);
      if (timer) window.clearInterval(timer);
      timers.delete(card);
    };

    card.addEventListener('mouseenter', () => { paused = true; });
    card.addEventListener('mouseleave', () => { paused = false; });
    card.addEventListener('focusin', () => { paused = true; });
    card.addEventListener('focusout', () => { paused = false; });

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        visible = entries.some(e => e.isIntersecting);
        if (visible) start(); else stop();
      }, { threshold: 0.2 });
      observer.observe(card);
    } else {
      start();
    }
  }

  function setupTrack(group) {
    const viewport = group.querySelector('.type-carousel-viewport');
    const track = group.querySelector('.type-carousel-track');
    const prev = group.querySelector('[data-carousel-prev]');
    const next = group.querySelector('[data-carousel-next]');
    if (!viewport || !track) return;

    const cards = [...track.querySelectorAll('.product-card')];
    cards.forEach(setupCardPreview);
    if (cards.length <= 1) group.classList.add('single-item');

    const step = () => {
      const first = track.querySelector('.product-card');
      if (!first) return Math.max(280, viewport.clientWidth * 0.8);
      const gap = parseFloat(getComputedStyle(track).gap || 16);
      return first.getBoundingClientRect().width + gap;
    };

    const scroll = direction => viewport.scrollBy({ left: direction * step(), behavior: reducedMotion ? 'auto' : 'smooth' });
    prev?.addEventListener('click', () => scroll(-1));
    next?.addEventListener('click', () => scroll(1));

    if (reducedMotion || cards.length <= 1) return;
    let paused = false;
    let timer = null;

    const advance = () => {
      if (paused) return;
      const atEnd = viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 8;
      if (atEnd) viewport.scrollTo({ left: 0, behavior: 'smooth' });
      else scroll(1);
    };
    const start = () => { if (!timer) timer = window.setInterval(advance, 5200); };
    const stop = () => { if (timer) window.clearInterval(timer); timer = null; };

    group.addEventListener('mouseenter', () => { paused = true; });
    group.addEventListener('mouseleave', () => { paused = false; });
    group.addEventListener('focusin', () => { paused = true; });
    group.addEventListener('focusout', () => { paused = false; });
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
    start();
  }

  function groupGrid(grid, related = false) {
    if (!grid || grid.dataset.carouselReady === '1') return;
    const cards = [...grid.querySelectorAll(':scope > .product-card')];
    if (!cards.length) return;

    const groups = new Map();
    cards.forEach(card => {
      const p = productById.get(card.dataset.id);
      const key = related ? 'related' : productGroup(p || {});
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(card);
    });

    grid.innerHTML = '';
    grid.classList.add('product-carousel-groups');
    if (related) grid.classList.add('related-carousel-groups');

    groups.forEach((groupCards, key) => {
      const section = document.createElement('section');
      section.className = 'type-carousel';
      section.innerHTML = `
        <div class="type-carousel-heading">
          <div>
            ${related ? '' : '<span class="eyebrow">Explorá la colección</span>'}
            <h3>${related ? 'Productos relacionados' : prettyType(key)}</h3>
          </div>
          <div class="type-carousel-controls" aria-label="Controles del carrusel">
            <button type="button" data-carousel-prev aria-label="Anterior">‹</button>
            <button type="button" data-carousel-next aria-label="Siguiente">›</button>
          </div>
        </div>
        <div class="type-carousel-viewport" tabindex="0">
          <div class="type-carousel-track"></div>
        </div>`;
      const track = section.querySelector('.type-carousel-track');
      groupCards.forEach(card => track.appendChild(card));
      grid.appendChild(section);
      setupTrack(section);
    });

    grid.dataset.carouselReady = '1';
  }

  let regrouping = false;
  function regroupCatalog() {
    const grid = document.querySelector('#productGrid');
    if (!grid || regrouping) return;
    const directCards = grid.querySelectorAll(':scope > .product-card');
    if (!directCards.length) return;
    regrouping = true;
    grid.dataset.carouselReady = '';
    groupGrid(grid, false);
    window.setTimeout(() => { regrouping = false; }, 0);
  }

  // La grilla se vuelve a generar al buscar, filtrar, ordenar o elegir una categoría.
  // El observador detecta ese nuevo render y vuelve a armar los carruseles automáticamente.
  const catalogGrid = document.querySelector('#productGrid');
  if (catalogGrid && 'MutationObserver' in window) {
    const observer = new MutationObserver(() => {
      if (!regrouping && catalogGrid.querySelector(':scope > .product-card')) {
        window.setTimeout(regroupCatalog, 0);
      }
    });
    observer.observe(catalogGrid, { childList: true });
  }

  window.setTimeout(regroupCatalog, 0);
  window.setTimeout(() => groupGrid(document.querySelector('#relatedGrid'), true), 0);

  // En producto.html, producto.js puede terminar unos milisegundos después.
  if (document.querySelector('#relatedGrid')) {
    let tries = 0;
    const relatedWatcher = window.setInterval(() => {
      const grid = document.querySelector('#relatedGrid');
      if (grid?.querySelector(':scope > .product-card')) {
        groupGrid(grid, true);
        window.clearInterval(relatedWatcher);
      }
      if (++tries > 30) window.clearInterval(relatedWatcher);
    }, 100);
  }
})();


(async () => {
  await (window.SDA_APP_READY || Promise.resolve(window.SDA));
  const PRODUCTS = window.PRODUCTS || [];
  if (!PRODUCTS.length) return;

  const id = new URLSearchParams(location.search).get('id');
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;

  const container = document.querySelector('.product-gallery-main');
  if (!container) return;

  const images = [
    ...(Array.isArray(p.images) ? p.images.map(i => typeof i === 'string' ? {url:i, alt:p.name} : i) : []),
    p.image ? {url:p.image, alt:p.name} : null,
    ...(Array.isArray(p.variantRows) ? p.variantRows.filter(v => v.image).map(v => ({url:v.image, alt:`${p.name} · ${v.value || 'variante'}`})) : [])
  ].filter(Boolean).filter((item, index, arr) => item.url && arr.findIndex(x => x.url === item.url) === index);

  if (!images.length) return;

  container.innerHTML = `
    <div class="product-media-carousel" aria-label="Galería de ${p.name}">
      <div class="product-media-stage">
        <button class="product-media-arrow prev" type="button" aria-label="Imagen anterior">‹</button>
        <img class="product-media-image" src="${images[0].url}" alt="${images[0].alt || p.name}">
        <button class="product-media-arrow next" type="button" aria-label="Imagen siguiente">›</button>
        <div class="product-media-counter"><span>1</span> / ${images.length}</div>
      </div>
      ${images.length > 1 ? `<div class="product-media-thumbs">${images.map((img,i)=>`<button type="button" class="product-media-thumb ${i===0?'active':''}" data-index="${i}" aria-label="Ver imagen ${i+1}"><img src="${img.url}" alt=""></button>`).join('')}</div>` : ''}
    </div>`;

  if (images.length < 2) return;

  const stageImg = container.querySelector('.product-media-image');
  const counter = container.querySelector('.product-media-counter span');
  const thumbs = [...container.querySelectorAll('.product-media-thumb')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = 0;
  let paused = false;
  let timer = null;

  const show = nextIndex => {
    index = (nextIndex + images.length) % images.length;
    stageImg.classList.add('carousel-fade');
    window.setTimeout(() => {
      stageImg.src = images[index].url;
      stageImg.alt = images[index].alt || p.name;
      if (counter) counter.textContent = String(index + 1);
      thumbs.forEach((t,i)=>t.classList.toggle('active',i===index));
      stageImg.classList.remove('carousel-fade');
    }, reducedMotion ? 0 : 150);
  };

  container.querySelector('.product-media-arrow.prev')?.addEventListener('click', () => show(index - 1));
  container.querySelector('.product-media-arrow.next')?.addEventListener('click', () => show(index + 1));
  thumbs.forEach(t => t.addEventListener('click', () => show(Number(t.dataset.index))));

  if (!reducedMotion) {
    const start = () => { if (!timer) timer = window.setInterval(() => { if (!paused) show(index + 1); }, 4500); };
    const stop = () => { if (timer) window.clearInterval(timer); timer = null; };
    container.addEventListener('mouseenter', () => { paused = true; });
    container.addEventListener('mouseleave', () => { paused = false; });
    container.addEventListener('focusin', () => { paused = true; });
    container.addEventListener('focusout', () => { paused = false; });
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
    start();
  }
})();

});
