(() => {
  const P=window.PRODUCTS||[];
  const money=v=>new Intl.NumberFormat("es-AR",{style:"currency",currency:"ARS",maximumFractionDigits:0}).format(v||0);
  const statProducts=document.querySelector("#statProducts"), statStock=document.querySelector("#statStock"), statLow=document.querySelector("#statLow"), statValue=document.querySelector("#statValue");
  const low=P.filter(p=>p.stock<=p.minStock);
  if(statProducts)statProducts.textContent=P.length;
  if(statStock)statStock.textContent=P.reduce((a,p)=>a+(p.stock||0),0);
  if(statLow)statLow.textContent=low.length;
  if(statValue)statValue.textContent=money(P.reduce((a,p)=>a+(p.cost||0)*(p.stock||0),0));
  const lowList=document.querySelector("#lowStockList");
  if(lowList) lowList.innerHTML=low.map(p=>`<div class="stock-alert"><div><strong>${p.name}</strong><small>mínimo ${p.minStock}</small></div><span>${p.stock} unid.</span></div>`).join("") || "<p>Sin alertas.</p>";
  const rows=document.querySelector("#adminProductRows");
  if(rows) rows.innerHTML=P.map(p=>`<tr><td><strong>${p.name}</strong></td><td>${p.brand}</td><td>${p.categories.join(", ")}</td><td>${p.price?money(p.price):"A cargar"}</td><td>${p.stock}</td><td><span class="status-dot ${p.stock<=0?'out':''}">${p.stock<=0?"Sin stock":"Activo"}</span></td></tr>`).join("");
  const inv=document.querySelector("#inventorySummary");
  if(inv) inv.innerHTML=`<p><strong>${P.length}</strong> productos base cargados. Actualmente el inventario real todavía debe importarse desde WhatsApp.</p><p>Valor a costo registrado: <strong>${money(P.reduce((a,p)=>a+(p.cost||0)*(p.stock||0),0))}</strong>.</p>`;

  document.querySelectorAll("[data-admin-view]").forEach(btn=>btn.addEventListener("click",()=>{
    document.querySelectorAll("[data-admin-view]").forEach(x=>x.classList.remove("active"));btn.classList.add("active");
    document.querySelectorAll(".admin-view").forEach(v=>v.classList.remove("active"));document.querySelector("#view-"+btn.dataset.adminView)?.classList.add("active");
    const title={dashboard:"Resumen del negocio",productos:"Productos",inventario:"Inventario",pedidos:"Pedidos",clientes:"Clientes",compras:"Compras a proveedores",gastos:"Gastos",informes:"Informes"}[btn.dataset.adminView];
    document.querySelector("#adminTitle").textContent=title;
  }));

  document.querySelector("#downloadCsv")?.addEventListener("click",()=>{
    const cols=["id","name","brand","categories","price","cost","stock","minStock","featured","new","offer","image","short"];
    const esc=v=>`"${String(v??"").replaceAll('"','""')}"`;
    const csv=[cols.join(","),...P.map(p=>cols.map(c=>esc(c==="categories"?p[c].join("|"):p[c])).join(","))].join("\n");
    const blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="catalogo-suspiros-del-alma.csv";a.click();URL.revokeObjectURL(a.href);
  });
})();