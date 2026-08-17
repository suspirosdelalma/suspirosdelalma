(() => {
  const PRODUCTS = window.PRODUCTS || [];
  const $ = (s) => document.querySelector(s);
  const money = v => v == null || Number(v) <= 0 ? "Precio a cargar" : new Intl.NumberFormat("es-AR",{style:"currency",currency:"ARS",maximumFractionDigits:0}).format(v);
  const categories = [...new Set(PRODUCTS.flatMap(p=>p.categories))].sort();
  const brands = [...new Set(PRODUCTS.map(p=>p.brand))].sort();
  let cart = JSON.parse(localStorage.getItem("sda_cart") || "[]");

  const categoryIcons = {
    "Sahumerios":"♨","Pulseras y colgantes":"✦","Cascadas y conitos":"〰","Velas":"☾",
    "Hornillos":"♧","Aceites y aromas":"◌","Bienestar":"✧","Novedades":"✺"
  };

  function productCard(p){
    const badge = p.stock<=0 ? '<span class="badge out">Sin stock</span>' : p.new ? '<span class="badge">Novedad</span>' : p.offer ? '<span class="badge offer">Oferta</span>' : '';
    return `<article class="product-card" data-id="${p.id}">
      <a class="product-photo" href="producto.html?id=${encodeURIComponent(p.id)}">
        ${badge}
        ${p.image ? `<img src="${p.image}" alt="${p.name}">` : `<div class="product-placeholder">${p.name}</div>`}
      </a>
      <div class="product-info">
        <div class="product-meta">${p.brand} · ${p.categories[0]}</div>
        <a href="producto.html?id=${encodeURIComponent(p.id)}"><h3>${p.name}</h3></a>
        <div class="price ${!p.price?'missing':''}">${money(p.price)}</div>
        <div class="stock-status ${p.stock<=0?'out':''}">${p.stock>0 ? `En stock · ${p.stock} unid.` : 'Sin stock — podés consultar disponibilidad'}</div>
        <div class="product-actions">
          <button class="btn primary add-cart" data-id="${p.id}" ${p.stock<=0?'disabled title="Sin stock"':''}>Agregar</button>
          <a class="icon-btn" href="https://wa.me/5491139384518?text=${encodeURIComponent('Hola Suspiros del Alma, quiero consultar por: '+p.name)}" target="_blank" rel="noopener" title="Consultar por WhatsApp">💬</a>
        </div>
      </div>
    </article>`;
  }

  function renderCategories(){
    const grid=$("#categoryGrid"); if(!grid) return;
    grid.innerHTML = categories.filter(c=>c!=="Novedades").map(c=>{
      const count=PRODUCTS.filter(p=>p.categories.includes(c)).length;
      return `<article class="category-card" data-category="${c}">
        <div class="category-icon">${categoryIcons[c]||"✧"}</div>
        <h3>${c}</h3><p>${count} ${count===1?"producto cargado":"productos cargados"}</p>
      </article>`;
    }).join("");
    grid.querySelectorAll(".category-card").forEach(el=>el.addEventListener("click",()=>{
      $("#categoryFilter").value=el.dataset.category; filterProducts(); document.querySelector("#productos").scrollIntoView();
    }));
  }

  function fillFilters(){
    const cf=$("#categoryFilter"), bf=$("#brandFilter");
    if(cf) cf.innerHTML += categories.map(c=>`<option value="${c}">${c}</option>`).join("");
    if(bf) bf.innerHTML += brands.map(b=>`<option value="${b}">${b}</option>`).join("");
  }

  function filterProducts(){
    const grid=$("#productGrid"); if(!grid) return;
    let list=[...PRODUCTS];
    const q=($("#searchInput")?.value||"").trim().toLowerCase();
    const cat=$("#categoryFilter")?.value||"", brand=$("#brandFilter")?.value||"", sort=$("#sortFilter")?.value||"featured";
    if(q) list=list.filter(p=>[p.name,p.brand,p.short,p.description,...p.tags,...p.categories].join(" ").toLowerCase().includes(q));
    if(cat) list=list.filter(p=>p.categories.includes(cat));
    if(brand) list=list.filter(p=>p.brand===brand);
    if(sort==="newest") list.sort((a,b)=>Number(b.new)-Number(a.new));
    if(sort==="price-asc") list.sort((a,b)=>(a.price||Infinity)-(b.price||Infinity));
    if(sort==="price-desc") list.sort((a,b)=>(b.price||0)-(a.price||0));
    if(sort==="name") list.sort((a,b)=>a.name.localeCompare(b.name));
    if(sort==="featured") list.sort((a,b)=>Number(b.featured)-Number(a.featured));
    grid.innerHTML=list.map(productCard).join("");
    $("#resultCount") && ($("#resultCount").textContent=`${list.length} productos`);
    $("#emptyState")?.classList.toggle("hidden",list.length>0);
    grid.querySelectorAll(".add-cart").forEach(btn=>btn.addEventListener("click",()=>addToCart(btn.dataset.id)));
  }

  function saveCart(){ localStorage.setItem("sda_cart",JSON.stringify(cart)); renderCart(); }
  function addToCart(id, qty=1){
    const p=PRODUCTS.find(x=>x.id===id); if(!p || p.stock<=0) return;
    const item=cart.find(x=>x.id===id);
    if(item) item.qty=Math.min(item.qty+qty,p.stock); else cart.push({id,qty:Math.min(qty,p.stock)});
    saveCart(); openCart();
  }
  function changeQty(id,d){
    const p=PRODUCTS.find(x=>x.id===id), item=cart.find(x=>x.id===id); if(!item||!p) return;
    item.qty=Math.max(0,Math.min(item.qty+d,p.stock));
    if(item.qty===0) cart=cart.filter(x=>x.id!==id); saveCart();
  }
  function removeItem(id){cart=cart.filter(x=>x.id!==id);saveCart()}
  function renderCart(){
    const count=cart.reduce((a,x)=>a+x.qty,0); document.querySelectorAll("#cartCount").forEach(x=>x.textContent=count);
    const box=$("#cartItems"), empty=$("#cartEmpty"), checkout=$("#cartCheckout"); if(!box) return;
    box.innerHTML=cart.map(i=>{
      const p=PRODUCTS.find(x=>x.id===i.id); if(!p) return "";
      return `<div class="cart-item"><div><h4>${p.name}</h4><small>${money(p.price)}</small>
        <div class="qty"><button data-minus="${p.id}">−</button><span>${i.qty}</span><button data-plus="${p.id}">+</button></div></div>
        <div><strong>${p.price?money(p.price*i.qty):"—"}</strong><br><button class="remove" data-remove="${p.id}">Quitar</button></div></div>`;
    }).join("");
    const total=cart.reduce((a,i)=>{const p=PRODUCTS.find(x=>x.id===i.id);return a+(p?.price||0)*i.qty},0);
    $("#cartTotal") && ($("#cartTotal").textContent=money(total));
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
    const lines=cart.map(i=>{const p=PRODUCTS.find(x=>x.id===i.id);return `• ${i.qty} x ${p.name}${p.price?` — ${money(p.price*i.qty)}`:" — precio a confirmar"}`});
    const total=cart.reduce((a,i)=>{const p=PRODUCTS.find(x=>x.id===i.id);return a+(p?.price||0)*i.qty},0);
    const text=["Hola Suspiros del Alma, quiero realizar este pedido:","",...lines,"",`Entrega: ${shipping}`,`Pago: ${payment}`,total>0?`Subtotal productos: ${money(total)}`:"","", "¿Me confirmás disponibilidad y costo final de envío?"].filter(Boolean).join("\n");
    window.open(`https://wa.me/5491139384518?text=${encodeURIComponent(text)}`,"_blank");
  }

  renderCart();
  if($("#categoryGrid")){renderCategories();fillFilters();filterProducts();}
  ["#searchInput","#categoryFilter","#brandFilter","#sortFilter"].forEach(s=>$(s)?.addEventListener("input",filterProducts));
  $("#openCart")?.addEventListener("click",openCart);$("#closeCart")?.addEventListener("click",closeCart);$("#overlay")?.addEventListener("click",closeCart);$("#keepShopping")?.addEventListener("click",closeCart);$("#checkoutWhatsApp")?.addEventListener("click",checkout);
  $("#menuToggle")?.addEventListener("click",()=>$("#mainNav")?.classList.toggle("open"));
  $("#year") && ($("#year").textContent=new Date().getFullYear());
  window.SDA={PRODUCTS,money,productCard,addToCart,renderCart,openCart};
})();