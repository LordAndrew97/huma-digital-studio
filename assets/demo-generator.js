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

  var sectorImages = {
    health: [
      'photo-1516841273335-e39b37888115', 'photo-1538108149393-fbbd81895907',
      'photo-1576091160399-112ba8d25d1d', 'photo-1584982751601-97dcc096659c',
      'photo-1532938911079-1b06ac7ceec7', 'photo-1629909613654-28e377c37b09',
      'photo-1622253692010-333f2da6031d', 'photo-1606811971618-4486d14f3f99',
      'photo-1666214280557-f1b5022eb634', 'photo-1588776814546-1ffcf47267a5'
    ],
    restaurant: [
      'photo-1517248135467-4c7edcad34c4', 'photo-1414235077428-338989a2e8c0',
      'photo-1555396273-367ea4eb4db5', 'photo-1504674900247-0877df9cc836',
      'photo-1550966871-3ed3cdb5ed0d', 'photo-1515003197210-e0cd71810b5f',
      'photo-1544148103-0773bf10d330', 'photo-1569058242253-92a9c755a0ec',
      'photo-1514933651103-005eec06c04b', 'photo-1508424757105-b6d5ad9329d0'
    ],
    professional: [
      'photo-1521737711867-e3b97375f902', 'photo-1497366754035-f200968a6e72',
      'photo-1497366811353-6870744d04b2', 'photo-1556761175-b413da4baf72',
      'photo-1556761175-4b46a572b786', 'photo-1524758631624-e2822e304c36',
      'photo-1542744173-8e7e53415bb0', 'photo-1522071820081-009f0129c71c',
      'photo-1551836022-d5d88e9218df', 'photo-1504384308090-c894fdcc538d'
    ],
    realestate: [
      'photo-1600585154340-be6161a56a0c', 'photo-1600566753190-17f0baa2a6c3',
      'photo-1600607687939-ce8a6c25118c', 'photo-1600607687920-4e2a09cf159d',
      'photo-1613490493576-7fde63acd811', 'photo-1600047509807-ba8f99d2cdde',
      'photo-1600573472550-8090b5e0745e', 'photo-1600607688969-a5bfcd646154',
      'photo-1600566753086-00f18fb6b3ea', 'photo-1600596542815-ffad4c1539a9'
    ],
    education: [
      'photo-1523240795612-9a054b0db644', 'photo-1509062522246-3755977927d7',
      'photo-1523050854058-8df90110c9f1', 'photo-1577896851231-70ef18881754',
      'photo-1519452575417-564c1401ecc0', 'photo-1503676260728-1c00da094a0b',
      'photo-1522202176988-66273c2fd55f', 'photo-1427504494785-3a9ca7044f45',
      'photo-1516321318423-f06f85e504b3', 'photo-1532012197267-da84d127e765'
    ],
    commerce: [
      'photo-1441986300917-64674bd600d8', 'photo-1556742049-0cfed4f6a45d',
      'photo-1604719312566-8912e9227c6a', 'photo-1607082348824-0a96f2a4b9da',
      'photo-1472851294608-062f824d29cc', 'photo-1534452203293-494d7ddbf7e0',
      'photo-1528698827591-e19ccd7bc23d', 'photo-1578916171728-46686eac8d58',
      'photo-1601598851547-4302969d0614', 'photo-1555529669-e69e7aa0ba9a'
    ],
    beauty: [
      'photo-1560066984-138dadb4c035', 'photo-1522337360788-8b13dee7a37e',
      'photo-1600948836101-f9ffda59d250', 'photo-1562322140-8baeececf3df',
      'photo-1616394584738-fc6e612e71b9', 'photo-1516975080664-ed2fc6a32937',
      'photo-1487412912498-0447578fcca8', 'photo-1521590832167-7bcbfaa6381f',
      'photo-1608248543803-ba4f8c70ae0b', 'photo-1570172619644-dfd03ed5d881'
    ],
    other: [
      'photo-1497366754035-f200968a6e72', 'photo-1522071820081-009f0129c71c',
      'photo-1497215728101-856f4ea42174', 'photo-1497366811364-ccf3f6e0b8dd',
      'photo-1504384308090-c894fdcc538d', 'photo-1556761175-b413da4baf72',
      'photo-1524758631624-e2822e304c36', 'photo-1497366216548-37526070297c',
      'photo-1521737711867-e3b97375f902', 'photo-1542744173-8e7e53415bb0'
    ]
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

  function imageUrl(photoId, width) {
    return 'https://images.unsplash.com/' + photoId + '?auto=format&fit=crop&w=' + (width || 1200) + '&q=82';
  }

  function pickSectorImages(sector, count) {
    var pool = (sectorImages[sector] || sectorImages.other).slice();
    for (var index = pool.length - 1; index > 0; index -= 1) {
      var randomIndex = Math.floor(Math.random() * (index + 1));
      var temporary = pool[index];
      pool[index] = pool[randomIndex];
      pool[randomIndex] = temporary;
    }
    return pool.slice(0, count).map(function (photoId, index) {
      return imageUrl(photoId, index === 0 ? 1600 : 1000);
    });
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
    var images = pickSectorImages(data.sector, 3);
    var business = escapeHtml(data.businessName);
    var headline = escapeHtml(data.headline || defaults.headline);
    var description = escapeHtml(data.description);
    var about = escapeHtml(defaults.about);
    var city = escapeHtml(data.city);
    var cta = escapeHtml(data.cta);
    var email = escapeHtml(data.email);
    var phone = escapeHtml(data.phone);
    var phoneHref = safePhone(data.phone);
    var themeClass = data.style === 'elegant' ? 'theme-elegant' : data.style === 'warm' ? 'theme-warm' : 'theme-modern';
    var imageAlt = 'Imagen representativa de ' + business;
    var serviceCards = data.services.map(function (service, index) {
      return '<article><span>0' + (index + 1) + '</span><h3>' + escapeHtml(service) + '</h3><p>Una solución clara, personalizada y orientada a conseguir el mejor resultado.</p></article>';
    }).join('');
    var contactLinks = '';
    if (phone) contactLinks += '<a href="tel:' + phoneHref + '">' + phone + '</a>';
    if (email) contactLinks += '<a href="mailto:' + email + '">' + email + '</a>';
    if (!contactLinks) contactLinks = '<span>Contáctanos para más información</span>';

    return '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<style>' +
      ':root{--accent:' + palette.accent + ';--accent2:' + palette.accent2 + ';--dark:' + palette.dark + ';--soft:' + palette.soft + '}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;color:var(--dark);font-family:Inter,Arial,sans-serif;background:#fff}a{text-decoration:none;color:inherit}img{display:block;width:100%;height:100%;object-fit:cover}.wrap{width:min(1100px,calc(100% - 44px));margin:auto}' +
      '.site-header{height:76px;display:flex;align-items:center;justify-content:space-between;position:absolute;z-index:5;left:50%;transform:translateX(-50%);width:min(1100px,calc(100% - 44px));color:#fff}.logo{font-weight:850;font-size:19px;letter-spacing:-.03em}.nav{display:flex;gap:24px;align-items:center;font-size:13px}.nav .mini{padding:10px 16px;border:1px solid currentColor;border-radius:999px}' +
      '.hero{min-height:570px;position:relative;overflow:hidden}.hero-grid{position:relative;z-index:2;min-height:570px;display:grid;grid-template-columns:1.05fr .95fr;gap:64px;align-items:center;padding-top:76px}.hero-copy{color:#fff}.eyebrow{text-transform:uppercase;letter-spacing:.18em;font-weight:800;font-size:10px;opacity:.78;margin-bottom:18px}.hero h1{font-size:clamp(42px,6vw,68px);line-height:1.02;letter-spacing:-.05em;max-width:700px;margin:0 0 22px}.hero p{font-size:16px;line-height:1.7;max-width:600px;opacity:.82;margin:0 0 29px}.btn{display:inline-flex;align-items:center;justify-content:center;padding:14px 24px;background:#fff;color:var(--dark);font-weight:800;border-radius:12px;font-size:13px}.hero-meta{display:flex;gap:20px;margin-top:30px;font-size:11px;opacity:.72}.hero-meta span:before{content:"✓";margin-right:7px}.hero-visual{height:390px;margin:0;position:relative}.hero-visual img{border-radius:22px}.hero-visual:before{content:"";position:absolute;inset:22px -20px -20px 22px;border:1px solid rgba(255,255,255,.38);border-radius:22px}.hero-visual figcaption{position:absolute;left:-25px;bottom:22px;background:#fff;color:var(--dark);padding:14px 18px;border-radius:12px;font-size:11px;font-weight:800;box-shadow:0 18px 45px rgba(0,0,0,.18)}' +
      '.theme-modern .hero{background:linear-gradient(135deg,var(--dark),var(--accent))}.theme-modern .hero:before{content:"";position:absolute;width:560px;height:560px;border-radius:50%;right:-180px;top:-230px;background:radial-gradient(circle,var(--accent2),transparent 68%);opacity:.7}' +
      '.theme-elegant{background:#f7f4ee}.theme-elegant .hero{min-height:650px;background:var(--dark)}.theme-elegant .hero:before{content:"";position:absolute;inset:0;background:linear-gradient(rgba(8,12,18,.48),rgba(8,12,18,.7)),url("' + images[0] + '") center/cover}.theme-elegant .hero-grid{min-height:650px;display:flex;justify-content:center;text-align:center}.theme-elegant .hero-copy{max-width:800px}.theme-elegant .hero h1,.theme-elegant h2{font-family:Georgia,serif;font-weight:500;letter-spacing:-.035em}.theme-elegant .hero p{margin-left:auto;margin-right:auto}.theme-elegant .hero-meta{justify-content:center}.theme-elegant .hero-visual{display:none}.theme-elegant .btn{border-radius:0;padding-left:30px;padding-right:30px}.theme-elegant .cards article{background:transparent;border:0!important;border-top:1px solid #b9b2a6!important;border-radius:0!important;box-shadow:none!important;padding-left:0!important}.theme-elegant .about{background:#ebe6dc!important}.theme-elegant .about-media img{border-radius:0!important}.theme-elegant .contact .btn{border-radius:0}' +
      '.theme-warm{background:#fffaf3}.theme-warm .site-header{color:var(--dark)}.theme-warm .hero{background:linear-gradient(145deg,#fff6e9,#f7eee0)}.theme-warm .hero:before{content:"";position:absolute;width:520px;height:520px;border-radius:45% 55% 65% 35%;right:-120px;top:-120px;background:var(--soft)}.theme-warm .hero-copy{color:var(--dark)}.theme-warm .hero h1{letter-spacing:-.045em}.theme-warm .hero p{opacity:.7}.theme-warm .hero .btn{background:var(--accent);color:#fff;border-radius:999px}.theme-warm .hero-meta{opacity:.62}.theme-warm .hero-visual img{border-radius:42% 58% 48% 52%}.theme-warm .hero-visual:before{border-radius:40% 60% 45% 55%;border-color:var(--accent);opacity:.35}.theme-warm .hero-visual figcaption{border-radius:999px}.theme-warm .services{background:#fffaf3}.theme-warm .cards article{border:0!important;border-radius:28px!important;background:#fff!important}.theme-warm .about{background:#f8ecde!important}.theme-warm .about-media img{border-radius:32px!important}.theme-warm .btn{border-radius:999px}' +
      '.services{padding:88px 0;background:#fff}.section-kicker{text-transform:uppercase;letter-spacing:.16em;color:var(--accent);font-weight:850;font-size:10px}.services h2,.about h2,.contact h2{font-size:clamp(30px,4vw,46px);letter-spacing:-.04em;margin:10px 0 36px}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.cards article{border:1px solid #e2e7ed;border-radius:16px;padding:28px;background:#fff;box-shadow:0 20px 45px -38px rgba(5,18,40,.45)}.cards article>span{display:grid;place-items:center;width:38px;height:38px;background:var(--soft);color:var(--accent);border-radius:11px;font-size:10px;font-weight:850}.cards h3{font-size:18px;margin:25px 0 9px}.cards p{color:#667284;font-size:13px;line-height:1.65;margin:0}' +
      '.about{padding:84px 0;background:var(--soft)}.about-grid{display:grid;grid-template-columns:.9fr 1.1fr;gap:72px;align-items:center}.about-media{height:410px;position:relative}.about-media>img:first-child{border-radius:18px}.about-media>img:last-child{position:absolute;width:42%;height:42%;right:-22px;bottom:-25px;border:8px solid var(--soft);border-radius:18px;box-shadow:0 18px 45px rgba(0,0,0,.16)}.about h2{margin-bottom:20px}.about p{color:#566476;line-height:1.75;font-size:15px}.facts{display:flex;gap:28px;margin-top:28px}.facts b{display:block;color:var(--accent);font-size:23px}.facts span{font-size:11px;color:#6a7889}' +
      '.contact{padding:82px 0;background:var(--dark);color:#fff;text-align:center}.contact .wrap{max-width:760px}.contact h2{margin-bottom:17px}.contact p{opacity:.72;margin:0 auto 26px}.contact .btn{background:var(--accent);color:#fff}.contact-links{display:flex;justify-content:center;gap:22px;margin-top:28px;flex-wrap:wrap;font-size:13px;opacity:.78}.contact-links a{text-decoration:underline}footer{padding:25px 22px;text-align:center;color:#7c8795;font-size:11px;background:#fff}' +
      '@media(max-width:760px){.site-header{height:64px}.nav a:not(.mini){display:none}.hero,.theme-elegant .hero{min-height:auto}.hero-grid,.theme-elegant .hero-grid{min-height:680px;grid-template-columns:1fr;display:grid;gap:28px;padding:105px 0 48px}.theme-elegant .hero-grid{display:flex}.hero h1{font-size:42px}.hero-visual{height:250px}.hero-visual figcaption{left:12px}.hero-meta{flex-direction:column;gap:7px}.theme-elegant .hero-meta{align-items:center}.services,.about,.contact{padding:62px 0}.cards{grid-template-columns:1fr}.about-grid{grid-template-columns:1fr;gap:45px}.about-media{height:310px}.about-media>img:last-child{right:10px}.facts{justify-content:space-between;gap:10px}}' +
      '</style></head><body class="' + themeClass + '">' +
      '<header class="site-header"><div class="logo">' + business + '</div><nav class="nav"><a href="#servicios">Servicios</a><a href="#nosotros">Nosotros</a><a class="mini" href="#contacto">Contacto</a></nav></header>' +
      '<main><section class="hero"><div class="wrap hero-grid"><div class="hero-copy"><div class="eyebrow">' + escapeHtml(defaults.eyebrow) + (city ? ' · ' + city : '') + '</div><h1>' + headline + '</h1><p>' + description + '</p><a class="btn" href="#contacto">' + cta + '</a><div class="hero-meta"><span>Atención personalizada</span><span>Respuesta rápida</span><span>Servicio profesional</span></div></div><figure class="hero-visual"><img src="' + images[0] + '" alt="' + imageAlt + '"><figcaption>Una experiencia pensada para ti</figcaption></figure></div></section>' +
      '<section class="services" id="servicios"><div class="wrap"><div class="section-kicker">Lo que hacemos</div><h2>Servicios pensados para ti</h2><div class="cards">' + serviceCards + '</div></div></section>' +
      '<section class="about" id="nosotros"><div class="wrap about-grid"><div class="about-media"><img src="' + images[1] + '" alt="' + imageAlt + '"><img src="' + images[2] + '" alt="Detalle de ' + business + '"></div><div><div class="section-kicker">Sobre nosotros</div><h2>Confianza desde el primer contacto</h2><p>' + about + '</p><p>En ' + business + ', cada cliente importa. Escuchamos lo que necesitas y te acompañamos durante todo el proceso.</p><div class="facts"><div><b>100%</b><span>Atención cercana</span></div><div><b>3</b><span>Servicios principales</span></div><div><b>1:1</b><span>Trato personalizado</span></div></div></div></div></section>' +
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
