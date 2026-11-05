
"use strict";

const WHATSAPP_NUMBER = "558398143223";
const menu = [
  { category: "Tapiocas", items: [
    ["Tapioca mista", 6], ["Tapioca de queijo coalho", 5], ["Tapioca de queijo manteiga", 6],
    ["Tapioca de coco", 4], ["Tapioca de manteiga", 3], ["Tapioca de ovo", 5],
    ["Tapioca de coco com queijo", 6], ["Tapioca de mussarela", 5]
  ]},
  { category: "Lanches e salgados", items: [
    ["Hambúrguer", 10], ["Misto quente", 4], ["Pão com ovo", 4], ["Pão com queijo coalho", 4],
    ["Pão com queijo mussarela", 5], ["Pão com queijo manteiga", 5], ["Pão com carne", 5],
    ["Cachorro-quente", 7], ["Pastel de carne", 4], ["Pastel de frango", 4],
    ["Pastel misto", 4], ["Pastel de queijo", 4], ["Pastel de forno", 4], ["Coxinha", 4]
  ]},
  { category: "Comidas regionais", note: "Pratos sujeitos à disponibilidade do dia.", items: [
    ["Torta salgada", 9], ["Macaxeira com costela", 12], ["Inhame com costela", 12],
    ["Inhame com carne guisada", 12], ["Macaxeira com bode", 14], ["Inhame com bode", 14],
    ["Arrumadinho", 14], ["Arroz de festa com galinha", 14]
  ]},
  { category: "Cuscuz recheado", items: [
    ["Cuscuz com ovo", 8], ["Cuscuz com queijo", 10], ["Cuscuz com carne", 10], ["Cuscuz com bode", 12]
  ]},
  { category: "Bolos", items: [
    ["Bolo de leite", 3], ["Bolo tradicional", 3], ["Bolo de mandioca", 3]
  ]},
  { category: "Salgadinhos e snacks", items: [
    ["Pipos — milho, churrasco, cachorro-quente, queijo ou pizza", 5],
    ["Karitó — doce ou salgada", 2], ["Trix — cebola, galinha, queijo ou churrasco", 3],
    ["Reizinho — requeijão, queijo, cebola ou churrasco", 3],
    ["Reizinho salgado — pizza, queijo ou churrasco", 3], ["Scrusch de batata", 3], ["Pipoca kro", 3]
  ]},
  { category: "Biscoitos e bolachas", items: [
    ["Biscoito recheado — morango ou chocolate", 2.5], ["Wafer", 2.5], ["Passatempo", 5],
    ["Club Social", 8], ["Tareco", 6], ["Bolo de goma", 6], ["Vitarella Maizena", 8]
  ]},
  { category: "Doces e guloseimas", items: [
    ["Mentos", 3], ["Jujuba", 1.5], ["Trident", 2.5], ["Halls", 1.5], ["Sonho de Valsa", 1.5],
    ["Paçoca", 0.5], ["Doce de amendoim tipo Molecão", 2], ["Doce de goiabada", 2], ["Cocada de coco", 2], ["Prestígio", 4], ["Trufa", 3], ["Batom", 2], ["Caixa chocolate garoto", 15], ["Pelota POP", 0.5], ["Pelotão", 1]
  ]},
  { category: "Sucos", note: "Sabores sujeitos à disponibilidade.", items: [
    ["Suco — laranja, maracujá, caju ou goiaba", 5]
  ]},
  { category: "Refrigerantes e bebidas", items: [
    ["Refrigerante lata", 5], ["Guaraná pequeno", 3], ["Guaraná 1 litro", 7], ["Guaraná 2 litros", 12],
    ["Coca-Cola KS (vidro)", 5], ["Coca-Cola 1 litro (descartável)", 10],
    ["Coca-Cola 2 litros (descartável)", 12], ["Coca-Cola 2 litros (retornável)", 8],
    ["Fanta 2 litros", 11], ["Fanta pequena — preço a confirmar", null], ["Energético", 11], ["Kapo", 4], ["Todynho", 3.5],
    ["Citrus", 4], ["Skinka", 5], ["Suco Del Valle de laranja", 10], ["Água sem gás", 2],
    ["Água com gás", 3], ["Água mineral 1,5 litro", 5], ["Coco", 4], ["Guaracoco", 5],
    ["Leite fermentado", 2], ["Iogurte grande", 8], ["Iogurte pequeno", 4], ["Iogurte de copo", 5]
  ]},
  { category: "Queijos e castanhas", items: [
    ["Queijo coalho — 100 g", 4], ["Queijo mussarela — 100 g", 5], ["Amendoim", 2.5], ["Castanha", 8]
  ]}
].map((group) => ({
  ...group,
  products: group.items.map(([name, price], index) => ({
    id: `${group.category}-${index}`,
    name,
    price
  }))
}));

const products = menu.flatMap((group) => group.products);
const cart = new Map();
const formatCurrency = (amount) => new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
}).format(amount);

const menuContainer = document.querySelector("#menu-items");
const categoryNav = document.querySelector("#category-nav");
const cartPanel = document.querySelector("#cart-panel");
const cartItems = document.querySelector("#cart-items");
const cartCount = document.querySelector("#cart-count");
const cartTotal = document.querySelector("#cart-total");
const checkoutButton = document.querySelector("#checkout-button");
const toast = document.querySelector("#toast");
let toastTimer;
let activeCategory = "Todos";

function renderCategories() {
  const categories = ["Todos", ...menu.map((group) => group.category)];
  categoryNav.innerHTML = categories.map((category) => `
    <button class="category-chip${category === activeCategory ? " active" : ""}"
      type="button" data-category="${escapeHtml(category)}"
      aria-pressed="${category === activeCategory}">${escapeHtml(category)}</button>
  `).join("");
}

function renderMenu() {
  const query = document.querySelector("#menu-search").value.trim().toLocaleLowerCase("pt-BR");
  const cards = menu.flatMap((group) => group.products.map((product) => {
    const matchesCategory = activeCategory === "Todos" || activeCategory === group.category;
    const matchesSearch = `${product.name} ${group.category}`.toLocaleLowerCase("pt-BR").includes(query);
    if (!matchesCategory || !matchesSearch) return "";
    const priceText = product.price === null ? "Preço a confirmar" : formatCurrency(product.price);
    const button = product.price === null
      ? `<button class="add-button consult-button" type="button" data-consult="${escapeHtml(product.id)}">Consultar</button>`
      : `<button class="add-button" type="button" data-add="${escapeHtml(product.id)}" aria-label="Adicionar ${escapeHtml(product.name)} à sacola">+</button>`;
    return `
      <article class="product-card">
        <div>
          <div class="product-category">${escapeHtml(group.category)}</div>
          <h3 class="product-name">${escapeHtml(product.name)}</h3>
        </div>
        <div class="product-bottom">
          <span class="product-price">${priceText}</span>
          ${button}
        </div>
      </article>
    `;
  })).join("");
  menuContainer.innerHTML = cards || '<p class="empty-results">Nenhum item encontrado. Tente outra busca ou categoria.</p>';
}

function renderCart() {
  const entries = Array.from(cart.entries());
  const quantity = entries.reduce((sum, [, count]) => sum + count, 0);
  const total = entries.reduce((sum, [id, count]) => {
    const product = products.find((item) => item.id === id);
    return sum + product.price * count;
  }, 0);

  cartCount.textContent = String(quantity);
  cartTotal.textContent = formatCurrency(total);
  checkoutButton.disabled = quantity === 0;
  if (entries.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <span class="empty-icon" aria-hidden="true">♧</span>
        <strong>Sua sacola está vazia</strong>
        <span>Adicione algo gostoso do cardápio.</span>
      </div>`;
    return;
  }

  cartItems.innerHTML = entries.map(([id, count]) => {
    const product = products.find((item) => item.id === id);
    return `
      <div class="cart-row">
        <div>
          <div class="cart-row-name">${escapeHtml(product.name)}</div>
          <div class="cart-row-price">${formatCurrency(product.price * count)}</div>
        </div>
        <div class="cart-row-controls" aria-label="Quantidade de ${escapeHtml(product.name)}">
          <button class="quantity-button" type="button" data-decrease="${escapeHtml(id)}" aria-label="Remover uma unidade">−</button>
          <span class="quantity-value">${count}</span>
          <button class="quantity-button" type="button" data-increase="${escapeHtml(id)}" aria-label="Adicionar uma unidade">+</button>
        </div>
      </div>`;
  }).join("");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 2300);
}

function openWhatsApp(message) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

categoryNav.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  renderCategories();
  renderMenu();
});

document.querySelector("#menu-search").addEventListener("input", renderMenu);

menuContainer.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  const consultButton = event.target.closest("[data-consult]");
  if (addButton) {
    const id = addButton.dataset.add;
    cart.set(id, (cart.get(id) || 0) + 1);
    renderCart();
    showToast("Item adicionado à sua sacola.");
  }
  if (consultButton) {
    const product = products.find((item) => item.id === consultButton.dataset.consult);
    openWhatsApp(`Olá! Gostaria de confirmar o preço e a disponibilidade de: ${product.name}.`);
  }
});

cartItems.addEventListener("click", (event) => {
  const increase = event.target.closest("[data-increase]");
  const decrease = event.target.closest("[data-decrease]");
  if (increase) {
    const id = increase.dataset.increase;
    cart.set(id, cart.get(id) + 1);
  }
  if (decrease) {
    const id = decrease.dataset.decrease;
    const nextQuantity = cart.get(id) - 1;
    if (nextQuantity > 0) cart.set(id, nextQuantity);
    else cart.delete(id);
  }
  renderCart();
});

document.querySelector("#order-type").addEventListener("change", (event) => {
  const addressField = document.querySelector("#address-field");
  const addressInput = document.querySelector("#customer-address");
  const isDelivery = event.target.value === "Entrega";
  addressField.hidden = !isDelivery;
  addressInput.required = isDelivery;
});

document.querySelector("#payment-method").addEventListener("change", (event) => {
  const cashChangeField = document.querySelector("#cash-change-field");
  cashChangeField.hidden = event.target.value !== "Espécie";
});

document.querySelector("#cart-toggle").addEventListener("click", (event) => {
  const isOpen = cartPanel.classList.toggle("is-open");
  event.currentTarget.setAttribute("aria-expanded", String(isOpen));
  event.currentTarget.textContent = isOpen ? "Fechar" : "Ver sacola";
});

document.querySelector("#checkout-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (cart.size === 0) return;

  const form = new FormData(event.currentTarget);
  const name = String(form.get("name")).trim();
  const orderType = String(form.get("orderType"));
  const paymentMethod = String(form.get("paymentMethod"));
  const address = String(form.get("address") || "").trim();
  const cashChange = String(form.get("cashChange") || "").trim();
  if (!name || !paymentMethod || (orderType === "Entrega" && !address)) return;

  const orderLines = Array.from(cart.entries()).map(([id, count]) => {
    const product = products.find((item) => item.id === id);
    return `• ${count}x ${product.name} — ${formatCurrency(product.price * count)}`;
  });
  const total = Array.from(cart.entries()).reduce((sum, [id, count]) => {
    const product = products.find((item) => item.id === id);
    return sum + product.price * count;
  }, 0);
  const notes = String(form.get("notes") || "").trim();
  const message = [
    "Olá! Quero fazer um pedido no Tempero da Terra:",
    "",
    ...orderLines,
    "",
    `Subtotal: ${formatCurrency(total)}`,
    `Nome: ${name}`,
    `Recebimento: ${orderType}`,
    `Forma de pagamento: ${paymentMethod}`,
    ...(paymentMethod === "Espécie" && cashChange ? [`Troco para: ${cashChange}`] : []),
    ...(address ? [`Endereço: ${address}`] : []),
    ...(notes ? [`Observações: ${notes}`] : []),
    "",
    "Por favor, confirme a disponibilidade e o recebimento do pedido."
  ].join("\n");
  openWhatsApp(message);
});

renderCategories();
renderMenu();
renderCart();
