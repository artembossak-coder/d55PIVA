document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  const filters = document.querySelectorAll(".filter");
  const cards = document.querySelectorAll(".product-card");
  filters.forEach(btn => {
    btn.addEventListener("click", () => {
      filters.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        card.style.display = filter === "all" || card.dataset.category === filter ? "" : "none";
      });
    });
  });

  const form = document.getElementById("orderForm");
  const toast = document.getElementById("toast");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const beer = document.getElementById("beerSelect").value;
    const volume = document.getElementById("volume").value;
    const time = document.getElementById("time").value;
    const snack = document.getElementById("snack").value.trim();
    const comment = document.getElementById("comment").value.trim();

    const message =
`Здравствуйте! Хочу оформить заказ в DULATY55.

Имя: ${name}
Телефон: ${phone}
Пиво: ${beer}
Объём: ${volume}
Время приезда: ${time}
Закуски: ${snack || "не указаны"}
Комментарий: ${comment || "нет"}

Адрес: проспект Дулати, 55, Алматы`;

    const url = "https://wa.me/77026655688?text=" + encodeURIComponent(message);
    toast.classList.add("show");
    setTimeout(() => {
      window.open(url, "_blank", "noopener");
      toast.classList.remove("show");
    }, 500);
  });

  const menuBtn = document.querySelector(".menu-btn");
  const nav = document.querySelector(".nav");
  menuBtn?.addEventListener("click", () => {
    const open = nav.classList.toggle("mobile-open");
    if (open) {
      nav.style.display = "flex";
      nav.style.position = "absolute";
      nav.style.top = "68px";
      nav.style.left = "0";
      nav.style.right = "0";
      nav.style.padding = "20px 5vw";
      nav.style.flexDirection = "column";
      nav.style.background = "rgba(8,7,6,.97)";
      nav.style.borderBottom = "1px solid rgba(255,255,255,.08)";
    } else {
      nav.style.display = "";
      nav.removeAttribute("style");
    }
  });
});

  const inventoryPanel = document.getElementById("inventoryPanel");
  const inventoryOpen = document.getElementById("inventoryOpen");
  const inventoryClose = document.getElementById("inventoryClose");
  const inventoryList = document.getElementById("inventoryList");
  const stockKey = "dulaty55_stock_v1";

  const productData = [
    ["0","DOS — 750 ₸/л"],["1","Прага — 1 140 ₸/л"],["2","Жигули Барное — 1 510 ₸/л"],
    ["3","Dorfest — 1 070 ₸/л"],["4","Weissberg — 1 200 ₸/л"],["5","Текелийское эль — 1 790 ₸/л"],
    ["6","Kwak Amber — 1 760 ₸/л"],["7","Гусь Коварный — 2 270 ₸/л"],["8","Первая Бочка — 2 670 ₸/л"],
    ["9","Андреич — 1 140 ₸/л"],["10","Безалкогольное — 250 ₸/0.5л"],["11","Первая Варка — 2 000 ₸/л"]
  ];
  let stock = JSON.parse(localStorage.getItem(stockKey) || "{}");

  function isAvailable(id){ return stock[id] !== false; }

  function syncCards(){
    document.querySelectorAll(".product-card[data-id]").forEach(card => {
      const id = card.dataset.id;
      const available = isAvailable(id);
      card.classList.toggle("out-of-stock", !available);
      const badge = card.querySelector(".stock-badge");
      if (badge) badge.textContent = available ? "В наличии" : "Нет в наличии";
    });
    const select = document.getElementById("beerSelect");
    [...select.options].forEach((option, index) => {
      if(index === 0) return;
      const id = String(index - 1);
      option.disabled = !isAvailable(id);
      option.textContent = productData[index - 1][1] + (isAvailable(id) ? "" : " — НЕТ В НАЛИЧИИ");
    });
  }

  function renderInventory(){
    inventoryList.innerHTML = "";
    productData.forEach(([id,name]) => {
      const available = isAvailable(id);
      const item = document.createElement("div");
      item.className = "inventory-item";
      item.innerHTML = `<span>${name}</span><button class="inventory-toggle ${available ? "available" : "unavailable"}" data-id="${id}">${available ? "✓ В наличии" : "× Нет в наличии"}</button>`;
      inventoryList.appendChild(item);
    });
    inventoryList.querySelectorAll(".inventory-toggle").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        stock[id] = !isAvailable(id);
        localStorage.setItem(stockKey, JSON.stringify(stock));
        renderInventory();
        syncCards();
      });
    });
  }

  inventoryOpen?.addEventListener("click", () => {
    renderInventory();
    inventoryPanel.classList.add("open");
    inventoryPanel.scrollIntoView({behavior:"smooth", block:"start"});
  });
  inventoryClose?.addEventListener("click", () => inventoryPanel.classList.remove("open"));
  syncCards();
