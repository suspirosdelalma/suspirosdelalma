(async () => {
  const app = await (window.SDA_APP_READY || Promise.resolve(window.SDA));
  const PRODUCTS = window.PRODUCTS || [];
  if (!app || !PRODUCTS.length) return;
  await new Promise(resolve => setTimeout(resolve,0));

  const id = new URLSearchParams(location.search).get("id");
  const p = PRODUCTS.find(x => x.id === id) || PRODUCTS[0];
  if (!p) return;

  const normalize = value => String(value || "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  const text = normalize([p.name,p.primaryCategory,p.type,p.short,p.description,p.aroma].join(" "));

  function companionText() {
    if (text.includes("duende") || text.includes("papanoel") || text.includes("mago"))
      return "cuando querés regalar algo con personalidad, sumar un detalle especial a un rincón o elegir un objeto que tenga presencia propia.";
    if (text.includes("sahumer") || text.includes("incienso"))
      return "cuando querés cambiar el clima de un ambiente, hacer una pausa o acompañar un momento con un aroma elegido por vos.";
    if (text.includes("difus") || text.includes("humidificador") || text.includes("aroma"))
      return "cuando querés que un ambiente se sienta más cuidado, perfumado y agradable durante el día.";
    if (text.includes("cascada") || text.includes("cono"))
      return "cuando querés que el momento de sahumar también sea visual y transformar un rincón en una pequeña escena de calma.";
    if (text.includes("pulsera") || text.includes("colgante") || text.includes("atrapasol"))
      return "cuando buscás un detalle con significado para vos o para regalar a alguien especial.";
    if (text.includes("vela") || text.includes("hornillo"))
      return "cuando querés sumar calidez, aroma y una luz distinta a tus espacios cotidianos.";
    if (text.includes("alumbre") || text.includes("cuidado"))
      return "cuando buscás incorporar a tu rutina un producto simple y práctico de cuidado cotidiano.";
    return "cuando querés sumar un pequeño gesto de bienestar, intención o belleza a tu día.";
  }

  const description = document.querySelector(".product-description");
  if (description && !document.querySelector(".product-companion")) {
    const box = document.createElement("div");
    box.className = "product-companion";
    box.innerHTML = `<small>Este producto puede acompañarte cuando...</small><p>${companionText()}</p>`;
    description.insertAdjacentElement("afterend", box);
  }

  const buy = document.querySelector(".product-buy");
  if (buy && !document.querySelector(".product-help")) {
    const help = document.createElement("div");
    help.className = "product-help";
    const msg = encodeURIComponent(`Hola Suspiros del Alma, estoy viendo ${p.name} y no sé si es lo que necesito. ¿Me ayudan a elegir?`);
    help.innerHTML = `¿No sabés si es para vos? <a target="_blank" rel="noopener" href="https://wa.me/${window.SDA_CATALOG_CONFIG.whatsapp}?text=${msg}">Contanos qué buscás y te orientamos.</a>`;
    buy.insertAdjacentElement("afterend", help);
  }

  function sharedWords(a,b) {
    const wa = new Set(normalize([a.name,a.type,a.primaryCategory,a.aroma,...(a.categories||[])].join(" ")).split(/[^a-z0-9áéíóúñ]+/).filter(x=>x.length>3));
    const wb = new Set(normalize([b.name,b.type,b.primaryCategory,b.aroma,...(b.categories||[])].join(" ")).split(/[^a-z0-9áéíóúñ]+/).filter(x=>x.length>3));
    let n = 0; wa.forEach(w => { if (wb.has(w)) n++; }); return n;
  }

  function score(x) {
    let s = 0;
    if (x.primaryCategory === p.primaryCategory) s += 6;
    if (x.type && x.type === p.type) s += 3;
    if (x.brand && x.brand === p.brand) s += 1;
    s += sharedWords(p,x);
    if (x.combo) s += 1;
    if (x.featured) s += .5;
    return s;
  }

  const related = PRODUCTS
    .filter(x => x.id !== p.id && x.stock !== 0)
    .map(x => ({x,score:score(x)}))
    .sort((a,b) => b.score-a.score || a.x.order-b.x.order)
    .slice(0,4)
    .map(o => o.x);

  const grid = document.querySelector("#relatedGrid");
  if (grid && related.length) {
    grid.innerHTML = related.map(app.productCard).join("");
    grid.querySelectorAll(".add-cart").forEach(btn => btn.addEventListener("click",()=>app.addToCart(btn.dataset.id)));
  }

  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", p.seoDescription || p.short || p.description || `Conocé ${p.name} en Suspiros del Alma.`);
})();
