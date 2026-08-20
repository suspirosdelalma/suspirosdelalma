(async () => {
  await (window.SDA_DATA_READY || Promise.resolve());
  const P=window.PRODUCTS||[];
  const money=v=>new Intl.NumberFormat("es-AR",{style:"currency",currency:"ARS",maximumFractionDigits:0}).format(Number(v)||0);

  const knownStock=P.filter(p=>p.stock!=null);
  const low=P.filter(p=>p.stock!=null && p.minStock!=null && p.stock<=p.minStock);
  const statProducts=document.querySelector("#statProducts"), statStock=document.querySelector("#statStock"), statLow=document.querySelector("#statLow"), statValue=document.querySelector("#statValue");

  if(statProducts)statProducts.textContent=P.length;
  if(statStock)statStock.textContent=knownStock.length ? knownStock.reduce((a,p)=>a+(p.stock||0),0) : "Pendiente";
  if(statLow)statLow.textContent=low.length;
  if(statValue){
    statValue.textContent="Privado";
    const label=statValue.parentElement?.querySelector("span");
    if(label) label.textContent="se calculará en la gestión segura";
  }

  const lowList=document.querySelector("#lowStockList");
  if(lowList) lowList.innerHTML=low.map(p=>`<div class="stock-alert"><div><strong>${p.name}</strong><small>mínimo ${p.minStock}</small></div><span>${p.stock} unid.</span></div>`).join("") || "<p>No hay alertas con el stock actualmente cargado.</p>";

  const rows=document.querySelector("#adminProductRows");
  if(rows) rows.innerHTML=P.map(p=>`<tr>
    <td><strong>${p.name}</strong></td><td>${p.brand}</td><td>${p.primaryCategory||p.categories.join(", ")}</td>
    <td>${p.showPrice&&p.price?money(p.price):"No publicado"}</td>
    <td>${p.stock==null?"A confirmar":p.stock}</td>
    <td><span class="status-dot ${p.stock===0?'out':''}">${p.stock===0?"Sin stock":p.stock==null?"A confirmar":"Activo"}</span></td>
  </tr>`).join("");

  const inv=document.querySelector("#inventorySummary");
  if(inv) inv.innerHTML=`<p><strong>${P.length}</strong> productos activos leídos desde Google Sheets.</p>
    <p>Productos con stock numérico cargado: <strong>${knownStock.length}</strong>. Los costos y la valorización no se publican en esta versión.</p>`;

  document.querySelectorAll("[data-admin-view]").forEach(btn=>btn.addEventListener("click",()=>{
    document.querySelectorAll("[data-admin-view]").forEach(x=>x.classList.remove("active"));btn.classList.add("active");
    document.querySelectorAll(".admin-view").forEach(v=>v.classList.remove("active"));document.querySelector("#view-"+btn.dataset.adminView)?.classList.add("active");
    const title={dashboard:"Resumen del negocio",productos:"Productos",inventario:"Inventario",pedidos:"Pedidos",clientes:"Clientes",compras:"Compras a proveedores",gastos:"Gastos",informes:"Informes"}[btn.dataset.adminView];
    document.querySelector("#adminTitle").textContent=title;
  }));

  document.querySelector("#downloadCsv")?.addEventListener("click",()=>{
    const cols=["id","name","brand","primaryCategory","price","showPrice","stock","minStock","featured","new","offer","image","short"];
    const esc=v=>`"${String(v??"").replaceAll('"','""')}"`;
    const csv=[cols.join(","),...P.map(p=>cols.map(c=>esc(p[c])).join(","))].join("\n");
    const blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="catalogo-publico-suspiros-del-alma.csv";a.click();URL.revokeObjectURL(a.href);
  });

  console.info("Panel demo — fuente:", window.SDA_DATA_SOURCE);
})();