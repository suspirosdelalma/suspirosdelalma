(async () => {
  const app = await (window.SDA_APP_READY || Promise.resolve(window.SDA));
  const PRODUCTS = window.PRODUCTS || [];
  if (!app || !PRODUCTS.length) return;

  const $ = s => document.querySelector(s);
  const normalize = value => String(value || "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

  function productText(p) {
    return normalize([
      p.name,p.brand,p.primaryCategory,p.type,p.short,p.description,p.aroma,p.color,
      ...(p.categories || []),...(p.variants || [])
    ].join(" "));
  }

  const categoryOrder = new Map();
  (window.CATEGORIES || []).forEach(c => {
    categoryOrder.set(normalize(c.name), Number(c.order) || 999);
    categoryOrder.set(normalize(c.id), Number(c.order) || 999);
  });
  const categoryRank = name => categoryOrder.get(normalize(name)) ?? 999;

  function reorderCategoriesFromSheet() {
    const grid = $("#categoryGrid");
    if (grid) {
      [...grid.children]
        .sort((a,b) => categoryRank(a.dataset.category) - categoryRank(b.dataset.category) || a.dataset.category.localeCompare(b.dataset.category,"es"))
        .forEach(el => grid.appendChild(el));
    }
    const select = $("#categoryFilter");
    if (select && select.options.length > 1) {
      const first = select.options[0];
      const options = [...select.options].slice(1)
        .sort((a,b) => categoryRank(a.value) - categoryRank(b.value) || a.text.localeCompare(b.text,"es"));
      select.innerHTML = "";
      select.appendChild(first);
      options.forEach(o => select.appendChild(o));
    }
  }

  const intentRules = {
    calma: {
      label:"Calma y relajación",
      words:["calma","relaj","lavanda","medit","armon","bienestar","yoga","sandalo","sándalo","vainilla","nardo"]
    },
    limpieza: {
      label:"Limpieza y protección",
      words:["limpieza","purif","proteccion","protección","ruda","romero","palo santo","defum","7 chakras","sagrada geometria","sagrada geometría"]
    },
    abundancia: {
      label:"Abundancia",
      words:["dinero","abund","prosper","suerte","atrae dinero","fortuna","abre camino","atrae clientes","buena suerte"]
    },
    amor: {
      label:"Amor y armonía",
      words:["amor","armonia","armonía","rosa","rosas","frutilla","jazmin","jazmín","vainilla","canela"]
    },
    momento: {
      label:"Un momento para mí",
      words:["sahumer","difus","aroma","hornillo","vela","aceite","lavanda","bienestar"]
    },
    regalo: {
      label:"Quiero hacer un regalo",
      words:["combo","regalo","ramo","duende","pulsera","colgante","atrapasol","magos","papanoel"]
    }
  };

  function matchesIntent(p, key) {
    if (key === "regalo" && p.combo) return true;
    const text = productText(p);
    return (intentRules[key]?.words || []).some(w => text.includes(normalize(w)));
  }

  function bindAddButtons(container) {
    container?.querySelectorAll(".add-cart").forEach(btn => {
      btn.addEventListener("click", () => app.addToCart(btn.dataset.id));
    });
  }

  function renderProductList(list, label) {
    const grid = $("#productGrid");
    if (!grid) return;
    grid.innerHTML = list.map(app.productCard).join("");
    bindAddButtons(grid);
    if ($("#resultCount")) $("#resultCount").textContent = `${list.length} productos`;
    $("#emptyState")?.classList.toggle("hidden", list.length > 0);
    const note = $("#intentResultNote");
    if (note) {
      note.classList.add("show");
      $("#intentResultText").textContent = `Elegimos estas opciones para: ${label}.`;
    }
  }

  document.querySelectorAll("[data-intent]").forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.intent;
      const rule = intentRules[key];
      if (!rule) return;
      if ($("#searchInput")) $("#searchInput").value = "";
      if ($("#categoryFilter")) $("#categoryFilter").value = "";
      if ($("#brandFilter")) $("#brandFilter").value = "";
      let list = PRODUCTS.filter(p => p.stock !== 0 && matchesIntent(p,key));
      if (!list.length) list = PRODUCTS.filter(p => p.stock !== 0).slice(0,8);
      list.sort((a,b) => Number(b.featured)-Number(a.featured) || a.order-b.order);
      renderProductList(list.slice(0,12), rule.label);
      $("#productos")?.scrollIntoView({behavior:"smooth",block:"start"});
    });
  });

  $("#clearIntent")?.addEventListener("click", () => {
    $("#intentResultNote")?.classList.remove("show");
    const input = $("#searchInput");
    if (input) {
      input.value = "";
      input.dispatchEvent(new Event("input",{bubbles:true}));
    }
  });

  ["#searchInput","#categoryFilter","#brandFilter","#sortFilter"].forEach(sel => {
    $(sel)?.addEventListener("input", () => $("#intentResultNote")?.classList.remove("show"));
  });

  function uniqueProducts(list) {
    const seen = new Set();
    return list.filter(p => p && !seen.has(p.id) && seen.add(p.id));
  }

  function renderCurated(id, list, fallback=[]) {
    const box = $(id);
    if (!box) return;
    const finalList = uniqueProducts([...list,...fallback]).filter(p => p.stock !== 0).slice(0,4);
    box.innerHTML = finalList.map(app.productCard).join("");
    bindAddButtons(box);
  }

  const available = PRODUCTS.filter(p => p.stock !== 0);
  const featured = available.filter(p => p.featured).sort((a,b)=>a.order-b.order);
  const gifts = available.filter(p => p.combo || matchesIntent(p,"regalo")).sort((a,b)=>Number(b.combo)-Number(a.combo) || a.order-b.order);
  const newest = available.filter(p => p.new).sort((a,b)=>a.order-b.order);
  renderCurated("#featuredPicks", featured, available);
  renderCurated("#giftPicks", gifts, featured);
  renderCurated("#newPicks", newest, featured);

  reorderCategoriesFromSheet();
})();
