/* Suspiros del Alma — Catálogo v2
   Fuente viva: Google Sheets publicado como CSV.
   Este archivo NO contiene datos privados. */
window.SDA_CATALOG_CONFIG = {
  productsCsv: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRmVrGzFLuB3osIvpJcxWxkgPIGO6pJhxQVXiJaEnWPkNssnXLjIaXz-CfDC2ojHZ2aUM39LUNmMIMG/pub?gid=1733573905&single=true&output=csv",
  variantsCsv: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRmVrGzFLuB3osIvpJcxWxkgPIGO6pJhxQVXiJaEnWPkNssnXLjIaXz-CfDC2ojHZ2aUM39LUNmMIMG/pub?gid=1920172241&single=true&output=csv",
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
      ["colgante-ama-y-se-feliz","Colgante “Ama y sé feliz”","Decoración","assets/productos/colgante-ama-y-se-feliz.png"],
      ["colgante-arriesgate-equivocate-y-vive","Colgante “Arriesgate, equivocate y vive”","Decoración","assets/productos/colgante-arriesgate-equivocate-y-vive.png"],
      ["colgante-disfruta-la-vida","Colgante “Disfruta la vida”","Decoración","assets/productos/colgante-disfruta-la-vida.png"],
      ["colgante-todo-vale-la-pena","Colgante “Todo vale la pena”","Decoración","assets/productos/colgante-todo-vale-la-pena.png"],
      ["cascada-humo-gato-maneki-neko","Cascada de humo Gato Maneki Neko","Cascadas y conitos","assets/productos/porta-sahumerio-gato-maneki-neko.png"],
      ["cascada-humo-om-mandala","Cascada de humo Om Mandala","Cascadas y conitos","assets/productos/porta-sahumerio-om-mandala.png"],
      ["cascada-humo-mariposa","Cascada de humo Mariposa","Cascadas y conitos","assets/productos/porta-sahumerio-mariposa.png"],
      ["cascada-humo-buda","Cascada de humo Buda","Cascadas y conitos","assets/productos/porta-sahumerio-buda.png"],
      ["cascada-humo-om","Cascada de humo Om","Cascadas y conitos","assets/productos/porta-sahumerio-om.png"],
      ["mix-defumacion-artesanal","Mix de defumación artesanal","Defumación","assets/productos/mix-defumacion-artesanal.png"],
      ["difusor-auto-colgante","Difusor para auto colgante","Difusores y aromas","assets/productos/difusores-auto-fragancias.png"],
      ["difusor-ambiental-varillas","Difusor ambiental con varillas","Difusores y aromas","assets/productos/difusores-ambientales-con-varillas.png"],
      ["hornillo-ceramica-lila","Hornillo de cerámica lila","Hornillos","assets/productos/hornillo-ceramica-lila.png"],
      ["hornillo-ceramica-fucsia","Hornillo de cerámica fucsia","Hornillos","assets/productos/hornillo-ceramica-fucsia.png"],
      ["hornillo-buda-blanco","Hornillo Buda blanco","Hornillos","assets/productos/hornillo-buda-blanco.png"],
      ["set-regalo-hornillo-rosa","Set de regalo con hornillo rosa","Combos y regalos","assets/productos/set-regalo-hornillo-rosa.png"],
      ["oferta-sahumerios-24-paquetes-1200-unidades","Oferta mayorista: 24 paquetes de sahumerios artesanales","Sahumerios","assets/productos/oferta-sahumerios-24-paquetes-1200-unidades.png"],
      ["promo-sahumerios-artesanales-premium","Sahumerios artesanales premium","Sahumerios","assets/productos/promo-sahumerios-artesanales-premium.png"]
    ].map((r, i) => ({
      id:r[0], name:r[1], slug:r[0], type:"", brand:"Suspiros del Alma",
      primaryCategory:r[2], categories:[r[2]], short:"Catálogo Suspiros del Alma.",
      description:"Consultanos por disponibilidad, variantes y precio actualizado.",
      price:null, showPrice:false, stock:null, minStock:null,
      featured:i<10, new:true, offer:r[0].includes("oferta") || r[0].includes("promo"),
      combo:r[0].includes("set-regalo"), image:r[3], order:i+1,
      variants:[], variantRows:[], aroma:"", color:"", presentation:"Unidad",
      material:"", usage:"", care:"", shipping:"", tags:[r[1],r[2]].join(" ").toLowerCase()
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
            image: clean(r.imagen_principal),
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
      window.SDA_DATA_SOURCE = {
        ok: true, source: "Google Sheets", loadedAt: new Date().toISOString(),
        products: products.length, variants: variantRows.length
      };
      return {products, variants: variantRows};
    } catch (error) {
      console.error("Suspiros del Alma: no se pudo cargar Google Sheets.", error);
      const products = fallbackProducts();
      window.PRODUCTS = products;
      window.VARIANTS = [];
      window.SDA_DATA_SOURCE = {
        ok: false, source: "Respaldo local", error: String(error),
        loadedAt: new Date().toISOString(), products: products.length, variants: 0
      };
      return {products, variants: []};
    }
  }

  window.SDA_DATA_READY = loadCatalog();
})();
