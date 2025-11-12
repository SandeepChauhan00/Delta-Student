require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("./models/listing");

const ownerId = "69144ef80c48982cdf6fb817";

// 20 high-quality Unsplash image URLs
const sampleImages = [
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1505691723518-36a1c44d1d61?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1519821172141-b5d8b32da2e7?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1472224371017-08207f84aaae?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1505691723518-36a1c44d1d61?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
];

const locations = [
  "Goa, India",
  "Manali, India",
  "Jaipur, India",
  "Mumbai, India",
  "Rishikesh, India",
  "Darjeeling, India",
  "Udaipur, India",
  "Leh, India",
  "Varanasi, India",
  "Bangalore, India",
  "Chennai, India",
  "Kolkata, India",
  "Shimla, India",
  "Ooty, India",
  "Nainital, India",
  "Pune, India",
  "Mysore, India",
  "Jodhpur, India",
  "Amritsar, India",
  "Ahmedabad, India"
];

const categories = [
  "rooms",
  "mountain",
  "city",
  "castle",
  "pool",
  "camp",
  "farm",
  "dome",
  "boat",
  "trending"
];

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("✅ Connected to MongoDB");

  await Listing.deleteMany({});
  console.log("🧹 Old listings removed.");

  const listings = [];

  for (let i = 0; i < 20; i++) {
    const randomImage = sampleImages[i];
    const randomLocation = locations[i];
    const randomCategory = categories[i % categories.length];
    const randomPrice = Math.floor(Math.random() * 7000) + 1500;

    listings.push({
      title: `${randomLocation.split(",")[0]} ${randomCategory} Escape ${i + 1}`,
      description: `Discover an exclusive ${randomCategory}-themed experience in ${randomLocation}. Perfect for comfort, relaxation, and adventure.`,
      image: {
        url: randomImage,
        filename: `listing-${i + 1}.jpg`
      },
      price: randomPrice,
      location: randomLocation,
      country: "India",
      owner: ownerId,
      category: randomCategory,
      geometry: {
        type: "Point",
        coordinates: [77.209, 28.6139]
      }
    });
  }

  await Listing.insertMany(listings);
  console.log("✅ 20 unique listings added with real images!");
  mongoose.connection.close();
}

main().catch((err) => console.error(err));
