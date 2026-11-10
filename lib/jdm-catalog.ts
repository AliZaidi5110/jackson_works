/**
 * JDM Engine Specialists UK – Complete Catalogue Data Layer
 * Covers Toyota, Nissan, Mitsubishi, Honda, Mazda, Subaru Japanese engines
 * All prices in GBP (£) inclusive of 20% VAT
 *
 * TODO: Replace placeholder prices, stock levels and descriptions with real data from client.
 */

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type Condition = 'New' | 'Used JDM' | 'Reconditioned' | 'Rebuilt' | 'Aftermarket';

export interface JdmProduct {
  id: number;
  sku: string;
  partNumber: string;
  title: string;
  shortTitle: string;
  brand: string;
  make: string;
  engines: string[];        // e.g. ['2JZ-GTE', '2JZ-GE']
  chassis: string[];        // e.g. ['JZA80', 'JZZ30']
  categoryId: string;
  subcategoryId: string;
  condition: Condition;
  priceIncVat: number;
  priceExVat: number;
  wasPrice: number | null;
  inStock: boolean;
  stockCount: number;
  stockStatus: 'In Stock' | 'Out of Stock' | 'Pre-order' | 'Enquire Only';
  mileage?: number;          // for used engines
  warranty: string;          // e.g. "3 Months", "12 Months"
  depositPct: number;        // normally 10, but can be overridden
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  isFeatured: boolean;
  isPopular: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isPublished?: boolean;
  specifications: Record<string, string>;
  searchTerms: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  // Extra fields for special categories
  torqueRating?: number;     // Nm – gearbox kits
  driveType?: 'RWD' | 'AWD' | 'FWD';
  gearboxType?: string;      // e.g. 'R154', 'W58', 'V160'
  controlFeatures?: string[]; // TCU features
  plugAndPlay?: boolean;     // TCU
  tuningRequired?: boolean;  // TCU/ECU
}

export interface Engine {
  code: string;
  name: string;
  make: string;
  displacement: string;
  config: string;          // e.g. 'Inline-6', 'V8', 'Rotary'
  power: string;           // e.g. '280 bhp (stock)'
  torque: string;
  induction: string;       // e.g. 'Twin-turbo', 'NA'
  commonChassis: string[];
  commonFailures: string[];
  upgradePaths: string[];
  seoTitle: string;
  seoDescription: string;
}

export interface Make {
  id: string;
  name: string;
  country: string;
  engines: string[];       // engine codes
  description: string;
}

export interface ChassisModel {
  code: string;
  name: string;
  make: string;
  years: string;
  engines: string[];
}

export interface PartCategory {
  id: string;
  name: string;
  description: string;
  subcategories: PartSubcategory[];
  featuredEngines: string[];
}

export interface PartSubcategory {
  id: string;
  name: string;
  description: string;
}

export interface EnginePackage {
  id: string;
  engineCode: string;
  tier: 'Engine Only' | 'Engine + Gearbox' | 'Engine + ECU + Loom' | 'Full Swap Package' | 'Rebuilt Performance Package';
  title: string;
  description: string;
  includedItems: PackageItem[];
  condition: Condition;
  mileage?: number;
  warranty: string;
  priceIncVat: number;
  priceExVat: number;
  inStock: boolean;
  stockStatus: 'In Stock' | 'Out of Stock' | 'Pre-order' | 'Enquire Only';
  fittingAvailable: boolean;
  image: string;
  isFeatured: boolean;
}

export interface PackageItem {
  name: string;
  partNumber?: string;
  condition: Condition;
  quantity: number;
  notes?: string;
}

// ─────────────────────────────────────────────
// MAKES
// ─────────────────────────────────────────────

export const MAKES: Make[] = [
  {
    id: 'toyota',
    name: 'Toyota',
    country: 'Japan',
    engines: ['2JZ-GTE', '2JZ-GE', '1JZ-GTE', '1JZ-GE', '3S-GTE', '1UZ-FE', '4A-GE'],
    description: 'Home of the legendary 2JZ-GTE and 1JZ-GTE. Toyota\'s straight-six engines are renowned for their extreme tunability and aftermarket support, powering iconic platforms such as the Supra A80, Chaser, Soarer, Altezza and Aristo.',
  },
  {
    id: 'nissan',
    name: 'Nissan',
    country: 'Japan',
    engines: ['RB25DET', 'RB26DETT', 'RB20DET', 'RB30', 'SR20DET', 'CA18DET', 'VQ35', 'VR38'],
    description: 'Nissan\'s RB and SR engine families define JDM performance. The twin-turbo RB26DETT in the Skyline GT-R remains one of the most celebrated engines of all time, whilst the SR20DET powers countless drift and circuit builds.',
  },
  {
    id: 'mitsubishi',
    name: 'Mitsubishi',
    country: 'Japan',
    engines: ['4G63', '4B11'],
    description: 'The 4G63 turbocharged engine is the heartbeat of every Lancer Evolution from Evo 1 through Evo 9, delivering rally-bred AWD performance. The 4B11 continues the legacy in the Evo X.',
  },
  {
    id: 'honda',
    name: 'Honda',
    country: 'Japan',
    engines: ['K20', 'B16', 'B18', 'F20C'],
    description: 'Honda\'s VTEC-equipped engines deliver exceptional naturally-aspirated performance. The K20 and B-series engines are among the most popular engine-swap choices in UK motorsport.',
  },
  {
    id: 'mazda',
    name: 'Mazda',
    country: 'Japan',
    engines: ['13B', 'BP', 'MZR'],
    description: 'Mazda\'s rotary 13B engine, as found in the RX-7 FD, is uniquely lightweight and high-revving. We stock bridgeported and turbocharged configurations alongside the naturally-aspirated BP and MZR four-cylinders.',
  },
  {
    id: 'subaru',
    name: 'Subaru',
    country: 'Japan',
    engines: ['EJ20', 'EJ25', 'FA20'],
    description: 'Subaru\'s horizontally-opposed EJ engines power the iconic Impreza WRX and STI rally machines. The EJ20 and EJ25 have an enormous aftermarket, from simple service items through to full-built race engines.',
  },
];

// ─────────────────────────────────────────────
// ENGINES
// ─────────────────────────────────────────────

export const PRIORITY_ENGINES = [
  { label: 'Toyota 2JZ', code: '2JZ-GTE', variants: '2JZ-GTE / 2JZ-GE' },
  { label: 'Nissan RB25', code: 'RB25DET', variants: 'RB25DET / RB25DET NEO' },
  { label: 'Nissan RB26', code: 'RB26DETT', variants: 'RB26DETT' },
];

export const ENGINES: Engine[] = [
  {
    code: '2JZ-GTE',
    name: 'Toyota 2JZ-GTE',
    make: 'toyota',
    displacement: '3.0 litre',
    config: 'Inline-6, DOHC, 24v',
    power: '280 bhp (stock, Japan)',
    torque: '432 Nm (stock)',
    induction: 'Sequential twin-turbo (CT20A/CT20B)',
    commonChassis: ['JZA80 Supra', 'JZZ30/JZZ31 Soarer', 'JZX100/110 Chaser', 'UZZ31/32 Soarer', 'IS300 Altezza'],
    commonFailures: ['Boost solenoid failure', 'IACV issues', 'VVT-i oil port blockage (VVT variant)', 'FFIM cracking (early models)'],
    upgradePaths: ['Upgraded intercooler', 'Single-turbo conversion (GT35R, GTX35, Precision)', 'Forged internals (Manley, CP, JE)', 'Port and polish head', 'E85 fuelling', '800–1,500+ bhp potential'],
    seoTitle: '2JZ-GTE Engine for Sale UK | Complete Engines, Parts & Packages',
    seoDescription: 'Buy used JDM, reconditioned and rebuilt Toyota 2JZ-GTE engines in the UK. Engine packages, turbo upgrades, internals and workshop fitting available. All prices in GBP inc. VAT.',
  },
  {
    code: '2JZ-GE',
    name: 'Toyota 2JZ-GE',
    make: 'toyota',
    displacement: '3.0 litre',
    config: 'Inline-6, DOHC, 24v',
    power: '215 bhp (stock)',
    torque: '280 Nm (stock)',
    induction: 'Naturally aspirated',
    commonChassis: ['JZA80 Supra (non-turbo)', 'JZS147/161 Aristo', 'IS300 Altezza', 'GS300'],
    commonFailures: ['VVT-i camshaft gear wear', 'Oil pressure sensor failure', 'Cooling system degradation'],
    upgradePaths: ['Turbo conversion (using 2JZ-GTE head)', 'VVT-i cam swap', 'Single throttle body conversion', 'Supercharger kit'],
    seoTitle: '2JZ-GE Engine for Sale UK | NA & Turbo Converted Units',
    seoDescription: 'Toyota 2JZ-GE naturally-aspirated engines for sale in the UK. Used JDM imports and turbo-conversion builds. Parts and packages available.',
  },
  {
    code: '1JZ-GTE',
    name: 'Toyota 1JZ-GTE',
    make: 'toyota',
    displacement: '2.5 litre',
    config: 'Inline-6, DOHC, 24v',
    power: '276 bhp (stock)',
    torque: '363 Nm (stock)',
    induction: 'Single turbo (CT15B) or twin-turbo (early)',
    commonChassis: ['JZX90/100 Chaser', 'JZX100/110 Mark II', 'JZZ30 Soarer', 'JZX100 Cresta'],
    commonFailures: ['Power steering pump failure', 'Boost solenoid wear', 'Intercooler pipe cracking', 'MAP sensor failure'],
    upgradePaths: ['Larger single turbo', 'Forged internals', 'Uprated fuelling', 'Big-port head'],
    seoTitle: '1JZ-GTE Engine for Sale UK | Chaser & Mark II Specialist',
    seoDescription: 'Used JDM and reconditioned Toyota 1JZ-GTE engines for sale in the UK. Single and twin-turbo variants. Parts, packages and fitting available.',
  },
  {
    code: 'RB26DETT',
    name: 'Nissan RB26DETT',
    make: 'nissan',
    displacement: '2.6 litre',
    config: 'Inline-6, DOHC, 24v',
    power: '276 bhp (restricted stock)',
    torque: '353 Nm (stock)',
    induction: 'Twin-turbo (RB26 T2)',
    commonChassis: ['BNR32 Skyline GT-R', 'BCNR33 Skyline GT-R', 'BNR34 Skyline GT-R'],
    commonFailures: ['Ignition system wear (6x coil packs)', 'Oil feed to turbos deterioration', 'Boost control solenoid', 'Throttle body sync drift'],
    upgradePaths: ['Large single-turbo (GT35, GTX40, Precision 6266)', 'Forged stroker kit (2.8–3.0L)', 'Nismo 600 / R1 heads', 'Tomei/BC stroker rods', '1,000+ bhp achievable'],
    seoTitle: 'RB26DETT Engine for Sale UK | GT-R Specialist Parts & Engines',
    seoDescription: 'Buy Nissan RB26DETT engines in the UK – used JDM, reconditioned and fully rebuilt. GT-R R32, R33, R34 specialist. Engine packages and parts.',
  },
  {
    code: 'RB25DET',
    name: 'Nissan RB25DET',
    make: 'nissan',
    displacement: '2.5 litre',
    config: 'Inline-6, DOHC, 24v',
    power: '247 bhp (stock)',
    torque: '289 Nm (stock)',
    induction: 'Single turbo (T28)',
    commonChassis: ['R33/R34 Skyline (non-GT-R)', 'C35 Laurel', 'A33 Cefiro', 'S2 Stagea'],
    commonFailures: ['Crank angle sensor failure', 'Boost solenoid', 'IACV cleaning', 'Cam seal leaks'],
    upgradePaths: ['T3/T4 turbo upgrade', 'RB25 NEO head on RB25 block', 'Forged internals for 500+ bhp', 'RB26 head conversion'],
    seoTitle: 'RB25DET Engine for Sale UK | Skyline & Drift Engine Specialist',
    seoDescription: 'Nissan RB25DET engines for sale in the UK. Used JDM imports, reconditioned and built engines. Skyline, Laurel and drift builds. Parts and packages.',
  },
  {
    code: 'RB20DET',
    name: 'Nissan RB20DET',
    make: 'nissan',
    displacement: '2.0 litre',
    config: 'Inline-6, DOHC, 24v',
    power: '212 bhp (stock)',
    torque: '245 Nm (stock)',
    induction: 'Single turbo',
    commonChassis: ['R32 Skyline GTS', 'R32 Skyline GTS-t', 'C33 Laurel'],
    commonFailures: ['Cam seal leaks', 'CAS seal', 'Oil pressure sender'],
    upgradePaths: ['Larger turbo', 'RB25 head conversion', 'Forged bottom end'],
    seoTitle: 'RB20DET Engine for Sale UK | R32 Skyline Specialist',
    seoDescription: 'Nissan RB20DET engines, parts and upgrade kits for sale in the UK. R32 Skyline specialist.',
  },
  {
    code: 'SR20DET',
    name: 'Nissan SR20DET',
    make: 'nissan',
    displacement: '2.0 litre',
    config: 'Inline-4, DOHC, 16v',
    power: '205 bhp (stock)',
    torque: '275 Nm (stock)',
    induction: 'Single turbo (T25 or T28)',
    commonChassis: ['S13 Silvia', 'S14 Silvia', 'S15 Silvia', '180SX', 'PS13'],
    commonFailures: ['Oil pump failure (high-mileage)', 'Crank angle sensor', 'Boost control solenoid', 'Coolant crossover pipe'],
    upgradePaths: ['T28/GT28 upgrade', 'Tomei/Tomei Forged internals', 'SARD fuel rail and injectors', 'Full-race SR20DET builds to 500 bhp'],
    seoTitle: 'SR20DET Engine for Sale UK | Silvia & 180SX Specialist',
    seoDescription: 'Nissan SR20DET engines, parts and drift kits for sale in the UK. Silvia S13, S14, S15 and 180SX specialist.',
  },
  {
    code: '4G63',
    name: 'Mitsubishi 4G63',
    make: 'mitsubishi',
    displacement: '2.0 litre',
    config: 'Inline-4, DOHC, 16v',
    power: '276 bhp (Evo 9 stock)',
    torque: '343 Nm (stock)',
    induction: 'Single turbo (TD05H)',
    commonChassis: ['Lancer Evolution I–IX', 'Eclipse (USDM)', 'Galant VR-4'],
    commonFailures: ['Head gasket failure (Evo 8+)', 'Balance shaft belt', 'MIVEC solenoid (Evo 9)'],
    upgradePaths: ['Larger turbo (Evo 9 TD06SH, Garrett, Precision)', 'Forged rods and pistons', 'Ported head', '1,000 bhp capable on built block'],
    seoTitle: '4G63 Engine for Sale UK | Evo Specialist Parts & Engines',
    seoDescription: 'Mitsubishi 4G63 engines, parts and packages for Lancer Evolution builds in the UK. Used JDM imports and fully rebuilt units.',
  },
  {
    code: 'EJ20',
    name: 'Subaru EJ20',
    make: 'subaru',
    displacement: '2.0 litre',
    config: 'Flat-4 (Boxer), DOHC',
    power: '280 bhp (WRX STI stock)',
    torque: '363 Nm (stock)',
    induction: 'Single turbo (IHI VF28/VF34)',
    commonChassis: ['GC8 Impreza WRX STI', 'GDB Impreza WRX STI', 'GRB Impreza WRX STI'],
    commonFailures: ['Head gasket failure (Phase I)', 'Ringland failure (high boost)', 'AVCS solenoid wear'],
    upgradePaths: ['EJ25 stroker conversion', 'TD05/VF39 turbo upgrade', 'STI short-block swap', 'Cosworth built block'],
    seoTitle: 'EJ20 Engine for Sale UK | Subaru Impreza WRX STI Specialist',
    seoDescription: 'Subaru EJ20 engines and parts for sale in the UK. WRX and STI specialist. Used JDM imports and rebuilt units.',
  },
];

// ─────────────────────────────────────────────
// CHASSIS
// ─────────────────────────────────────────────

export const CHASSIS: ChassisModel[] = [
  { code: 'JZA80', name: 'Toyota Supra (A80)', make: 'toyota', years: '1993–2002', engines: ['2JZ-GTE', '2JZ-GE'] },
  { code: 'JZZ30', name: 'Toyota Soarer (Z30)', make: 'toyota', years: '1991–2000', engines: ['1JZ-GTE', '2JZ-GTE', '2JZ-GE'] },
  { code: 'JZX100', name: 'Toyota Chaser (X100)', make: 'toyota', years: '1996–2001', engines: ['1JZ-GTE', '2JZ-GE'] },
  { code: 'JZX90', name: 'Toyota Chaser (X90)', make: 'toyota', years: '1992–1996', engines: ['1JZ-GTE'] },
  { code: 'JZX110', name: 'Toyota Mark II (X110)', make: 'toyota', years: '2000–2004', engines: ['1JZ-GTE'] },
  { code: 'BNR32', name: 'Nissan Skyline GT-R (R32)', make: 'nissan', years: '1989–1994', engines: ['RB26DETT'] },
  { code: 'BCNR33', name: 'Nissan Skyline GT-R (R33)', make: 'nissan', years: '1995–1998', engines: ['RB26DETT'] },
  { code: 'BNR34', name: 'Nissan Skyline GT-R (R34)', make: 'nissan', years: '1999–2002', engines: ['RB26DETT'] },
  { code: 'ENR33', name: 'Nissan Skyline (R33 non-GT-R)', make: 'nissan', years: '1993–1998', engines: ['RB25DET', 'RB20DET'] },
  { code: 'ER34', name: 'Nissan Skyline (R34 non-GT-R)', make: 'nissan', years: '1998–2002', engines: ['RB25DET'] },
  { code: 'S13', name: 'Nissan Silvia / 180SX (S13)', make: 'nissan', years: '1988–1994', engines: ['SR20DET', 'CA18DET'] },
  { code: 'S14', name: 'Nissan Silvia (S14)', make: 'nissan', years: '1993–1998', engines: ['SR20DET'] },
  { code: 'S15', name: 'Nissan Silvia (S15)', make: 'nissan', years: '1999–2002', engines: ['SR20DET'] },
  { code: 'CE9A', name: 'Mitsubishi Lancer Evo IV', make: 'mitsubishi', years: '1996–1998', engines: ['4G63'] },
  { code: 'CT9A', name: 'Mitsubishi Lancer Evo VII–IX', make: 'mitsubishi', years: '2001–2007', engines: ['4G63'] },
  { code: 'GC8', name: 'Subaru Impreza WRX/STI (GC)', make: 'subaru', years: '1992–2000', engines: ['EJ20'] },
  { code: 'GDB', name: 'Subaru Impreza WRX STI (GDB)', make: 'subaru', years: '2000–2007', engines: ['EJ20'] },
];

// ─────────────────────────────────────────────
// PART CATEGORIES
// ─────────────────────────────────────────────

export const PART_CATEGORIES: PartCategory[] = [
  {
    id: 'engine-packages',
    name: 'Engine Packages',
    description: 'Pre-bundled ready-to-fit engine packages for every JDM platform. Engine-only through to full swap packages with gearbox, ECU, wiring loom, cooling and fuelling.',
    subcategories: [
      { id: 'engine-only', name: 'Engine Only', description: 'Complete engine units' },
      { id: 'engine-gearbox', name: 'Engine + Gearbox', description: 'Matched engine and gearbox combinations' },
      { id: 'engine-ecu-loom', name: 'Engine + ECU + Loom', description: 'Ready to run with engine management' },
      { id: 'full-swap', name: 'Full Swap Package', description: 'Everything needed for a complete engine swap' },
      { id: 'built-performance', name: 'Rebuilt / Performance Package', description: 'Forged internals, upgraded turbo and supporting mods' },
    ],
    featuredEngines: ['2JZ-GTE', 'RB26DETT', 'RB25DET', '1JZ-GTE', 'SR20DET'],
  },
  {
    id: 'complete-engines',
    name: 'Complete Engines',
    description: 'Used JDM imports, reconditioned and fully rebuilt engines. Options: engine only, engine with gearbox, engine with ECU and loom.',
    subcategories: [
      { id: 'used-jdm', name: 'Used JDM Import', description: 'Direct JDM import engines with mileage and grade' },
      { id: 'reconditioned', name: 'Reconditioned', description: 'Professionally reconditioned to OEM specification' },
      { id: 'rebuilt', name: 'Rebuilt', description: 'Fully rebuilt with new OEM or performance components' },
    ],
    featuredEngines: ['2JZ-GTE', 'RB26DETT', 'RB25DET', 'SR20DET', '4G63'],
  },
  {
    id: 'engine-internals',
    name: 'Engine Internals',
    description: 'Conrods, pistons, crankshafts, bearings, rings, engine kits, oil pumps, gasket sets, studs and bolts.',
    subcategories: [
      { id: 'pistons', name: 'Pistons & Rings', description: '' },
      { id: 'connecting-rods', name: 'Connecting Rods', description: '' },
      { id: 'crankshafts', name: 'Crankshafts & Stroker Kits', description: '' },
      { id: 'bearings', name: 'Bearings', description: '' },
      { id: 'engine-kits', name: 'Engine Build Kits', description: '' },
      { id: 'oil-pumps', name: 'Oil Pumps', description: '' },
      { id: 'gasket-sets', name: 'Gasket Sets', description: '' },
      { id: 'studs-bolts', name: 'Head Studs & Fasteners', description: '' },
    ],
    featuredEngines: ['2JZ-GTE', 'RB26DETT', 'SR20DET', '4G63'],
  },
  {
    id: 'cylinder-head',
    name: 'Cylinder Head & Valvetrain',
    description: 'Cylinder heads, camshafts, valves, springs, lifters, VVT-i parts, timing belts/chains and tensioners.',
    subcategories: [
      { id: 'cylinder-heads', name: 'Cylinder Heads', description: '' },
      { id: 'camshafts', name: 'Camshafts', description: '' },
      { id: 'valves-springs', name: 'Valves & Springs', description: '' },
      { id: 'vvt-parts', name: 'VVT-i / VVTL-i Parts', description: '' },
      { id: 'timing', name: 'Timing Belts, Chains & Tensioners', description: '' },
    ],
    featuredEngines: ['2JZ-GTE', '1JZ-GTE', 'RB26DETT'],
  },
  {
    id: 'turbo-induction',
    name: 'Turbo & Forced Induction',
    description: 'Turbochargers, manifolds, wastegates, blow-off valves, intercoolers, boost controllers, charge pipes, downpipes, oil and water lines.',
    subcategories: [
      { id: 'turbochargers', name: 'Turbochargers', description: '' },
      { id: 'turbo-manifolds', name: 'Turbo Manifolds', description: '' },
      { id: 'wastegates', name: 'External Wastegates & Actuators', description: '' },
      { id: 'blow-off-valves', name: 'Blow-off Valves & BOVs', description: '' },
      { id: 'intercoolers', name: 'Intercoolers & Charge Pipes', description: '' },
      { id: 'boost-controllers', name: 'Boost Controllers', description: '' },
      { id: 'downpipes', name: 'Downpipes', description: '' },
      { id: 'turbo-oil-lines', name: 'Turbo Oil & Water Lines', description: '' },
    ],
    featuredEngines: ['2JZ-GTE', 'RB26DETT', 'SR20DET', '4G63', 'EJ20'],
  },
  {
    id: 'fuel-system',
    name: 'Fuel System',
    description: 'Injectors, fuel pumps, rails, regulators, surge tanks, lines and fittings.',
    subcategories: [
      { id: 'injectors', name: 'Fuel Injectors', description: '' },
      { id: 'fuel-pumps', name: 'Fuel Pumps', description: '' },
      { id: 'fuel-rails', name: 'Fuel Rails & Regulators', description: '' },
      { id: 'surge-tanks', name: 'Surge Tanks', description: '' },
      { id: 'fuel-lines', name: 'Fuel Lines & Fittings', description: '' },
    ],
    featuredEngines: ['2JZ-GTE', 'RB26DETT', 'SR20DET'],
  },
  {
    id: 'ignition-ecu',
    name: 'Ignition, ECU & Electronics',
    description: 'Stock and standalone ECUs, coil packs, spark plugs, sensors, wiring looms and gauges.',
    subcategories: [
      { id: 'standalone-ecu', name: 'Standalone ECUs', description: '' },
      { id: 'oem-ecu', name: 'OEM / Stock ECUs', description: '' },
      { id: 'coils-plugs', name: 'Coil Packs & Spark Plugs', description: '' },
      { id: 'sensors', name: 'Sensors', description: '' },
      { id: 'wiring-looms', name: 'Wiring Looms & Conversion Harnesses', description: '' },
      { id: 'gauges', name: 'Gauges & Data Logging', description: '' },
    ],
    featuredEngines: ['2JZ-GTE', 'RB26DETT', 'SR20DET'],
  },
  {
    id: 'tcu-transmission',
    name: 'TCU / Transmission Controllers',
    description: 'Transmission control units for automatic gearboxes and standalone controllers. Subcategories: Standalone TCUs, OEM TCUs, Wiring Harnesses, Solenoids, Valve Bodies, Paddle Shift.',
    subcategories: [
      { id: 'standalone-tcu', name: 'Standalone TCUs', description: '' },
      { id: 'oem-tcu', name: 'OEM / Genuine TCUs', description: '' },
      { id: 'tcu-harnesses', name: 'Wiring Harnesses & Plug-and-Play Looms', description: '' },
      { id: 'solenoids-sensors', name: 'Solenoids & Sensors', description: '' },
      { id: 'valve-bodies', name: 'Valve Bodies & Accessories', description: '' },
      { id: 'paddle-shift', name: 'Paddle Shift & Control Switches', description: '' },
    ],
    featuredEngines: ['2JZ-GTE', 'RB26DETT', '1JZ-GTE'],
  },
  {
    id: 'gearbox-kits',
    name: 'Gearbox Kits',
    description: 'Complete gearbox and conversion kits for Japanese engine builds. Rebuild kits, upgrade kits, conversion kits, clutch and flywheel kits.',
    subcategories: [
      { id: 'rebuild-kits', name: 'Gearbox Rebuild Kits', description: 'Bearings, seals, synchros and hardware' },
      { id: 'upgrade-kits', name: 'Gearbox Upgrade Kits', description: 'Uprated gears, LSD kits, shift kits' },
      { id: 'conversion-kits', name: 'Gearbox Conversion Kits', description: 'Bellhousing adapters, mounts, driveshaft kits' },
      { id: 'clutch-flywheel', name: 'Clutch & Flywheel Kits', description: 'Stage 1–3 and twin-plate clutch kits' },
      { id: 'complete-gearbox', name: 'Complete Gearbox Packages', description: 'Gearbox with matching clutch, flywheel and mounts' },
    ],
    featuredEngines: ['2JZ-GTE', 'RB26DETT', 'SR20DET', '4G63'],
  },
  {
    id: 'cooling-lubrication',
    name: 'Cooling & Lubrication',
    description: 'Radiators, oil coolers, water pumps, thermostats, hoses, silicone kits, oils and filters.',
    subcategories: [
      { id: 'radiators', name: 'Radiators', description: '' },
      { id: 'oil-coolers', name: 'Oil Coolers', description: '' },
      { id: 'water-pumps', name: 'Water Pumps & Thermostats', description: '' },
      { id: 'hoses-silicone', name: 'Hoses & Silicone Kits', description: '' },
      { id: 'oils-filters', name: 'Engine Oils & Filters', description: '' },
    ],
    featuredEngines: ['2JZ-GTE', 'RB26DETT'],
  },
  {
    id: 'exhaust',
    name: 'Exhaust',
    description: 'Manifolds, headers, downpipes, cat-back systems, collectors in stainless, Inconel and titanium.',
    subcategories: [
      { id: 'exhaust-manifolds', name: 'Exhaust Manifolds & Headers', description: '' },
      { id: 'downpipes-collectors', name: 'Downpipes & Collectors', description: '' },
      { id: 'cat-back', name: 'Cat-back Systems', description: '' },
    ],
    featuredEngines: ['2JZ-GTE', 'RB26DETT', 'SR20DET'],
  },
  {
    id: 'drivetrain',
    name: 'Drivetrain',
    description: 'Differentials, driveshafts, propshafts, axles, driveshaft adapters, engine and gearbox mounts.',
    subcategories: [
      { id: 'differentials', name: 'Differentials & LSD', description: '' },
      { id: 'driveshafts', name: 'Driveshafts & Propshafts', description: '' },
      { id: 'mounts', name: 'Engine & Gearbox Mounts', description: '' },
      { id: 'driveshaft-adapters', name: 'Driveshaft Adapters', description: '' },
    ],
    featuredEngines: ['2JZ-GTE', 'RB26DETT', 'SR20DET'],
  },
  {
    id: 'used-jdm-parts',
    name: 'Used & Genuine JDM Parts',
    description: 'Graded and photographed genuine JDM parts with mileage where known.',
    subcategories: [
      { id: 'genuine-jdm', name: 'Genuine JDM Parts', description: '' },
      { id: 'graded-used', name: 'Graded Used Parts', description: '' },
    ],
    featuredEngines: ['2JZ-GTE', 'RB26DETT', 'SR20DET', '4G63'],
  },
  {
    id: 'new-parts',
    name: 'New Parts',
    description: 'OEM genuine and aftermarket performance parts from leading brands.',
    subcategories: [
      { id: 'oem-genuine', name: 'OEM / Genuine New Parts', description: '' },
      { id: 'aftermarket-performance', name: 'Aftermarket Performance', description: '' },
    ],
    featuredEngines: ['2JZ-GTE', 'RB26DETT', 'RB25DET', 'SR20DET', '4G63'],
  },
  {
    id: 'accessories',
    name: 'Accessories & Consumables',
    description: 'Gaskets, seals, hardware, clamps, tools and consumables.',
    subcategories: [
      { id: 'gaskets-seals', name: 'Gaskets & Seals', description: '' },
      { id: 'hardware', name: 'Hardware & Fasteners', description: '' },
      { id: 'tools', name: 'Tools & Workshop Supplies', description: '' },
    ],
    featuredEngines: [],
  },
];

// ─────────────────────────────────────────────
// SAMPLE PRODUCTS (placeholder data – replace with real stock)
// ─────────────────────────────────────────────

export const SAMPLE_PRODUCTS: JdmProduct[] = [
  // 2JZ-GTE
  {
    id: 1001,
    sku: 'JDM-2JZ-ENG-001',
    partNumber: 'TOY-2JZ-GTE-STK',
    title: 'Toyota 2JZ-GTE Complete Engine – Used JDM Import (Low Mileage)',
    shortTitle: '2JZ-GTE Used JDM Engine',
    brand: 'Toyota Genuine',
    make: 'toyota',
    engines: ['2JZ-GTE'],
    chassis: ['JZA80', 'JZZ30', 'JZX100'],
    categoryId: 'complete-engines',
    subcategoryId: 'used-jdm',
    condition: 'Used JDM',
    priceIncVat: 2999.00,
    priceExVat: 2499.17,
    wasPrice: null,
    inStock: true,
    stockCount: 3,
    stockStatus: 'In Stock',
    mileage: 62000,
    warranty: '3 Months',
    depositPct: 10,
    rating: 4.8,
    reviewCount: 24,
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80',
    images: [],
    isFeatured: true,
    isPopular: true,
    isNewArrival: false,
    isBestSeller: true,
    specifications: {
      'Displacement': '3.0 litre (2,997 cc)',
      'Configuration': 'Inline-6, DOHC, 24v',
      'Induction': 'Sequential Twin-Turbo',
      'Power (stock)': '280 bhp',
      'Torque (stock)': '432 Nm',
      'Mileage': '62,000 km',
      'Import Grade': '4/5',
      'Compression Test': 'TODO – results added on dispatch',
      'Warranty': '3 Months Parts & Labour',
    },
    searchTerms: '2jz gte engine toyota supra soarer chaser jza80 jzz30 inline six twin turbo jdm import',
    description: 'Direct JDM import Toyota 2JZ-GTE complete engine unit. Recorded mileage of 62,000 km. Compression tested before dispatch. Supplied with timing cover, alternator and air conditioning compressor brackets. Suitable for JZA80 Supra, JZZ30/31 Soarer, JZX100 Chaser and compatible swap applications. **TODO: Insert compression test results and import documentation.**',
    seoTitle: '2JZ-GTE Used JDM Engine for Sale UK | From £2,999 Inc. VAT',
    seoDescription: 'Buy a used JDM Toyota 2JZ-GTE engine in the UK. Low-mileage import, compression tested, 3-month warranty. Supra, Soarer and Chaser fitment. 10% deposit secures.',
  },
  {
    id: 1002,
    sku: 'JDM-2JZ-TURBO-001',
    partNumber: 'GAR-GTX3576R-2JZ',
    title: 'Garrett GTX3576R Gen II Turbocharger – 2JZ-GTE / 1JZ-GTE',
    shortTitle: 'Garrett GTX3576R Turbo',
    brand: 'Garrett',
    make: 'toyota',
    engines: ['2JZ-GTE', '1JZ-GTE'],
    chassis: ['JZA80', 'JZZ30', 'JZX100'],
    categoryId: 'turbo-induction',
    subcategoryId: 'turbochargers',
    condition: 'New',
    priceIncVat: 1249.00,
    priceExVat: 1040.83,
    wasPrice: 1399.00,
    inStock: true,
    stockCount: 2,
    stockStatus: 'In Stock',
    warranty: '12 Months',
    depositPct: 10,
    rating: 4.9,
    reviewCount: 18,
    image: 'https://images.unsplash.com/photo-1558981359-219d6364c9c8?auto=format&fit=crop&w=600&q=80',
    images: [],
    isFeatured: true,
    isPopular: true,
    isNewArrival: false,
    isBestSeller: true,
    specifications: {
      'Compressor Wheel': '57.65 / 82 mm',
      'Turbine Wheel': '60.65 / 68 mm',
      'Housing': '.82 A/R T3 inlet',
      'Power Potential': '600–700 bhp',
      'Bearing Type': 'GTX Dual Ball Bearing',
      'Warranty': '12 Months',
    },
    searchTerms: 'garrett gtx3576r turbo 2jz gte supra chaser soarer single turbo conversion upgrade',
    description: 'Garrett GTX3576R Gen II ball-bearing turbocharger, ideal for 2JZ-GTE single-turbo conversion builds targeting 600–700 bhp. T3 inlet flange, .82 A/R turbine housing. Compatible with purpose-made 2JZ manifolds (sold separately). Suitable for Supra, Soarer, Chaser and swap applications.',
    seoTitle: 'Garrett GTX3576R Turbo for 2JZ-GTE UK | Single Turbo Upgrade',
    seoDescription: 'Buy Garrett GTX3576R turbocharger for 2JZ-GTE in the UK. Ball-bearing, 600–700 bhp capable. Supra and Chaser single-turbo conversion. 12-month warranty.',
  },
  {
    id: 1003,
    sku: 'JDM-2JZ-RODS-001',
    partNumber: 'MAN-2JZ-RODS-625',
    title: 'Manley H-Beam Connecting Rod Set – Toyota 2JZ (625 HP Rating)',
    shortTitle: 'Manley H-Beam Rods – 2JZ',
    brand: 'Manley',
    make: 'toyota',
    engines: ['2JZ-GTE', '2JZ-GE'],
    chassis: ['JZA80', 'JZZ30', 'JZX100'],
    categoryId: 'engine-internals',
    subcategoryId: 'connecting-rods',
    condition: 'New',
    priceIncVat: 599.00,
    priceExVat: 499.17,
    wasPrice: null,
    inStock: true,
    stockCount: 6,
    stockStatus: 'In Stock',
    warranty: '12 Months',
    depositPct: 10,
    rating: 4.9,
    reviewCount: 31,
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80',
    images: [],
    isFeatured: false,
    isPopular: true,
    isNewArrival: false,
    isBestSeller: true,
    specifications: {
      'Material': '4340 Chromoly Steel',
      'Design': 'H-Beam',
      'HP Rating': '625 bhp',
      'Bolts': 'ARP 8740 Cap Screws',
      'Quantity': '6-piece set',
      'Bearing Width': 'Stock',
      'Warranty': '12 Months',
    },
    searchTerms: 'manley h-beam connecting rods 2jz gte toyota supra conrods forged internals',
    description: 'Manley H-Beam connecting rods for Toyota 2JZ-GTE and 2JZ-GE. 4340 chromoly steel construction rated to 625 bhp. Supplied as a 6-piece set with ARP 8740 cap screws. Essential for builds beyond stock power. Fits standard pin and bearing dimensions.',
    seoTitle: 'Manley H-Beam Rods for Toyota 2JZ | 2JZ-GTE Connecting Rods UK',
    seoDescription: 'Manley H-Beam connecting rod set for Toyota 2JZ-GTE UK. 625 bhp rated, ARP bolts. Supra and Chaser engine builds. In stock.',
  },
  // RB26DETT
  {
    id: 2001,
    sku: 'JDM-RB26-ENG-001',
    partNumber: 'NIS-RB26-DETT-STK',
    title: 'Nissan RB26DETT Complete Engine – Used JDM Import (BNR34 R34 GT-R)',
    shortTitle: 'RB26DETT Used JDM Engine',
    brand: 'Nissan Genuine',
    make: 'nissan',
    engines: ['RB26DETT'],
    chassis: ['BNR32', 'BCNR33', 'BNR34'],
    categoryId: 'complete-engines',
    subcategoryId: 'used-jdm',
    condition: 'Used JDM',
    priceIncVat: 5499.00,
    priceExVat: 4582.50,
    wasPrice: null,
    inStock: true,
    stockCount: 1,
    stockStatus: 'In Stock',
    mileage: 48000,
    warranty: '3 Months',
    depositPct: 10,
    rating: 4.9,
    reviewCount: 12,
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80',
    images: [],
    isFeatured: true,
    isPopular: true,
    isNewArrival: false,
    isBestSeller: false,
    specifications: {
      'Displacement': '2.6 litre (2,568 cc)',
      'Configuration': 'Inline-6, DOHC, 24v',
      'Induction': 'Twin-Turbo (RB26)',
      'Power (stock)': '276 bhp (restricted)',
      'Torque (stock)': '353 Nm',
      'Source': 'BNR34 R34 Skyline GT-R',
      'Mileage': '48,000 km',
      'Import Grade': '5/5',
      'Warranty': '3 Months',
    },
    searchTerms: 'rb26dett engine nissan skyline gt-r r32 r33 r34 bnr34 bnr33 bnr32 inline six twin turbo jdm import',
    description: 'Sourced from a BNR34 R34 Skyline GT-R. Recorded mileage of 48,000 km. Grade 5/5. Full compression test results provided with dispatch documentation. Supplied with stock twin turbos, intake manifold and throttle bodies. **TODO: Insert compression test results and import paperwork.**',
    seoTitle: 'RB26DETT Engine for Sale UK | R34 GT-R JDM Import',
    seoDescription: 'Buy a used JDM Nissan RB26DETT engine in the UK. R34 GT-R sourced, 48k km, Grade 5. 3-month warranty. 10% deposit secures your order.',
  },
  {
    id: 2002,
    sku: 'JDM-RB25-ENG-001',
    partNumber: 'NIS-RB25-DET-STK',
    title: 'Nissan RB25DET NEO Complete Engine – Used JDM Import',
    shortTitle: 'RB25DET NEO Used JDM Engine',
    brand: 'Nissan Genuine',
    make: 'nissan',
    engines: ['RB25DET'],
    chassis: ['ENR33', 'ER34', 'BCNR33'],
    categoryId: 'complete-engines',
    subcategoryId: 'used-jdm',
    condition: 'Used JDM',
    priceIncVat: 1899.00,
    priceExVat: 1582.50,
    wasPrice: null,
    inStock: true,
    stockCount: 4,
    stockStatus: 'In Stock',
    mileage: 75000,
    warranty: '3 Months',
    depositPct: 10,
    rating: 4.7,
    reviewCount: 19,
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80',
    images: [],
    isFeatured: false,
    isPopular: true,
    isNewArrival: false,
    isBestSeller: true,
    specifications: {
      'Displacement': '2.5 litre (2,498 cc)',
      'Configuration': 'Inline-6, DOHC, 24v',
      'Induction': 'Single Turbo (T28)',
      'Power (stock)': '247 bhp',
      'Variant': 'NEO (Series 2)',
      'Mileage': '75,000 km',
      'Warranty': '3 Months',
    },
    searchTerms: 'rb25det neo engine nissan skyline r33 r34 laurel single turbo jdm import',
    description: 'Nissan RB25DET NEO (Series 2) complete engine. Used JDM import with 75,000 km. Supplied with standard turbo, intake manifold and exhaust manifold. Suitable for R33/R34 Skyline (non-GT-R), C35 Laurel, A33 Cefiro and swap builds. **TODO: Compression test data to be added.**',
    seoTitle: 'RB25DET NEO Engine for Sale UK | Skyline R33 R34 Specialist',
    seoDescription: 'Buy a Nissan RB25DET NEO engine in the UK. Used JDM import, 75k km, 3-month warranty. R33 R34 Skyline specialist. 10% deposit.',
  },
  {
    id: 2003,
    sku: 'JDM-SR20-ENG-001',
    partNumber: 'NIS-SR20-DET-STK',
    title: 'Nissan SR20DET Engine – Used JDM Import (S14 Silvia)',
    shortTitle: 'SR20DET Used JDM Engine',
    brand: 'Nissan Genuine',
    make: 'nissan',
    engines: ['SR20DET'],
    chassis: ['S13', 'S14', 'S15'],
    categoryId: 'complete-engines',
    subcategoryId: 'used-jdm',
    condition: 'Used JDM',
    priceIncVat: 1299.00,
    priceExVat: 1082.50,
    wasPrice: null,
    inStock: true,
    stockCount: 5,
    stockStatus: 'In Stock',
    mileage: 82000,
    warranty: '3 Months',
    depositPct: 10,
    rating: 4.6,
    reviewCount: 33,
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80',
    images: [],
    isFeatured: false,
    isPopular: true,
    isNewArrival: false,
    isBestSeller: true,
    specifications: {
      'Displacement': '2.0 litre (1,998 cc)',
      'Configuration': 'Inline-4, DOHC, 16v',
      'Induction': 'Single Turbo (T28)',
      'Power (stock)': '205 bhp',
      'Source': 'S14 Silvia (Japan)',
      'Mileage': '82,000 km',
      'Warranty': '3 Months',
    },
    searchTerms: 'sr20det engine nissan silvia 180sx s13 s14 s15 drift engine single turbo jdm import',
    description: 'Used JDM Nissan SR20DET complete engine, sourced from a Japanese S14 Silvia with 82,000 km. Supplied with stock T28 turbo, intake manifold and exhaust manifold. Popular drift and circuit build engine. Suitable for S13, S14 and S15 Silvia plus 180SX. **TODO: Compression test results to be added.**',
    seoTitle: 'SR20DET Engine for Sale UK | Silvia S14 Drift Engine JDM',
    seoDescription: 'Buy a Nissan SR20DET engine in the UK. JDM import from S14 Silvia, 82k km, 3-month warranty. Drift and circuit specialist. 10% deposit.',
  },
  // TCU
  {
    id: 3001,
    sku: 'JDM-TCU-2JZ-A340-001',
    partNumber: 'PNP-TCU-2JZ-A340',
    title: 'Plug-and-Play Standalone TCU for Toyota A340 Automatic Gearbox – 2JZ Supra Compatible',
    shortTitle: 'Standalone TCU – 2JZ A340',
    brand: 'TODO: Brand',
    make: 'toyota',
    engines: ['2JZ-GTE', '2JZ-GE', '1JZ-GTE'],
    chassis: ['JZA80', 'JZZ30'],
    categoryId: 'tcu-transmission',
    subcategoryId: 'standalone-tcu',
    condition: 'New',
    priceIncVat: 649.00,
    priceExVat: 540.83,
    wasPrice: null,
    inStock: true,
    stockCount: 4,
    stockStatus: 'In Stock',
    warranty: '12 Months',
    depositPct: 10,
    rating: 4.7,
    reviewCount: 9,
    image: 'https://images.unsplash.com/photo-1558441719-234752600f58?auto=format&fit=crop&w=600&q=80',
    images: [],
    isFeatured: false,
    isPopular: false,
    isNewArrival: true,
    isBestSeller: false,
    specifications: {
      'Compatible Gearbox': 'Toyota A340E / A340F',
      'Compatible Engines': '2JZ-GTE, 2JZ-GE, 1JZ-GTE',
      'Shift Control': 'Adjustable shift points',
      'Lock-up Clutch': 'Fully controllable',
      'Launch Control': 'Yes',
      'Data Logging': 'Yes (via laptop/PC)',
      'Wiring': 'Plug-and-Play (OEM connector)',
      'Tuning Required': 'Basic calibration recommended',
      'Warranty': '12 Months',
    },
    searchTerms: 'standalone tcu transmission controller 2jz a340 automatic gearbox supra chaser soarer plug and play',
    description: 'Standalone TCU designed for the Toyota A340E/F automatic gearbox, fully compatible with 2JZ-GTE, 2JZ-GE and 1JZ-GTE engines. Plug-and-play OEM-connector wiring harness. Features: adjustable shift points, lock-up clutch control, launch control and data logging. Basic calibration recommended; full tuning guide supplied. **TODO: Confirm exact brand and verify compatibility list.**',
    seoTitle: 'Standalone TCU for Toyota A340 Gearbox | 2JZ Supra Compatible UK',
    seoDescription: 'Buy a standalone TCU for the Toyota A340 automatic gearbox in the UK. Plug-and-play, compatible with 2JZ-GTE Supra and Chaser. 12-month warranty.',
    gearboxType: 'A340E / A340F',
    controlFeatures: ['Adjustable shift points', 'Lock-up clutch control', 'Launch control', 'Data logging'],
    plugAndPlay: true,
    tuningRequired: false,
  },
  // Gearbox Kit
  {
    id: 4001,
    sku: 'JDM-GBX-2JZ-R154-001',
    partNumber: 'CONV-2JZ-R154-KIT',
    title: 'Toyota R154 Gearbox Conversion Kit – 2JZ-GTE Engine (Supra / Chaser)',
    shortTitle: '2JZ to R154 Gearbox Conversion Kit',
    brand: 'TODO: Brand',
    make: 'toyota',
    engines: ['2JZ-GTE', '2JZ-GE'],
    chassis: ['JZA80', 'JZX100'],
    categoryId: 'gearbox-kits',
    subcategoryId: 'conversion-kits',
    condition: 'New',
    priceIncVat: 899.00,
    priceExVat: 749.17,
    wasPrice: null,
    inStock: true,
    stockCount: 3,
    stockStatus: 'In Stock',
    warranty: '12 Months',
    depositPct: 10,
    rating: 4.6,
    reviewCount: 7,
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80',
    images: [],
    isFeatured: false,
    isPopular: false,
    isNewArrival: true,
    isBestSeller: false,
    specifications: {
      'Gearbox': 'Toyota R154 (5-speed manual)',
      'Compatible Engines': '2JZ-GTE, 2JZ-GE',
      'Drive Type': 'RWD',
      'Torque Rating': '540 Nm',
      'Includes': 'Bellhousing, flywheel, starter adapter, mount',
      'Build Notes': 'TODO: Custom driveshaft may be required',
      'Warranty': '12 Months',
    },
    searchTerms: 'r154 gearbox conversion kit 2jz gte toyota supra chaser bellhousing adapter flywheel',
    description: 'Complete conversion kit to mate the Toyota R154 5-speed manual gearbox to the 2JZ-GTE or 2JZ-GE engine. Kit includes bellhousing adapter plate, lightweight flywheel, starter motor adapter, gearbox crossmember and mount. Torque-rated to 540 Nm. **TODO: Confirm whether a custom driveshaft is required for specific chassis. Confirm exact brand.**',
    seoTitle: 'Toyota R154 Gearbox Conversion Kit for 2JZ-GTE UK | Supra & Chaser',
    seoDescription: 'Buy a Toyota R154 gearbox conversion kit for 2JZ-GTE in the UK. Bellhousing, flywheel, adapter and mount included. Supra and Chaser builds. 12-month warranty.',
    torqueRating: 540,
    driveType: 'RWD',
    gearboxType: 'R154',
  },
];

// ─────────────────────────────────────────────
// ENGINE PACKAGES (sample data)
// ─────────────────────────────────────────────

export const ENGINE_PACKAGES: EnginePackage[] = [
  {
    id: 'pkg-2jz-gte-used-jdm',
    engineCode: '2JZ-GTE',
    tier: 'Engine Only',
    title: '2JZ-GTE Engine Only – Used JDM Import',
    description: 'Complete used JDM 2JZ-GTE engine unit. Compression tested before dispatch. Suitable for Supra A80, Soarer, Chaser and swap builds.',
    includedItems: [
      { name: '2JZ-GTE Engine Block and Head Assembly', condition: 'Used JDM', quantity: 1 },
      { name: 'Stock Twin Turbos (CT20A/CT20B)', condition: 'Used JDM', quantity: 1, notes: 'Inspected and serviceable' },
      { name: 'Intake Manifold', condition: 'Used JDM', quantity: 1 },
      { name: 'Exhaust Manifold', condition: 'Used JDM', quantity: 1 },
      { name: 'Alternator', condition: 'Used JDM', quantity: 1 },
    ],
    condition: 'Used JDM',
    mileage: 62000,
    warranty: '3 Months Parts & Labour',
    priceIncVat: 2999.00,
    priceExVat: 2499.17,
    inStock: true,
    stockStatus: 'In Stock',
    fittingAvailable: true,
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
  },
  {
    id: 'pkg-2jz-gte-full-swap',
    engineCode: '2JZ-GTE',
    tier: 'Full Swap Package',
    title: '2JZ-GTE Full Swap Package – Engine, Gearbox, ECU & Loom',
    description: 'Everything you need for a complete 2JZ-GTE engine swap. Engine, R154 gearbox, stock ECU, wiring loom and essential ancillaries. Workshop fitting available.',
    includedItems: [
      { name: '2JZ-GTE Engine (Used JDM)', condition: 'Used JDM', quantity: 1, notes: '62,000 km, Grade 4' },
      { name: 'R154 5-Speed Manual Gearbox', condition: 'Used JDM', quantity: 1 },
      { name: 'Stock 2JZ ECU (JDM)', condition: 'Used JDM', quantity: 1 },
      { name: 'Engine Wiring Loom', condition: 'Used JDM', quantity: 1 },
      { name: 'Engine Mounts (application-specific)', condition: 'New', quantity: 1, notes: 'TODO – specify chassis' },
      { name: 'Gearbox Mount', condition: 'New', quantity: 1 },
    ],
    condition: 'Used JDM',
    mileage: 62000,
    warranty: '3 Months Parts & Labour',
    priceIncVat: 4499.00,
    priceExVat: 3749.17,
    inStock: true,
    stockStatus: 'In Stock',
    fittingAvailable: true,
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
  },
  {
    id: 'pkg-2jz-gte-built-perf',
    engineCode: '2JZ-GTE',
    tier: 'Rebuilt Performance Package',
    title: '2JZ-GTE Rebuilt Performance Package – 600 bhp Ready',
    description: 'Fully rebuilt 2JZ-GTE with forged internals, ported head and single-turbo setup. Dyno tested. Ready to install.',
    includedItems: [
      { name: '2JZ-GTE Block (bored and honed)', condition: 'Rebuilt', quantity: 1 },
      { name: 'Manley H-Beam Connecting Rods', condition: 'New', quantity: 6 },
      { name: 'CP Forged Pistons (8.5:1 CR)', condition: 'New', quantity: 6 },
      { name: 'ACL Race Bearings', condition: 'New', quantity: 1, notes: 'Full set' },
      { name: 'Cometic MLS Head Gasket', condition: 'New', quantity: 1 },
      { name: 'ARP Head Studs', condition: 'New', quantity: 1 },
      { name: 'Ported and Polished Cylinder Head', condition: 'Rebuilt', quantity: 1 },
      { name: 'HKS 272° Camshafts', condition: 'New', quantity: 2 },
      { name: 'Garrett GTX3576R Turbocharger', condition: 'New', quantity: 1 },
      { name: 'Injector Dynamics ID1050x Injectors', condition: 'New', quantity: 6 },
    ],
    condition: 'Rebuilt',
    warranty: '12 Months Parts & Labour',
    priceIncVat: 12499.00,
    priceExVat: 10415.83,
    inStock: false,
    stockStatus: 'Enquire Only',
    fittingAvailable: true,
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
  },
  {
    id: 'pkg-rb26-used-jdm',
    engineCode: 'RB26DETT',
    tier: 'Engine Only',
    title: 'RB26DETT Engine Only – Used JDM Import (R34 GT-R)',
    description: 'Direct JDM import RB26DETT from a BNR34 R34 Skyline GT-R. Compression tested. Includes twin turbos and throttle bodies.',
    includedItems: [
      { name: 'RB26DETT Engine Assembly', condition: 'Used JDM', quantity: 1, notes: 'BNR34 sourced, 48,000 km' },
      { name: 'Stock Twin Turbochargers', condition: 'Used JDM', quantity: 2 },
      { name: 'Individual Throttle Bodies (×6)', condition: 'Used JDM', quantity: 1 },
      { name: 'Intake Plenum', condition: 'Used JDM', quantity: 1 },
    ],
    condition: 'Used JDM',
    mileage: 48000,
    warranty: '3 Months',
    priceIncVat: 5499.00,
    priceExVat: 4582.50,
    inStock: true,
    stockStatus: 'In Stock',
    fittingAvailable: true,
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
  },
  {
    id: 'pkg-rb25det-used-jdm',
    engineCode: 'RB25DET',
    tier: 'Engine Only',
    title: 'RB25DET NEO Engine Only – Used JDM Import',
    description: 'Nissan RB25DET NEO (Series 2) used JDM engine. Compression tested. Includes turbo and manifolds.',
    includedItems: [
      { name: 'RB25DET NEO Engine Assembly', condition: 'Used JDM', quantity: 1, notes: '75,000 km' },
      { name: 'Stock T28 Turbocharger', condition: 'Used JDM', quantity: 1 },
      { name: 'Intake Manifold', condition: 'Used JDM', quantity: 1 },
      { name: 'Exhaust Manifold', condition: 'Used JDM', quantity: 1 },
    ],
    condition: 'Used JDM',
    mileage: 75000,
    warranty: '3 Months',
    priceIncVat: 1899.00,
    priceExVat: 1582.50,
    inStock: true,
    stockStatus: 'In Stock',
    fittingAvailable: true,
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
    isFeatured: false,
  },
];

// ─────────────────────────────────────────────
// QUERY HELPERS
// ─────────────────────────────────────────────

export function queryJdmProducts(params: {
  products?: JdmProduct[];
  search?: string;
  categoryId?: string;
  subcategoryId?: string;
  make?: string;
  engine?: string;
  condition?: Condition;
  inStock?: boolean;
  featured?: boolean;
  popular?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
  sortBy?: 'recommended' | 'price_asc' | 'price_desc' | 'rating';
  page?: number;
  limit?: number;
}): { products: JdmProduct[]; totalResults: number; page: number; totalPages: number } {
  const {
    search, categoryId, subcategoryId, make, engine, condition, inStock,
    featured, popular, newArrival, bestSeller,
    sortBy = 'recommended', page = 1, limit = 24,
    products = SAMPLE_PRODUCTS,
  } = params;

  let results = [...products];

  results = results.filter(p => p.isPublished !== false);

  if (make && make !== 'all') results = results.filter(p => p.make === make);
  if (engine && engine !== 'all') results = results.filter(p => p.engines.includes(engine));
  if (categoryId && categoryId !== 'all') results = results.filter(p => p.categoryId === categoryId);
  if (subcategoryId && subcategoryId !== 'all') results = results.filter(p => p.subcategoryId === subcategoryId);
  if (condition) results = results.filter(p => p.condition === condition);
  if (inStock) results = results.filter(p => p.inStock);
  if (featured) results = results.filter(p => p.isFeatured);
  if (popular) results = results.filter(p => p.isPopular);
  if (newArrival) results = results.filter(p => p.isNewArrival);
  if (bestSeller) results = results.filter(p => p.isBestSeller);
  if (search && search.trim()) {
    const term = search.trim().toLowerCase();
    results = results.filter(product =>
      [product.title, product.brand, product.sku, product.searchTerms].some(value => value?.toLowerCase().includes(term)),
    );
  }

  if (sortBy === 'price_asc') results.sort((a, b) => a.priceIncVat - b.priceIncVat);
  else if (sortBy === 'price_desc') results.sort((a, b) => b.priceIncVat - a.priceIncVat);
  else if (sortBy === 'rating') results.sort((a, b) => b.rating - a.rating);

  const totalResults = results.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / limit));
  const paginated = results.slice((page - 1) * limit, page * limit);

  return { products: paginated, totalResults, page, totalPages };
}

export function getJdmProductById(id: number, products: JdmProduct[] = SAMPLE_PRODUCTS): JdmProduct | undefined {
  return products.find(p => p.id === id);
}

export function getEngineByCode(code: string): Engine | undefined {
  return ENGINES.find(e => e.code === code);
}

export function getMakeById(id: string): Make | undefined {
  return MAKES.find(m => m.id === id);
}

export function getPackagesByEngine(engineCode: string): EnginePackage[] {
  return ENGINE_PACKAGES.filter(p => p.engineCode === engineCode);
}

export function getFeaturedPackages(): EnginePackage[] {
  return ENGINE_PACKAGES.filter(p => p.isFeatured);
}

/** Calculate deposit amount (default 10%) */
export function calculateDeposit(priceIncVat: number, depositPct = 10): {
  deposit: number;
  balance: number;
  depositPct: number;
} {
  const deposit = Math.round((priceIncVat * depositPct) / 100 * 100) / 100;
  const balance = Math.round((priceIncVat - deposit) * 100) / 100;
  return { deposit, balance, depositPct };
}
