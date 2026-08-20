window.SDA_APP_READY = (async () => {
  await (window.SDA_DATA_READY || Promise.resolve());
  const PRODUCTS = window.PRODUCTS || [];
  const CONFIG = window.SDA_CATALOG_CONFIG || {whatsapp:"5491139384518"};
  const $ = s => document.querySelector(s);

  const money = v => {
    if (v == null || !Number.isFinite(Number(v)) || Number(v) <= 0) return "A confirmar";
    return new Intl.NumberFormat("es-AR",{style:"currency",currency:"ARS",maximumFractionDigits:0}).format(Number(v));
  };
  const priceText = p => p?.showPrice && p?.price ? money(p.price) : "Consultar precio";
  const canAdd = p => p && p.stock !== 0;
  const stockText = p => {
    if (!p) return "";
    if (p.stock === null || p.stock === undefined) return "Disponibilidad a confirmar";
    if (p.stock <= 0) return "Sin stock — consultanos próxima disponibilidad";
    if (p.minStock != null && p.stock <= p.minStock) return `Últimas unidades · ${p.stock} disponibles`;
    return `En stock · ${p.stock} unid.`;
  };
  const stockClass = p => p?.stock === 0 ? "out" : "";

  const categories = [...new Set(PRODUCTS.flatMap(p=>p.categories||[]))].sort((a,b)=>a.localeCompare(b,"es"));
  const primaryCategories = [...new Set(PRODUCTS.map(p=>p.primaryCategory).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"es"));
  const brands = [...new Set(PRODUCTS.map(p=>p.brand).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"es"));
  let cart = JSON.parse(localStorage.getItem("sda_cart") || "[]").filter(i=>PRODUCTS.some(p=>p.id===i.id));

  const categoryIcons = {
    "Sahumerios":"♨","Pulseras y colgantes":"✦","Cascadas y conitos":"〰","Velas":"☾",
    "Hornillos":"♧","Aceites y aromas":"◌","Difusores y aromas":"◌","Bienestar":"✧",
    "Decoración":"✦","Defumación":"♨","Combos y regalos":"🎁","Novedades":"✺"
  };

  function productCard(p){
    const badge = p.stock === 0 ? '<span class="badge out">Sin stock</span>'
      : p.offer ? '<span class="badge offer">Oferta</span>'
      : p.new ? '<span class="badge">Novedad</span>' : '';
    return `<article class="product-card" data-id="${p.id}">
      <a class="product-photo" href="producto.html?id=${encodeURIComponent(p.id)}">
        ${badge}
        ${p.image ? `<img src="${p.image}" alt="${p.name}" loading="lazy">` : `<div class="product-placeholder">${p.name}</div>`}
      </a>
      <div class="product-info">
        <div class="product-meta">${p.brand} · ${p.primaryCategory || p.categories?.[0] || ""}</div>
        <a href="producto.html?id=${encodeURIComponent(p.id)}"><h3>${p.name}</h3></a>
        <div class="price ${!p.showPrice?'missing':''}">${priceText(p)}</div>
        <div class="stock-status ${stockClass(p)}">${stockText(p)}</div>
        <div class="product-actions">
          <button class="btn primary add-cart" data-id="${p.id}" ${!canAdd(p)?'disabled title="Sin stock"':''}>Agregar</button>
          <a class="icon-btn" href="https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent('Hola Suspiros del Alma, quiero consultar por: '+p.name)}" target="_blank" rel="noopener" title="Consultar por WhatsApp">💬</a>
        </div>
      </div>
    </article>`;
  }

  function renderCategories(){
    const grid=$("#categoryGrid"); if(!grid) return;
    grid.innerHTML = primaryCategories.map(c=>{
      const count=PRODUCTS.filter(p=>p.primaryCategory===c).length;
      return `<article class="category-card" data-category="${c}">
        <div class="category-icon">${categoryIcons[c]||"✧"}</div>
        <h3>${c}</h3><p>${count} ${count===1?"producto":"productos"}</p>
      </article>`;
    }).join("");
    grid.querySelectorAll(".category-card").forEach(el=>el.addEventListener("click",()=>{
      if($("#categoryFilter")) $("#categoryFilter").value=el.dataset.category;
      filterProducts(); document.querySelector("#productos")?.scrollIntoView();
    }));
  }

  function fillFilters(){
    const cf=$("#categoryFilter"), bf=$("#brandFilter");
    if(cf) cf.innerHTML = '<option value="">Todas las categorías</option>' + categories.map(c=>`<option value="${c}">${c}</option>`).join("");
    if(bf) bf.innerHTML = '<option value="">Todas las marcas</option>' + brands.map(b=>`<option value="${b}">${b}</option>`).join("");
  }

  function filterProducts(){
    const grid=$("#productGrid"); if(!grid) return;
    let list=[...PRODUCTS];
    const q=($("#searchInput")?.value||"").trim().toLowerCase();
    const cat=$("#categoryFilter")?.value||"", brand=$("#brandFilter")?.value||"", sort=$("#sortFilter")?.value||"featured";
    if(q) list=list.filter(p=>[p.name,p.brand,p.short,p.description,p.tags,...(p.categories||[]),...(p.variants||[])].join(" ").toLowerCase().includes(q));
    if(cat) list=list.filter(p=>(p.categories||[]).includes(cat));
    if(brand) list=list.filter(p=>p.brand===brand);
    if(sort==="newest") list.sort((a,b)=>Number(b.new)-Number(a.new) || a.order-b.order);
    if(sort==="price-asc") list.sort((a,b)=>(a.showPrice?a.price:Infinity)-(b.showPrice?b.price:Infinity));
    if(sort==="price-desc") list.sort((a,b)=>(b.showPrice?b.price:-1)-(a.showPrice?a.price:-1));
    if(sort==="name") list.sort((a,b)=>a.name.localeCompare(b.name,"es"));
    if(sort==="featured") list.sort((a,b)=>Number(b.featured)-Number(a.featured) || a.order-b.order);
    grid.innerHTML=list.map(productCard).join("");
    if($("#resultCount")) $("#resultCount").textContent=`${list.length} productos`;
    $("#emptyState")?.classList.toggle("hidden",list.length>0);
    grid.querySelectorAll(".add-cart").forEach(btn=>btn.addEventListener("click",()=>addToCart(btn.dataset.id)));
  }

  function maxQty(p){ return p.stock == null ? Number.POSITIVE_INFINITY : Math.max(0,p.stock); }
  function saveCart(){ localStorage.setItem("sda_cart",JSON.stringify(cart)); renderCart(); }

  function addToCart(id, qty=1){
    const p=PRODUCTS.find(x=>x.id===id); if(!canAdd(p)) return;
    const max=maxQty(p), item=cart.find(x=>x.id===id);
    if(item) item.qty=Math.min(item.qty+qty,max);
    else cart.push({id,qty:Math.min(Math.max(1,qty),max)});
    saveCart(); openCart();
  }

  function changeQty(id,d){
    const p=PRODUCTS.find(x=>x.id===id), item=cart.find(x=>x.id===id); if(!item||!p) return;
    item.qty=Math.max(0,Math.min(item.qty+d,maxQty(p)));
    if(item.qty===0) cart=cart.filter(x=>x.id!==id);
    saveCart();
  }
  function removeItem(id){cart=cart.filter(x=>x.id!==id);saveCart()}

  function renderCart(){
    const count=cart.reduce((a,x)=>a+x.qty,0); document.querySelectorAll("#cartCount").forEach(x=>x.textContent=count);
    const box=$("#cartItems"), empty=$("#cartEmpty"), checkout=$("#cartCheckout"); if(!box) return;
    box.innerHTML=cart.map(i=>{
      const p=PRODUCTS.find(x=>x.id===i.id); if(!p) return "";
      const line = p.showPrice && p.price ? money(p.price*i.qty) : "A confirmar";
      return `<div class="cart-item"><div><h4>${p.name}</h4><small>${priceText(p)}</small>
        <div class="qty"><button data-minus="${p.id}">−</button><span>${i.qty}</span><button data-plus="${p.id}">+</button></div></div>
        <div><strong>${line}</strong><br><button class="remove" data-remove="${p.id}">Quitar</button></div></div>`;
    }).join("");
    const known=cart.reduce((a,i)=>{const p=PRODUCTS.find(x=>x.id===i.id);return a+(p?.showPrice&&p?.price?p.price*i.qty:0)},0);
    const unknown=cart.some(i=>{const p=PRODUCTS.find(x=>x.id===i.id);return p && !(p.showPrice&&p.price)});
    if($("#cartTotal")) $("#cartTotal").textContent = unknown ? (known>0 ? `${money(known)} + a confirmar` : "A confirmar") : money(known);
    empty?.classList.toggle("hidden",cart.length>0); checkout?.classList.toggle("hidden",cart.length===0);
    box.querySelectorAll("[data-minus]").forEach(b=>b.onclick=()=>changeQty(b.dataset.minus,-1));
    box.querySelectorAll("[data-plus]").forEach(b=>b.onclick=()=>changeQty(b.dataset.plus,1));
    box.querySelectorAll("[data-remove]").forEach(b=>b.onclick=()=>removeItem(b.dataset.remove));
  }

  function openCart(){$("#cartPanel")?.classList.add("open");$("#overlay")?.classList.add("show");$("#cartPanel")?.setAttribute("aria-hidden","false")}
  function closeCart(){$("#cartPanel")?.classList.remove("open");$("#overlay")?.classList.remove("show");$("#cartPanel")?.setAttribute("aria-hidden","true")}

  function checkout(){
    if(!cart.length)return;
    const shipping=$("#shippingMethod")?.value||"A coordinar", payment=$("#paymentMethod")?.value||"A coordinar";
    const lines=cart.map(i=>{
      const p=PRODUCTS.find(x=>x.id===i.id);
      const linePrice=p.showPrice&&p.price?` — ${money(p.price*i.qty)}`:" — precio a confirmar";
      return `• ${i.qty} x ${p.name}${linePrice}`;
    });
    const known=cart.reduce((a,i)=>{const p=PRODUCTS.find(x=>x.id===i.id);return a+(p?.showPrice&&p?.price?p.price*i.qty:0)},0);
    const unknown=cart.some(i=>{const p=PRODUCTS.find(x=>x.id===i.id);return p && !(p.showPrice&&p.price)});
    const subtotal = known>0 ? `Subtotal de precios publicados: ${money(known)}${unknown?" + productos a confirmar":""}` : "Precio total: a confirmar";
    const text=["Hola Suspiros del Alma, quiero realizar este pedido:","",...lines,"",`Entrega: ${shipping}`,`Pago: ${payment}`,subtotal,"","¿Me confirmás disponibilidad y costo final de envío?"].join("\n");
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`,"_blank");
  }

  renderCart();
  if($("#categoryGrid")){renderCategories();fillFilters();filterProducts();}
  ["#searchInput","#categoryFilter","#brandFilter","#sortFilter"].forEach(s=>$(s)?.addEventListener("input",filterProducts));
  $("#openCart")?.addEventListener("click",openCart);$("#closeCart")?.addEventListener("click",closeCart);
  $("#overlay")?.addEventListener("click",closeCart);$("#keepShopping")?.addEventListener("click",closeCart);
  $("#checkoutWhatsApp")?.addEventListener("click",checkout);
  $("#menuToggle")?.addEventListener("click",()=>$("#mainNav")?.classList.toggle("open"));
  if($("#year")) $("#year").textContent=new Date().getFullYear();

  console.info("Suspiros del Alma catálogo:", window.SDA_DATA_SOURCE);
  window.SDA={PRODUCTS,money,priceText,stockText,canAdd,productCard,addToCart,renderCart,openCart};
  return window.SDA;
})();