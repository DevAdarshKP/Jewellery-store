const mongoose = require('mongoose');

async function updateProductImages() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jewellery_store';
  await mongoose.connect(uri);

  const productImagesMap = {
    'crown-emerald-cut-diamond-ring': [
      { url: '/products/solitaire-diamond-ring.png', alt: 'Crown Solitaire Diamond Ring', isPrimary: true, displayOrder: 1 },
      { url: '/products/nail-wrap-ring.png', alt: 'Crown Solitaire Profile', isPrimary: false, displayOrder: 2 },
      { url: '/products/classic-link-bracelet.png', alt: 'Crown Atelier Suite', isPrimary: false, displayOrder: 3 }
    ],
    'neelam-royal-sapphire-ring': [
      { url: '/hero-silver-ring-clean.png', alt: 'Neelam Royal Sapphire Ring', isPrimary: true, displayOrder: 1 },
      { url: '/products/solitaire-diamond-ring.png', alt: 'Solitaire Band Pairing', isPrimary: false, displayOrder: 2 },
      { url: '/products/three-stone-emerald-ring.png', alt: 'Gemstone Trio Angle', isPrimary: false, displayOrder: 3 }
    ],
    'royal-polki-emerald-choker': [
      { url: '/products/polki-emerald-pendant.png', alt: 'Royal Polki Emerald Choker', isPrimary: true, displayOrder: 1 },
      { url: '/products/chandbali-hoop-earrings.png', alt: 'Matching Polki Jhumkas', isPrimary: false, displayOrder: 2 },
      { url: '/hero-gold-ring-clean.png', alt: 'Bridal Heritage Ring', isPrimary: false, displayOrder: 3 }
    ],
    'celeste-diamond-solitaire-pendant': [
      { url: '/products/polki-emerald-pendant.png', alt: 'Celeste Diamond Solitaire Pendant', isPrimary: true, displayOrder: 1 },
      { url: '/products/solitaire-diamond-ring.png', alt: 'Solitaire Ring Suite', isPrimary: false, displayOrder: 2 }
    ],
    'noor-chandbali-polki-earrings': [
      { url: '/products/chandbali-hoop-earrings.png', alt: 'Noor Chandbali Polki Earrings', isPrimary: true, displayOrder: 1 },
      { url: '/products/polki-emerald-pendant.png', alt: 'Choker Pairing', isPrimary: false, displayOrder: 2 }
    ],
    'aethel-diamond-cascade-drops': [
      { url: '/products/chandbali-hoop-earrings.png', alt: 'Aethel Diamond Cascade Drops', isPrimary: true, displayOrder: 1 },
      { url: '/hero-silver-ring-clean.png', alt: 'Diamond Ring Companion', isPrimary: false, displayOrder: 2 }
    ],
    'empress-heritage-jadau-kada': [
      { url: '/products/classic-link-bracelet.png', alt: 'Empress Heritage Jadau Kada', isPrimary: true, displayOrder: 1 },
      { url: '/products/tennis-beaded-bracelet.png', alt: 'Beaded Kada Angle', isPrimary: false, displayOrder: 2 }
    ],
    'riviera-classic-diamond-tennis-bracelet': [
      { url: '/products/tennis-beaded-bracelet.png', alt: 'Riviera Classic Diamond Tennis Bracelet', isPrimary: true, displayOrder: 1 },
      { url: '/products/classic-link-bracelet.png', alt: 'Alternate Clasp View', isPrimary: false, displayOrder: 2 }
    ],
    'the-maharani-royal-bridal-set': [
      { url: '/hero-gold-ring-clean.png', alt: 'The Maharani Royal Bridal Set Ring', isPrimary: true, displayOrder: 1 },
      { url: '/products/polki-emerald-pendant.png', alt: 'Maharani Choker Piece', isPrimary: false, displayOrder: 2 },
      { url: '/products/chandbali-hoop-earrings.png', alt: 'Maharani Earring Suite', isPrimary: false, displayOrder: 3 }
    ],
    'devi-filigree-gold-temple-bangle-draft': [
      { url: '/products/classic-link-bracelet.png', alt: 'Devi Filigree Gold Temple Bangle', isPrimary: true, displayOrder: 1 }
    ]
  };

  for (const [slug, images] of Object.entries(productImagesMap)) {
    const res = await mongoose.connection.db.collection('products').updateOne(
      { slug },
      { $set: { images, updatedAt: new Date() } }
    );
    console.log(`Updated images for ${slug}: matched=${res.matchedCount}, modified=${res.modifiedCount}`);
  }

  console.log('All product records updated with background-less PNG images!');
  process.exit(0);
}

updateProductImages().catch(err => {
  console.error(err);
  process.exit(1);
});

