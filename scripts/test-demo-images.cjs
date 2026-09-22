const assert = require('node:assert/strict');
const { existsSync } = require('node:fs');
const selector = require('../assets/demo-image-selector.js');

const cases = [
  {
    expected: 'health-dental',
    data: { businessName: 'Clínica Dental Sonrisa', sector: 'health', description: 'Ortodoncia e implantes', services: ['Limpieza dental', 'Ortodoncia', 'Implantes'] }
  },
  {
    expected: 'health-pediatric',
    data: { businessName: 'PequeSalud', sector: 'health', description: 'Pediatría cercana para bebés y niños', services: ['Revisión infantil', 'Vacunación', 'Pediatra'] }
  },
  {
    expected: 'professional-legal',
    data: { businessName: 'Valencia Legal', sector: 'professional', description: 'Despacho de abogados', services: ['Derecho laboral', 'Derecho fiscal', 'Asesoría jurídica'] }
  },
  {
    expected: 'professional-marketing',
    data: { businessName: 'Estudio Naranja', sector: 'professional', description: 'Agencia creativa de branding', services: ['Diseño', 'Marketing', 'Redes sociales'] }
  },
  {
    expected: 'realestate-apartment',
    data: { businessName: 'Vive Valencia', sector: 'realestate', description: 'Alquiler de pisos y apartamentos', services: ['Alquiler', 'Gestión de pisos', 'Visitas'] }
  },
  {
    expected: 'education-digital',
    data: { businessName: 'Impulso Academy', sector: 'education', description: 'Formación digital para empresas', services: ['Excel', 'Marketing digital', 'Datos'] }
  },
  {
    expected: 'commerce-tech',
    data: { businessName: 'Tech Store', sector: 'commerce', description: 'Tienda de tecnología y accesorios', services: ['Auriculares', 'Móviles', 'Informática'] }
  },
  {
    expected: 'beauty-barber',
    data: { businessName: 'Barber Club', sector: 'beauty', description: 'Barbería para caballeros', services: ['Corte', 'Barba', 'Afeitado'] }
  },
  {
    expected: 'fitness-general',
    data: { businessName: 'Fuerza Centro', sector: 'other', description: 'Gimnasio con entrenamiento personal', services: ['Fitness', 'Pesas', 'Entrenador'] }
  },
  {
    expected: 'restaurant-cafe',
    data: { businessName: 'Miga Café', sector: 'restaurant', description: 'Cafetería de especialidad y brunch', services: ['Café', 'Desayunos', 'Repostería'] }
  },
  {
    expected: 'beauty-spa',
    data: { businessName: 'Calma', sector: 'beauty', description: 'Spa urbano con tratamientos faciales', services: ['Masajes', 'Estética', 'Bienestar'] }
  },
  {
    expected: 'fitness-yoga',
    data: { businessName: 'Respira', sector: 'other', description: 'Estudio de yoga y pilates', services: ['Yoga', 'Pilates', 'Meditación'] }
  },
  {
    expected: 'other-pets',
    data: { businessName: 'Huella Feliz', sector: 'other', description: 'Centro de mascotas', services: ['Peluquería canina', 'Adiestramiento', 'Cuidado de perros'] }
  },
  {
    expected: 'other-automotive',
    data: { businessName: 'Motor Norte', sector: 'other', description: 'Taller de automoción', services: ['Mecánica', 'Motor', 'Coches'] }
  },
  {
    expected: 'other-construction',
    data: { businessName: 'Reforma Clara', sector: 'professional', description: 'Arquitectura y reformas integrales', services: ['Construcción', 'Interiorismo', 'Obra'] }
  },
  {
    expected: 'other-tourism',
    data: { businessName: 'Costa Serena', sector: 'other', description: 'Hotel boutique junto al mar', services: ['Alojamiento', 'Vacaciones', 'Turismo'] }
  },
  {
    expected: 'other-events',
    data: { businessName: 'Momentos', sector: 'professional', description: 'Organización de bodas y eventos', services: ['Bodas', 'Celebraciones', 'Wedding planner'] }
  }
];

for (const fixture of cases) {
  const detected = selector.detect(fixture.data);
  assert.equal(detected.id, fixture.expected, `${fixture.data.businessName}: perfil incorrecto`);
  const result = selector.select(fixture.data);
  assert.equal(result.images.length, 3, `${fixture.data.businessName}: se esperaban tres imágenes`);
  assert.equal(new Set(result.images).size, 3, `${fixture.data.businessName}: no debe repetir imágenes`);
  for (const image of result.images) assert.ok(existsSync(image), `${fixture.data.businessName}: falta ${image}`);
  assert.deepEqual(result.images, selector.select(fixture.data).images, `${fixture.data.businessName}: la selección debe ser estable`);
}

for (const [id, profile] of Object.entries(selector.profiles)) {
  assert.ok(profile.images.length >= 3, `${id}: el perfil necesita al menos tres imágenes`);
  assert.equal(new Set(profile.images).size, profile.images.length, `${id}: el catálogo no debe contener duplicados`);
  for (const image of profile.images) assert.ok(existsSync(image), `${id}: falta ${image}`);
}

const forbiddenCrossSector = {
  'professional-general': ['academia', 'clinica', 'comercio', 'restaurante'],
  'other-general': ['academia', 'clinica', 'comercio', 'restaurante'],
  'commerce-general': ['academia', 'clinica', 'inmobiliaria'],
  'health-general': ['academia', 'comercio', 'restaurante']
};

for (const [id, forbidden] of Object.entries(forbiddenCrossSector)) {
  const paths = selector.profiles[id].images.join(' ');
  for (const token of forbidden) assert.ok(!paths.includes(token), `${id}: contiene una imagen cruzada de ${token}`);
}

const themedProfiles = {
  'health-dental': ['health-dental', 'clinica-odontologia'],
  'fitness-yoga': ['fitness-yoga', 'fitness-pilates', 'fitness-group-class'],
  'other-pets': ['pets-'],
  'other-automotive': ['automotive-'],
  'other-construction': ['construction-'],
  'other-tourism': ['tourism-'],
  'other-events': ['events-']
};

for (const [id, allowed] of Object.entries(themedProfiles)) {
  for (const image of selector.profiles[id].images) {
    assert.ok(allowed.some((token) => image.includes(token)), `${id}: ${image} no pertenece a su temática`);
  }
}

const genericHealth = selector.detect({ businessName: 'Centro Vital', sector: 'health', description: 'Atención sanitaria', services: ['Consulta', 'Revisión', 'Seguimiento'] });
assert.equal(genericHealth.id, 'health-general');

console.log(`Demo image selection passed (${cases.length + 1} cases, ${Object.keys(selector.profiles).length} profiles).`);
