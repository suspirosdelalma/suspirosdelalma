(() => {
  const app=window.SDA, PRODUCTS=window.PRODUCTS||[];
  const params=new URLSearchParams(location.search), id=params.get("id");
  const p=PRODUCTS.find(x=>x.id===id)||PRODUCTS[0];
  const page=document.querySelector("#productPage"); if(!page||!p)return;
  document.title=`${p.name} | Suspiros del Alma`;
  const price=app.money(p.price);
  page.innerHTML=`
    <section>
      <div class="product-gallery-main">
        ${p.image?`<img src="${p.image}" alt="${p.name}">`:`<div class="product-placeholder">${p.name}</div>`}
      </div>
    </section>
    <section class="product-detail">
      <span class="eyebrow">${p.brand} · ${p.categories.join(" · ")}</span>
      <h1>${p.name}</h1>
      <div class="price ${!p.price?'missing':''}">${price}</div>
      <div class="stock-status ${p.stock<=0?'out':''}">${p.stock>0?`✓ En stock · ${p.stock} unidades`:"Sin stock — consultanos próxima disponibilidad"}</div>
      <p class="product-description">${p.description}</p>
      <div class="product-specs">
        <div class="product-spec"><small>Marca</small><strong>${p.brand}</strong></div>
        <div class="product-spec"><small>Presentación</small><strong>${p.presentation||"A completar"}</strong></div>
        <div class="product-spec"><small>Aroma</small><strong>${p.aroma||"No aplica"}</strong></div>
        <div class="product-spec"><small>Variantes</small><strong>${(p.variants||[]).join(", ")||"Sin variantes"}</strong></div>
        <div class="product-spec"><small>Cómo usar</small><strong>${p.usage||"Consultar indicaciones"}</strong></div>
        <div class="product-spec"><small>Cuidados</small><strong>${p.care||"A completar"}</strong></div>
      </div>
      <div class="product-buy">
        <input id="productQty" type="number" min="1" max="${Math.max(1,p.stock)}" value="1">
        <button class="btn primary" id="productAdd" ${p.stock<=0?"disabled":""}>Agregar al carrito</button>
        <a class="btn secondary" target="_blank" rel="noopener" href="https://wa.me/5491139384518?text=${encodeURIComponent("Hola Suspiros del Alma, quiero consultar por: "+p.name)}">Consultar por WhatsApp</a>
      </div>
      <div class="product-note">Envíos por Correo Argentino a todo el país, moto envío según zona y punto de encuentro coordinado en Estación Longchamps. El costo de envío se confirma antes del pago.</div>
    </section>`;
  document.querySelector("#productAdd")?.addEventListener("click",()=>{
    const qty=Math.max(1,Number(document.querySelector("#productQty").value)||1);app.addToCart(p.id,qty);
  });
  const related=PRODUCTS.filter(x=>x.id!==p.id && x.categories.some(c=>p.categories.includes(c))).slice(0,4);
  const rel=document.querySelector("#relatedGrid"); if(rel){rel.innerHTML=(related.length?related:PRODUCTS.filter(x=>x.id!==p.id).slice(0,4)).map(app.productCard).join("");rel.querySelectorAll(".add-cart").forEach(b=>b.onclick=()=>app.addToCart(b.dataset.id));}
})();