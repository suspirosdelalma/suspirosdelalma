(async () => {
  const app = await (window.SDA_APP_READY || Promise.resolve(window.SDA));
  const PRODUCTS = window.PRODUCTS || [];
  if(!app || !PRODUCTS.length) return;

  const params=new URLSearchParams(location.search), id=params.get("id");
  const p=PRODUCTS.find(x=>x.id===id)||PRODUCTS[0];
  const page=document.querySelector("#productPage"); if(!page||!p)return;
  document.title=p.seoTitle || `${p.name} | Suspiros del Alma`;

  const specs = [
    ["Marca",p.brand],
    ["Presentación",p.presentation||"A confirmar"],
    ["Fragancia / aroma",p.aroma||((p.variants||[]).join(", "))||"No aplica"],
    ["Color",p.color||"Según modelo"],
    ["Variantes",(p.variants||[]).join(", ")||"Sin variantes cargadas"],
    ["Material",p.material||"A confirmar"],
    ["Cómo usar",p.usage||"Consultar indicaciones"],
    ["Cuidados",p.care||"Consultar indicaciones"]
  ];

  page.innerHTML=`
    <section>
      <div class="product-gallery-main">
        ${p.image?`<img src="${p.image}" alt="${p.name}">`:`<div class="product-placeholder">${p.name}</div>`}
      </div>
    </section>
    <section class="product-detail">
      <span class="eyebrow">${p.brand} · ${p.primaryCategory||p.categories.join(" · ")}</span>
      <h1>${p.name}</h1>
      <div class="price ${!p.showPrice?'missing':''}">${app.priceText(p)}</div>
      <div class="stock-status ${p.stock===0?'out':''}">${app.stockText(p)}</div>
      <p class="product-description">${p.description||p.short||""}</p>
      <div class="product-specs">
        ${specs.map(([k,v])=>`<div class="product-spec"><small>${k}</small><strong>${v}</strong></div>`).join("")}
      </div>
      <div class="product-buy">
        <input id="productQty" type="number" min="1" ${p.stock!=null&&p.stock>0?`max="${p.stock}"`:""} value="1">
        <button class="btn primary" id="productAdd" ${!app.canAdd(p)?"disabled":""}>Agregar al carrito</button>
        <a class="btn secondary" target="_blank" rel="noopener" href="https://wa.me/${window.SDA_CATALOG_CONFIG.whatsapp}?text=${encodeURIComponent("Hola Suspiros del Alma, quiero consultar por: "+p.name)}">Consultar por WhatsApp</a>
      </div>
      <div class="product-note">${p.shipping || "Envíos por Correo Argentino a todo el país, moto envío según zona y punto de encuentro coordinado en Estación Longchamps."} El costo final del envío se confirma antes del pago.</div>
    </section>`;

  document.querySelector("#productAdd")?.addEventListener("click",()=>{
    const qty=Math.max(1,Number(document.querySelector("#productQty").value)||1);app.addToCart(p.id,qty);
  });

  const related=PRODUCTS.filter(x=>x.id!==p.id && (x.categories||[]).some(c=>(p.categories||[]).includes(c))).slice(0,4);
  const rel=document.querySelector("#relatedGrid");
  if(rel){
    rel.innerHTML=(related.length?related:PRODUCTS.filter(x=>x.id!==p.id).slice(0,4)).map(app.productCard).join("");
    rel.querySelectorAll(".add-cart").forEach(b=>b.onclick=()=>app.addToCart(b.dataset.id));
  }
})();