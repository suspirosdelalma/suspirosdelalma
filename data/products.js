/* Suspiros del Alma — Catálogo v5
   Fuente viva: Google Sheets publicado como CSV.
   Las secciones de la home se organizan por categoria_principal. */
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
      ["colgante-atrapasuenos","Colgante atrapasueños","colgante_atrapasuenos","Pulseras y colgantes","assets/productos/colgante-ama-y-se-feliz.png"],
      ["cascada-humo-gato-maneki-neko","Cascada de humo Gato Maneki Neko","cascada_humo","Cascadas y conitos","assets/productos/porta-sahumerio-gato-maneki-neko.png"],
      ["cascada-humo-om-mandala","Cascada de humo Om Mandala","cascada_humo","Cascadas y conitos","assets/productos/porta-sahumerio-om-mandala.png"],
      ["cascada-humo-mariposa","Cascada de humo Mariposa","cascada_humo","Cascadas y conitos","assets/productos/porta-sahumerio-mariposa.png"],
      ["cascada-humo-buda","Cascada de humo Buda","cascada_humo","Cascadas y conitos","assets/productos/porta-sahumerio-buda.png"],
      ["cascada-humo-om","Cascada de humo Om","cascada_humo","Cascadas y conitos","assets/productos/porta-sahumerio-om.png"],
      ["hornillo-ceramica-lila","Hornillo de cerámica lila","hornillo","Hornillos - velas - aceites","assets/productos/hornillo-ceramica-lila.png"],
      ["hornillo-ceramica-fucsia","Hornillo de cerámica fucsia","hornillo","Hornillos - velas - aceites","assets/productos/hornillo-ceramica-fucsia.png"],
      ["hornillo-buda-blanco","Hornillo Buda blanco","hornillo","Hornillos - velas - aceites","assets/productos/hornillo-buda-blanco.png"],
      ["sahumerios-artesanales-menor","Sahumerios artesanales x menor","sahumerio_artesanal","Sahumerios Artesanales","assets/productos/sahumerios-artesanales-menor-portada.png"],
      ["sahumerios-artesanales-mayor","Sahumerios artesanales x mayor","sahumerio_mayorista","Sahumerios Artesanales","assets/productos/sahumerios-artesanales-mayor-portada.png"],
      ["sahumerios-limpieza-energetica","Sahumerios limpieza energética","sahumerio_limpieza","Sahumerios Artesanales","assets/productos/sahumerios-limpieza-energetica-portada.png"],
      ["pulsera-cinta-ojo-turco","Pulsera cinta ojo turco","pulsera","Pulseras y colgantes","assets/productos/pulsera-ojo-turco-principal.png"],
      ["pulsera-san-benito","Pulsera San Benito","pulsera","Pulseras y colgantes","assets/productos/pulsera-san-benito-principal.png"],
      ["tobillera-ojo-turco","Tobillera ojo turco","tobillera","Pulseras y colgantes","assets/productos/tobillera-ojo-turco-principal.png"],
      ["piedra-alumbre","Piedra de Alumbre","cuidado_personal","Cuidado personal","assets/productos/piedra-alumbre-principal.png"]
    ].map((r, i) => ({
      id:r[0], name:r[1], slug:r[0], type:r[2], brand:"Suspiros del Alma",
      primaryCategory:r[3], categories:[r[3]], short:"Catálogo Suspiros del Alma.",
      description:"Consultanos por disponibilidad, variantes y precio actualizado.",
      price:null, showPrice:false, stock:null, minStock:null,
      featured:true, new:true, offer:false, combo:false,
      image:r[4], images:[{url:r[4],path:r[4],alt:r[1],order:1}], order:i+1,
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
        try { imageRows = await fetchCSV(CONFIG.imagesCsv); }
        catch (imageError) {
          console.warn("Suspiros del Alma: IMAGENES no está disponible; se usarán imágenes principales y variantes.", imageError);
        }
      }

      const variantsByProduct = new Map();
      variantRows.filter(r => yes(r.activo)).forEach(r => {
        const id = clean(r.id_producto);
        if (!variantsByProduct.has(id)) variantsByProduct.set(id, []);
        variantsByProduct.get(id).push({
          id: clean(r.id_variante), type: clean(r.tipo_variante), value: clean(r.valor_variante),
          sku: clean(r.sku), price: numberValue(r.precio_minorista),
          wholesalePrice: numberValue(r.precio_mayorista),
          stock: clean(r.stock) === "" ? null : numberValue(r.stock),
          active: yes(r.activo), image: clean(r.imagen_variante)
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
          id: clean(r.id_imagen), filename: clean(r.nombre_archivo), path, publicUrl, url,
          alt: clean(r.texto_alt), order: numberValue(r.orden) ?? 999
        });
      });
      imagesByProduct.forEach(list => list.sort((a,b) => a.order - b.order));

      const products = productRows.filter(r => yes(r.activo)).map((r, index) => {
        const id = clean(r.id);
        const vrows = variantsByProduct.get(id) || [];
        const primary = clean(r.categoria_principal) || "Otros productos";
        const secondary = splitPipe(r.categorias_secundarias);
        const price = numberValue(r.precio_minorista);
        const stock = clean(r.stock) === "" ? null : numberValue(r.stock);
        const minStock = clean(r.stock_minimo) === "" ? null : numberValue(r.stock_minimo);
        const variants = unique(vrows.map(v => v.value));
        const allVariants = unique([...variants, ...splitPipe(r.fragancia)]);
        const mainImage = clean(r.imagen_principal);
        const gallery = [...(imagesByProduct.get(id) || [])];
        if (mainImage && !gallery.some(img => img.url === mainImage || img.path === mainImage)) {
          gallery.unshift({id:`main-${id}`,filename:mainImage.split('/').pop(),path:mainImage,publicUrl:"",url:mainImage,alt:clean(r.nombre)||id,order:0});
        }

        return {
          id, name: clean(r.nombre) || id, slug: clean(r.slug) || id,
          type: clean(r.tipo_producto), brand: clean(r.marca) || "Suspiros del Alma",
          primaryCategory: primary, categories: unique([primary, ...secondary]),
          short: clean(r.descripcion_corta), description: clean(r.descripcion_larga) || clean(r.descripcion_corta),
          price, wholesalePrice: numberValue(r.precio_mayorista),
          showPrice: yes(r.mostrar_precio) && price !== null && price > 0,
          stock, minStock, stockStatus: clean(r.estado_stock),
          featured: yes(r.destacado), new: yes(r.novedad), offer: yes(r.oferta), combo: yes(r.combo),
          color: clean(r.color), presentation: clean(r.presentacion), image: mainImage, images: gallery,
          order: numberValue(r.orden) ?? index + 1, aroma: clean(r.fragancia), material: clean(r.material),
          usage: clean(r.uso), care: clean(r.cuidados), shipping: clean(r.envio),
          seoTitle: clean(r.seo_titulo), seoDescription: clean(r.seo_descripcion),
          variants: allVariants, variantRows: vrows,
          tags: unique([clean(r.nombre),clean(r.marca),primary,...secondary,clean(r.tipo_producto),clean(r.fragancia),clean(r.color),...allVariants]).join(" ").toLowerCase()
        };
      }).sort((a,b) => a.order - b.order);

      if (!products.length) throw new Error("La hoja PRODUCTOS no devolvió registros activos.");
      window.PRODUCTS = products;
      window.VARIANTS = variantRows;
      window.PRODUCT_IMAGES = imageRows;
      window.SDA_DATA_SOURCE = {ok:true,source:"Google Sheets",loadedAt:new Date().toISOString(),products:products.length,variants:variantRows.length,images:imageRows.length};
      return {products,variants:variantRows,images:imageRows};
    } catch (error) {
      console.error("Suspiros del Alma: no se pudo cargar Google Sheets.", error);
      const products = fallbackProducts();
      window.PRODUCTS = products;
      window.VARIANTS = [];
      window.PRODUCT_IMAGES = [];
      window.SDA_DATA_SOURCE = {ok:false,source:"Respaldo local",error:String(error),loadedAt:new Date().toISOString(),products:products.length,variants:0,images:0};
      return {products,variants:[],images:[]};
    }
  }

  window.SDA_DATA_READY = loadCatalog();
})();

window.addEventListener('load', () => {
  const CATEGORY_INFO = {
    "Sahumerios Artesanales": {order:1, icon:"☾", eyebrow:"Explorá nuestras líneas", text:"Sahumerios artesanales de larga duración, aromas intensos y opciones minoristas y mayoristas.", tone:"violet"},
    "Pulseras y colgantes": {order:2, icon:"♡", eyebrow:"Explorá la colección", text:"Amuletos, accesorios y colgantes con significado para acompañarte cada día.", tone:"teal"},
    "Cascadas y conitos": {order:3, icon:"〰", eyebrow:"Descubrí la colección", text:"Cascadas de humo y conitos para crear momentos de calma y una ambientación especial.", tone:"sand"},
    "Velas": {order:4, icon:"✦", eyebrow:"Luz y calidez", text:"Velas para iluminar, perfumar y acompañar tus rituales cotidianos.", tone:"rose"},
    "Hornillos - velas - aceites": {order:5, icon:"♨", eyebrow:"Aromas para tus espacios", text:"Hornillos, aceites y complementos para transformar tus espacios con aroma y calidez.", tone:"aqua"},
    "Aromanza": {order:6, icon:"◉", eyebrow:"Colección por marca", text:"Una selección exclusiva de productos Aromanza.", tone:"aqua"},
    "Sagrada Madre": {order:7, icon:"✧", eyebrow:"Colección por marca", text:"Productos de Sagrada Madre elegidos para rituales y momentos especiales.", tone:"violet"},
    "Sahumadores": {order:8, icon:"♨", eyebrow:"Complementos", text:"Sahumadores y accesorios para acompañar tus prácticas de limpieza y aromatización.", tone:"sand"},
    "Atrapasoles": {order:9, icon:"☀", eyebrow:"Luz y color", text:"Objetos decorativos que llenan tus espacios de luz, color y movimiento.", tone:"aqua"},
    "Duendes": {order:10, icon:"♧", eyebrow:"Pequeños encantos", text:"Figuras y objetos con encanto para sumar magia y personalidad a tus espacios.", tone:"rose"},
    "Sahumerios Importados": {order:11, icon:"✈", eyebrow:"Aromas del mundo", text:"Sahumerios importados y aromas seleccionados de distintas marcas.", tone:"violet"},
    "Combos Imperdibles!": {order:12, icon:"🎁", eyebrow:"Para aprovechar", text:"Combinaciones especiales para regalar, descubrir productos o aprovechar promociones.", tone:"rose"},
    "Cuidado personal": {order:13, icon:"✧", eyebrow:"Bienestar cotidiano", text:"Productos elegidos para acompañar el cuidado cotidiano de forma simple y natural.", tone:"aqua"}
  };

  const CATEGORY_ORDER = Object.fromEntries(Object.entries(CATEGORY_INFO).map(([name, info]) => [name, info.order]));

  if (!document.getElementById('sda-v5-styles')) {
    const style = document.createElement('style');
    style.id = 'sda-v5-styles';
    style.textContent = `
      /* La navegación principal por categorías ahora vive dentro del catálogo */
      .category-section { display:none !important; }
      .product-carousel-groups { display:grid !important; grid-template-columns:1fr !important; gap:20px !important; }
      .category-showcase { display:grid; grid-template-columns:230px minmax(0,1fr); gap:24px; padding:22px; border:1px solid var(--line); border-radius:26px; background:#fff; min-width:0; }
      .category-showcase-intro { padding:8px 4px 8px 2px; display:flex; flex-direction:column; align-items:flex-start; justify-content:center; min-width:0; }
      .category-showcase-intro .category-symbol { font-size:26px; line-height:1; margin-bottom:10px; }
      .category-showcase-intro h3 { font-family:"Cormorant Garamond",serif; font-size:clamp(30px,3vw,42px); line-height:.95; margin:4px 0 12px; color:var(--deep); }
      .category-showcase-intro p { margin:0 0 16px; font-size:14px; line-height:1.55; color:var(--muted); }
      .category-showcase-intro .category-link { border:0; border-radius:999px; padding:10px 15px; background:var(--teal); color:#fff; font-weight:700; cursor:pointer; }
      .category-showcase-content { min-width:0; border-radius:21px; padding:10px; background:linear-gradient(135deg,#f8fbfa,#f7f2e9); }
      .category-showcase.tone-violet .category-showcase-content { background:linear-gradient(135deg,#faf6ff,#f4eef9); }
      .category-showcase.tone-rose .category-showcase-content { background:linear-gradient(135deg,#fff7f7,#f8eeee); }
      .category-showcase.tone-aqua .category-showcase-content { background:linear-gradient(135deg,#f0fbf9,#eaf6f5); }
      .category-showcase.tone-sand .category-showcase-content { background:linear-gradient(135deg,#fffaf2,#f6efe4); }
      .type-carousel-controls { display:flex; justify-content:flex-end; gap:8px; margin:0 2px 7px; }
      .type-carousel-controls button, .product-media-arrow { width:40px; height:40px; border:1px solid var(--line); border-radius:50%; background:rgba(255,255,255,.96); color:var(--deep); font-size:26px; line-height:1; cursor:pointer; box-shadow:0 7px 20px rgba(37,63,63,.08); }
      .category-showcase.single-item .type-carousel-controls { display:none; }
      .type-carousel-viewport { overflow-x:auto; overscroll-behavior-inline:contain; scrollbar-width:none; scroll-snap-type:x mandatory; border-radius:18px; }
      .type-carousel-viewport::-webkit-scrollbar { display:none; }
      .type-carousel-track { display:flex; gap:14px; width:max-content; padding:2px 2px 8px; }
      .type-carousel-track .product-card { flex:0 0 clamp(220px,20vw,280px); width:clamp(220px,20vw,280px); scroll-snap-align:start; }
      .product-photo img, .product-media-image { transition:opacity .22s ease; }
      .carousel-fade { opacity:.25; }
      .related-carousel-groups .category-showcase { grid-template-columns:1fr; padding:0; border:0; background:transparent; }
      .related-carousel-groups .category-showcase-intro { display:none; }
      .related-carousel-groups .category-showcase-content { background:transparent; padding:0; }
      .product-media-carousel { width:100%; }
      .product-media-stage { position:relative; width:100%; aspect-ratio:4/5; border-radius:28px; overflow:hidden; background:linear-gradient(145deg,#e5f6f2,#f3ead9); display:grid; place-items:center; }
      .product-media-image { width:100%; height:100%; object-fit:contain; background:#f7f4ee; }
      .product-media-arrow { position:absolute; top:50%; transform:translateY(-50%); z-index:3; }
      .product-media-arrow.prev { left:14px; } .product-media-arrow.next { right:14px; }
      .product-media-counter { position:absolute; right:14px; bottom:14px; z-index:3; background:rgba(255,255,255,.88); backdrop-filter:blur(6px); border:1px solid rgba(255,255,255,.9); border-radius:999px; padding:6px 10px; font-size:11px; font-weight:700; }
      .product-media-thumbs { display:flex; gap:8px; margin-top:12px; overflow-x:auto; scrollbar-width:none; padding-bottom:2px; }
      .product-media-thumbs::-webkit-scrollbar { display:none; }
      .product-media-thumb { flex:0 0 72px; width:72px; height:72px; padding:0; border:2px solid transparent; border-radius:14px; overflow:hidden; background:#fff; cursor:pointer; opacity:.72; }
      .product-media-thumb.active { border-color:var(--teal); opacity:1; }
      .product-media-thumb img { width:100%; height:100%; object-fit:cover; }
      @media (max-width:900px) { .category-showcase { grid-template-columns:190px minmax(0,1fr); gap:16px; padding:16px; } }
      @media (max-width:700px) {
        .product-carousel-groups { gap:16px !important; }
        .category-showcase { grid-template-columns:1fr; gap:8px; padding:15px; }
        .category-showcase-intro { padding:2px 4px 4px; }
        .category-showcase-intro h3 { font-size:32px; }
        .category-showcase-intro p { margin-bottom:10px; }
        .type-carousel-track .product-card { flex-basis:min(75vw,270px); width:min(75vw,270px); }
        .product-media-stage { aspect-ratio:1/1.18; border-radius:22px; }
        .product-media-thumb { flex-basis:60px; width:60px; height:60px; }
      }
      @media (prefers-reduced-motion:reduce) { .product-photo img,.product-media-image { transition:none; } }
    `;
    document.head.appendChild(style);
  }

  (async () => {
    const app = await (window.SDA_APP_READY || Promise.resolve(window.SDA));
    const PRODUCTS = window.PRODUCTS || [];
    if (!app || !PRODUCTS.length) return;

    const productById = new Map(PRODUCTS.map(p => [p.id,p]));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timers = new WeakMap();

    // El selector muestra solo categorías principales y en el orden acordado.
    const categorySelect = document.querySelector('#categoryFilter');
    if (categorySelect) {
      const present = [...new Set(PRODUCTS.map(p => p.primaryCategory).filter(Boolean))]
        .sort((a,b) => (CATEGORY_ORDER[a] ?? 999) - (CATEGORY_ORDER[b] ?? 999) || a.localeCompare(b,'es'));
      const selected = categorySelect.value;
      categorySelect.innerHTML = '<option value="">Todas las categorías</option>' + present.map(c => `<option value="${c}">${c}</option>`).join('');
      if (present.includes(selected)) categorySelect.value = selected;
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
      const p = productById.get(card.dataset.id);
      const img = card.querySelector('.product-photo img');
      if (!p || !img) return;
      const images = uniqueImages(p);
      if (images.length < 2 || reducedMotion) return;
      let index = Math.max(0, images.indexOf(img.getAttribute('src')));
      let paused = false, visible = true;
      const advance = () => {
        if (paused || !visible) return;
        index = (index + 1) % images.length;
        img.classList.add('carousel-fade');
        window.setTimeout(() => { img.src = images[index]; img.classList.remove('carousel-fade'); }, 140);
      };
      const start = () => { if (!timers.has(card)) timers.set(card, window.setInterval(advance, 2000)); };
      const stop = () => { const timer = timers.get(card); if (timer) window.clearInterval(timer); timers.delete(card); };
      card.addEventListener('mouseenter',()=>paused=true); card.addEventListener('mouseleave',()=>paused=false);
      card.addEventListener('focusin',()=>paused=true); card.addEventListener('focusout',()=>paused=false);
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
          visible = entries.some(e => e.isIntersecting);
          if (visible) start(); else stop();
        }, {threshold:.2});
        observer.observe(card);
      } else start();
    }

    function setupTrack(section) {
      const viewport = section.querySelector('.type-carousel-viewport');
      const track = section.querySelector('.type-carousel-track');
      const cards = [...track.querySelectorAll('.product-card')];
      cards.forEach(setupCardPreview);
      if (cards.length <= 1) section.classList.add('single-item');
      const step = () => {
        const first = track.querySelector('.product-card');
        if (!first) return Math.max(260,viewport.clientWidth*.8);
        return first.getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || 14);
      };
      const scroll = d => viewport.scrollBy({left:d*step(),behavior:reducedMotion?'auto':'smooth'});
      section.querySelector('[data-carousel-prev]')?.addEventListener('click',()=>scroll(-1));
      section.querySelector('[data-carousel-next]')?.addEventListener('click',()=>scroll(1));
      if (reducedMotion || cards.length <= 1) return;
      let paused = false, timer = null;
      const advance = () => {
        if (paused) return;
        const atEnd = viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 8;
        if (atEnd) viewport.scrollTo({left:0,behavior:'smooth'}); else scroll(1);
      };
      const start = () => { if (!timer) timer = window.setInterval(advance,5200); };
      const stop = () => { if (timer) window.clearInterval(timer); timer=null; };
      section.addEventListener('mouseenter',()=>paused=true); section.addEventListener('mouseleave',()=>paused=false);
      section.addEventListener('focusin',()=>paused=true); section.addEventListener('focusout',()=>paused=false);
      document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
      start();
    }

    function groupGrid(grid, related=false) {
      if (!grid || grid.dataset.carouselReady === '1') return;
      const cards = [...grid.querySelectorAll(':scope > .product-card')];
      if (!cards.length) return;
      const groups = new Map();
      cards.forEach(card => {
        const p = productById.get(card.dataset.id);
        const key = related ? 'related' : (p?.primaryCategory || 'Otros productos');
        if (!groups.has(key)) groups.set(key,[]);
        groups.get(key).push(card);
      });
      const entries = [...groups.entries()].sort(([a],[b]) => related ? 0 : ((CATEGORY_ORDER[a]??999)-(CATEGORY_ORDER[b]??999) || a.localeCompare(b,'es')));
      grid.innerHTML='';
      grid.classList.add('product-carousel-groups');
      if (related) grid.classList.add('related-carousel-groups');

      entries.forEach(([category,groupCards]) => {
        groupCards.sort((a,b) => (productById.get(a.dataset.id)?.order ?? 999) - (productById.get(b.dataset.id)?.order ?? 999));
        const info = related ? {icon:'',eyebrow:'',text:'',tone:'aqua'} : (CATEGORY_INFO[category] || {icon:'✧',eyebrow:'Explorá la colección',text:'Descubrí los productos disponibles en esta categoría.',tone:'aqua'});
        const section = document.createElement('section');
        section.className = `category-showcase tone-${info.tone}`;
        section.dataset.category = category;
        section.innerHTML = `
          <div class="category-showcase-intro">
            <span class="eyebrow">${info.eyebrow}</span>
            <div class="category-symbol" aria-hidden="true">${info.icon}</div>
            <h3>${related ? 'Productos relacionados' : category}</h3>
            ${related ? '' : `<p>${info.text}</p><button class="category-link" type="button">Ver esta categoría</button>`}
          </div>
          <div class="category-showcase-content">
            <div class="type-carousel-controls" aria-label="Controles del carrusel">
              <button type="button" data-carousel-prev aria-label="Anterior">‹</button>
              <button type="button" data-carousel-next aria-label="Siguiente">›</button>
            </div>
            <div class="type-carousel-viewport" tabindex="0"><div class="type-carousel-track"></div></div>
          </div>`;
        const track = section.querySelector('.type-carousel-track');
        groupCards.forEach(card => track.appendChild(card));
        section.querySelector('.category-link')?.addEventListener('click',() => {
          const select = document.querySelector('#categoryFilter');
          if (!select) return;
          select.value = category;
          select.dispatchEvent(new Event('input',{bubbles:true}));
          document.querySelector('#productos')?.scrollIntoView({behavior:'smooth',block:'start'});
        });
        grid.appendChild(section);
        setupTrack(section);
      });
      grid.dataset.carouselReady='1';
    }

    let regrouping=false;
    function regroupCatalog() {
      const grid=document.querySelector('#productGrid');
      if (!grid || regrouping || !grid.querySelector(':scope > .product-card')) return;
      regrouping=true; grid.dataset.carouselReady=''; groupGrid(grid,false);
      window.setTimeout(()=>regrouping=false,0);
    }

    const catalogGrid=document.querySelector('#productGrid');
    if (catalogGrid && 'MutationObserver' in window) {
      new MutationObserver(() => {
        if (!regrouping && catalogGrid.querySelector(':scope > .product-card')) window.setTimeout(regroupCatalog,0);
      }).observe(catalogGrid,{childList:true});
    }
    window.setTimeout(regroupCatalog,0);

    // Relacionados de producto.html: carrusel simple, sin panel de categoría.
    const relatedGrid=document.querySelector('#relatedGrid');
    if (relatedGrid) {
      let tries=0;
      const watcher=window.setInterval(() => {
        if (relatedGrid.querySelector(':scope > .product-card')) { relatedGrid.dataset.carouselReady=''; groupGrid(relatedGrid,true); window.clearInterval(watcher); }
        if (++tries>40) window.clearInterval(watcher);
      },100);
    }
  })();

  // Galería de la ficha individual.
  (async () => {
    await (window.SDA_APP_READY || Promise.resolve(window.SDA));
    const PRODUCTS=window.PRODUCTS||[];
    const id=new URLSearchParams(location.search).get('id');
    const p=PRODUCTS.find(x=>x.id===id);
    if (!p) return;
    const container=document.querySelector('.product-gallery-main');
    if (!container) return;
    const images=[
      ...(Array.isArray(p.images)?p.images.map(i=>typeof i==='string'?{url:i,alt:p.name}:i):[]),
      p.image?{url:p.image,alt:p.name}:null,
      ...(Array.isArray(p.variantRows)?p.variantRows.filter(v=>v.image).map(v=>({url:v.image,alt:`${p.name} · ${v.value||'variante'}`})):[])
    ].filter(Boolean).filter((item,index,arr)=>item.url&&arr.findIndex(x=>x.url===item.url)===index);
    if (!images.length) return;
    container.innerHTML=`
      <div class="product-media-carousel" aria-label="Galería de ${p.name}">
        <div class="product-media-stage">
          <button class="product-media-arrow prev" type="button" aria-label="Imagen anterior">‹</button>
          <img class="product-media-image" src="${images[0].url}" alt="${images[0].alt||p.name}">
          <button class="product-media-arrow next" type="button" aria-label="Imagen siguiente">›</button>
          <div class="product-media-counter"><span>1</span> / ${images.length}</div>
        </div>
        ${images.length>1?`<div class="product-media-thumbs">${images.map((img,i)=>`<button type="button" class="product-media-thumb ${i===0?'active':''}" data-index="${i}" aria-label="Ver imagen ${i+1}"><img src="${img.url}" alt=""></button>`).join('')}</div>`:''}
      </div>`;
    if (images.length<2) return;
    const stageImg=container.querySelector('.product-media-image');
    const counter=container.querySelector('.product-media-counter span');
    const thumbs=[...container.querySelectorAll('.product-media-thumb')];
    const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let index=0,paused=false,timer=null;
    const show=nextIndex=>{
      index=(nextIndex+images.length)%images.length;
      stageImg.classList.add('carousel-fade');
      window.setTimeout(()=>{
        stageImg.src=images[index].url; stageImg.alt=images[index].alt||p.name;
        if(counter) counter.textContent=String(index+1);
        thumbs.forEach((t,i)=>t.classList.toggle('active',i===index));
        stageImg.classList.remove('carousel-fade');
      },reducedMotion?0:150);
    };
    container.querySelector('.product-media-arrow.prev')?.addEventListener('click',()=>show(index-1));
    container.querySelector('.product-media-arrow.next')?.addEventListener('click',()=>show(index+1));
    thumbs.forEach(t=>t.addEventListener('click',()=>show(Number(t.dataset.index))));
    if(!reducedMotion){
      const start=()=>{if(!timer)timer=window.setInterval(()=>{if(!paused)show(index+1)},2000)};
      const stop=()=>{if(timer)window.clearInterval(timer);timer=null};
      container.addEventListener('mouseenter',()=>paused=true); container.addEventListener('mouseleave',()=>paused=false);
      container.addEventListener('focusin',()=>paused=true); container.addEventListener('focusout',()=>paused=false);
      document.addEventListener('visibilitychange',()=>document.hidden?stop():start()); start();
    }
  })();
});
