(function () {
  'use strict';

  var WHATSAPP = '593981416568';
  var form = document.getElementById('demoForm');
  var steps = Array.prototype.slice.call(document.querySelectorAll('.form-step'));
  var currentStep = 1;
  var labels = [
    { label: 'Paso 1 de 3', title: 'Tu negocio' },
    { label: 'Paso 2 de 3', title: 'Contenido de la web' },
    { label: 'Paso 3 de 3', title: 'Estilo y contacto' }
  ];

  var nextButton = document.getElementById('nextButton');
  var backButton = document.getElementById('backButton');
  var generateButton = document.getElementById('generateButton');
  var stepLabel = document.getElementById('stepLabel');
  var stepTitle = document.getElementById('stepTitle');
  var progressBar = document.getElementById('progressBar');
  var previewEmpty = document.getElementById('previewEmpty');
  var previewResult = document.getElementById('previewResult');
  var previewFrame = document.getElementById('previewFrame');
  var previewStage = document.getElementById('previewStage');
  var contactHuma = document.getElementById('contactHuma');

  var sectorDefaults = {
    health: { headline: 'Tu bienestar, en buenas manos', eyebrow: 'Atención profesional y cercana', about: 'Un equipo comprometido con ofrecerte una atención rigurosa, humana y adaptada a tus necesidades.', icon: '✦' },
    restaurant: { headline: 'Sabores que merecen compartirse', eyebrow: 'Una experiencia para disfrutar', about: 'Cuidamos cada detalle, desde los ingredientes hasta el servicio, para que cada visita sea especial.', icon: '◆' },
    professional: { headline: 'Soluciones claras para hacer avanzar tu negocio', eyebrow: 'Experiencia que genera resultados', about: 'Te acompañamos con un servicio profesional, directo y enfocado en alcanzar tus objetivos.', icon: '↗' },
    realestate: { headline: 'Encuentra el espacio para tu próxima historia', eyebrow: 'Propiedades seleccionadas para ti', about: 'Te ayudamos a tomar la mejor decisión con atención personalizada, transparencia y conocimiento del mercado.', icon: '⌂' },
    education: { headline: 'Aprende hoy. Avanza mañana.', eyebrow: 'Formación práctica y cercana', about: 'Programas diseñados para convertir el aprendizaje en nuevas oportunidades personales y profesionales.', icon: '◫' },
    commerce: { headline: 'Lo que buscas, más cerca de ti', eyebrow: 'Calidad y atención en cada compra', about: 'Seleccionamos productos y soluciones pensados para hacer tu día a día más fácil.', icon: '◇' },
    beauty: { headline: 'Un espacio creado para cuidarte', eyebrow: 'Bienestar que se nota', about: 'Tratamientos y experiencias personalizadas para que te sientas bien por dentro y por fuera.', icon: '✧' },
    other: { headline: 'Una forma diferente de hacer las cosas', eyebrow: 'Calidad, cercanía y confianza', about: 'Conoce una propuesta creada para ayudarte con atención personalizada y resultados que marcan la diferencia.', icon: '●' }
  };

  var palettes = {
    blue: { accent: '#1769e0', accent2: '#00a6d8', dark: '#08152b', soft: '#eef5ff' },
    green: { accent: '#16896a', accent2: '#49af78', dark: '#0b2822', soft: '#edf8f3' },
    purple: { accent: '#7752c8', accent2: '#b46dcc', dark: '#1e1733', soft: '#f4effc' },
    terracotta: { accent: '#c65d42', accent2: '#e39a61', dark: '#321b18', soft: '#fff3ed' },
    black: { accent: '#20242b', accent2: '#697382', dark: '#101216', soft: '#f1f2f4' }
  };

  function value(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function selected(name) {
    var el = form.querySelector('input[name="' + name + '"]:checked');
    return el ? el.value : '';
  }

  function escapeHtml(input) {
    return String(input || '').replace(/[&<>'"]/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char];
    });
  }

  function safePhone(input) {
    return String(input || '').replace(/[^0-9+]/g, '');
  }

  function safeDomain(name) {
    var normalized = String(name || 'tu-negocio').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return normalized.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 42) + '.com';
  }

  function showError(field, message) {
    var target = document.querySelector('[data-error-for="' + field + '"]');
    if (target) target.textContent = message || '';
    var input = document.getElementById(field);
    if (input) input.classList.toggle('invalid', Boolean(message));
  }

  function validateStep(step) {
    var valid = true;
    if (step === 1) {
      ['businessName', 'sector', 'businessDescription'].forEach(function (id) {
        var missing = !value(id);
        showError(id, missing ? 'Completa este campo para continuar.' : '');
        valid = valid && !missing;
      });
    }
    if (step === 2) {
      var missingService = !value('service1') || !value('service2') || !value('service3');
      showError('services', missingService ? 'Añade tres servicios principales.' : '');
      var email = value('email');
      var invalidEmail = email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      showError('email', invalidEmail ? 'Escribe un correo válido.' : '');
      valid = !missingService && !invalidEmail;
    }
    if (step === 3) {
      var missingName = !value('contactName');
      var missingConsent = !document.getElementById('consent').checked;
      showError('contactName', missingName ? 'Indica tu nombre.' : '');
      showError('consent', missingConsent ? 'Necesitamos tu aceptación para continuar.' : '');
      valid = !missingName && !missingConsent;
    }
    return valid;
  }

  function setStep(step) {
    currentStep = Math.max(1, Math.min(3, step));
    steps.forEach(function (item) {
      item.classList.toggle('active', Number(item.dataset.step) === currentStep);
    });
    stepLabel.textContent = labels[currentStep - 1].label;
    stepTitle.textContent = labels[currentStep - 1].title;
    progressBar.style.width = (currentStep * 33.333) + '%';
    backButton.hidden = currentStep === 1;
    nextButton.hidden = currentStep === 3;
    generateButton.hidden = currentStep !== 3;
    document.getElementById('formPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function collectData() {
    return {
      businessName: value('businessName'),
      sector: value('sector') || 'other',
      city: value('city'),
      description: value('businessDescription'),
      headline: value('headline'),
      services: [value('service1'), value('service2'), value('service3')],
      phone: value('phone'),
      email: value('email'),
      cta: value('ctaText') || 'Solicitar información',
      contactName: value('contactName'),
      style: selected('style') || 'modern',
      color: selected('color') || 'blue'
    };
  }

  function buildPreview(data) {
    var defaults = sectorDefaults[data.sector] || sectorDefaults.other;
    var palette = palettes[data.color] || palettes.blue;
    var business = escapeHtml(data.businessName);
    var headline = escapeHtml(data.headline || defaults.headline);
    var description = escapeHtml(data.description);
    var about = escapeHtml(defaults.about);
    var city = escapeHtml(data.city);
    var cta = escapeHtml(data.cta);
    var email = escapeHtml(data.email);
    var phone = escapeHtml(data.phone);
    var phoneHref = safePhone(data.phone);
    var serif = data.style === 'elegant';
    var roundness = data.style === 'warm' ? '28px' : data.style === 'elegant' ? '2px' : '16px';
    var surface = data.style === 'warm' ? '#fffaf4' : '#ffffff';
    var serviceCards = data.services.map(function (service, index) {
      return '<article><span>0' + (index + 1) + '</span><h3>' + escapeHtml(service) + '</h3><p>Atención personalizada y una solución pensada para conseguir el mejor resultado.</p></article>';
    }).join('');
    var contactLinks = '';
    if (phone) contactLinks += '<a href="tel:' + phoneHref + '">' + phone + '</a>';
    if (email) contactLinks += '<a href="mailto:' + email + '">' + email + '</a>';
    if (!contactLinks) contactLinks = '<span>Contáctanos para más información</span>';

    return '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<style>' +
      '*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;color:' + palette.dark + ';font-family:Inter,Arial,sans-serif;background:' + surface + '}a{text-decoration:none;color:inherit}.wrap{width:min(1100px,calc(100% - 44px));margin:auto}' +
      'header{height:74px;display:flex;align-items:center;justify-content:space-between;position:absolute;z-index:2;left:50%;transform:translateX(-50%);width:min(1100px,calc(100% - 44px));color:#fff}.logo{font-weight:800;font-size:19px;letter-spacing:-.02em}.nav{display:flex;gap:23px;align-items:center;font-size:13px}.nav .mini{padding:10px 16px;border:1px solid rgba(255,255,255,.45);border-radius:999px}' +
      '.hero{min-height:520px;display:flex;align-items:center;color:#fff;position:relative;overflow:hidden;background:linear-gradient(130deg,' + palette.dark + ' 0%,' + palette.accent + ' 100%)}.hero:before{content:"";position:absolute;width:520px;height:520px;border-radius:50%;right:-130px;top:-190px;background:radial-gradient(circle,' + palette.accent2 + ',transparent 67%);opacity:.65}.hero:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.18),transparent 70%)}.hero .wrap{position:relative;z-index:1;padding-top:60px}.eyebrow{text-transform:uppercase;letter-spacing:.17em;font-weight:700;font-size:11px;opacity:.78;margin-bottom:18px}.hero h1{font-family:' + (serif ? 'Georgia,serif' : 'Inter,Arial,sans-serif') + ';font-size:clamp(42px,7vw,72px);line-height:1.02;letter-spacing:-.045em;max-width:780px;margin:0 0 22px}.hero p{font-size:17px;line-height:1.65;max-width:640px;opacity:.84;margin:0 0 29px}.btn{display:inline-flex;align-items:center;justify-content:center;padding:14px 24px;background:#fff;color:' + palette.dark + ';font-weight:700;border-radius:' + roundness + ';font-size:14px}.hero-meta{display:flex;gap:24px;margin-top:32px;font-size:12px;opacity:.72}.hero-meta span:before{content:"✓";margin-right:7px}' +
      '.services{padding:84px 0;background:' + surface + '}.section-kicker{text-transform:uppercase;letter-spacing:.15em;color:' + palette.accent + ';font-weight:800;font-size:11px}.services h2,.about h2,.contact h2{font-family:' + (serif ? 'Georgia,serif' : 'Inter,Arial,sans-serif') + ';font-size:clamp(30px,4vw,47px);letter-spacing:-.035em;margin:10px 0 36px}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:17px}.cards article{border:1px solid #e3e8ee;border-radius:' + roundness + ';padding:27px;background:#fff;box-shadow:0 20px 45px -36px rgba(5,18,40,.35)}.cards article>span{display:grid;place-items:center;width:36px;height:36px;background:' + palette.soft + ';color:' + palette.accent + ';border-radius:10px;font-size:11px;font-weight:800}.cards h3{font-size:18px;margin:25px 0 9px}.cards p{color:#667284;font-size:13px;line-height:1.6;margin:0}' +
      '.about{padding:78px 0;background:' + palette.soft + '}.about-grid{display:grid;grid-template-columns:.8fr 1.2fr;gap:75px;align-items:start}.about-badge{aspect-ratio:1;border-radius:' + roundness + ';background:linear-gradient(145deg,' + palette.accent + ',' + palette.dark + ');display:grid;place-items:center;color:#fff;font-size:90px;box-shadow:0 30px 60px -30px ' + palette.accent + '}.about h2{margin-bottom:20px}.about p{color:#566476;line-height:1.75;font-size:15px}.facts{display:flex;gap:28px;margin-top:28px}.facts b{display:block;color:' + palette.accent + ';font-size:23px}.facts span{font-size:11px;color:#6a7889}' +
      '.contact{padding:78px 0;background:' + palette.dark + ';color:#fff;text-align:center}.contact .wrap{max-width:760px}.contact h2{margin-bottom:17px}.contact p{opacity:.72;margin:0 auto 26px}.contact .btn{background:' + palette.accent + ';color:#fff}.contact-links{display:flex;justify-content:center;gap:22px;margin-top:28px;flex-wrap:wrap;font-size:13px;opacity:.78}.contact-links a{text-decoration:underline}' +
      'footer{padding:25px 22px;text-align:center;color:#7c8795;font-size:11px;background:#fff}' +
      '@media(max-width:700px){header{height:64px}.nav a:not(.mini){display:none}.hero{min-height:570px}.hero .wrap{padding-top:58px}.hero h1{font-size:43px}.hero-meta{flex-direction:column;gap:8px}.services,.about,.contact{padding:62px 0}.cards{grid-template-columns:1fr}.about-grid{grid-template-columns:1fr;gap:32px}.about-badge{aspect-ratio:2.1;font-size:65px}.facts{justify-content:space-between;gap:10px}}' +
      '</style></head><body>' +
      '<header><div class="logo">' + business + '</div><nav class="nav"><a href="#servicios">Servicios</a><a href="#nosotros">Nosotros</a><a class="mini" href="#contacto">Contacto</a></nav></header>' +
      '<main><section class="hero"><div class="wrap"><div class="eyebrow">' + escapeHtml(defaults.eyebrow) + (city ? ' · ' + city : '') + '</div><h1>' + headline + '</h1><p>' + description + '</p><a class="btn" href="#contacto">' + cta + '</a><div class="hero-meta"><span>Atención personalizada</span><span>Respuesta rápida</span><span>Servicio profesional</span></div></div></section>' +
      '<section class="services" id="servicios"><div class="wrap"><div class="section-kicker">Lo que hacemos</div><h2>Servicios pensados para ti</h2><div class="cards">' + serviceCards + '</div></div></section>' +
      '<section class="about" id="nosotros"><div class="wrap about-grid"><div class="about-badge">' + defaults.icon + '</div><div><div class="section-kicker">Sobre nosotros</div><h2>Confianza desde el primer contacto</h2><p>' + about + '</p><p>En ' + business + ', cada cliente importa. Escuchamos lo que necesitas y te acompañamos durante todo el proceso.</p><div class="facts"><div><b>100%</b><span>Atención cercana</span></div><div><b>3</b><span>Servicios principales</span></div><div><b>1:1</b><span>Trato personalizado</span></div></div></div></div></section>' +
      '<section class="contact" id="contacto"><div class="wrap"><div class="section-kicker">Hablemos</div><h2>¿Cómo podemos ayudarte?</h2><p>Cuéntanos qué necesitas y te responderemos lo antes posible.</p><a class="btn" href="' + (phoneHref ? 'https://wa.me/' + phoneHref.replace('+', '') : email ? 'mailto:' + email : '#') + '">' + cta + '</a><div class="contact-links">' + contactLinks + '</div></div></section></main>' +
      '<footer>Propuesta visual creada para ' + business + ' · Demo de HUMA Digital Studio</footer></body></html>';
  }

  function render(data) {
    previewFrame.srcdoc = buildPreview(data);
    document.getElementById('previewDomain').textContent = safeDomain(data.businessName);
    var text = 'Hola HUMA Digital Studio, he creado una demo para ' + data.businessName + ' y quiero continuar con el proyecto.';
    contactHuma.href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(text);
    contactHuma.target = '_blank';
    contactHuma.rel = 'noopener noreferrer';
    previewEmpty.hidden = true;
    previewResult.hidden = false;
    previewResult.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  nextButton.addEventListener('click', function () {
    if (validateStep(currentStep)) setStep(currentStep + 1);
  });
  backButton.addEventListener('click', function () { setStep(currentStep - 1); });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!validateStep(3)) return;
    generateButton.classList.add('loading');
    generateButton.disabled = true;
    window.setTimeout(function () {
      render(collectData());
      generateButton.classList.remove('loading');
      generateButton.disabled = false;
    }, 650);
  });

  document.getElementById('editButton').addEventListener('click', function () {
    document.getElementById('formPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  document.querySelectorAll('[data-device]').forEach(function (button) {
    button.addEventListener('click', function () {
      document.querySelectorAll('[data-device]').forEach(function (item) { item.classList.remove('active'); });
      button.classList.add('active');
      previewStage.classList.toggle('mobile', button.dataset.device === 'mobile');
    });
  });

  document.querySelectorAll('textarea[maxlength]').forEach(function (textarea) {
    var counter = document.querySelector('[data-count="' + textarea.id + '"]');
    textarea.addEventListener('input', function () { if (counter) counter.textContent = textarea.value.length; });
  });

  form.addEventListener('input', function (event) {
    var field = event.target.id;
    if (field) showError(field, '');
    if (/^service[123]$/.test(field)) showError('services', '');
  });

  document.getElementById('year').textContent = new Date().getFullYear();
}());
