(function () {
  "use strict";

  var CONFIG = window.SITE_CONFIG;
  var PRODUCTS = window.PRODUCTS;
  var I18n = window.I18n;
  var t = I18n.t;
  var pick = I18n.pick;
  var CART_KEY = "tjp.cart.v1";
  var THEME_KEY = "tjp.theme";
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- helpers ---------- */
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") node.textContent = attrs[k];
      else if (k === "class") node.className = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { node.appendChild(c); });
    return node;
  }
  function money(n) { return CONFIG.currency + " " + n.toLocaleString("en-US"); }
  function svgDataUri(svg) {
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg.replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" '));
  }
  var toastTimer;
  function toast(message) {
    var node = $("toast");
    node.textContent = message;
    node.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { node.classList.remove("show"); }, 2600);
  }
  /** A status line that remembers its translation key, so it follows a language change. */
  function setStatus(id, key) {
    var node = $(id);
    if (key) node.setAttribute("data-status", key); else node.removeAttribute("data-status");
    node.textContent = key ? t(key) : "";
  }
  function refreshStatuses() {
    ["donate-status", "order-status", "message-status"].forEach(function (id) {
      var key = $(id).getAttribute("data-status");
      if (key) $(id).textContent = t(key);
    });
  }

  /* ---------- theme ---------- */
  function currentTheme() {
    var set = document.documentElement.getAttribute("data-theme");
    if (set === "light" || set === "dark") return set;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function renderThemeToggle() {
    var dark = currentTheme() === "dark";
    $("theme-label").textContent = t(dark ? "theme.light" : "theme.dark");
    $("theme-toggle").setAttribute("aria-pressed", String(dark));
  }
  function bindTheme() {
    $("theme-toggle").addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* storage unavailable */ }
      renderThemeToggle();
    });
    if (window.matchMedia) {
      var query = window.matchMedia("(prefers-color-scheme: dark)");
      if (query.addEventListener) query.addEventListener("change", renderThemeToggle);
    }
    // Some hosts (including the Claude preview) set the theme attribute themselves.
    new MutationObserver(renderThemeToggle).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  }

  /* ---------- language ---------- */
  function renderLangSwitch() {
    Array.prototype.forEach.call($("lang-switch").children, function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === I18n.current()));
    });
  }
  function bindLang() {
    $("lang-switch").addEventListener("click", function (e) {
      var lang = e.target.getAttribute && e.target.getAttribute("data-lang");
      if (lang) I18n.set(lang);
    });
    I18n.onChange(renderAll);
  }

  /* ---------- sending details without a backend ---------- */
  function channel(allowNetlify) {
    if (CONFIG.previewMode) return "preview";
    if (CONFIG.formEndpoint) return "endpoint";
    if (allowNetlify && CONFIG.useNetlifyForms) return "netlify";
    if (CONFIG.whatsappNumber) return "whatsapp";
    return "email";
  }
  function toText(title, fields) {
    return title + "\n\n" + Object.keys(fields).map(function (k) { return k + ": " + fields[k]; }).join("\n");
  }
  /** Resolves with "sent" | "whatsapp" | "email" | "preview"; rejects if a network send fails. */
  function send(title, fields, opts) {
    var via = channel(opts && opts.netlifyFormName);
    var text = toText(title, fields);
    if (via === "preview") return Promise.resolve("preview");
    if (via === "endpoint") {
      return fetch(CONFIG.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.assign({ _subject: title }, fields))
      }).then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return "sent"; });
    }
    if (via === "netlify") {
      var body = new URLSearchParams(Object.assign({ "form-name": opts.netlifyFormName }, fields));
      return fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body.toString() })
        .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return "sent"; });
    }
    if (via === "whatsapp") {
      window.open("https://wa.me/" + CONFIG.whatsappNumber + "?text=" + encodeURIComponent(text), "_blank", "noopener");
      return Promise.resolve("whatsapp");
    }
    window.location.href = "mailto:" + CONFIG.email + "?subject=" + encodeURIComponent(title) + "&body=" + encodeURIComponent(text);
    return Promise.resolve("email");
  }

  /* ---------- lists built from config ---------- */
  function renderConfigLists() {
    var drop = $("dropoffs"), facts = $("facts"), contact = $("contact-list");
    drop.textContent = ""; facts.textContent = ""; contact.textContent = "";
    CONFIG.dropoffs.forEach(function (d) {
      drop.appendChild(el("li", {}, [el("strong", { text: pick(d.name) }), el("span", { text: pick(d.address) + ". " + pick(d.hours) })]));
    });
    CONFIG.facts.forEach(function (f) {
      facts.appendChild(el("li", {}, [el("strong", { text: f.value }), el("span", { text: pick(f.label) })]));
    });
    var rows = [];
    if (CONFIG.whatsappNumber) rows.push(["WhatsApp", "+" + CONFIG.whatsappNumber, "https://wa.me/" + CONFIG.whatsappNumber]);
    if (CONFIG.phoneDisplay) rows.push([t("contact.phone"), CONFIG.phoneDisplay, "tel:" + CONFIG.phoneDisplay.replace(/[^+\d]/g, "")]);
    if (CONFIG.email) rows.push([t("contact.email"), CONFIG.email, "mailto:" + CONFIG.email]);
    if (CONFIG.instagram) rows.push(["Instagram", "@" + CONFIG.instagram, "https://instagram.com/" + CONFIG.instagram]);
    var footer = $("footer-contact");
    footer.textContent = "";
    rows.forEach(function (c) {
      var copy = el("button", { type: "button", class: "copy-btn", text: t("contact.copy") });
      copy.addEventListener("click", function () { copyText(c[1], copy); });
      contact.appendChild(el("li", {}, [
        el("span", { class: "contact-label", text: c[0] }),
        el("a", { href: c[2], text: c[1], rel: "noopener" }),
        copy
      ]));
      footer.appendChild(el("li", {}, [el("span", { text: c[0] }), el("a", { href: c[2], text: c[1], rel: "noopener" })]));
    });
    CONFIG.dropoffs.slice(0, 1).forEach(function (d) {
      contact.appendChild(el("li", {}, [el("span", { class: "contact-label", text: t("contact.hours") }), el("span", { class: "contact-value", text: pick(d.hours) })]));
      footer.appendChild(el("li", {}, [el("span", { text: pick(d.name) }), el("span", { class: "footer-hours", text: pick(d.hours) })]));
    });
  }
  function copyText(text, button) {
    var done = function () {
      button.textContent = t("contact.copied");
      setTimeout(function () { button.textContent = t("contact.copy"); }, 1800);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done).catch(function () { toast(text); });
    else toast(text);
  }

  /* ---------- shop ---------- */
  var activeFilter = "all";
  function renderFilters() {
    var box = $("filters");
    box.textContent = "";
    box.setAttribute("aria-label", t("nav.shop"));
    var cats = ["all"].concat(PRODUCTS.map(function (p) { return p.category; }).filter(function (c, i, a) { return a.indexOf(c) === i; }));
    cats.forEach(function (c) {
      var b = el("button", { type: "button", text: t("cat." + c), "aria-pressed": String(c === activeFilter) });
      b.addEventListener("click", function () { activeFilter = c; renderFilters(); renderProducts(); });
      box.appendChild(b);
    });
  }
  function productCard(p) {
    var name = pick(p.name);
    var img = el("img", {
      src: p.image || svgDataUri(window.ProductArt.svg(p)),
      alt: p.image ? name : t("shop.illustration", { name: name }),
      loading: "lazy", width: "320", height: "250"
    });
    var add = el("button", { type: "button", class: "btn", text: t("shop.add"), "aria-label": t("shop.addNamed", { name: name }) });
    add.addEventListener("click", function () { Cart.add(p.id); toast(t("shop.added", { name: pick(p.name) })); });
    return el("li", { class: "product" }, [
      el("div", { class: "product-art" }, [img]),
      el("div", { class: "product-info" }, [
        el("h3", { text: name }),
        el("p", { text: pick(p.blurb) }),
        el("div", { class: "product-buy" }, [el("span", { class: "price", text: money(p.price) }), add])
      ])
    ]);
  }
  function fill(list, products) {
    list.textContent = "";
    products.forEach(function (p) { list.appendChild(productCard(p)); });
  }
  function renderProducts() {
    fill($("products"), PRODUCTS.filter(function (p) { return activeFilter === "all" || p.category === activeFilter; }));
    fill($("featured"), PRODUCTS.slice(0, 4)); // home page shows the first four
  }

  /* ---------- cart ---------- */
  var Cart = (function () {
    var items = {};
    try { items = JSON.parse(localStorage.getItem(CART_KEY)) || {}; } catch (e) { items = {}; }
    // Drop anything no longer in the catalogue.
    Object.keys(items).forEach(function (id) { if (!find(id) || !(items[id] > 0)) delete items[id]; });

    function find(id) { return PRODUCTS.filter(function (p) { return p.id === id; })[0]; }
    function save() { try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch (e) { /* storage unavailable */ } render(); }
    function lines() { return Object.keys(items).map(function (id) { var p = find(id); return { product: p, qty: items[id], total: p.price * items[id] }; }); }
    function total() { return lines().reduce(function (s, l) { return s + l.total; }, 0); }
    function count() { return lines().reduce(function (s, l) { return s + l.qty; }, 0); }

    function render() {
      $("cart-count").textContent = count();
      var ul = $("cart-items");
      ul.textContent = "";
      lines().forEach(function (l) {
        var name = pick(l.product.name);
        var minus = el("button", { type: "button", text: "−", "aria-label": t("cart.fewer", { name: name }) });
        var plus = el("button", { type: "button", text: "+", "aria-label": t("cart.more", { name: name }) });
        var remove = el("button", { type: "button", class: "remove", text: t("cart.remove"), "aria-label": t("cart.removeNamed", { name: name }) });
        minus.addEventListener("click", function () { set(l.product.id, l.qty - 1); });
        plus.addEventListener("click", function () { set(l.product.id, l.qty + 1); });
        remove.addEventListener("click", function () { set(l.product.id, 0); });
        ul.appendChild(el("li", {}, [
          el("h3", { text: name }),
          el("span", { class: "line-price", text: money(l.total) }),
          el("div", { class: "qty" }, [minus, el("span", { text: String(l.qty) }), plus]),
          remove
        ]));
      });
      var empty = count() === 0;
      $("cart-empty").hidden = !empty;
      $("cart-foot").hidden = empty;
      $("cart-total").textContent = money(total());
      $("checkout-total").textContent = money(total());
    }
    function set(id, qty) { if (qty <= 0) delete items[id]; else items[id] = Math.min(qty, 20); save(); }
    return {
      add: function (id) { set(id, (items[id] || 0) + 1); },
      clear: function () { items = {}; save(); },
      lines: lines, total: total, count: count, render: render
    };
  })();

  var inCheckout = false;
  function showCartView(checkout) {
    inCheckout = checkout;
    $("cart-view").hidden = checkout;
    $("checkout-form").hidden = !checkout;
    $("cart-title").textContent = t(checkout ? "cart.details" : "cart.title");
  }
  function bindCart() {
    var dialog = $("cart");
    $("open-cart").addEventListener("click", function () { showCartView(false); setStatus("order-status", null); dialog.showModal(); });
    $("close-cart").addEventListener("click", function () { dialog.close(); });
    $("cart-browse").addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });
    $("to-checkout").addEventListener("click", function () { showCartView(true); $("checkout-name").focus(); });
    $("back-to-cart").addEventListener("click", function () { showCartView(false); });

    $("checkout-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var f = e.target.elements;
      var ok = f.name.value.trim() && f.phone.value.trim() && f.address.value.trim() && Cart.count() > 0;
      $("err-checkout").hidden = !!ok;
      if (!ok) return;
      // Sent in English so the business always receives orders in one language.
      var fields = {
        Name: f.name.value.trim(),
        Phone: f.phone.value.trim(),
        Address: f.address.value.trim(),
        Items: Cart.lines().map(function (l) { return l.qty + " x " + l.product.name.en + " (" + money(l.total) + ")"; }).join("; "),
        Total: money(Cart.total()),
        Language: I18n.current()
      };
      var btn = $("place-order");
      btn.disabled = true;
      send("New order, " + CONFIG.businessName, fields).then(function (result) {
        setStatus("order-status", "order." + result);
        if (result === "sent") { Cart.clear(); e.target.reset(); }
      }).catch(function () {
        setStatus("order-status", "order.failed");
      }).then(function () { btn.disabled = false; });
    });
  }

  /* ---------- donation form ---------- */
  function bindDonate() {
    var form = $("donate-form");
    var addressField = $("address-field");
    form.addEventListener("change", function (e) {
      if (e.target.name === "method") addressField.hidden = form.elements.method.value !== "Pickup";
    });
    // Footer "ways to give" links jump to the form with that option already chosen.
    Array.prototype.forEach.call(document.querySelectorAll("a[data-method]"), function (link) {
      link.addEventListener("click", function () {
        form.elements.method.value = link.getAttribute("data-method");
        addressField.hidden = form.elements.method.value !== "Pickup";
      });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = form.elements;
      if (f.company.value) return; // honeypot
      var items = Array.prototype.map.call(form.querySelectorAll('input[name="items"]:checked'), function (i) { return i.value; });
      var pickup = f.method.value === "Pickup";
      var checks = [
        ["err-items", items.length > 0, form.querySelector('input[name="items"]')],
        ["err-address", !pickup || f.address.value.trim(), f.address],
        ["err-name", f.name.value.trim(), f.name],
        ["err-contact", f.contact.value.trim(), f.contact]
      ];
      var firstBad = null;
      checks.forEach(function (c) { $(c[0]).hidden = !!c[1]; if (!c[1] && !firstBad) firstBad = c[2]; });
      if (firstBad) { firstBad.focus(); return; }

      // Option values are English, so details arrive in one language whatever the visitor chose.
      var fields = {
        items: items.join(", "),
        quantity: f.quantity.value || "not given",
        condition: f.condition.value,
        method: f.method.value,
        name: f.name.value.trim(),
        contact: f.contact.value.trim(),
        language: I18n.current()
      };
      if (pickup) fields.address = f.address.value.trim();
      if (f.notes.value.trim()) fields.notes = f.notes.value.trim();

      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      send("Denim donation, " + CONFIG.businessName, fields, { netlifyFormName: "denim-donation" }).then(function (result) {
        setStatus("donate-status", "donate." + result);
        if (result === "sent") { form.reset(); addressField.hidden = true; }
      }).catch(function () {
        setStatus("donate-status", "donate.failed");
      }).then(function () { btn.disabled = false; });
    });
  }

  /* ---------- contact form ---------- */
  function bindContact() {
    var form = $("contact-form");
    // Links such as "Run a collection drive" open the form with that topic already chosen.
    Array.prototype.forEach.call(document.querySelectorAll("a[data-topic]"), function (link) {
      link.addEventListener("click", function () { form.elements.topic.value = link.getAttribute("data-topic"); });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = form.elements;
      if (f.company.value) return; // honeypot
      var checks = [
        ["err-c-name", f.name.value.trim(), f.name],
        ["err-c-contact", f.contact.value.trim(), f.contact],
        ["err-c-message", f.message.value.trim(), f.message]
      ];
      var firstBad = null;
      checks.forEach(function (c) { $(c[0]).hidden = !!c[1]; if (!c[1] && !firstBad) firstBad = c[2]; });
      if (firstBad) { firstBad.focus(); return; }
      var fields = {
        topic: f.topic.value,
        name: f.name.value.trim(),
        contact: f.contact.value.trim(),
        message: f.message.value.trim(),
        language: I18n.current()
      };
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      send(fields.topic + ", " + CONFIG.businessName, fields, { netlifyFormName: "contact-message" }).then(function (result) {
        setStatus("message-status", "message." + result);
        if (result === "sent") form.reset();
      }).catch(function () {
        setStatus("message-status", "message.failed");
      }).then(function () { btn.disabled = false; });
    });
  }

  /* ---------- pages ----------
   * Each menu item is its own page view. Sections carry data-page="name"; the address
   * bar shows #name, so pages can be linked, bookmarked and reached with Back.
   * Without JavaScript nothing is hidden and the site reads as one long page.
   */
  var PAGES = ["home", "how", "donate", "shop", "about", "contact"];
  var PAGE_TITLE = { home: "tagline", how: "nav.how", donate: "nav.donate", shop: "nav.shop", about: "about.title", contact: "contact.title" };
  var currentPage = null;

  function pageFromHash() {
    var id = (window.location.hash || "").replace(/^#/, "");
    return PAGES.indexOf(id) !== -1 ? id : null;
  }
  function renderPageMeta() {
    document.title = CONFIG.businessName + " | " + t(PAGE_TITLE[currentPage] || "tagline");
    Array.prototype.forEach.call(document.querySelectorAll('.site-nav a, .footer-col a[href^="#"]'), function (a) {
      if (a.getAttribute("href") === "#" + currentPage) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }
  function showPage(id, opts) {
    if (PAGES.indexOf(id) === -1) id = "home";
    var changed = id !== currentPage;
    currentPage = id;
    Array.prototype.forEach.call(document.querySelectorAll("[data-page]"), function (section) {
      section.hidden = section.getAttribute("data-page") !== id;
    });
    $("footer-cta").hidden = id === "donate" || id === "how"; // those pages end with their own invitation
    renderPageMeta();
    if (!(opts && opts.keepScroll)) {
      var toTop = function () { window.scrollTo({ top: 0, left: 0, behavior: "instant" }); };
      toTop();
      window.requestAnimationFrame(toTop); // again after the browser's own jump to the #anchor
    }
    if (changed && opts && opts.focus) {
      var heading = document.querySelector('[data-page="' + id + '"] h1, [data-page="' + id + '"] h2');
      if (heading) { heading.setAttribute("tabindex", "-1"); heading.focus({ preventScroll: true }); }
    }
  }
  function bindPages() {
    // Handle the click directly as well as the address change, so pages still switch
    // where the address bar cannot be updated (for example inside an embedded preview).
    document.addEventListener("click", function (e) {
      var link = e.target.closest && e.target.closest('a[href^="#"]');
      if (!link) return;
      var id = link.getAttribute("href").slice(1);
      if (PAGES.indexOf(id) === -1) return;
      e.preventDefault();
      try { if (window.location.hash !== "#" + id) window.location.hash = id; } catch (err) { /* address bar unavailable */ }
      showPage(id, { focus: true });
    });
    window.addEventListener("hashchange", function () {
      var id = pageFromHash();
      if (id && id !== currentPage) showPage(id, { focus: true });
    });
    showPage(pageFromHash() || "home", { keepScroll: true });
  }

  /* ---------- nav ---------- */
  function bindNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = $("site-nav");
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
    });
  }

  /** Everything built by script; runs at start-up and again on each language change. */
  function renderAll() {
    renderLangSwitch();
    renderThemeToggle();
    renderConfigLists();
    renderFilters();
    renderProducts();
    Cart.render();
    showCartView(inCheckout);
    refreshStatuses();
    if (currentPage) renderPageMeta();
  }

  I18n.init();
  $("year").textContent = new Date().getFullYear();
  renderAll();
  bindLang();
  bindTheme();
  bindCart();
  bindDonate();
  bindContact();
  bindNav();
  bindPages();
})();
