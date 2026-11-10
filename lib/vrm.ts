/**
 * APEX Auto Parts UK - Next.js VRM Lookup Engine
 */

export interface VehicleSpec {
  vrm: string;
  make: string;
  model: string;
  year: number;
  engine: string;
  fuel: string;
  variant: string;
  bhp: string;
  engineCode: string;
  vinPrefix: string;
  bodyStyle: string;
  transmission: string;
}

const VRM_PRESETS: Record<string, VehicleSpec> = {
  "AB12CDE": {
    vrm: "AB12 CDE",
    make: "BMW",
    model: "3 Series",
    year: 2020,
    engine: "320d 2.0L",
    fuel: "Diesel",
    variant: "M Sport Auto xDrive",
    bhp: "190 BHP",
    engineCode: "B47D20O1",
    vinPrefix: "WBA5V72000",
    bodyStyle: "Saloon",
    transmission: "8-Speed Automatic"
  },
  "DV70XKZ": {
    vrm: "DV70 XKZ",
    make: "Ford",
    model: "Transit Custom",
    year: 2021,
    engine: "2.0 TDCi EcoBlue",
    fuel: "Diesel",
    variant: "Limited 300 L1H1",
    bhp: "130 BHP",
    engineCode: "YNF6",
    vinPrefix: "WF0YXXTTGY",
    bodyStyle: "Panel Van",
    transmission: "6-Speed Manual"
  },
  "LM68FGH": {
    vrm: "LM68 FGH",
    make: "Audi",
    model: "A4",
    year: 2019,
    engine: "2.0 TFSI 40",
    fuel: "Petrol",
    variant: "S Line S Tronic",
    bhp: "190 BHP",
    engineCode: "CVKB",
    vinPrefix: "WAUZZZF45K",
    bodyStyle: "Avant Estate",
    transmission: "7-Speed S Tronic"
  },
  "BW19UXP": {
    vrm: "BW19 UXP",
    make: "Volkswagen",
    model: "Golf VII",
    year: 2019,
    engine: "2.0 GTD TDI",
    fuel: "Diesel",
    variant: "GTD Hatchback DSG",
    bhp: "184 BHP",
    engineCode: "CUNA",
    vinPrefix: "WVWZZZAUZK",
    bodyStyle: "Hatchback",
    transmission: "7-Speed DSG"
  },
  "RE21NKO": {
    vrm: "RE21 NKO",
    make: "Mercedes-Benz",
    model: "A-Class",
    year: 2021,
    engine: "A200 1.3L",
    fuel: "Petrol",
    variant: "AMG Line Executive",
    bhp: "163 BHP",
    engineCode: "M282.914",
    vinPrefix: "W1K1770871",
    bodyStyle: "Hatchback",
    transmission: "7G-DCT Automatic"
  }
};

const FALLBACK_MAKES = [
  { make: "BMW", models: ["3 Series", "5 Series", "1 Series", "X5"], engines: ["320d 2.0L", "330e Hybrid"], fuels: ["Diesel", "Petrol"] },
  { make: "Ford", models: ["Focus", "Fiesta", "Transit Custom", "Kuga"], engines: ["1.0 EcoBoost", "2.0 TDCi"], fuels: ["Petrol", "Diesel"] },
  { make: "Audi", models: ["A3", "A4", "A6", "Q5"], engines: ["2.0 TDI", "1.5 TFSI"], fuels: ["Petrol", "Diesel"] },
  { make: "Volkswagen", models: ["Golf VII", "Polo", "Passat"], engines: ["2.0 TDI GTD", "1.5 TSI"], fuels: ["Diesel", "Petrol"] }
];

export function lookupVRM(rawInput: string): VehicleSpec | null {
  if (!rawInput) return null;
  const normalized = rawInput.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!normalized) return null;

  if (VRM_PRESETS[normalized]) {
    return VRM_PRESETS[normalized];
  }

  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash << 5) - hash + normalized.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const makeProfile = FALLBACK_MAKES[absHash % FALLBACK_MAKES.length];
  const model = makeProfile.models[(absHash >> 2) % makeProfile.models.length];
  const engine = makeProfile.engines[(absHash >> 4) % makeProfile.engines.length];
  const fuel = makeProfile.fuels[(absHash >> 3) % makeProfile.fuels.length];
  const year = 2018 + (absHash % 7);

  const formattedVRM = normalized.length >= 5 
    ? normalized.slice(0, normalized.length - 3) + ' ' + normalized.slice(normalized.length - 3)
    : normalized;

  return {
    vrm: formattedVRM,
    make: makeProfile.make,
    model: model,
    year: year,
    engine: engine,
    fuel: fuel,
    variant: "Standard UK Edition",
    bhp: (110 + (absHash % 90)) + " BHP",
    engineCode: "ENG-" + (1000 + (absHash % 8999)),
    vinPrefix: "UK" + makeProfile.make.substring(0,2).toUpperCase() + (100000 + (absHash % 899999)),
    bodyStyle: "Hatchback/Saloon",
    transmission: (absHash % 2 === 0) ? "6-Speed Manual" : "8-Speed Automatic"
  };
}
