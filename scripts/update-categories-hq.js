const mongoose = require('mongoose');

async function updateCategoryImages() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jewellery_store';
  await mongoose.connect(uri);

  const catMap = {
    'necklaces-pendants': '/products/royal-polki-choker-hq.png',
    'earrings-jhumkas': '/products/chandbali-earrings-hq.png',
    'bangles-bracelets': '/products/tennis-bracelet-hq.png',
    'statement-rings': '/hero-gold-ring-hq.png',
    'bridal-heritage-sets': '/products/royal-polki-choker-hq.png',
  };

  for (const [slug, imageUrl] of Object.entries(catMap)) {
    const res = await mongoose.connection.db.collection('categories').updateOne(
      { slug },
      { $set: { imageUrl, updatedAt: new Date() } }
    );
    console.log(`Updated category ${slug}: matched=${res.matchedCount}, modified=${res.modifiedCount}`);
  }

  console.log('All MongoDB categories updated with HQ images!');
  process.exit(0);
}

updateCategoryImages().catch((err) => {
  console.error(err);
  process.exit(1);
});

