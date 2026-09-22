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

  function trackEvent(name, params) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
  }

  try {
    if (localStorage.getItem('huma_cookie_consent') === 'accepted') {
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', 'G-31GKJRK2TV');
      var analytics = document.createElement('script');
      analytics.async = true;
      analytics.src = 'https://www.googletagmanager.com/gtag/js?id=G-31GKJRK2TV';
      document.head.appendChild(analytics);
    }
  } catch (error) {}

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
    if (!valid) {
      var invalid = steps[step - 1].querySelector('.invalid, input:invalid, select:invalid, textarea:invalid');
      if (invalid) invalid.focus();
      trackEvent('demo_validation_error', { step: step });
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
    trackEvent('demo_step_view', { step: currentStep });
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
    var imageProfile = window.HumaDemoImages.select(data);
    var images = imageProfile.images;
    var profileCopy = {
      'health-dental': { eyebrow: 'Odontología cuidada al detalle', aboutTitle: 'Tu sonrisa merece confianza', value: 'Diagnóstico claro, atención cercana y un plan pensado para cada sonrisa.', action: 'Agenda tu valoración' },
      'restaurant-cafe': { eyebrow: 'Café, sabor y buenos momentos', aboutTitle: 'Un lugar al que apetece volver', value: 'Producto cuidado, ambiente acogedor y una experiencia para saborear sin prisas.', action: 'Ven a conocernos' },
      'beauty-spa': { eyebrow: 'Pausa, bienestar y cuidado', aboutTitle: 'Tu momento empieza aquí', value: 'Tratamientos personalizados en un espacio creado para desconectar y sentirte bien.', action: 'Reserva tu experiencia' },
      'fitness-yoga': { eyebrow: 'Movimiento con propósito', aboutTitle: 'Tu práctica, a tu ritmo', value: 'Sesiones guiadas para ganar fuerza, equilibrio y bienestar en un entorno cercano.', action: 'Prueba una sesión' },
      'other-pets': { eyebrow: 'Cuidado para quienes más quieres', aboutTitle: 'Bienestar animal con cercanía', value: 'Atención responsable y un trato amable para cuidar a tu compañero en cada etapa.', action: 'Pide tu cita' },
      'other-automotive': { eyebrow: 'Tu vehículo, en buenas manos', aboutTitle: 'Confianza en cada kilómetro', value: 'Revisión clara, trabajo preciso y comunicación directa antes de cada reparación.', action: 'Solicita una revisión' },
      'other-construction': { eyebrow: 'Espacios bien pensados', aboutTitle: 'Del proyecto a la realidad', value: 'Planificación, oficio y atención al detalle para transformar tu espacio con garantías.', action: 'Cuéntanos tu proyecto' },
      'other-tourism': { eyebrow: 'Tu próxima escapada empieza aquí', aboutTitle: 'Una estancia para recordar', value: 'Descanso, hospitalidad y experiencias locales en un entorno que invita a quedarse.', action: 'Consulta disponibilidad' },
      'other-events': { eyebrow: 'Momentos que dejan huella', aboutTitle: 'Todo listo para celebrar', value: 'Diseñamos cada detalle para que disfrutes de un evento coherente, fluido y memorable.', action: 'Diseña tu evento' }
    }[imageProfile.id] || {};
    var business = escapeHtml(data.businessName);
    var headline = escapeHtml(data.headline || defaults.headline);
    var description = escapeHtml(data.description);
    var eyebrow = escapeHtml(profileCopy.eyebrow || defaults.eyebrow);
    var aboutTitle = escapeHtml(profileCopy.aboutTitle || 'Una experiencia que inspira confianza');
    var about = escapeHtml(profileCopy.value || defaults.about);
    var city = escapeHtml(data.city);
    var cta = escapeHtml(data.cta);
    var contextualAction = escapeHtml(profileCopy.action || data.cta);
    var email = escapeHtml(data.email);
    var phone = escapeHtml(data.phone);
    var phoneHref = safePhone(data.phone);
    var themeClass = data.style === 'elegant' ? 'theme-elegant' : data.style === 'warm' ? 'theme-warm' : 'theme-modern';
    var imageAlt = 'Imagen de ' + escapeHtml(imageProfile.label) + ' para ' + business;
    var serviceDescriptions = {
      health: ['Valoración profesional y orientación comprensible desde el primer contacto.', 'Atención adaptada a tus necesidades, con seguimiento y cercanía.', 'Un proceso cuidado para que tomes decisiones con tranquilidad.'],
      restaurant: ['Una propuesta elaborada con producto, técnica y personalidad.', 'Opciones pensadas para distintos gustos y momentos del día.', 'Servicio atento para completar una experiencia que apetece repetir.'],
      professional: ['Análisis claro de tu situación para definir el mejor siguiente paso.', 'Soluciones prácticas, bien explicadas y enfocadas en tus objetivos.', 'Acompañamiento directo para avanzar con seguridad y criterio.'],
      realestate: ['Selección cuidada según tus prioridades, ubicación y presupuesto.', 'Información clara para comparar opciones y decidir con confianza.', 'Acompañamiento cercano durante todo el proceso de búsqueda.'],
      education: ['Contenido práctico que conecta aprendizaje y aplicación real.', 'Acompañamiento para avanzar con confianza y resolver dudas.', 'Un itinerario ordenado para convertir esfuerzo en progreso visible.'],
      commerce: ['Selección de calidad con información clara para elegir mejor.', 'Atención ágil antes, durante y después de cada compra.', 'Una experiencia sencilla, cercana y pensada para tu día a día.'],
      beauty: ['Un diagnóstico personal para recomendar solo lo que necesitas.', 'Técnica, detalle y productos seleccionados para cuidar cada resultado.', 'Un momento de bienestar diseñado para que salgas sintiéndote mejor.'],
      other: ['Una solución adaptada a lo que necesitas, sin procesos complicados.', 'Atención directa, comunicación clara y cuidado en cada detalle.', 'Un servicio pensado para ofrecerte un resultado útil y duradero.']
    }[data.sector] || [];
    var serviceCards = data.services.map(function (service, index) {
      return '<article><span>0' + (index + 1) + '</span><h3>' + escapeHtml(service) + '</h3><p>' + escapeHtml(serviceDescriptions[index] || serviceDescriptions[0]) + '</p><a href="#contacto">Saber más <b>↗</b></a></article>';
    }).join('');
    var contactLinks = '';
    if (phone) contactLinks += '<a href="tel:' + phoneHref + '">' + phone + '</a>';
    if (email) contactLinks += '<a href="mailto:' + email + '">' + email + '</a>';
    if (!contactLinks) contactLinks = '<span>Contáctanos para más información</span>';
    var contactHref = phoneHref ? 'https://wa.me/' + phoneHref.replace('+', '') : email ? 'mailto:' + email : '#contacto';
    var locationLabel = city || 'Atención cercana';

    return '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<style>' +
      '@font-face{font-family:DemoSans;src:url("assets/fonts/manrope-latin.woff2") format("woff2");font-display:swap}@font-face{font-family:DemoDisplay;src:url("assets/fonts/sora-latin.woff2") format("woff2");font-display:swap}:root{--accent:' + palette.accent + ';--accent2:' + palette.accent2 + ';--dark:' + palette.dark + ';--soft:' + palette.soft + ';--ink:#111c2a}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;color:var(--ink);font-family:DemoSans,Arial,sans-serif;background:#fff}a{text-decoration:none;color:inherit}img{display:block;width:100%;height:100%;object-fit:cover}.wrap{width:min(1120px,calc(100% - 48px));margin:auto}.display{font-family:DemoDisplay,Arial,sans-serif}' +
      '.site-header{height:78px;display:flex;align-items:center;justify-content:space-between;position:absolute;z-index:5;left:50%;transform:translateX(-50%);width:min(1120px,calc(100% - 48px));color:#fff}.logo{font:800 19px DemoDisplay;letter-spacing:-.035em}.nav{display:flex;gap:27px;align-items:center;font-size:12px}.nav .mini{padding:11px 18px;border:1px solid currentColor;border-radius:999px}.hero{min-height:660px;position:relative;overflow:hidden;background:linear-gradient(135deg,var(--dark),var(--accent))}.hero-grid{position:relative;z-index:2;min-height:660px;display:grid;grid-template-columns:1.08fr .92fr;gap:68px;align-items:center;padding-top:78px}.hero-copy{color:#fff}.eyebrow,.section-kicker{text-transform:uppercase;letter-spacing:.17em;font-weight:800;font-size:10px}.eyebrow{display:flex;align-items:center;gap:10px;opacity:.82;margin-bottom:19px}.eyebrow:before{content:"";width:26px;height:1px;background:currentColor}.hero h1{font:800 clamp(44px,6vw,72px)/1.01 DemoDisplay;margin:0 0 22px;letter-spacing:-.055em;max-width:720px}.hero p{font-size:16px;line-height:1.75;max-width:590px;opacity:.84;margin:0 0 29px}.hero-actions{display:flex;align-items:center;gap:20px;flex-wrap:wrap}.btn{display:inline-flex;align-items:center;justify-content:center;padding:15px 24px;background:#fff;color:var(--dark);font-weight:800;border-radius:12px;font-size:13px}.text-link{font-size:12px;font-weight:700;border-bottom:1px solid currentColor;padding-bottom:3px}.hero-meta{display:flex;gap:20px;margin-top:34px;font-size:11px;opacity:.76}.hero-meta span:before{content:"✓";margin-right:7px}.hero-visual{height:455px;margin:0;position:relative}.hero-visual img{border-radius:28px}.hero-visual:before{content:"";position:absolute;inset:24px -20px -20px 24px;border:1px solid rgba(255,255,255,.4);border-radius:28px}.hero-visual figcaption{position:absolute;left:-32px;bottom:26px;max-width:210px;background:#fff;color:var(--dark);padding:16px 19px;border-radius:13px;font-size:11px;font-weight:800;box-shadow:0 18px 45px rgba(0,0,0,.2)}.hero-visual figcaption span{display:block;color:var(--accent);font-size:9px;text-transform:uppercase;letter-spacing:.12em;margin-bottom:4px}' +
      '.trust{background:#fff;border-bottom:1px solid #e7ebef}.trust-grid{display:grid;grid-template-columns:1.2fr repeat(3,1fr);align-items:center}.trust-grid div{padding:23px 24px;border-left:1px solid #e7ebef}.trust-grid div:first-child{border:0;padding-left:0;color:#657181;font-size:11px}.trust b{display:block;font:700 13px DemoDisplay;color:var(--ink);margin-bottom:3px}.trust span{font-size:10px;color:#788494}.services{padding:96px 0;background:#fff}.section-head{display:flex;justify-content:space-between;align-items:end;gap:40px;margin-bottom:42px}.section-kicker{color:var(--accent);margin-bottom:10px}.services h2,.about h2,.process h2,.contact h2{font:750 clamp(31px,4vw,48px)/1.08 DemoDisplay;letter-spacing:-.045em;margin:0}.section-head p{max-width:420px;color:#667284;font-size:14px;line-height:1.7}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.cards article{border:1px solid #e1e6ec;border-radius:18px;padding:29px;background:#fff;transition:.25s;box-shadow:0 22px 48px -42px #0a1829}.cards article:hover{transform:translateY(-5px);box-shadow:0 25px 48px -35px rgba(5,18,40,.5)}.cards article>span{display:grid;place-items:center;width:40px;height:40px;background:var(--soft);color:var(--accent);border-radius:12px;font-size:10px;font-weight:850}.cards h3{font:700 18px DemoDisplay;margin:26px 0 10px}.cards p{color:#667284;font-size:13px;line-height:1.7;margin:0 0 23px}.cards a{font-size:11px;font-weight:800;color:var(--accent)}.cards a b{margin-left:5px}' +
      '.about{padding:98px 0;background:var(--soft);overflow:hidden}.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:82px;align-items:center}.about-media{height:475px;position:relative}.about-media>img:first-child{border-radius:22px}.about-media>img:last-child{position:absolute;width:48%;height:43%;right:-30px;bottom:-32px;border:9px solid var(--soft);border-radius:22px;box-shadow:0 20px 48px rgba(0,0,0,.18)}.about h2{margin:11px 0 22px}.about p{color:#566476;line-height:1.8;font-size:15px}.quote{margin:29px 0 0;padding:19px 21px;border-left:3px solid var(--accent);background:rgba(255,255,255,.62);font-size:13px!important;color:var(--ink)!important}.process{padding:90px 0;background:#fff}.process-head{text-align:center;max-width:720px;margin:0 auto 45px}.process-head .section-kicker{margin-bottom:11px}.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:#dde3e9;border:1px solid #dde3e9;border-radius:18px;overflow:hidden}.steps article{padding:31px;background:#fff}.steps span{color:var(--accent);font:800 11px DemoDisplay}.steps h3{font:700 17px DemoDisplay;margin:17px 0 9px}.steps p{color:#687585;font-size:12px;line-height:1.65;margin:0}' +
      '.contact{padding:94px 0;background:var(--dark);color:#fff;position:relative;overflow:hidden}.contact:before{content:"";position:absolute;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,var(--accent),transparent 68%);opacity:.32;right:-190px;top:-270px}.contact-grid{position:relative;display:grid;grid-template-columns:1.2fr .8fr;gap:80px;align-items:center}.contact h2{margin:10px 0 18px}.contact p{opacity:.72;line-height:1.7}.contact-card{padding:29px;border:1px solid rgba(255,255,255,.16);border-radius:20px;background:rgba(255,255,255,.07);backdrop-filter:blur(10px)}.contact-card .btn{width:100%;background:var(--accent);color:#fff}.contact-links{display:flex;flex-direction:column;gap:9px;margin-top:18px;font-size:12px;opacity:.78;overflow-wrap:anywhere}footer{display:flex;justify-content:space-between;gap:20px;padding:26px 24px;color:#7c8795;font-size:10px;background:#fff}' +
      '.theme-modern .hero:before{content:"";position:absolute;width:650px;height:650px;border-radius:50%;right:-220px;top:-310px;background:radial-gradient(circle,var(--accent2),transparent 67%);opacity:.75}.theme-modern .hero-visual img{clip-path:polygon(0 0,100% 8%,100% 100%,0 91%)}.theme-elegant{background:#f7f4ee}.theme-elegant .hero{min-height:720px;background:var(--dark)}.theme-elegant .hero:before{content:"";position:absolute;inset:0;background:linear-gradient(rgba(8,12,18,.42),rgba(8,12,18,.74)),url("' + images[0] + '") center/cover}.theme-elegant .hero-grid{min-height:720px;display:flex;justify-content:center;text-align:center}.theme-elegant .hero-copy{max-width:820px}.theme-elegant .eyebrow,.theme-elegant .hero-actions,.theme-elegant .hero-meta{justify-content:center}.theme-elegant .hero h1,.theme-elegant h2{font-family:Georgia,serif;font-weight:500;letter-spacing:-.03em}.theme-elegant .hero p{margin-left:auto;margin-right:auto}.theme-elegant .hero-visual{display:none}.theme-elegant .btn{border-radius:0;padding-left:32px;padding-right:32px}.theme-elegant .cards article{background:transparent;border:0;border-top:1px solid #b9b2a6;border-radius:0;box-shadow:none;padding-left:0}.theme-elegant .about{background:#e9e3d8}.theme-elegant .about-media img,.theme-elegant .steps{border-radius:0}.theme-elegant .about-media>img:last-child{border-color:#e9e3d8}.theme-elegant .contact-card{border-radius:0}.theme-elegant .contact .btn{border-radius:0}.theme-warm{background:#fffaf3}.theme-warm .site-header{color:var(--dark)}.theme-warm .hero{background:linear-gradient(145deg,#fff7eb,#f5eadb)}.theme-warm .hero:before{content:"";position:absolute;width:620px;height:620px;border-radius:45% 55% 65% 35%;right:-150px;top:-140px;background:var(--soft)}.theme-warm .hero-copy{color:var(--dark)}.theme-warm .hero p{opacity:.72}.theme-warm .hero .btn{background:var(--accent);color:#fff;border-radius:999px}.theme-warm .hero-meta{opacity:.64}.theme-warm .hero-visual img{border-radius:43% 57% 48% 52%}.theme-warm .hero-visual:before{border-radius:40% 60% 45% 55%;border-color:var(--accent);opacity:.35}.theme-warm .hero-visual figcaption,.theme-warm .cards article,.theme-warm .steps,.theme-warm .contact-card{border-radius:28px}.theme-warm .services,.theme-warm .process{background:#fffaf3}.theme-warm .about{background:#f6e9d8}.theme-warm .about-media>img:first-child{border-radius:44% 56% 48% 52%}.theme-warm .about-media>img:last-child{border-radius:30px;border-color:#f6e9d8}.theme-warm .btn{border-radius:999px}' +
      '@media(max-width:760px){.wrap,.site-header{width:min(100% - 34px,1120px)}.site-header{height:66px}.nav a:not(.mini){display:none}.hero,.theme-elegant .hero{min-height:auto}.hero-grid,.theme-elegant .hero-grid{min-height:730px;grid-template-columns:1fr;display:grid;gap:32px;padding:104px 0 46px;text-align:left}.theme-elegant .eyebrow,.theme-elegant .hero-actions,.theme-elegant .hero-meta{justify-content:flex-start}.theme-elegant .hero p{margin-left:0}.hero h1{font-size:43px}.hero-visual{height:280px}.hero-visual figcaption{left:12px;bottom:13px}.hero-meta{flex-wrap:wrap;gap:8px 16px}.trust-grid{grid-template-columns:1fr 1fr}.trust-grid div{border-bottom:1px solid #e7ebef}.trust-grid div:first-child{padding-left:24px}.services,.about,.process,.contact{padding:68px 0}.section-head{display:block}.section-head p{margin-top:16px}.cards,.about-grid,.steps,.contact-grid{grid-template-columns:1fr}.cards{gap:12px}.about-grid{gap:49px}.about-media{height:330px}.about-media>img:last-child{right:7px}.steps{gap:1px}.contact-grid{gap:30px}footer{flex-direction:column;text-align:center}}' +
      '</style></head><body class="' + themeClass + '">' +
      '<header class="site-header"><div class="logo">' + business + '</div><nav class="nav"><a href="#servicios">Servicios</a><a href="#nosotros">Nosotros</a><a class="mini" href="#contacto">Contacto</a></nav></header>' +
      '<main><section class="hero"><div class="wrap hero-grid"><div class="hero-copy"><div class="eyebrow">' + eyebrow + (city ? ' · ' + city : '') + '</div><h1>' + headline + '</h1><p>' + description + '</p><div class="hero-actions"><a class="btn" href="#contacto">' + contextualAction + '</a><a class="text-link" href="#servicios">Explorar servicios ↓</a></div><div class="hero-meta"><span>Atención personalizada</span><span>Información clara</span><span>Contacto directo</span></div></div><figure class="hero-visual"><img src="' + images[0] + '" alt="' + imageAlt + '"><figcaption><span>Nuestra forma de trabajar</span>Una experiencia pensada alrededor de ti</figcaption></figure></div></section>' +
      '<section class="trust"><div class="wrap trust-grid"><div>LO ESENCIAL, DESDE EL PRIMER CONTACTO</div><div><b>Atención directa</b><span>Sin intermediarios</span></div><div><b>' + locationLabel + '</b><span>Servicio accesible</span></div><div><b>Tres áreas clave</b><span>Una propuesta completa</span></div></div></section>' +
      '<section class="services" id="servicios"><div class="wrap"><div class="section-head"><div><div class="section-kicker">Lo que hacemos</div><h2>Soluciones para avanzar</h2></div><p>Una propuesta clara y ordenada para que encuentres rápidamente lo que necesitas y sepas cuál es el siguiente paso.</p></div><div class="cards">' + serviceCards + '</div></div></section>' +
      '<section class="about" id="nosotros"><div class="wrap about-grid"><div class="about-media"><img src="' + images[1] + '" alt="' + imageAlt + '"><img src="' + images[2] + '" alt="Detalle de ' + business + '"></div><div><div class="section-kicker">Nuestra manera de hacer</div><h2>' + aboutTitle + '</h2><p>' + about + '</p><p>En ' + business + ' escuchamos lo que necesitas, te explicamos cada paso y cuidamos la experiencia de principio a fin.</p><p class="quote">Cercanía para entenderte. Criterio para ofrecerte una solución que de verdad encaje.</p></div></div></section>' +
      '<section class="process"><div class="wrap"><div class="process-head"><div class="section-kicker">Un proceso sencillo</div><h2>Fácil de empezar, claro de seguir</h2></div><div class="steps"><article><span>01 · CONVERSEMOS</span><h3>Cuéntanos qué necesitas</h3><p>Escuchamos tu objetivo y resolvemos las primeras dudas sin complicaciones.</p></article><article><span>02 · PROPUESTA</span><h3>Definimos la mejor opción</h3><p>Ordenamos prioridades y planteamos una solución adaptada a tu caso.</p></article><article><span>03 · SIGUIENTE PASO</span><h3>Avanzamos contigo</h3><p>Te acompañamos con comunicación directa durante todo el proceso.</p></article></div></div></section>' +
      '<section class="contact" id="contacto"><div class="wrap contact-grid"><div><div class="section-kicker">Hablemos</div><h2>¿Empezamos?</h2><p>Cuéntanos qué tienes en mente. Te responderemos con claridad para ayudarte a dar el siguiente paso.</p></div><div class="contact-card"><a class="btn" href="' + contactHref + '">' + cta + '</a><div class="contact-links">' + contactLinks + '</div></div></div></section></main>' +
      '<footer><span>' + business + '</span><span>Propuesta visual automática · HUMA Digital Studio</span></footer></body></html>';
  }

  function render(data) {
    previewFrame.srcdoc = buildPreview(data);
    document.getElementById('previewDomain').textContent = safeDomain(data.businessName);
    var text = 'Hola HUMA Digital Studio, he creado una demo y quiero continuar con el proyecto.\n\n' +
      'Negocio: ' + data.businessName + '\nSector: ' + data.sector + '\nCiudad: ' + (data.city || '-') +
      '\nServicios: ' + data.services.join(', ') + '\nEstilo: ' + data.style + '\nColor: ' + data.color +
      '\nContacto: ' + data.contactName + (data.email ? ' · ' + data.email : '') + (data.phone ? ' · ' + data.phone : '');
    contactHuma.href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(text);
    contactHuma.target = '_blank';
    contactHuma.rel = 'noopener noreferrer';
    previewEmpty.hidden = true;
    previewResult.hidden = false;
    var imageProfile = window.HumaDemoImages.detect(data);
    trackEvent('demo_generated', { sector: data.sector, style: data.style, color: data.color, image_profile: imageProfile.id });
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

  contactHuma.addEventListener('click', function () { trackEvent('demo_lead_whatsapp', { lead_source: 'demo_generator' }); });

  document.querySelectorAll('[data-device]').forEach(function (button) {
    button.addEventListener('click', function () {
      document.querySelectorAll('[data-device]').forEach(function (item) { item.classList.remove('active'); });
      button.classList.add('active');
      document.querySelectorAll('[data-device]').forEach(function (item) { item.setAttribute('aria-pressed', item === button ? 'true' : 'false'); });
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
