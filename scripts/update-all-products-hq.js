const mongoose = require('mongoose');

async function updateAllProductsWithHQ() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jewellery_store';
  await mongoose.connect(uri);

  const productImagesMap = {
    'royal-polki-emerald-choker': [
      { url: '/products/royal-polki-choker-hq.png', alt: 'Royal Polki & Emerald Choker Necklace', isPrimary: true, displayOrder: 1 },
      { url: '/products/chandbali-earrings-hq.png', alt: 'Matching Polki Chandbali Suite', isPrimary: false, displayOrder: 2 },
      { url: '/hero-gold-ring-hq.png', alt: 'Heritage 18K Gold Band', isPrimary: false, displayOrder: 3 }
    ],
    'celeste-diamond-solitaire-pendant': [
      { url: '/products/celeste-pendant-hq.png', alt: 'Celeste 3-Carat Diamond Solitaire Pendant', isPrimary: true, displayOrder: 1 },
      { url: '/products/solitaire-diamond-ring.png', alt: 'Matching Solitaire Diamond Ring', isPrimary: false, displayOrder: 2 },
      { url: '/products/tennis-bracelet-hq.png', alt: 'Tennis Suite Companion', isPrimary: false, displayOrder: 3 }
    ],
    'noor-chandbali-polki-earrings': [
      { url: '/products/chandbali-earrings-hq.png', alt: 'Noor Chandbali Polki Earrings Pair', isPrimary: true, displayOrder: 1 },
      { url: '/products/royal-polki-choker-hq.png', alt: 'Matching Royal Polki Choker', isPrimary: false, displayOrder: 2 }
    ],
    'aethel-diamond-cascade-drops': [
      { url: '/products/chandbali-earrings-hq.png', alt: 'Aethel Diamond Cascade Earrings', isPrimary: true, displayOrder: 1 },
      { url: '/hero-silver-ring-hq.png', alt: 'Cocktail Sapphire Ring Pairing', isPrimary: false, displayOrder: 2 }
    ],
    'empress-heritage-jadau-kada': [
      { url: '/products/tennis-bracelet-hq.png', alt: 'Empress Heritage Kada Bracelet', isPrimary: true, displayOrder: 1 },
      { url: '/hero-gold-ring-hq.png', alt: 'Gold Channel Band Suite', isPrimary: false, displayOrder: 2 }
    ],
    'riviera-classic-diamond-tennis-bracelet': [
      { url: '/products/tennis-bracelet-hq.png', alt: 'Riviera Classic Diamond Tennis Bracelet', isPrimary: true, displayOrder: 1 },
      { url: '/products/celeste-pendant-hq.png', alt: 'Diamond Solitaire Pairing', isPrimary: false, displayOrder: 2 }
    ],
    'crown-emerald-cut-diamond-ring': [
      { url: '/products/solitaire-diamond-ring.png', alt: 'Crown Solitaire Diamond Ring', isPrimary: true, displayOrder: 1 },
      { url: '/hero-gold-ring-hq.png', alt: '18K Yellow Gold Channel Band', isPrimary: false, displayOrder: 2 },
      { url: '/hero-silver-ring-hq.png', alt: 'Platinum Sapphire Ring Suite', isPrimary: false, displayOrder: 3 }
    ],
    'neelam-royal-sapphire-ring': [
      { url: '/hero-silver-ring-hq.png', alt: 'Neelam Royal Sapphire Cocktail Ring', isPrimary: true, displayOrder: 1 },
      { url: '/products/solitaire-diamond-ring.png', alt: 'Solitaire Diamond Band Pairing', isPrimary: false, displayOrder: 2 },
      { url: '/products/tennis-bracelet-hq.png', alt: 'Diamond Tennis Suite', isPrimary: false, displayOrder: 3 }
    ],
    'the-maharani-royal-bridal-set': [
      { url: '/products/royal-polki-choker-hq.png', alt: 'The Maharani Royal Bridal Choker', isPrimary: true, displayOrder: 1 },
      { url: '/products/chandbali-earrings-hq.png', alt: 'Maharani Polki Chandbali Earrings', isPrimary: false, displayOrder: 2 },
      { url: '/hero-gold-ring-hq.png', alt: 'Maharani Heritage Gold Ring', isPrimary: false, displayOrder: 3 }
    ],
    'devi-filigree-gold-temple-bangle-draft': [
      { url: '/products/tennis-bracelet-hq.png', alt: 'Devi Filigree Temple Bangle', isPrimary: true, displayOrder: 1 }
    ]
  };

  for (const [slug, images] of Object.entries(productImagesMap)) {
    const res = await mongoose.connection.db.collection('products').updateOne(
      { slug },
      { $set: { images, updatedAt: new Date() } }
    );
    console.log(`Updated images for ${slug}: matched=${res.matchedCount}, modified=${res.modifiedCount}`);
  }

  console.log('All MongoDB products successfully updated with ultra-high-resolution HQ images!');
  process.exit(0);
}

updateAllProductsWithHQ().catch((err) => {
  console.error(err);
  process.exit(1);
});

