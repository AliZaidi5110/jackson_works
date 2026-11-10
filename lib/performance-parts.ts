export const PERFORMANCE_PART_GROUPS = [
  {
    id: 'manifolds',
    title: 'Turbo Manifolds',
    description: 'Start with the engine and chassis. Mount position, flange and wastegate clearance depend on the build.',
    names: [
      'Turbo Manifolds', 'Toyota Turbo Manifolds', 'Nissan Turbo Manifolds', 'BMW Turbo Manifolds',
      'Ford Turbo Manifolds', 'Honda Turbo Manifolds', 'Mazda Turbo Manifolds', 'MINI Turbo Manifolds',
      'Mitsubishi Turbo Manifolds', 'Renault Turbo Manifolds', 'Saab Turbo Manifolds', 'Vauxhall Turbo Manifolds',
    ],
  },
  {
    id: 'turbo-and-boost',
    title: 'Turbo & Boost Control',
    description: 'Enquire about matching the turbo, boost-control components and intake system to your setup.',
    names: [
      'Turbos', 'External Wastegates', 'Wastegate Actuators', 'Blow Off Valves', 'Boost Control',
      'Fresh Air Anti-Lag', 'Charge Air Control', 'Intercoolers', 'Air Filters', 'Intake Pipes', 'Boost Pipes',
      'Turbo Blankets', 'Turbosmart Parts',
    ],
  },
  {
    id: 'fuel-oil-electrical',
    title: 'Fuel, Oil & Electrical',
    description: 'Ask about fuel pressure, oil supply, monitoring and supporting electrical components.',
    names: ['Fuel Management', 'Oil Management', 'Gauges', 'Alternator', 'Battery Brackets', 'CAN Modules'],
  },
  {
    id: 'fabrication-components',
    title: 'Fabrication Components',
    description: 'Share material, size and connection details for the pipework or fitting you need.',
    names: [
      'Clamps', 'V-Bands & Clamps', 'Reference Adaptors', 'Silicon Hose', 'Bends', 'Stainless Steel Tube',
      'Transition Cones', 'Cast Collectors', 'Flexi Bellows', 'Manifold Flanges', 'Turbo Inlet Flanges',
      'Downpipes', 'Silencers', 'Exhaust Heat Shields',
    ],
  },
  {
    id: 'transmission',
    title: '8HP Transmission Components',
    description: 'Tell us the transmission model and the engine it needs to fit.',
    names: ['Bellhousing Kits', 'Torque Converters', 'Breather Kits', 'Seal Kits', 'Transmission Cooler Adaptors'],
  },
  {
    id: 'braking',
    title: 'Brake Components',
    description: 'Include your vehicle and brake setup so the requested components can be checked.',
    names: ['Bias Valves & Adjusters', 'Brake Servo Replacements'],
  },
  {
    id: 'merchandise',
    title: 'Apparel & Merchandise',
    description: 'Ask about a specific item, size or design.',
    names: ['Apparel', 'Merchandise', 'Banners'],
  },
].map(({ names, ...group }) => ({
  ...group,
  items: names.map(title => ({ id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'), title })),
}));

export const PERFORMANCE_PARTS = PERFORMANCE_PART_GROUPS.flatMap(group => group.items);
