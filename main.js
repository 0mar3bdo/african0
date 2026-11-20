/* ============================================
   أفريكانو للعبايات الخليجية
   إدارة: محمد كمال | تطوير: عمر عبده
   ============================================ */

const WHATSAPP_NUMBER = "201006832711";

/* ============================================
   إعدادات المنتجات (تُقرأ تلقائياً من مجلد images)
   ============================================ */
const MAX_PRODUCTS = 30;
const MAX_IMAGES_PER_PRODUCT = 10;

const categoryLabels = {
  classic: "✦ كلاسيك ✦",
  modern: "✦ مودرن ✦",
  luxury: "✦ فاخر ✦"
};

/* ============ Loader ============ */
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader").classList.add("hidden");
  }, 900);
});

/* ============ Header Scroll ============ */
const header = document.getElementById("header");
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 60);
});

/* ============ Mobile Menu ============ */
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("open");
  nav.classList.toggle("open");
});
nav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    menuToggle.classList.remove("open");
    nav.classList.remove("open");
  });
});

/* ============ Active Nav ============ */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");
window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 150) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === "#" + current);
  });
});

/* ============ Custom Cursor ============ */
const cursor = document.getElementById("cursor");
const cursorDot = document.getElementById("cursorDot");
let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;

document.addEventListener("mousemove", e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%,-50%)`;
});

function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.15;
  cursorY += (mouseY - cursorY) * 0.15;
  cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%,-50%)`;
  requestAnimationFrame(animateCursor);
}
animateCursor();

/* ============ Particles ============ */
const particlesContainer = document.getElementById("particles");
for (let i = 0; i < 30; i++) {
  const p = document.createElement("span");
  p.className = "particle";
  p.style.left = Math.random() * 100 + "%";
  p.style.animationDuration = (Math.random() * 15 + 10) + "s";
  p.style.animationDelay = (Math.random() * 10) + "s";
  p.style.width = p.style.height = (Math.random() * 4 + 2) + "px";
  particlesContainer.appendChild(p);
}

/* ============ 3D Tilt ============ */
function applyTilt(el) {
  const strength = 12;
  el.addEventListener("mousemove", e => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -strength;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * strength;
    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
  });
  el.addEventListener("mouseleave", () => {
    el.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateZ(0)";
  });
}

/* ============ Hero 3D Parallax ============ */
const heroFrame = document.querySelector(".hero-img-frame");
if (heroFrame) {
  document.addEventListener("mousemove", e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    heroFrame.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
  });
}

/* ============ Counter ============ */
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      let count = 0;
      const inc = target / 60;
      const timer = setInterval(() => {
        count += inc;
        if (count >= target) { count = target; clearInterval(timer); }
        el.textContent = target === 100 ? Math.round(count) + "%" : "+" + Math.round(count);
      }, 20);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll("[data-count]").forEach(el => counterObserver.observe(el));

/* ============ Reveal on Scroll ============ */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".section-head, .about-image, .about-text, .manager-banner, .contact-extra, .contact-form").forEach(el => {
  el.classList.add("reveal");
  revealObserver.observe(el);
});

/* ============================================
   ===== التحميل التلقائي للمنتجات =====
   ============================================ */

async function checkImageExists(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

async function loadInfoFile(folderIndex) {
  try {
    const res = await fetch(`images/${folderIndex}/info.txt`, { cache: "no-store" });
    if (!res.ok) return null;
    const text = await res.text();
    const info = {};
    text.split(/\r?\n/).forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) return;
      const key = trimmed.slice(0, eqIdx).trim();
      const value = trimmed.slice(eqIdx + 1).trim();
      if (key) info[key] = value;
    });
    return info;
  } catch (err) {
    return null;
  }
}

async function collectProductImages(folderIndex) {
  const images = [];
  for (let i = 1; i <= MAX_IMAGES_PER_PRODUCT; i++) {
    const src = `images/${folderIndex}/${i}.png`;
    const exists = await checkImageExists(src);
    if (exists) images.push(src);
  }
  return images;
}

async function loadDynamicProducts() {
  const products = [];

  for (let i = 1; i <= MAX_PRODUCTS; i++) {
    const mainImg = `images/${i}/1.png`;
    const hasMain = await checkImageExists(mainImg);
    if (!hasMain) continue;

    const images = await collectProductImages(i);
    const info = await loadInfoFile(i) || {};

    const name = info.name || `موديل أفريكانو ${i}`;
    const colors = info.colors || "";
    const description = info.description || "عباية خليجية فاخرة — تصميم راقٍ وأنيق يناسب كل المناسبات.";
    const category = (info.category || "").toLowerCase();
    const finalCategory = ["classic", "modern", "luxury"].includes(category)
      ? category
      : (i % 2 === 0 ? "modern" : "classic");

    products.push({
      id: i,
      folder: i,
      imgSrc: images[0],
      images: images,
      name,
      colors,
      description,
      category: finalCategory
    });
  }

  renderProducts(products);
}

/* ============ Render Products ============ */
function renderProducts(productsData, filter = "all") {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  if (!productsData || productsData.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 50px; background: #fff; border-radius: 16px; color: #7a7068;">
        <h3 style="font-family: 'Amiri', serif; font-size: 24px; margin-bottom: 10px;">لا توجد صور حالياً</h3>
        <p>لإضافة منتج جديد، أنشئ مجلداً باسم <code>1</code> داخل مجلد <code>images</code>، وضع فيه صورة <code>1.png</code> وملف <code>info.txt</code>.</p>
      </div>
    `;
    return;
  }

  const filtered = filter === "all"
    ? productsData
    : productsData.filter(p => p.category === filter);

  filtered.forEach((p, i) => {
    const card = document.createElement("article");
    card.className = "card";
    card.style.animationDelay = `${i * 0.07}s`;

    card.innerHTML = `
      <div class="card-img">
        <img src="${p.imgSrc}" alt="${p.name}" loading="lazy" />
        <div class="card-overlay"><span>عرض التفاصيل ✦</span></div>
      </div>
      <div class="card-body">
        <h3>${p.name}</h3>
        <div class="card-footer" style="justify-content: center;">
          <button class="card-order">اطلب الآن</button>
        </div>
      </div>
    `;

    card.addEventListener("click", e => {
      if (e.target.classList.contains("card-order")) return;
      openProductModal(p);
    });

    card.querySelector(".card-order").addEventListener("click", e => {
      e.stopPropagation();
      const text = `مرحباً أفريكانو 👋\nأريد الاستفسار عن:\n${p.name}`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
    });

    grid.appendChild(card);
    applyTilt(card);
  });

  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderProducts(productsData, btn.dataset.filter);
    };
  });
}

/* ============ Product Modal ============ */
const productModal = document.getElementById("productModal");
const productModalOverlay = document.getElementById("productModalOverlay");
const productModalClose = document.getElementById("productModalClose");
const modalImg = document.getElementById("modalImg");
const modalName = document.getElementById("modalName");
const modalCategory = document.getElementById("modalCategory");
const modalWhatsapp = document.getElementById("modalWhatsapp");

function openProductModal(product) {
  modalImg.src = product.imgSrc;
  modalImg.alt = product.name;
  modalName.textContent = product.name;
  modalCategory.textContent = categoryLabels[product.category] || "✦ مجموعة أفريكانو ✦";

  const featuresList = document.querySelector(".modal-features");
  if (featuresList) {
    let items = "";
    if (product.description) {
      items += `<li>📝 ${product.description}</li>`;
    }
    if (product.colors) {
      items += `<li>🎨 الألوان المتوفرة: ${product.colors}</li>`;
    }
    items += `
      <li>✨ قماش فاخر عالي الجودة</li>
      <li>✨ تطريز يدوي دقيق</li>
      <li>✨ خياطة احترافية</li>
      <li>✨ توصيل لجميع الدول العربية</li>
    `;
    featuresList.innerHTML = items;
  }

  let galleryEl = document.querySelector(".modal-gallery");
  if (!galleryEl) {
    galleryEl = document.createElement("div");
    galleryEl.className = "modal-gallery";
    document.querySelector(".product-modal-img").appendChild(galleryEl);
  }
  galleryEl.innerHTML = "";
  if (product.images && product.images.length > 1) {
    product.images.forEach(src => {
      const t = document.createElement("img");
      t.src = src;
      t.alt = product.name;
      t.loading = "lazy";
      t.addEventListener("click", () => { modalImg.src = src; });
      galleryEl.appendChild(t);
    });
  }

  const text = `مرحباً أفريكانو 👋\nأريد الاستفسار عن:\n${product.name}`;
  modalWhatsapp.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

  productModal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeProductModal() {
  productModal.classList.remove("open");
  document.body.style.overflow = "";
}

productModalClose.addEventListener("click", closeProductModal);
productModalOverlay.addEventListener("click", closeProductModal);
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeProductModal();
});

/* ============ Contact Form → WhatsApp ============ */
const form = document.getElementById("contactForm");
const formMsg = document.getElementById("formMsg");

form.addEventListener("submit", e => {
  e.preventDefault();
  const data = new FormData(form);
  const name = (data.get("name") || "").trim();
  const phone = (data.get("phone") || "").trim();
  const message = (data.get("message") || "").trim();

  if (!name || !phone || !message) {
    formMsg.textContent = "يرجى ملء جميع الحقول المطلوبة.";
    formMsg.style.color = "#c0392b";
    return;
  }

  const text = `مرحباً أفريكانو 👋\nالاسم: ${name}\nالهاتف: ${phone}\nالرسالة: ${message}`;
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

  formMsg.textContent = "جاري تحويلك إلى واتساب...";
  formMsg.style.color = "#a5851b";

  setTimeout(() => {
    window.open(url, "_blank");
    form.reset();
    formMsg.textContent = "تم فتح واتساب ✦";
  }, 400);
});

/* ============ Flip Cards on Mobile ============ */
if (window.innerWidth < 768) {
  document.querySelectorAll(".flip-card").forEach(card => {
    card.addEventListener("click", e => {
      if (!card.classList.contains("flipped")) {
        e.preventDefault();
        card.classList.add("flipped");
      }
    });
  });
}

/* ============ Year ============ */
document.getElementById("year").textContent = new Date().getFullYear();

/* ============ Init ============ */
loadDynamicProducts();