/**
 * APEX Auto Parts UK - 10,000+ Scalable Automotive Catalogue Engine
 * Provides instant indexed search, filtering, pagination, vehicle compatibility verification,
 * and bulk import/export administrative capabilities.
 */
(function(window) {
  'use strict';

  const BRANDS = [
    { name: "Bosch", logo: "BOSCH", country: "Germany", tier: "OEM Supplier" },
    { name: "Brembo", logo: "BREMBO", country: "Italy", tier: "High Performance" },
    { name: "Valeo", logo: "VALEO", country: "France", tier: "OEM Supplier" },
    { name: "Mann-Filter", logo: "MANN", country: "Germany", tier: "Premium Filtration" },
    { name: "NGK", logo: "NGK", country: "Japan", tier: "Ignition Specialist" },
    { name: "Febi Bilstein", logo: "FEBI", country: "Germany", tier: "German Quality" },
    { name: "SKF", logo: "SKF", country: "Sweden", tier: "Bearings & Suspension" },
    { name: "Sachs", logo: "SACHS", country: "Germany", tier: "Damping & Clutch" },
    { name: "LuK", logo: "LUK", country: "Germany", tier: "Transmission" },
    { name: "Gates", logo: "GATES", country: "USA", tier: "Belts & Hose Systems" },
    { name: "Castrol", logo: "CASTROL", country: "UK", tier: "Lubricants" },
    { name: "Philips", logo: "PHILIPS", country: "Netherlands", tier: "Automotive Lighting" },
    { name: "Denso", logo: "DENSO", country: "Japan", tier: "Thermal & Electrical" },
    { name: "Mahle", logo: "MAHLE", country: "Germany", tier: "Engine Components" }
  ];

  const VEHICLE_CATALOG = [
    { make: "BMW", models: ["1 Series", "3 Series", "5 Series", "X3", "X5"], years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], engines: ["320d 2.0L", "330e Hybrid", "M340i 3.0L", "520d 2.0L", "118i 1.5L"] },
    { make: "Ford", models: ["Focus", "Fiesta", "Transit Custom", "Kuga", "Mondeo"], years: [2012, 2014, 2016, 2018, 2019, 2020, 2021, 2022, 2023], engines: ["1.0 EcoBoost", "1.5 EcoBlue", "2.0 TDCi", "2.0 EcoBlue"] },
    { make: "Audi", models: ["A3", "A4", "A6", "Q5", "TT"], years: [2014, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023], engines: ["2.0 TDI 40", "1.5 TFSI 35", "2.0 TFSI 45", "3.0 TDI"] },
    { make: "Volkswagen", models: ["Golf VII", "Polo", "Passat", "Tiguan", "Transporter"], years: [2013, 2015, 2017, 2018, 2019, 2020, 2021, 2022, 2023], engines: ["2.0 TDI GTD", "1.5 TSI Evo", "1.6 TDI", "2.0 TSI GTI"] },
    { make: "Mercedes-Benz", models: ["C-Class", "E-Class", "A-Class", "GLC", "Sprinter"], years: [2015, 2017, 2018, 2019, 2020, 2021, 2022, 2023], engines: ["C220d 2.0L", "A200 1.3L", "E300d 2.0L", "314 CDI"] },
    { make: "Vauxhall", models: ["Corsa", "Astra", "Insignia", "Mokka", "Vivaro"], years: [2014, 2016, 2017, 2018, 2019, 2020, 2021, 2022], engines: ["1.2 Turbo", "1.4 16V", "1.5 Turbo D", "2.0 CDTi"] },
    { make: "Land Rover", models: ["Range Rover Evoque", "Discovery Sport", "Defender"], years: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023], engines: ["2.0 TD4", "2.0 D180", "3.0 D300"] },
    { make: "Nissan", models: ["Qashqai", "Juke", "X-Trail"], years: [2015, 2017, 2018, 2019, 2020, 2021, 2022], engines: ["1.5 dCi", "1.2 DIG-T", "1.3 DIG-T"] },
    { make: "Toyota", models: ["Yaris", "Corolla", "RAV4"], years: [2016, 2018, 2019, 2020, 2021, 2022, 2023], engines: ["1.5 VVT-h Hybrid", "1.8 Hybrid", "2.5 Hybrid"] },
    { make: "Peugeot", models: ["208", "3008", "5008", "Partner"], years: [2016, 2017, 2018, 2019, 2020, 2021, 2022], engines: ["1.2 PureTech", "1.6 BlueHDi", "1.5 BlueHDi"] }
  ];

  const CATEGORY_STRUCTURE = [
    {
      id: "braking",
      name: "Braking Systems",
      icon: "fa-compact-disc",
      image: "./images/brake_discs_category.jpg",
      subcategories: ["Brake Pads", "Brake Discs", "Brake Calipers", "Brake Shoes", "Brake Sensors", "Brake Fluid & Lines"]
    },
    {
      id: "engine",
      name: "Engine Parts & Filters",
      icon: "fa-engine",
      image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80",
      subcategories: ["Oil Filters", "Air Filters", "Fuel Filters", "Cabin Pollen Filters", "Spark Plugs", "Glow Plugs", "Timing Belts", "Gaskets", "Engine Oil"]
    },
    {
      id: "suspension",
      name: "Suspension & Steering",
      icon: "fa-car-side",
      image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80",
      subcategories: ["Shock Absorbers", "Suspension Arms", "Ball Joints", "Track Rod Ends", "Wheel Bearings", "Coil Springs", "Anti-Roll Bar Links"]
    },
    {
      id: "electrical",
      name: "Electrical & Ignition",
      icon: "fa-bolt",
      image: "https://images.unsplash.com/photo-1558441719-234752600f58?auto=format&fit=crop&w=600&q=80",
      subcategories: ["Car Batteries", "Alternators", "Starter Motors", "Ignition Coils", "ABS Sensors", "Oxygen Sensors (Lambda)", "Headlight Bulbs"]
    },
    {
      id: "cooling",
      name: "Cooling & Heating",
      icon: "fa-snowflake",
      image: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=600&q=80",
      subcategories: ["Radiators", "Water Pumps", "Thermostats", "Cooling Fans", "Intercoolers", "Radiator Hoses", "Antifreeze"]
    },
    {
      id: "transmission",
      name: "Clutch & Transmission",
      icon: "fa-gear",
      image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80",
      subcategories: ["Clutch Kits", "Dual Mass Flywheels", "Clutch Master Cylinders", "Drive Shafts", "Gearbox Oils"]
    },
    {
      id: "exhaust",
      name: "Exhaust Systems",
      icon: "fa-wind",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
      subcategories: ["Exhaust Silencers", "Catalytic Converters", "DPF Filters", "EGR Valves", "Exhaust Mounts"]
    },
    {
      id: "accessories",
      name: "Accessories & Car Care",
      icon: "fa-spray-can",
      image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=600&q=80",
      subcategories: ["Wiper Blades", "Floor Mats", "Car Care & Detailing", "Interior Accessories", "Roof Racks", "Phone Holders", "Dash Cams"]
    }
  ];

  // Template items used to generate 10,000+ realistic catalog items dynamically
  const PRODUCT_TEMPLATES = [
    { subcat: "Brake Pads", title: "{brand} Premium Front Ceramic Brake Pad Set", basePrice: 42.99, image: "https://images.unsplash.com/photo-1600792850431-7e50c904e54e?auto=format&fit=crop&w=500&q=80", position: "Front Axle", material: "Low-Metallic Ceramic", warranty: "24 Months / 25,000 Miles" },
    { subcat: "Brake Discs", title: "{brand} Vented Coated Front Brake Discs (Pair)", basePrice: 79.99, image: "./images/brake_discs_category.jpg", position: "Front Axle", material: "High-Carbon Vented Steel", warranty: "36 Months" },
    { subcat: "Brake Calipers", title: "{brand} Hydraulic Brake Caliper Assembly", basePrice: 114.50, image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=500&q=80", position: "Left / Right Front", material: "Cast Iron Alloy", warranty: "24 Months" },
    { subcat: "Oil Filters", title: "{brand} High-Flow Spin-On Engine Oil Filter", basePrice: 11.99, image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=500&q=80", position: "Engine Block", material: "Synthetic Micro-Glass Media", warranty: "12 Months" },
    { subcat: "Air Filters", title: "{brand} Engine Air Intake Filter Element", basePrice: 16.50, image: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=500&q=80", position: "Air Box Intake", material: "Multi-Ply Pleated Paper", warranty: "12 Months" },
    { subcat: "Spark Plugs", title: "{brand} Laser Iridium High Performance Spark Plug Set (x4)", basePrice: 34.99, image: "https://images.unsplash.com/photo-1558441719-234752600f58?auto=format&fit=crop&w=500&q=80", position: "Ignition Cylinder", material: "Iridium / Platinum", warranty: "50,000 Miles" },
    { subcat: "Shock Absorbers", title: "{brand} Gas-Pressurised Twin-Tube Shock Absorber", basePrice: 68.00, image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=500&q=80", position: "Rear / Front", material: "Hard-Chrome Plated Piston Rod", warranty: "3 Years" },
    { subcat: "Car Batteries", title: "{brand} AGM Start-Stop 12V 70Ah 760A Heavy Duty Battery", basePrice: 139.99, image: "https://images.unsplash.com/photo-1558441719-234752600f58?auto=format&fit=crop&w=500&q=80", position: "Engine Bay", material: "Absorbent Glass Mat (AGM)", warranty: "4 Years UK Guarantee" },
    { subcat: "Wiper Blades", title: "{brand} Aerotwin Flat Beam Front Wiper Blade Pair", basePrice: 24.99, image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=500&q=80", position: "Windscreen", material: "Dual-Rubber Graphite Coated", warranty: "12 Months" },
    { subcat: "Water Pumps", title: "{brand} Coolant Water Pump with Gasket Kit", basePrice: 52.00, image: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=500&q=80", position: "Engine Timing Belt Drive", material: "Aluminium Impeller", warranty: "2 Years" },
    { subcat: "Clutch Kits", title: "{brand} 3-Piece Complete Clutch Kit with Concentric Slave", basePrice: 189.00, image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=500&q=80", position: "Transmission Housing", material: "Organic Friction Material", warranty: "2 Years / 30,000 Miles" },
    { subcat: "Timing Belts", title: "{brand} Timing Belt Kit with Tensioner Pulley", basePrice: 85.50, image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=500&q=80", position: "Camshaft Drive", material: "HNBR Reinforced Rubber", warranty: "5 Years / 60,000 Miles" }
  ];

  // In-memory catalog dataset (10,000 items)
  let ALL_PRODUCTS = [];
  let INDEXED_LOOKUP = new Map(); // Fast O(1) lookup by ID/SKU/OEM
  let MAKE_MODEL_MAP = new Map(); // Fast vehicle filter map

  function generateCatalog(targetCount) {
    targetCount = targetCount || 10240; // Generate over 10,000 items
    console.time("Generate 10k Catalog");
    ALL_PRODUCTS = [];
    INDEXED_LOOKUP.clear();
    MAKE_MODEL_MAP.clear();

    let idCounter = 10001;

    // First generate featured core curated products for main display
    for (let cat of CATEGORY_STRUCTURE) {
      for (let sub of cat.subcategories) {
        for (let brandObj of BRANDS) {
          for (let v of VEHICLE_CATALOG) {
            for (let model of v.models) {
              if (ALL_PRODUCTS.length >= targetCount) break;

              let tmpl = PRODUCT_TEMPLATES.find(t => t.subcat === sub) || PRODUCT_TEMPLATES[0];
              let sku = (brandObj.name.substring(0,3).toUpperCase()) + '-' + (Math.floor(10000 + (idCounter * 31) % 89999));
              let oem = (10000000 + Math.floor((idCounter * 17) % 89999999)).toString();
              let partNo = (brandObj.logo) + '-' + (idCounter % 9000 + 1000);
              
              // Price calculations & discount logic
              let priceMultiplier = 0.85 + ((idCounter * 7) % 45) / 100;
              let price = Math.round(tmpl.basePrice * priceMultiplier * 100) / 100;
              let isDiscounted = (idCounter % 4 === 0);
              let wasPrice = isDiscounted ? Math.round(price * 1.25 * 100) / 100 : null;
              let isDeal = (idCounter % 7 === 0);
              let isBestSeller = (idCounter % 5 === 0);
              let stock = (idCounter % 11 === 0) ? 0 : (idCounter % 3 === 0 ? 3 : 15 + (idCounter % 50));
              let rating = (4.0 + ((idCounter % 10) / 10)).toFixed(1);
              let reviewCount = 12 + (idCounter % 280);

              let product = {
                id: idCounter,
                sku: sku,
                partNumber: partNo,
                oemNumber: oem,
                title: tmpl.title.replace("{brand}", brandObj.name) + ` for ${v.make} ${model}`,
                brand: brandObj.name,
                brandTier: brandObj.tier,
                category: cat.id,
                categoryName: cat.name,
                subcategory: sub,
                price: price,
                wasPrice: wasPrice,
                priceExVat: Math.round((price / 1.2) * 100) / 100,
                inStock: stock > 0,
                stockCount: stock,
                rating: parseFloat(rating),
                reviewCount: reviewCount,
                image: tmpl.image,
                isDeal: isDeal,
                isBestSeller: isBestSeller,
                specifications: {
                  "Brand": brandObj.name,
                  "Part Number": partNo,
                  "OEM Reference": oem,
                  "Fitting Position": tmpl.position,
                  "Material": tmpl.material,
                  "Warranty": tmpl.warranty,
                  "Quality Standard": "E-Mark Certified / OEM Equivalent",
                  "Country of Origin": brandObj.country
                },
                compatibility: {
                  make: v.make,
                  models: [model],
                  years: v.years,
                  engines: v.engines
                },
                searchTerms: `${tmpl.title} ${brandObj.name} ${v.make} ${model} ${sku} ${oem} ${partNo} ${sub} ${cat.name}`.toLowerCase()
              };

              ALL_PRODUCTS.push(product);
              INDEXED_LOOKUP.set(product.id, product);
              INDEXED_LOOKUP.set(product.sku, product);
              INDEXED_LOOKUP.set(product.oemNumber, product);
              INDEXED_LOOKUP.set(product.partNumber, product);

              // Vehicle fast map key
              let vehicleKey = `${v.make.toLowerCase()}:${model.toLowerCase()}`;
              if (!MAKE_MODEL_MAP.has(vehicleKey)) {
                MAKE_MODEL_MAP.set(vehicleKey, []);
              }
              MAKE_MODEL_MAP.get(vehicleKey).push(product.id);

              idCounter++;
            }
          }
        }
      }
    }
    console.timeEnd("Generate 10k Catalog");
    console.log(`Generated ${ALL_PRODUCTS.length} automotive products ready for fast querying.`);
  }

  // Auto initialize dataset
  generateCatalog(10240);

  window.CatalogEngine = {
    getAllProducts: function() {
      return ALL_PRODUCTS;
    },

    getProductCount: function() {
      return ALL_PRODUCTS.length;
    },

    getCategories: function() {
      return CATEGORY_STRUCTURE;
    },

    getBrands: function() {
      return BRANDS;
    },

    getVehicles: function() {
      return VEHICLE_CATALOG;
    },

    getProductByIdOrSku: function(idOrSku) {
      if (!idOrSku) return null;
      let key = (typeof idOrSku === 'string') ? idOrSku.trim() : idOrSku;
      if (INDEXED_LOOKUP.has(key)) return INDEXED_LOOKUP.get(key);
      let numKey = parseInt(key, 10);
      if (!isNaN(numKey) && INDEXED_LOOKUP.has(numKey)) return INDEXED_LOOKUP.get(numKey);
      return ALL_PRODUCTS.find(p => p.sku === key || p.partNumber === key || p.oemNumber === key) || null;
    },

    /**
     * High-Performance Filter & Pagination Query Engine
     */
    query: function(params) {
      params = params || {};
      let page = parseInt(params.page, 10) || 1;
      let limit = parseInt(params.limit, 10) || 24;
      let search = (params.search || '').trim().toLowerCase();
      let category = params.category || 'all';
      let subcategory = params.subcategory || 'all';
      let brand = params.brand || 'all';
      let make = params.make || 'all';
      let model = params.model || 'all';
      let year = params.year ? parseInt(params.year, 10) : null;
      let engine = params.engine || 'all';
      let inStockOnly = params.inStock === true || params.inStock === 'true';
      let dealsOnly = params.dealsOnly === true || params.dealsOnly === 'true';
      let bestSellersOnly = params.bestSellersOnly === true || params.bestSellersOnly === 'true';
      let minPrice = params.minPrice ? parseFloat(params.minPrice) : 0;
      let maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : Infinity;
      let sortBy = params.sortBy || 'recommended'; // recommended, price_asc, price_desc, rating, newest, best_selling

      let results = ALL_PRODUCTS;

      // 1. Vehicle Filter Optimization using Map lookup if make & model are specified
      if (make !== 'all' && model !== 'all') {
        let vehicleKey = `${make.toLowerCase()}:${model.toLowerCase()}`;
        if (MAKE_MODEL_MAP.has(vehicleKey)) {
          let ids = MAKE_MODEL_MAP.get(vehicleKey);
          results = ids.map(id => INDEXED_LOOKUP.get(id)).filter(Boolean);
        } else {
          results = results.filter(p => p.compatibility.make.toLowerCase() === make.toLowerCase() && p.compatibility.models.some(m => m.toLowerCase() === model.toLowerCase()));
        }
      } else if (make !== 'all') {
        results = results.filter(p => p.compatibility.make.toLowerCase() === make.toLowerCase());
      }

      // 2. Year & Engine matching
      if (year) {
        results = results.filter(p => p.compatibility.years.includes(year));
      }
      if (engine !== 'all') {
        results = results.filter(p => p.compatibility.engines.some(e => e.toLowerCase().includes(engine.toLowerCase())));
      }

      // 3. Category & Subcategory
      if (category !== 'all') {
        results = results.filter(p => p.category === category);
      }
      if (subcategory !== 'all') {
        results = results.filter(p => p.subcategory.toLowerCase() === subcategory.toLowerCase());
      }

      // 4. Brand
      if (brand !== 'all') {
        results = results.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
      }

      // 5. Flags (Stock, Deals, Best Sellers)
      if (inStockOnly) {
        results = results.filter(p => p.inStock);
      }
      if (dealsOnly) {
        results = results.filter(p => p.isDeal || p.wasPrice);
      }
      if (bestSellersOnly) {
        results = results.filter(p => p.isBestSeller);
      }

      // 6. Price range
      if (minPrice > 0 || maxPrice < Infinity) {
        results = results.filter(p => p.price >= minPrice && p.price <= maxPrice);
      }

      // 7. Full-text search
      if (search) {
        let terms = search.split(/\s+/);
        results = results.filter(p => {
          return terms.every(term => p.searchTerms.includes(term));
        });
      }

      // 8. Sorting
      if (sortBy === 'price_asc') {
        results.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price_desc') {
        results.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'rating') {
        results.sort((a, b) => b.rating - a.rating);
      } else if (sortBy === 'best_selling') {
        results.sort((a, b) => b.reviewCount - a.reviewCount);
      } else if (sortBy === 'newest') {
        results.sort((a, b) => b.id - a.id);
      }

      // 9. Pagination
      let totalResults = results.length;
      let totalPages = Math.ceil(totalResults / limit) || 1;
      let startIndex = (page - 1) * limit;
      let paginatedProducts = results.slice(startIndex, startIndex + limit);

      return {
        products: paginatedProducts,
        totalResults: totalResults,
        page: page,
        totalPages: totalPages,
        limit: limit
      };
    },

    /**
     * Instant Autocomplete Search Suggestions
     */
    searchSuggestions: function(query, limit) {
      if (!query || query.trim().length < 2) return [];
      limit = limit || 6;
      let q = query.trim().toLowerCase();
      let suggestions = [];

      // Category matches
      for (let cat of CATEGORY_STRUCTURE) {
        if (cat.name.toLowerCase().includes(q)) {
          suggestions.push({ type: 'category', title: cat.name, categoryId: cat.id, icon: 'fa-folder' });
        }
        for (let sub of cat.subcategories) {
          if (sub.toLowerCase().includes(q)) {
            suggestions.push({ type: 'subcategory', title: sub, categoryId: cat.id, icon: 'fa-layer-group' });
          }
        }
      }

      // Brand matches
      for (let b of BRANDS) {
        if (b.name.toLowerCase().includes(q)) {
          suggestions.push({ type: 'brand', title: b.name + ' Parts', brandName: b.name, icon: 'fa-copyright' });
        }
      }

      // Product matches
      let count = 0;
      for (let p of ALL_PRODUCTS) {
        if (p.searchTerms.includes(q)) {
          suggestions.push({
            type: 'product',
            id: p.id,
            sku: p.sku,
            partNumber: p.partNumber,
            title: p.title,
            brand: p.brand,
            price: p.price,
            image: p.image,
            icon: 'fa-box'
          });
          count++;
          if (count >= limit) break;
        }
      }

      return suggestions;
    },

    /**
     * Check product compatibility against target vehicle specs
     */
    checkCompatibility: function(productId, vehicle) {
      if (!vehicle) return { status: 'unknown', message: 'Select your vehicle to verify fitment' };
      let product = this.getProductByIdOrSku(productId);
      if (!product) return { status: 'unknown', message: 'Product not found' };

      let comp = product.compatibility;
      let isMakeMatch = comp.make.toLowerCase() === vehicle.make.toLowerCase();
      let isModelMatch = comp.models.some(m => vehicle.model.toLowerCase().includes(m.toLowerCase()) || m.toLowerCase().includes(vehicle.model.toLowerCase()));

      if (isMakeMatch && isModelMatch) {
        return {
          status: 'compatible',
          message: `✓ Guaranteed Fit for ${vehicle.make} ${vehicle.model} (${vehicle.year || ''})`
        };
      } else if (isMakeMatch) {
        return {
          status: 'warning',
          message: `⚠ May fit ${vehicle.make} models. Please verify OEM part number ${product.oemNumber}`
        };
      } else {
        return {
          status: 'incompatible',
          message: `✕ Not compatible with ${vehicle.make} ${vehicle.model}. Designed for ${comp.make} ${comp.models.join(', ')}`
        };
      }
    },

    // Administrative CRUD operations
    addProduct: function(productData) {
      let newId = ALL_PRODUCTS.length > 0 ? Math.max(...ALL_PRODUCTS.map(p => p.id)) + 1 : 10001;
      let product = Object.assign({
        id: newId,
        sku: 'SKU-' + newId,
        partNumber: 'PART-' + newId,
        oemNumber: 'OEM-' + newId,
        inStock: true,
        stockCount: 50,
        rating: 5.0,
        reviewCount: 1,
        specifications: {},
        compatibility: { make: "Generic", models: ["Universal"], years: [2020], engines: ["All Engines"] },
        searchTerms: (productData.title + ' ' + productData.brand).toLowerCase()
      }, productData);

      ALL_PRODUCTS.unshift(product);
      INDEXED_LOOKUP.set(product.id, product);
      INDEXED_LOOKUP.set(product.sku, product);
      return product;
    },

    updateProduct: function(id, updatedFields) {
      let product = this.getProductByIdOrSku(id);
      if (!product) return null;
      Object.assign(product, updatedFields);
      product.searchTerms = `${product.title} ${product.brand} ${product.sku} ${product.partNumber} ${product.oemNumber}`.toLowerCase();
      return product;
    },

    deleteProduct: function(id) {
      let index = ALL_PRODUCTS.findIndex(p => p.id === id);
      if (index !== -1) {
        let [deleted] = ALL_PRODUCTS.splice(index, 1);
        INDEXED_LOOKUP.delete(deleted.id);
        INDEXED_LOOKUP.delete(deleted.sku);
        return true;
      }
      return false;
    }
  };
})(window);
