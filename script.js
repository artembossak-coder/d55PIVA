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

/* v3: unique randomized bubble trajectories — camera feels submerged in beer */
(function createBeerAtmosphere(){
  const bg = document.querySelector('.beer-bg');
  if(!bg) return;
  const layer = document.createElement('div');
  layer.className = 'chaos-bubbles';
  const rand = (min,max) => Math.random()*(max-min)+min;
  for(let i=0;i<58;i++){
    const b=document.createElement('span');
    const size=rand(2, i<12 ? 13 : 7);
    const startX=rand(-5,105), startY=rand(35,108);
    const depth=Math.random();
    const travel=depth>.7 ? rand(280,560) : rand(170,360);
    const drift=rand(45,150)*(Math.random()<.5?-1:1);
    const duration=rand(7,18);
    const delay=-rand(0,duration);
    b.className='chaos-bubble '+(depth>.72?'near':depth<.28?'far':'');
    b.style.left=startX+'%'; b.style.top=startY+'%';
    b.style.width=size+'px'; b.style.height=size+'px';
    b.style.setProperty('--duration',duration.toFixed(2)+'s');
    b.style.setProperty('--delay',delay.toFixed(2)+'s');
    b.style.setProperty('--opacity',rand(.32,.9).toFixed(2));
    b.style.setProperty('--x1',rand(-drift,drift));
    b.style.setProperty('--x2',rand(-drift*1.5,drift*1.5));
    b.style.setProperty('--x3',rand(-drift,drift));
    b.style.setProperty('--x4',rand(-drift*1.4,drift*1.4));
    b.style.setProperty('--x5',rand(-drift*1.8,drift*1.8));
    b.style.setProperty('--y1',-travel*.18);
    b.style.setProperty('--y2',-travel*.39);
    b.style.setProperty('--y3',-travel*.58);
    b.style.setProperty('--y4',-travel*.78);
    b.style.setProperty('--y5',-travel);
    layer.appendChild(b);
  }
  bg.appendChild(layer);
})();

/* Click a bubble -> pop -> one-time 5% surprise discount */
(function bubbleCoupons(){
  const bubbles=document.querySelectorAll('.chaos-bubble');
  let couponClaimed=localStorage.getItem('d55_coupon_5')==='1';
  bubbles.forEach(b=>b.addEventListener('click',e=>{
    e.stopPropagation();
    if(b.classList.contains('popped')) return;
    const x=e.clientX, y=e.clientY;
    b.classList.add('popped');
    const pop=document.createElement('div');
    pop.className='bubble-pop'; pop.textContent='POP!'; pop.style.left=x+'px'; pop.style.top=y+'px';
    document.body.appendChild(pop); setTimeout(()=>pop.remove(),700);
    if(!couponClaimed){
      couponClaimed=true; localStorage.setItem('d55_coupon_5','1');
      const toast=document.createElement('div'); toast.className='coupon-toast';
      toast.innerHTML='<b>🎁 Пузырёк лопнул!</b><span>Тебе выпала скидка <strong>5%</strong> на заказ в DULATY55.</span><button>Понятно</button>';
      document.body.appendChild(toast); toast.querySelector('button').onclick=()=>toast.remove();
      setTimeout(()=>toast.remove(),9000);
    }
  }));
})();

/* Reliable clickable bubbles */
(function(){
  const atmosphere = document.querySelector(".beer-atmosphere");
  if(!atmosphere) return;

  const layer = document.createElement("div");
  layer.className = "random-bubbles";
  atmosphere.appendChild(layer);

  let rewarded = false;
  try { rewarded = localStorage.getItem("d55_bubble_discount") === "yes"; } catch(e){}

  function makeBubble(){
    const b = document.createElement("button");
    b.type = "button";
    b.className = "beer-bubble";
    b.setAttribute("aria-label","Лопнуть пузырёк");
    const size = Math.round(18 + Math.random()*24);
    const left = Math.random()*96;
    const dur = (7 + Math.random()*8).toFixed(2);
    const delay = (-Math.random()*10).toFixed(2);
    b.style.width = size+"px";
    b.style.height = size+"px";
    b.style.left = left+"%";
    b.style.bottom = (-size - Math.random()*80)+"px";
    b.style.setProperty("--dur",dur+"s");
    b.style.setProperty("--delay",delay+"s");
    for(let n=1;n<=5;n++){
      b.style.setProperty("--x"+n, Math.round((Math.random()*2-1)*95)+"px");
    }

    const pop = (ev)=>{
      ev.preventDefault();
      ev.stopPropagation();
      if(b.dataset.popped) return;
      b.dataset.popped="1";

      const rect=b.getBoundingClientRect();
      const x=rect.left+rect.width/2, y=rect.top+rect.height/2;

      for(let i=0;i<9;i++){
        const p=document.createElement("span");
        p.className="bubble-particle";
        p.style.left=x+"px"; p.style.top=y+"px";
        p.style.setProperty("--px",Math.round(Math.cos(i/9*Math.PI*2)* (18+Math.random()*28))+"px");
        p.style.setProperty("--py",Math.round(Math.sin(i/9*Math.PI*2)* (18+Math.random()*28))+"px");
        document.body.appendChild(p);
        setTimeout(()=>p.remove(),600);
      }

      const label=document.createElement("div");
      label.className="bubble-pop-label";
      label.textContent="POP!";
      label.style.left=x+"px"; label.style.top=y+"px";
      document.body.appendChild(label);
      setTimeout(()=>label.remove(),800);

      b.classList.add("burst");
      setTimeout(()=>b.remove(),220);

      if(!rewarded){
        rewarded=true;
        try{localStorage.setItem("d55_bubble_discount","yes")}catch(e){}
        const toast=document.getElementById("bubbleDiscount");
        if(toast){
          toast.classList.add("show");
          const close=document.getElementById("bubbleDiscountClose");
          close.onclick=()=>toast.classList.remove("show");
          setTimeout(()=>toast.classList.remove("show"),7000);
        }
      }
      setTimeout(makeBubble,350);
    };

    b.addEventListener("click",pop,{passive:false});
    b.addEventListener("pointerup",e=>{
      if(e.pointerType==="touch") pop(e);
    },{passive:false});
    layer.appendChild(b);
    setTimeout(()=>{ if(document.body.contains(b)) b.remove(); makeBubble(); }, (parseFloat(dur)+2)*1000);
  }

  for(let i=0;i<28;i++) setTimeout(makeBubble,i*180);
})();


/* === Premium v6 Canvas background + coupon bubbles === */
(function(){
const c=document.createElement('canvas');
c.id='beerCanvas';
document.body.prepend(c);
const x=c.getContext('2d');
let w,h,b=[];
function rs(){w=c.width=innerWidth;h=c.height=innerHeight;}
addEventListener('resize',rs);rs();
for(let i=0;i<25;i++)b.push({x:Math.random()*w,y:Math.random()*h,r:6+Math.random()*18,v:0.5+Math.random()});
function loop(){
x.clearRect(0,0,w,h);
let g=x.createLinearGradient(0,h,0,0);
g.addColorStop(0,"#2b1600");g.addColorStop(1,"#0b0b0b");
x.fillStyle=g;x.fillRect(0,0,w,h);
for(const p of b){
p.y-=p.v;if(p.y<-30){p.y=h+30;p.x=Math.random()*w;}
x.beginPath();x.arc(p.x,p.y,p.r,0,Math.PI*2);
x.strokeStyle="rgba(255,210,90,.5)";x.stroke();
}
requestAnimationFrame(loop);
}
loop();

let used=localStorage.getItem("d55_coupon");
document.addEventListener("click",e=>{
if(used)return;
for(const p of b){
const dx=e.clientX-p.x,dy=e.clientY-p.y;
if(dx*dx+dy*dy<p.r*p.r){
used=1;
localStorage.setItem("d55_coupon","1");
alert("🎉 Ваш купон: D55-5\nСкидка 5%");
break;
}
}
});
})();
