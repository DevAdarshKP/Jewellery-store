import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';

// If running standalone, load env variables from .env.local
const envLocalPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [k, ...v] = trimmed.split('=');
      process.env[k.trim()] = v.join('=').trim();
    }
  }
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jewellery_store';

async function seed() {
  console.log('Connecting to MongoDB at:', MONGODB_URI);
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB successfully.');

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('Database connection failed');
  }

  // 1. Seed Admin User
  const usersCollection = db.collection('users');
  await usersCollection.deleteMany({});
  const passwordHash = await bcrypt.hash('Admin@12345', 12);
  const adminUser = {
    name: 'Atelier Director',
    email: 'admin@jewellerystore.local',
    passwordHash,
    role: 'ADMIN',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await usersCollection.insertOne(adminUser);
  console.log('Seeded Admin User: admin@jewellerystore.local (Password: Admin@12345)');

  // 2. Seed Categories with local editorial imagery
  const categoriesCollection = db.collection('categories');
  await categoriesCollection.deleteMany({});

  const categoryDefinitions = [
    {
      name: 'Necklaces & Pendants',
      slug: 'necklaces-pendants',
      description:
        'Regal chokers, layered diamond necklaces, and artisanal pendants crafted in 22K yellow and rose gold.',
      imageUrl: '/editorial/category-necklaces.jpg',
      displayOrder: 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Earrings & Jhumkas',
      slug: 'earrings-jhumkas',
      description:
        'Chandelier drops, heritage polki studs, and diamond-encrusted hoops celebrating timeless beauty.',
      imageUrl: '/editorial/category-earrings.jpg',
      displayOrder: 2,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Bangles & Bracelets',
      slug: 'bangles-bracelets',
      description:
        'Traditional kada bangles, delicate diamond tennis bracelets, and intricate filigree gold cuffs.',
      imageUrl: '/editorial/category-bracelets.jpg',
      displayOrder: 3,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Statement Rings',
      slug: 'statement-rings',
      description:
        'Cocktail rings featuring brilliant solitaire cuts, untreated emeralds, and heritage cluster motifs.',
      imageUrl: '/editorial/category-rings.jpg',
      displayOrder: 4,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Bridal Heritage Sets',
      slug: 'bridal-heritage-sets',
      description:
        'Magnificent full bridal sets featuring uncut diamonds, Zambian emerald drops, and royal pearls.',
      imageUrl: '/editorial/haute-joaillerie-feature.jpg',
      displayOrder: 5,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const catInsertResult = await categoriesCollection.insertMany(categoryDefinitions);
  const catMap: Record<string, any> = {};
  for (let i = 0; i < categoryDefinitions.length; i++) {
    catMap[categoryDefinitions[i].slug] = catInsertResult.insertedIds[i];
  }
  console.log(`Seeded ${categoryDefinitions.length} Categories.`);

  // 3. Seed Products with local high-resolution jewellery assets
  const productsCollection = db.collection('products');
  await productsCollection.deleteMany({});

  const sampleProducts = [
    // -------------------------------------------------------------------------
    // Tashola Primary Signature Lookbook Items (Row 1)
    // -------------------------------------------------------------------------
    {
      title: 'Gold Pink Stone Detail Hoop Earrings',
      slug: 'gold-pink-stone-hoop-earrings',
      sku: 'LUM-ER-002',
      categoryId: catMap['earrings-jhumkas'],
      summary: 'Textured 18K yellow gold huggie hoops finished with an untreated organic pink stone droplet.',
      description: 'Artisanal organic hoops cast in solid 18K yellow gold with molten surface textures. Features a custom hand-set rose quartz cabochon reflecting ethereal pastel luminescence.',
      metal: '18K Yellow Gold',
      purity: '75.0% Gold',
      stones: 'Natural Rose Quartz & Pink Spinel',
      priceGuidance: '£28.00',
      quoteOnly: false,
      status: 'PUBLISHED',
      isFeatured: true,
      images: [
        {
          url: '/products/tashola-pink-stone-hoops.png',
          alt: 'Gold Pink Stone Detail Hoop Earrings Front View',
          isPrimary: true,
          displayOrder: 1,
        },
        {
          url: '/products/tashola-pink-stone-hoops-2.png',
          alt: 'Gold Pink Stone Detail Hoop Earrings Alternate View',
          isPrimary: false,
          displayOrder: 2,
        },
      ],
      attributes: [
        { group: 'Dimensions', key: 'Hoop Diameter', value: '22 mm' },
        { group: 'Gold Weight', key: 'Net Weight', value: '9.4 Grams' },
        { group: 'Stone Detail', key: 'Center Stone', value: 'Natural Rose Quartz' },
      ],
      viewsCount: 320,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Gold Serpentine Flow Crystal Bangle',
      slug: 'gold-serpentine-flow-crystal-bangle',
      sku: 'LUM-BR-002',
      categoryId: catMap['bangles-bracelets'],
      summary: 'Fluid undulating gold bangle lined with micro-pavé optical brilliant crystals.',
      description: 'Embodying natural hydrodynamic waveforms, this ergonomic cuff contours the wrist with dual ribbons of polished 18K yellow gold, punctuated by pavé set crystals.',
      metal: '18K Yellow Gold',
      purity: '75.0% Gold',
      stones: 'Micro-Pavé Brilliant Cut Crystals',
      priceGuidance: '£12.00',
      quoteOnly: false,
      status: 'PUBLISHED',
      isFeatured: true,
      images: [
        {
          url: '/products/tashola-serpentine-bangle.png',
          alt: 'Gold Serpentine Flow Crystal Bangle',
          isPrimary: true,
          displayOrder: 1,
        },
        {
          url: '/products/tashola-serpentine-bangle-2.png',
          alt: 'Gold Serpentine Flow Crystal Bangle Alternate View',
          isPrimary: false,
          displayOrder: 2,
        },
      ],
      attributes: [
        { group: 'Fit', key: 'Inner Circumference', value: '17.5 cm (Flexible Spring Hinge)' },
        { group: 'Craftsmanship', key: 'Finish', value: 'High Mirror Polish' },
      ],
      viewsCount: 280,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Gold Organic Clear Crystal Dangle Earrings',
      slug: 'gold-organic-clear-crystal-dangle-earrings',
      sku: 'LUM-ER-003',
      categoryId: catMap['earrings-jhumkas'],
      summary: 'Triple-tier articulated drops featuring freeform bezel-mounted crystal drops.',
      description: 'A sculptural statement drop earring featuring three organic pebble-shaped links. Hand-forged in molten 18K yellow gold encasing faceted teardrop rock crystals.',
      metal: '18K Yellow Gold',
      purity: '75.0% Gold',
      stones: 'Natural Rock Crystals (Faceted Pear & Oval)',
      priceGuidance: '£30.00',
      quoteOnly: false,
      status: 'PUBLISHED',
      isFeatured: true,
      images: [
        {
          url: '/products/tashola-crystal-dangles.png',
          alt: 'Gold Organic Clear Crystal Dangle Earrings',
          isPrimary: true,
          displayOrder: 1,
        },
        {
          url: '/products/tashola-crystal-dangles-2.png',
          alt: 'Gold Organic Clear Crystal Dangle Earrings Alternate View',
          isPrimary: false,
          displayOrder: 2,
        },
      ],
      attributes: [
        { group: 'Dimensions', key: 'Drop Length', value: '52 mm' },
        { group: 'Articulation', key: 'Flexibility', value: 'Triple Articulated Links' },
      ],
      viewsCount: 215,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Gold Sculptural Pebble Ring',
      slug: 'gold-sculptural-pebble-ring',
      sku: 'LUM-RG-003',
      categoryId: catMap['statement-rings'],
      summary: 'Modernist open-shank bypass ring topped with dual polished gold organic domes.',
      description: 'Contemporary sculptural architecture for the hands. Cast in solid heavy-gauge yellow gold with twin asymmetric mushroom pebbles polished to a mirror gleam.',
      metal: '18K Yellow Gold',
      purity: '75.0% Gold',
      stones: 'Pure Solid Cast Gold',
      priceGuidance: '£ 10.00',
      quoteOnly: false,
      status: 'PUBLISHED',
      isFeatured: true,
      images: [
        {
          url: '/products/tashola-pebble-ring.png',
          alt: 'Gold Sculptural Pebble Ring',
          isPrimary: true,
          displayOrder: 1,
        },
        {
          url: '/products/tashola-pebble-ring-2.png',
          alt: 'Gold Sculptural Pebble Ring Alternate View',
          isPrimary: false,
          displayOrder: 2,
        },
      ],
      attributes: [
        { group: 'Band Style', key: 'Design', value: 'Open Bypass Ergonomic Shank' },
        { group: 'Weight', key: 'Solid Gold Weight', value: '11.8 Grams' },
      ],
      viewsCount: 390,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },

    // -------------------------------------------------------------------------
    // Tashola Secondary Curated Items (Row 2 & Pagination)
    // -------------------------------------------------------------------------
    {
      title: 'Gold Statement Sculptural Flora Stud Earrings',
      slug: 'gold-flora-stud-earrings',
      sku: 'LUM-ER-004',
      categoryId: catMap['earrings-jhumkas'],
      summary: 'Wing-like botanical leaf petal studs curved to follow the contour of the earlobe.',
      description: 'Organic molten foliage crafted in warm 18K yellow gold. Each petal is individually sculpted with undulating natural ribs for dramatic sculptural dimension.',
      metal: '18K Yellow Gold',
      purity: '75.0% Gold',
      stones: 'Hand-Finished Brushed Gold',
      priceGuidance: '£38.00',
      quoteOnly: false,
      status: 'PUBLISHED',
      isFeatured: true,
      images: [
        {
          url: '/products/tashola-flora-studs.png',
          alt: 'Gold Statement Sculptural Flora Stud Earrings',
          isPrimary: true,
          displayOrder: 1,
        },
        {
          url: '/products/tashola-flora-studs-2.png',
          alt: 'Gold Statement Sculptural Flora Stud Earrings Alternate View',
          isPrimary: false,
          displayOrder: 2,
        },
      ],
      attributes: [
        { group: 'Style', key: 'Mounting', value: 'Ear Climber Wing Stud' },
        { group: 'Length', key: 'Span', value: '38 mm' },
      ],
      viewsCount: 190,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Gold Statement Gemstone Ring',
      slug: 'gold-gemstone-statement-ring',
      sku: 'LUM-RG-006',
      categoryId: catMap['statement-rings'],
      summary: 'Brushed gold cigar band bezel-set with an emerald-cut natural crystal.',
      description: 'Wide hammered gold statement ring featuring raw organic edge finishes and an offset octagonal solitaire gemstone.',
      metal: '18K Yellow Gold',
      purity: '75.0% Gold',
      stones: 'Natural White Topaz Solitaire',
      priceGuidance: '£22.00',
      quoteOnly: false,
      status: 'PUBLISHED',
      isFeatured: true,
      images: [
        {
          url: '/products/tashola-gemstone-ring.png',
          alt: 'Gold Statement Gemstone Ring',
          isPrimary: true,
          displayOrder: 1,
        },
        {
          url: '/products/tashola-gemstone-ring-2.png',
          alt: 'Gold Statement Gemstone Ring Alternate View',
          isPrimary: false,
          displayOrder: 2,
        },
      ],
      attributes: [
        { group: 'Profile', key: 'Band Width', value: '14 mm Tapered' },
      ],
      viewsCount: 160,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Gold Golden Flow Open Cuff',
      slug: 'gold-flow-open-cuff',
      sku: 'LUM-BR-003',
      categoryId: catMap['bangles-bracelets'],
      summary: 'Multi-strand wire open wrist cuff in satin-finished golden bronze.',
      description: 'Delicate intertwining lattice wires creating an airy, weightless aesthetic that glides on smoothly.',
      metal: '18K Yellow Gold',
      purity: '75.0% Gold',
      stones: 'Brushed Golden Finish',
      priceGuidance: '£35.00',
      quoteOnly: false,
      status: 'PUBLISHED',
      isFeatured: true,
      images: [
        {
          url: '/products/tashola-flow-cuff.png',
          alt: 'Gold Golden Flow Open Cuff',
          isPrimary: true,
          displayOrder: 1,
        },
        {
          url: '/products/tashola-flow-cuff-2.png',
          alt: 'Gold Golden Flow Open Cuff Alternate View',
          isPrimary: false,
          displayOrder: 2,
        },
      ],
      attributes: [
        { group: 'Sizing', key: 'Diameter', value: '62 mm (Adjustable Open Cuff)' },
      ],
      viewsCount: 145,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Gold Adjustable Drop Lariat Necklace',
      slug: 'gold-drop-lariat-necklace',
      sku: 'LUM-NK-003',
      categoryId: catMap['necklaces-pendants'],
      summary: 'Sliding bolo bead fine snake chain with twin cascading drop finials.',
      description: 'Versatile minimalist jewellery statement. The central polished slider sphere allows limitless neckline adjustments from choker to plunging decolletage.',
      metal: '18K Yellow Gold',
      purity: '75.0% Gold',
      stones: 'Solid Gold Beads',
      priceGuidance: '£16.00',
      quoteOnly: false,
      status: 'PUBLISHED',
      isFeatured: true,
      images: [
        {
          url: '/products/tashola-lariat-necklace.png',
          alt: 'Gold Adjustable Drop Lariat Necklace',
          isPrimary: true,
          displayOrder: 1,
        },
        {
          url: '/products/tashola-lariat-necklace-2.png',
          alt: 'Gold Adjustable Drop Lariat Necklace Alternate View',
          isPrimary: false,
          displayOrder: 2,
        },
      ],
      attributes: [
        { group: 'Chain Length', key: 'Total Length', value: '65 cm Adjustable' },
      ],
      viewsCount: 230,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },

    // -------------------------------------------------------------------------
    // Haute Joaillerie Showcase Pieces (Split Section & Curated Archive)
    // -------------------------------------------------------------------------
    {
      title: 'Heritage Double-Wave Open Gold Cuff',
      slug: 'heritage-double-wave-open-gold-cuff',
      sku: 'LUM-BR-004',
      categoryId: catMap['bangles-bracelets'],
      summary: 'Masterpiece 18K yellow gold sculptural wave cuff with micro-pavé diamonds.',
      description: 'Handcrafted in Paris ateliers, this ergonomic double-wave cuff blends organic fluidity with architectural precision, capped by round brilliant diamonds.',
      metal: '18K Yellow Gold',
      purity: '75.0% Gold',
      stones: 'Pavé Diamonds (0.75 Cts, VVS, F Color)',
      priceGuidance: 'From $2,100',
      quoteOnly: false,
      status: 'PUBLISHED',
      isFeatured: true,
      images: [
        {
          url: '/products/tashola-wave-cuff.png',
          alt: 'Heritage Double-Wave Open Gold Cuff',
          isPrimary: true,
          displayOrder: 1,
        },
        {
          url: '/products/tashola-wave-cuff-2.png',
          alt: 'Heritage Double-Wave Open Gold Cuff Alternate View',
          isPrimary: false,
          displayOrder: 2,
        },
      ],
      attributes: [
        { group: 'Origin', key: 'Atelier', value: 'Place Vendôme Studio' },
      ],
      viewsCount: 310,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Twin Heritage Diamond Pavé Bands',
      slug: 'twin-heritage-diamond-pave-bands',
      sku: 'LUM-RG-007',
      categoryId: catMap['statement-rings'],
      summary: 'Pair of stacking eternity rings in mirror-polished 18K yellow gold with diamond channel settings.',
      description: 'A timeless union of twin bridal bands. Each ring is channel-set with ideal-cut diamonds for an unbroken ribbon of pure brilliant fire.',
      metal: '18K Yellow Gold',
      purity: '75.0% Gold',
      stones: 'Round Brilliant Diamonds (1.20 Cts Total, VS1, E Color)',
      priceGuidance: 'From $2,800',
      quoteOnly: false,
      status: 'PUBLISHED',
      isFeatured: true,
      images: [
        {
          url: '/products/twin-heritage-bands.png',
          alt: 'Twin Heritage Diamond Pavé Bands',
          isPrimary: true,
          displayOrder: 1,
        },
        {
          url: '/products/twin-heritage-bands-2.png',
          alt: 'Twin Heritage Diamond Pavé Bands Alternate View',
          isPrimary: false,
          displayOrder: 2,
        },
      ],
      attributes: [
        { group: 'Set', key: 'Included', value: '2 Matching Stacking Bands' },
      ],
      viewsCount: 420,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },

    // -------------------------------------------------------------------------
    // Atelier Heritage Masterpieces (Critical Path Tested)
    // -------------------------------------------------------------------------
    {
      title: 'Royal Polki & Emerald Choker',
      slug: 'royal-polki-emerald-choker',
      sku: 'LUM-NK-001',
      categoryId: catMap['necklaces-pendants'],
      summary: 'An opulent 22K yellow gold choker set with natural uncut polki diamonds and vibrant Colombian emerald beads.',
      description: 'Immerse in regal heritage with this handcrafted choker necklace. Each uncut polki diamond is set using traditional Jadau techniques, accented by clusters of hand-strung natural emerald beads. Ideal for grand wedding celebrations and auspicious gala appearances.',
      metal: '22K Yellow Gold (BIS Hallmarked)',
      purity: '91.6% Pure Gold',
      stones: 'Natural Uncut Polki Diamonds (14.5 Cts), Colombian Emeralds (28 Cts)',
      priceGuidance: 'From $4,800 / Quote on Request',
      quoteOnly: true,
      status: 'PUBLISHED',
      isFeatured: true,
      images: [
        {
          url: '/products/royal-polki-choker-hq.png',
          alt: 'Royal Polki & Emerald Choker Front View',
          isPrimary: true,
          displayOrder: 1,
        },
      ],
      attributes: [
        { group: 'Gold & Metal', key: 'Net Gold Weight', value: '62.40 Grams' },
        { group: 'Gemstones', key: 'Polki Diamond Clarity', value: 'Natural Antique Cut' },
        { group: 'Gemstones', key: 'Emerald Origin', value: 'Certified Colombian' },
        { group: 'Craftsmanship', key: 'Technique', value: 'Traditional Kundan Meenakari back-inlay' },
      ],
      viewsCount: 650,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Celeste Diamond Solitaire Pendant',
      slug: 'celeste-diamond-solitaire-pendant',
      sku: 'LUM-NK-002',
      categoryId: catMap['necklaces-pendants'],
      summary: 'A luminous round brilliant solitaire diamond suspended in an 18K white gold minimal basket setting.',
      description: 'Subtle, refined, and undeniably radiant. The Celeste pendant highlights a certified 1.50-carat round brilliant diamond, cut to ideal proportions for maximum light dispersion, accompanied by an adjustable 18K white gold chain.',
      metal: '18K White Gold',
      purity: '75.0% Hallmarked Gold',
      stones: 'Round Brilliant Diamond (1.50 Carats, VVS1, E Color)',
      priceGuidance: 'From $1,850',
      quoteOnly: false,
      status: 'PUBLISHED',
      isFeatured: true,
      images: [
        {
          url: '/products/celeste-pendant-hq.png',
          alt: 'Celeste Diamond Solitaire Pendant',
          isPrimary: true,
          displayOrder: 1,
        },
      ],
      attributes: [
        { group: 'Diamond Specs', key: 'Carat Weight', value: '1.50 Cts' },
        { group: 'Diamond Specs', key: 'Clarity / Color', value: 'VVS1 / E Colorless' },
        { group: 'Certification', key: 'Grading Lab', value: 'GIA Certified' },
      ],
      viewsCount: 240,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Riviera Classic Diamond Tennis Bracelet',
      slug: 'riviera-classic-diamond-tennis-bracelet',
      sku: 'LUM-BR-001',
      categoryId: catMap['bangles-bracelets'],
      summary: 'A seamless continuous line of matched brilliant-cut diamonds set in a supple 18K white gold four-prong bracelet.',
      description: 'The quintessential modern luxury bracelet. Featuring 55 perfectly calibrated round brilliant diamonds totaling 5.00 carats, secured with a concealed double-safety box clasp.',
      metal: '18K White Gold',
      purity: '75.0% Gold',
      stones: '5.00 Cts Round Brilliant Diamonds (VVS-VS, E-F)',
      priceGuidance: 'From $3,400',
      quoteOnly: false,
      status: 'PUBLISHED',
      isFeatured: true,
      images: [
        {
          url: '/products/tennis-bracelet-hq.png',
          alt: 'Riviera Diamond Tennis Bracelet',
          isPrimary: true,
          displayOrder: 1,
        },
      ],
      attributes: [
        { group: 'Diamonds', key: 'Diamond Count', value: '55 Stones' },
        { group: 'Length', key: 'Standard Wrist Size', value: '7.0 Inches' },
      ],
      viewsCount: 310,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Noor Chandbali Diamond & Pearl Drops',
      slug: 'noor-chandbali-polki-earrings',
      sku: 'LUM-ER-001',
      categoryId: catMap['earrings-jhumkas'],
      summary: 'Crescent-shaped Chandbali earrings detailed with delicate seed pearls and rose-cut diamond accents.',
      description: 'Inspired by Mughal architecture, these crescent chandbalis swing gracefully with every movement. Adorned with Basra pearls and uncut diamonds, finished with intricate floral Meenakari enamel on the reverse.',
      metal: '22K Yellow Gold',
      purity: '91.6% Pure Gold',
      stones: 'Rose Cut Diamonds & Natural Seed Pearls',
      priceGuidance: 'From $2,600',
      quoteOnly: true,
      status: 'PUBLISHED',
      isFeatured: true,
      images: [
        {
          url: '/products/chandbali-earrings-hq.png',
          alt: 'Noor Chandbali Earrings Pair',
          isPrimary: true,
          displayOrder: 1,
        },
      ],
      attributes: [
        { group: 'Dimensions', key: 'Earring Length', value: '6.8 cm' },
        { group: 'Gold Weight', key: 'Gross Weight', value: '34.2 grams' },
      ],
      viewsCount: 410,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Imperial Sapphire & Diamond Cocktail Ring',
      slug: 'imperial-sapphire-diamond-cocktail-ring',
      sku: 'LUM-RG-001',
      categoryId: catMap['statement-rings'],
      summary: 'Untreated royal blue cushion-cut sapphire encircled by a double tier of pavé diamonds in platinum.',
      description: 'A museum-grade 4.5-carat royal blue Ceylon sapphire commands the center of this ring, framed by 64 hand-set micropavé diamonds.',
      metal: 'Platinum 950',
      purity: '95.0% Pure Platinum',
      stones: '4.50 Cts Natural Ceylon Sapphire (Unheated) + 1.10 Cts Diamonds',
      priceGuidance: 'From $3,600',
      quoteOnly: false,
      status: 'PUBLISHED',
      isFeatured: true,
      images: [
        {
          url: '/hero-silver-ring-hq.png',
          alt: 'Imperial Sapphire & Diamond Cocktail Ring',
          isPrimary: true,
          displayOrder: 1,
        },
      ],
      attributes: [
        { group: 'Center Stone', key: 'Origin', value: 'Certified Sri Lankan (Ceylon)' },
      ],
      viewsCount: 290,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: '18K Yellow Gold Diamond Channel Band',
      slug: 'fine-gold-diamond-channel-band',
      sku: 'LUM-RG-002',
      categoryId: catMap['statement-rings'],
      summary: 'Heavy solid 18K yellow gold band channel set with calibrated round brilliant diamonds.',
      description: 'Subtle grandeur for everyday prestige. Hand-burnished gold edges protect an unbroken line of VVS brilliant-cut diamonds.',
      metal: '18K Yellow Gold',
      purity: '75.0% Gold',
      stones: 'Round Brilliant Diamonds (1.00 Cts, VVS, F Color)',
      priceGuidance: 'From $2,100',
      quoteOnly: false,
      status: 'PUBLISHED',
      isFeatured: true,
      images: [
        {
          url: '/hero-gold-ring-hq.png',
          alt: '18K Yellow Gold Diamond Channel Band',
          isPrimary: true,
          displayOrder: 1,
        },
      ],
      attributes: [
        { group: 'Width', key: 'Band Profile', value: '5.5 mm Comfort Fit' },
      ],
      viewsCount: 210,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Heritage Black Onyx & Gold Signet Ring',
      slug: 'heritage-black-onyx-gold-signet-ring',
      sku: 'LUM-RG-004',
      categoryId: catMap['statement-rings'],
      summary: 'Carved natural black onyx tablet mounted in a heavy architectural 18K gold signet.',
      description: 'A modern talisman. The jet-black mirror polish of natural onyx is offset by hand-finished bevels of satin yellow gold.',
      metal: '18K Yellow Gold',
      purity: '75.0% Gold',
      stones: 'Natural Calibrated Black Onyx Tablet',
      priceGuidance: 'From $1,750',
      quoteOnly: false,
      status: 'PUBLISHED',
      isFeatured: false,
      images: [
        {
          url: '/products/black-onyx-signet-ring.png',
          alt: 'Heritage Black Onyx & Gold Signet Ring',
          isPrimary: true,
          displayOrder: 1,
        },
        {
          url: '/products/black-onyx-signet-ring-2.png',
          alt: 'Heritage Black Onyx & Gold Signet Ring Alternate View',
          isPrimary: false,
          displayOrder: 2,
        },
      ],
      attributes: [
        { group: 'Design', key: 'Top Dimensions', value: '16 mm x 12 mm' },
      ],
      viewsCount: 175,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Australian Opal & Pavé Diamond Ring',
      slug: 'australian-opal-pave-diamond-ring',
      sku: 'LUM-RG-005',
      categoryId: catMap['statement-rings'],
      summary: 'Natural solid Australian black opal cabochon radiating neon play-of-color with diamond pavé bezel.',
      description: 'Displaying intense electric green, blue, and fiery orange flash from every viewing angle, encased in custom organic prongs.',
      metal: '18K Yellow Gold',
      purity: '75.0% Gold',
      stones: 'Natural Solid Lightning Ridge Opal (2.85 Cts) + 0.40 Cts Diamonds',
      priceGuidance: 'From $2,400',
      quoteOnly: false,
      status: 'PUBLISHED',
      isFeatured: false,
      images: [
        {
          url: '/products/opal-statement-ring.png',
          alt: 'Australian Opal & Pavé Diamond Ring',
          isPrimary: true,
          displayOrder: 1,
        },
        {
          url: '/products/opal-statement-ring-2.png',
          alt: 'Australian Opal & Pavé Diamond Ring Alternate View',
          isPrimary: false,
          displayOrder: 2,
        },
      ],
      attributes: [
        { group: 'Opal Origin', key: 'Mine', value: 'Lightning Ridge, Australia' },
      ],
      viewsCount: 195,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'The Maharani Royal Bridal Set',
      slug: 'the-maharani-royal-bridal-set',
      sku: 'LUM-ST-001',
      categoryId: catMap['bridal-heritage-sets'],
      summary: 'Complete haute joaillerie bridal trousseau including grand necklace, matching chandbalis, and maang tikka.',
      description: 'The crowning glory of the Lumière Atelier bridal archive. Handcrafted over 400 artisanal hours, combining royal Jadau polki diamonds, natural pearls, and untreated emeralds in solid 22K gold.',
      metal: '22K Yellow Gold (BIS Hallmarked)',
      purity: '91.6% Pure Gold',
      stones: 'Uncut Polki Diamonds (38.5 Cts), Zambian Emerald Drops (65 Cts)',
      priceGuidance: 'Price on Private Consultation',
      quoteOnly: true,
      status: 'PUBLISHED',
      isFeatured: true,
      images: [
        {
          url: '/products/royal-polki-choker-hq.png',
          alt: 'The Maharani Royal Bridal Set Front View',
          isPrimary: true,
          displayOrder: 1,
        },
      ],
      attributes: [
        { group: 'Suite Contents', key: 'Pieces Included', value: 'Choker, Long Haar, Earrings, Maang Tikka' },
        { group: 'Gold Weight', key: 'Gross Weight', value: '280.5 Grams' },
      ],
      viewsCount: 520,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },

    // -------------------------------------------------------------------------
    // Draft Product for Admin CMS Testing
    // -------------------------------------------------------------------------
    {
      title: 'Artisanal Solitaire Gold Ring (Draft)',
      slug: 'artisanal-solitaire-gold-ring-draft',
      sku: 'LUM-RG-009',
      categoryId: catMap['statement-rings'],
      summary: 'Hand-forged textured gold band currently undergoing final hallmark verification.',
      description: 'A preview piece from the upcoming Autumn high-jewellery capsule. Stored in draft status.',
      metal: '18K Yellow Gold',
      purity: '75.0% Gold',
      stones: 'Uncut Rough Diamond (1.10 Cts)',
      priceGuidance: 'From $1,900',
      quoteOnly: true,
      status: 'DRAFT',
      isFeatured: false,
      images: [
        {
          url: '/products/solitaire-diamond-ring.png',
          alt: 'Artisanal Solitaire Gold Ring Draft',
          isPrimary: true,
          displayOrder: 1,
        },
        {
          url: '/products/solitaire-diamond-ring-2.png',
          alt: 'Artisanal Solitaire Gold Ring Draft Alternate View',
          isPrimary: false,
          displayOrder: 2,
        },
      ],
      attributes: [
        { group: 'Inspection', key: 'Artisan Status', value: 'Pending Hallmarking Assay' },
      ],
      viewsCount: 8,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  await productsCollection.insertMany(sampleProducts);
  console.log(`Seeded ${sampleProducts.length} Premium Jewellery Products (including 1 Draft item).`);

  // 4. Seed Settings
  const settingsCollection = db.collection('settings');
  await settingsCollection.deleteMany({});

  const defaultSettings = [
    {
      key: 'whatsapp',
      value: {
        phoneNumber: '918129440790',
        messageTemplate:
          'Hello Lumière Atelier, I would like to enquire about "{productName}" (Code: {productSku}). Link: {productUrl}',
        enabled: true,
      },
      updatedAt: new Date(),
    },
    {
      key: 'homepage',
      value: {
        heroBadge: 'Haute Joaillerie & Ornaments',
        heroTitle: 'Jewelry That Speaks for You',
        heroSubtitle:
          'Create bold accents with handcrafted heirloom pieces that celebrate grace and individuality.',
        heroCtaText: 'Shop Now',
        announcementText: 'Complimentary Private Appointments & Worldwide Bespoke Consultations Available',
        aboutStoryHeading: 'The Heritage of Lumière Atelier',
        aboutStoryText:
          'Rooted in centuries-old artisanal traditions, Lumière Atelier crafts timeless high-jewellery masterpieces. Every gemstone is hand-selected for extraordinary fire, every gold setting forged with peerless precision, creating heirloom ornaments that honor grace, dignity, and personal legacy.',
        aboutStoryImage: '/editorial/hero-tashola-portrait.jpg',
      },
      updatedAt: new Date(),
    },
    {
      key: 'general',
      value: {
        brandName: 'Lumière Atelier',
        tagline: 'Fine Jewellery & Ornaments',
        contactEmail: 'concierge@lumiereatelier.local',
        contactPhone: '+91 98765 43210',
        showroomAddress: '14 Heritage Boulevard, Luxury Quarter',
        businessHours: 'Monday – Saturday: 10:30 AM – 8:00 PM',
      },
      updatedAt: new Date(),
    },
  ];

  await settingsCollection.insertMany(defaultSettings);
  console.log('Seeded Website & WhatsApp Settings.');

  await mongoose.disconnect();
  console.log('Seed completed successfully!');
}

seed().catch((err) => {
  console.error('Seed script error:', err);
  process.exit(1);
});
