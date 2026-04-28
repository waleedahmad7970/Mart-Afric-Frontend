// Image assets (reused across related items)
import suya from "@/assets/product-suya.jpg";
import rice from "@/assets/product-rice.jpg";
import palmoil from "@/assets/product-palmoil.jpg";
import hibiscus from "@/assets/product-hibiscus.jpg";
import egusi from "@/assets/product-egusi.jpg";
import plantain from "@/assets/product-plantain.jpg";
import pepper from "@/assets/product-pepper.jpg";
import yam from "@/assets/product-yam.jpg";
import baobab from "@/assets/product-baobab.jpg";
import fonio from "@/assets/product-fonio.jpg";
import moringa from "@/assets/product-moringa.jpg";
import shea from "@/assets/product-shea.jpg";
import bongafish from "@/assets/product-bongafish.jpg";
import garri from "@/assets/product-garri.jpg";
import groundnut from "@/assets/product-groundnut.jpg";
import berbere from "@/assets/product-berbere.jpg";
import milk from "@/assets/product-milk.jpg";
import eggs from "@/assets/product-eggs.jpg";
import bread from "@/assets/product-bread.jpg";
import blender from "@/assets/product-blender.jpg";
import towels from "@/assets/product-towels.jpg";
import candle from "@/assets/product-candle.jpg";
import serum from "@/assets/product-serum.jpg";
import lipstick from "@/assets/product-lipstick.jpg";

export const categories = [
  { slug: "flours-staples", name: "Flours & Staples" },
  { slug: "spices-seasonings", name: "Spices & Seasonings" },
  { slug: "drinks-beverages", name: "Drinks & Beverages" },
  { slug: "fresh-produce", name: "Fresh Produce" },
  { slug: "fish-meat", name: "Fish & Meat" },
  { slug: "oils-pastes", name: "Oils & Pastes" },
  { slug: "kitchenware", name: "Kitchenware" },
  { slug: "beauty-wellness", name: "Beauty & Wellness" },
];

export const products = [
  // FLOURS & STAPLES
  { id: "neat-fufu", name: "Neat Fufu", tagline: "Smooth, lump-free swallow", price: 6.5, category: "flours-staples", image: garri, rating: 4.8, stock: 120, origin: "Ghana", description: "Premium neat fufu flour — smooth, lump-free and ready in minutes for a soft, satisfying swallow." },
  { id: "gari", name: "Gari", tagline: "Classic cassava flakes", price: 5.0, category: "flours-staples", image: garri, rating: 4.7, stock: 200, origin: "Ghana", description: "Traditional gari — sun-fermented cassava flakes for soakings, eba and snacks." },
  { id: "nkulenu-gari", name: "Nkulenu Gari", tagline: "Trusted Ghanaian brand", price: 5.5, category: "flours-staples", image: garri, rating: 4.8, stock: 140, origin: "Ghana", description: "Nkulenu's finely-processed gari — clean, crisp and full of authentic flavour." },
  { id: "kivo-gari", name: "Kivo Gari (All Flavours)", tagline: "Plain · coconut · spiced", price: 6.0, category: "flours-staples", image: garri, rating: 4.7, stock: 160, origin: "Ghana", description: "Kivo gari in a range of flavours — choose plain, coconut or spiced for your favourite swallow." },
  { id: "cassava-flour-kokonte", name: "Cassava Flour (Kokonte)", tagline: "Earthy, hearty staple", price: 7.0, category: "flours-staples", image: garri, rating: 4.6, stock: 110, origin: "Ghana", description: "Sun-dried cassava flour for kokonte — earthy, filling and rich in tradition." },
  { id: "tuo-zafi-flour", name: "Tuo Zafi Flour", tagline: "Northern Ghana favourite", price: 7.5, category: "flours-staples", image: garri, rating: 4.7, stock: 90, origin: "Ghana", description: "Smooth corn flour blend for the perfect tuo zafi — soft, stretchy and traditional." },
  { id: "chinkafa-rice", name: "Chinkafa Rice", tagline: "Premium long-grain", price: 18.0, category: "flours-staples", image: rice, rating: 4.8, stock: 130, origin: "Ghana", description: "Aromatic long-grain Chinkafa rice — fluffy, fragrant and perfect for jollof or plain rice dishes." },
  { id: "hominy-corn-oblaya", name: "Hominy Corn (Oblaya)", tagline: "For ekuegbemi & soups", price: 6.0, category: "flours-staples", image: fonio, rating: 4.6, stock: 75, origin: "Ghana", description: "Whole hominy corn (Oblaya) — slow-cooked into hearty traditional dishes and soups." },
  { id: "whole-millet", name: "Whole Millet", tagline: "Wholesome ancient grain", price: 6.5, category: "flours-staples", image: fonio, rating: 4.7, stock: 100, origin: "Ghana", description: "Nutty whole millet grains — perfect for porridge, brewing or pounding into flour." },
  { id: "powdered-millet", name: "Powdered Millet", tagline: "Quick porridge base", price: 7.0, category: "flours-staples", image: fonio, rating: 4.7, stock: 95, origin: "Ghana", description: "Stone-milled millet powder — ready for porridge, koko and traditional drinks." },
  { id: "tom-brown-sack", name: "Tom Brown (Sack)", tagline: "Roasted grain blend", price: 12.0, category: "flours-staples", image: fonio, rating: 4.8, stock: 60, origin: "Ghana", description: "Family-size sack of Tom Brown — a roasted blend of corn, soybean and groundnut for a nourishing porridge." },
  { id: "fanti-kenkey", name: "Fanti Kenkey", tagline: "Authentic, banana-leaf wrapped", price: 4.5, category: "flours-staples", image: garri, rating: 4.9, stock: 80, origin: "Ghana", description: "Traditional Fanti kenkey — fermented corn dough wrapped and steamed for that signature tang." },
  { id: "bambara-beans", name: "Bambara Beans", tagline: "Protein-rich legume", price: 8.5, category: "flours-staples", image: egusi, rating: 4.7, stock: 70, origin: "Ghana", description: "Earthy, protein-packed Bambara beans — boil, roast or stew for a hearty meal." },
  { id: "ghana-black-eye-beans", name: "Ghana Black Eye Beans", tagline: "Pantry essential", price: 7.0, category: "flours-staples", image: egusi, rating: 4.8, stock: 110, origin: "Ghana", description: "Plump Ghanaian black-eyed beans — perfect for waakye, red red and stews." },

  // SPICES & SEASONINGS
  { id: "remie-seasoning", name: "Remie Seasoning (All Flavours)", tagline: "All-purpose flavour boost", price: 4.0, category: "spices-seasonings", image: suya, rating: 4.7, stock: 200, origin: "Ghana", description: "Remie seasoning in every flavour — instant depth for soups, stews, rice and grills." },
  { id: "kivo-stew-spices", name: "Kivo Stew Spices", tagline: "Bold tomato-stew blend", price: 5.0, category: "spices-seasonings", image: berbere, rating: 4.8, stock: 140, origin: "Ghana", description: "Specially blended Kivo spices to bring out rich, deep flavour in your stews." },
  { id: "kivo-soup-spices", name: "Kivo Soup Spices", tagline: "For light & palm soups", price: 5.0, category: "spices-seasonings", image: berbere, rating: 4.8, stock: 140, origin: "Ghana", description: "Aromatic Kivo blend — the secret to deeply flavourful light soups, palm soups and groundnut soups." },
  { id: "kivo-pepper", name: "Kivo Pepper (All Sizes)", tagline: "Smoky ground pepper", price: 4.5, category: "spices-seasonings", image: pepper, rating: 4.8, stock: 180, origin: "Ghana", description: "Kivo ground pepper in multiple sizes — fiery, smoky and full of character." },
  { id: "prekese", name: "Prekese", tagline: "Aromatic soup pod", price: 6.0, category: "spices-seasonings", image: berbere, rating: 4.8, stock: 90, origin: "Ghana", description: "Fragrant prekese pods — drop into soups for an unmistakable aroma and authentic taste." },
  { id: "gino-curry-powder", name: "Gino Curry Powder", tagline: "Warm everyday curry", price: 3.5, category: "spices-seasonings", image: berbere, rating: 4.7, stock: 220, origin: "Ghana", description: "Trusted Gino curry powder — a warm, balanced blend for jollof, stews and marinades." },
  { id: "gino-jollof-mix", name: "Gino Jollof Mix", tagline: "Restaurant-style jollof", price: 4.0, category: "spices-seasonings", image: berbere, rating: 4.8, stock: 200, origin: "Ghana", description: "All-in-one Gino jollof seasoning — restaurant-style flavour, every time." },
  { id: "tasty-tom-jollof-mix", name: "Tasty Tom Jollof Mix (Big)", tagline: "Family-size pack", price: 6.5, category: "spices-seasonings", image: berbere, rating: 4.7, stock: 160, origin: "Ghana", description: "Big-pack Tasty Tom jollof mix — designed for family gatherings and parties." },
  { id: "fom-wisa", name: "Fom Wisa", tagline: "Aromatic forest pepper", price: 6.0, category: "spices-seasonings", image: pepper, rating: 4.7, stock: 80, origin: "Ghana", description: "Pungent Fom Wisa — adds heat and an unmistakable forest aroma to soups and stews." },
  { id: "ghana-ginger", name: "Ghana Ginger", tagline: "Fresh & fiery", price: 4.5, category: "spices-seasonings", image: pepper, rating: 4.8, stock: 100, origin: "Ghana", description: "Fresh, fiery Ghanaian ginger — essential for tea, marinades and traditional drinks." },
  { id: "onga-cubes", name: "Onga Cubes Seasoning", tagline: "Bouillon classic", price: 3.0, category: "spices-seasonings", image: suya, rating: 4.7, stock: 250, origin: "Ghana", description: "Classic Onga seasoning cubes for flavour-packed soups, sauces and rice." },
  { id: "onga-sachet", name: "Onga Sachet Seasoning", tagline: "Easy single-use packs", price: 2.5, category: "spices-seasonings", image: suya, rating: 4.7, stock: 240, origin: "Ghana", description: "Convenient Onga sachet seasoning — perfect single-use portions for everyday cooking." },
  { id: "maggi-cubes", name: "Maggi Cubes", tagline: "The pantry staple", price: 3.0, category: "spices-seasonings", image: suya, rating: 4.8, stock: 300, origin: "Imported", description: "Trusted Maggi seasoning cubes — instant umami for soups, stews and grilled dishes." },
  { id: "sea-salt", name: "Sea Salt", tagline: "Pure, mineral-rich", price: 2.5, category: "spices-seasonings", image: suya, rating: 4.6, stock: 260, origin: "Imported", description: "Clean, mineral-rich sea salt — your everyday cooking and finishing salt." },
  { id: "whole-egusi", name: "Whole Egusi", tagline: "Hand-shelled melon seeds", price: 8.0, category: "spices-seasonings", image: egusi, rating: 4.7, stock: 90, origin: "Ghana", description: "Buttery, protein-rich whole melon seeds — toast or grind into stews." },
  { id: "ground-egusi", name: "Ground Egusi", tagline: "Ready for stews", price: 9.0, category: "spices-seasonings", image: egusi, rating: 4.7, stock: 90, origin: "Ghana", description: "Pre-ground egusi — straight into the pot for thick, rich, soul-warming stews." },
  { id: "hibiscus-leaves-sobolo", name: "Hibiscus Leaves (Sobolo)", tagline: "Brew the classic drink", price: 5.5, category: "spices-seasonings", image: hibiscus, rating: 4.8, stock: 200, origin: "Ghana", description: "Dried hibiscus leaves for sobolo — tart, ruby-red and refreshing hot or iced." },
  { id: "chewing-sticks", name: "Chewing Sticks", tagline: "Traditional oral care", price: 3.0, category: "spices-seasonings", image: berbere, rating: 4.6, stock: 150, origin: "Ghana", description: "Natural chewing sticks — the time-honoured way to clean and freshen your mouth." },

  // DRINKS & BEVERAGES
  { id: "nkulenu-hausa-koko", name: "Nkulenu Hausa Koko", tagline: "Spiced millet porridge mix", price: 6.0, category: "drinks-beverages", image: fonio, rating: 4.8, stock: 110, origin: "Ghana", description: "Nkulenu Hausa Koko mix — a warming, spiced millet porridge ready in minutes." },
  { id: "comas-hausa-koko", name: "Comas Hausa Koko", tagline: "Quick spiced porridge", price: 6.0, category: "drinks-beverages", image: fonio, rating: 4.7, stock: 100, origin: "Ghana", description: "Comas Hausa Koko — fragrant, gently-spiced porridge for breakfast or any time." },
  { id: "nkulenu-abemudro", name: "Nkulenu Abemudro", tagline: "Authentic palm fruit drink", price: 7.5, category: "drinks-beverages", image: hibiscus, rating: 4.7, stock: 80, origin: "Ghana", description: "Nkulenu Abemudro — the authentic taste of palm fruit, ready to enjoy." },
  { id: "sorrel-juice", name: "Sorrel Juice", tagline: "Tart & refreshing", price: 4.0, category: "drinks-beverages", image: hibiscus, rating: 4.7, stock: 140, origin: "Ghana", description: "Chilled sorrel juice — naturally tart, ruby-red and wonderfully refreshing." },
  { id: "milo", name: "Milo", tagline: "Energy chocolate drink", price: 8.5, category: "drinks-beverages", image: milk, rating: 4.9, stock: 200, origin: "Imported", description: "Classic Milo — the malty chocolate energy drink loved across generations." },
  { id: "cerelac", name: "Cerelac", tagline: "Infant cereal", price: 9.5, category: "drinks-beverages", image: milk, rating: 4.8, stock: 140, origin: "Imported", description: "Nutritious Cerelac infant cereal — fortified with vitamins and iron for growing little ones." },
  { id: "wheat-drink", name: "Wheat Drink", tagline: "Wholesome breakfast", price: 7.0, category: "drinks-beverages", image: milk, rating: 4.7, stock: 120, origin: "Ghana", description: "Smooth, hearty wheat drink — a wholesome way to start the day." },
  { id: "cottage-fresh-drink", name: "Cottage Fresh", tagline: "Refreshingly natural", price: 5.5, category: "drinks-beverages", image: milk, rating: 4.7, stock: 130, origin: "Ghana", description: "Cottage Fresh — a clean, refreshing everyday drink the whole family will love." },
  { id: "ceres-fruit-juice", name: "Ceres Fruit Juice", tagline: "100% pure juice", price: 4.5, category: "drinks-beverages", image: hibiscus, rating: 4.8, stock: 180, origin: "Imported", description: "Ceres 100% pure fruit juice — no added sugar, just bright natural fruit flavour." },
  { id: "don-simon-juice", name: "Don Simon Fruit Juices", tagline: "Mediterranean classic", price: 4.5, category: "drinks-beverages", image: hibiscus, rating: 4.7, stock: 160, origin: "Imported", description: "Don Simon premium fruit juices — naturally rich flavour from sun-ripened fruit." },
  { id: "fanta", name: "Fanta", tagline: "Crisp orange soda", price: 2.5, category: "drinks-beverages", image: hibiscus, rating: 4.7, stock: 300, origin: "Imported", description: "Ice-cold Fanta — bubbly, fruity and the perfect everyday refreshment." },

  // FRESH PRODUCE
  { id: "cocoyam-leaves-kontomire", name: "Cocoyam Leaves (Kontomire)", tagline: "For palaver sauce", price: 4.5, category: "fresh-produce", image: plantain, rating: 4.8, stock: 80, origin: "Ghana", description: "Tender kontomire (cocoyam) leaves — the heart of a great palaver sauce." },
  { id: "turkey-berries", name: "Turkey Berries (Kwahu Nsusua)", tagline: "Bitter, traditional", price: 5.0, category: "fresh-produce", image: pepper, rating: 4.7, stock: 70, origin: "Ghana", description: "Pleasantly bitter turkey berries — a classic addition to traditional Ghanaian dishes." },
  { id: "apem-plantain", name: "Apem Plantain", tagline: "Firm cooking plantain", price: 4.0, category: "fresh-produce", image: plantain, rating: 4.7, stock: 90, origin: "Ghana", description: "Firm Apem plantain — perfect for boiling, roasting and ampesi." },
  { id: "puna-yam", name: "Puna Yam", tagline: "Premium Ghanaian yam", price: 9.0, category: "fresh-produce", image: yam, rating: 4.8, stock: 70, origin: "Ghana", description: "Top-grade Puna yam — creamy, dense and ideal for fufu, ampesi or roasting." },

  // FISH & MEAT
  { id: "adwene", name: "Adwene", tagline: "Smoked tilapia delicacy", price: 12.0, category: "fish-meat", image: bongafish, rating: 4.7, stock: 50, origin: "Ghana", description: "Slow-smoked Adwene (tilapia) — deeply savoury and ready for stews and soups." },
  { id: "african-queen-mackerel", name: "African Queen Mackerel", tagline: "Tinned mackerel", price: 3.5, category: "fish-meat", image: bongafish, rating: 4.7, stock: 220, origin: "Imported", description: "African Queen mackerel in tomato sauce — pantry-ready protein for fast, tasty meals." },
  { id: "african-queen-sardines", name: "African Queen Sardines", tagline: "In rich sauce", price: 3.0, category: "fish-meat", image: bongafish, rating: 4.7, stock: 240, origin: "Imported", description: "African Queen sardines — convenient, protein-rich and full of flavour." },
  { id: "african-queen-fufu", name: "African Queen Fufu", tagline: "Instant fufu mix", price: 5.5, category: "fish-meat", image: garri, rating: 4.7, stock: 150, origin: "Ghana", description: "African Queen instant fufu — smooth swallow ready in minutes." },

  // OILS & PASTES
  { id: "palm-oil", name: "Palm Oil", tagline: "Traditional red palm oil", price: 12.0, category: "oils-pastes", image: palmoil, rating: 4.8, stock: 110, origin: "Ghana", description: "Rich, vibrant red palm oil — essential for jollof, stews and authentic West African cooking." },
  { id: "groundnut-paste", name: "Groundnut Paste", tagline: "Stone-ground peanut paste", price: 7.5, category: "oils-pastes", image: groundnut, rating: 4.8, stock: 130, origin: "Ghana", description: "Pure stone-ground groundnut paste — the heart of a great groundnut soup." },
  { id: "nkulenu-palm-soup", name: "Nkulenu Palm Soup", tagline: "Ready-to-cook soup base", price: 9.0, category: "oils-pastes", image: palmoil, rating: 4.8, stock: 90, origin: "Ghana", description: "Authentic Nkulenu palm soup base — rich, smooth and packed with traditional flavour." },

  // KITCHENWARE
  { id: "asanka-all-sizes", name: "Asanka (All Sizes)", tagline: "Traditional grinding bowl", price: 14.0, category: "kitchenware", image: blender, rating: 4.8, stock: 60, origin: "Ghana", description: "Traditional asanka clay grinding bowl — available in all sizes for pepper, shito and sauces." },
  { id: "clay-bowls-asanka", name: "Clay Bowls (Asanka)", tagline: "Hand-thrown clay bowls", price: 12.0, category: "kitchenware", image: blender, rating: 4.7, stock: 70, origin: "Ghana", description: "Beautifully hand-thrown asanka clay bowls — for grinding, serving and presentation." },
  { id: "wooden-masher-tapoli", name: "Wooden Masher (Tapoli)", tagline: "For banku & kenkey", price: 8.0, category: "kitchenware", image: blender, rating: 4.7, stock: 80, origin: "Ghana", description: "Hand-carved wooden tapoli masher — built for banku, kenkey and stirring thick stews." },
  { id: "wooden-spoons-banku-ta", name: "Wooden Spoons (Banku Ta)", tagline: "Carved hardwood", price: 6.0, category: "kitchenware", image: blender, rating: 4.7, stock: 120, origin: "Ghana", description: "Hand-carved Banku Ta wooden spoons — strong enough to stir the heaviest swallow." },
  { id: "wooden-mortar-pestle", name: "Wooden Mortar & Pestle", tagline: "Pound fufu the right way", price: 28.0, category: "kitchenware", image: blender, rating: 4.8, stock: 40, origin: "Ghana", description: "Sturdy wooden mortar and pestle — built to pound fufu, yam and traditional pastes." },
  { id: "big-calabash-lid", name: "Big Calabash and Lid", tagline: "Natural serving vessel", price: 18.0, category: "kitchenware", image: blender, rating: 4.7, stock: 35, origin: "Ghana", description: "Large natural calabash with matching lid — for storing, serving and traditional ceremonies." },
  { id: "coal-pot", name: "Coal Pot", tagline: "Outdoor charcoal stove", price: 35.0, category: "kitchenware", image: blender, rating: 4.8, stock: 25, origin: "Ghana", description: "Sturdy traditional coal pot — perfect for grilling, smoky stews and outdoor cooking." },

  // BEAUTY & WELLNESS
  { id: "shea-butter", name: "Shea Butter", tagline: "Raw, unrefined", price: 16.0, category: "beauty-wellness", image: shea, rating: 4.9, stock: 90, origin: "Ghana", description: "Pure, unrefined shea butter — nourishing for skin, hair and lips." },
  { id: "cottage-fresh-black-soap", name: "Cottage Fresh Black Soap (All Flavours)", tagline: "Traditional African black soap", price: 8.0, category: "beauty-wellness", image: serum, rating: 4.8, stock: 130, origin: "Ghana", description: "Cottage Fresh black soap in every flavour — a deeply cleansing, all-natural skincare classic." },
  { id: "funbact", name: "Funbact", tagline: "Skin care cream", price: 6.5, category: "beauty-wellness", image: serum, rating: 4.6, stock: 150, origin: "Imported", description: "Funbact cream — a trusted choice for everyday skin care and protection." },
];

export const findProduct = (id) => products.find((p) => p.id === id);
