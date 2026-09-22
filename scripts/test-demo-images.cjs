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
    expected: 'fitness',
    data: { businessName: 'Fuerza Centro', sector: 'other', description: 'Gimnasio con entrenamiento personal', services: ['Fitness', 'Pesas', 'Entrenador'] }
  }
];

for (const fixture of cases) {
  const detected = selector.detect(fixture.data);
  assert.equal(detected.id, fixture.expected, `${fixture.data.businessName}: perfil incorrecto`);
  const result = selector.select(fixture.data);
  assert.equal(result.images.length, 3, `${fixture.data.businessName}: se esperaban tres imágenes`);
  for (const image of result.images) assert.ok(existsSync(image), `${fixture.data.businessName}: falta ${image}`);
  assert.deepEqual(result.images, selector.select(fixture.data).images, `${fixture.data.businessName}: la selección debe ser estable`);
}

const genericHealth = selector.detect({ businessName: 'Centro Vital', sector: 'health', description: 'Atención sanitaria', services: ['Consulta', 'Revisión', 'Seguimiento'] });
assert.equal(genericHealth.id, 'health-general');

console.log(`Demo image selection passed (${cases.length + 1} cases).`);
