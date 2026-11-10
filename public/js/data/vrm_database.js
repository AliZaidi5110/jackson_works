/**
 * APEX Auto Parts UK - Vehicle Registration Mark (VRM) Lookup Engine
 * Supports exact DVLA mock mappings + dynamic algorithmic fallback for any UK Registration Plate.
 */
(function(window) {
  'use strict';

  // Preset DVLA Mock Mappings
  const VRM_PRESETS = {
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
    },
    "FD69WZA": {
      vrm: "FD69 WZA",
      make: "Vauxhall",
      model: "Corsa",
      year: 2020,
      engine: "1.2 Turbo",
      fuel: "Petrol",
      variant: "SRi Premium",
      bhp: "100 BHP",
      engineCode: "F12XHT",
      vinPrefix: "VXKV18000L",
      bodyStyle: "Hatchback",
      transmission: "6-Speed Manual"
    },
    "PX18YTR": {
      vrm: "PX18 YTR",
      make: "Land Rover",
      model: "Range Rover Evoque",
      year: 2018,
      engine: "2.0 TD4",
      fuel: "Diesel",
      variant: "HSE Dynamic Auto",
      bhp: "180 BHP",
      engineCode: "204DTD",
      vinPrefix: "SALLV2BN3J",
      bodyStyle: "SUV",
      transmission: "9-Speed Automatic"
    },
    "OE66KPM": {
      vrm: "OE66 KPM",
      make: "Nissan",
      model: "Qashqai",
      year: 2016,
      engine: "1.5 dCi",
      fuel: "Diesel",
      variant: "N-Connecta",
      bhp: "110 BHP",
      engineCode: "K9K 636",
      vinPrefix: "SJNFCAJ11U",
      bodyStyle: "Crossover SUV",
      transmission: "6-Speed Manual"
    },
    "VK22GLO": {
      vrm: "VK22 GLO",
      make: "Toyota",
      model: "Yaris",
      year: 2022,
      engine: "1.5 VVT-h Hybrid",
      fuel: "Hybrid",
      variant: "Design e-CVT",
      bhp: "116 BHP",
      engineCode: "M15A-FXE",
      vinPrefix: "VNKKD3D300",
      bodyStyle: "Hatchback",
      transmission: "e-CVT Automatic"
    },
    "HN17SJU": {
      vrm: "HN17 SJU",
      make: "Peugeot",
      model: "3008",
      year: 2017,
      engine: "1.6 BlueHDi",
      fuel: "Diesel",
      variant: "Allure GT-Line",
      bhp: "120 BHP",
      engineCode: "BHZ (DV6FC)",
      vinPrefix: "VF3MCBHZH8",
      bodyStyle: "SUV",
      transmission: "6-Speed Automatic"
    }
  };

  // Fallback vehicle profiles for dynamic VRM inputs
  const FALLBACK_MAKES = [
    { make: "BMW", models: ["3 Series", "5 Series", "1 Series", "X5", "X3"], engines: ["320d 2.0L", "330e Hybrid", "520d 2.0L", "118i 1.5L"], fuels: ["Diesel", "Petrol", "Hybrid"] },
    { make: "Ford", models: ["Focus", "Fiesta", "Transit Custom", "Kuga", "Mondeo"], engines: ["1.0 EcoBoost", "1.5 EcoBlue", "2.0 TDCi"], fuels: ["Petrol", "Diesel"] },
    { make: "Audi", models: ["A3", "A4", "A6", "Q5", "TT"], engines: ["2.0 TDI", "1.5 TFSI", "2.0 TFSI 45"], fuels: ["Petrol", "Diesel"] },
    { make: "Volkswagen", models: ["Golf VII", "Polo", "Passat", "Tiguan", "Transporter"], engines: ["2.0 TDI GTD", "1.5 TSI", "1.6 TDI"], fuels: ["Diesel", "Petrol"] },
    { make: "Mercedes-Benz", models: ["C-Class", "E-Class", "A-Class", "GLC", "Sprinter"], engines: ["C220d 2.0L", "A200 1.3L", "E300d 2.0L"], fuels: ["Diesel", "Petrol"] },
    { make: "Vauxhall", models: ["Corsa", "Astra", "Insignia", "Mokka", "Vivaro"], engines: ["1.2 Turbo", "1.4 16V", "1.5 Turbo D"], fuels: ["Petrol", "Diesel"] }
  ];

  window.VRMLookupEngine = {
    lookup: function(rawInput) {
      if (!rawInput) return null;
      const normalized = rawInput.toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (!normalized) return null;

      // 1. Direct preset match
      if (VRM_PRESETS[normalized]) {
        return VRM_PRESETS[normalized];
      }

      // 2. Hash-based deterministic fallback for any registration format
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
      
      // Determine year based on number plate numbers if available
      let year = 2018 + (absHash % 7); // 2018 - 2024
      const digitsMatch = normalized.match(/\d{2}/);
      if (digitsMatch) {
        let num = parseInt(digitsMatch[0], 10);
        if (num >= 50 && num <= 74) {
          year = 2000 + (num - 50);
        } else if (num >= 0 && num <= 25) {
          year = 2000 + num;
        }
      }

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
        variant: "Standard Edition",
        bhp: (110 + (absHash % 90)) + " BHP",
        engineCode: "ENG-" + (1000 + (absHash % 8999)),
        vinPrefix: "UK" + makeProfile.make.substring(0,2).toUpperCase() + (100000 + (absHash % 899999)),
        bodyStyle: "Hatchback/Saloon",
        transmission: (absHash % 2 === 0) ? "6-Speed Manual" : "8-Speed Automatic"
      };
    },

    getPresets: function() {
      return Object.values(VRM_PRESETS);
    }
  };
})(window);
