import { useEffect, useState } from "react";
import { Sparkles, TrendingUp, Heart, ShoppingBag } from "lucide-react";
import AiSuggestions from "@/components/AiSuggestions";
import { getTasteProfile } from "@/lib/userTaste";
import { getProfileSuggestions, getTrending, getFrequentlyBoughtTogether } from "@/lib/suggestions";
import { useCart } from "@/context/CartContext";
import { products, categories } from "@/data/products";

/**
 * Multi-rail recommendation block.
 *  - "Just for you" — built from the user's taste profile (views + cart).
 *  - "Because you viewed X" — keyword/category similarity to the last seed.
 *  - "Frequently bought with your cart" — cross-sell when cart has items.
 *  - "Trending in <top category>" — discovery with category filter.
 *
 * Re-renders whenever the route/seed prop changes so it feels live.
 */
const PersonalizedRails = ({ contextSeed = null, excludeIds = [] }) => {
  const [profile, setProfile] = useState({ seeds: [], hasSignal: false, categoryWeights: {} });
  const { items: cartItems } = useCart();

  useEffect(() => {
    setProfile(getTasteProfile());
  }, [contextSeed?.id, cartItems.length]);

  const exclude = [...excludeIds, ...(contextSeed ? [contextSeed.id] : [])];

  // 1. Just for you — profile-based
  const personalized = profile.hasSignal
    ? getProfileSuggestions(profile, 8, { exclude })
    : [];

  // 2. Because you viewed (only on PDP)
  const becauseYou = contextSeed ? null : null; // handled via AiSuggestions below

  // 3. Cross-sell with cart
  const crossSell = getFrequentlyBoughtTogether(cartItems, 8);

  // 4. Trending in your top category
  const topCatSlug = Object.entries(profile.categoryWeights || {})
    .sort((a, b) => b[1] - a[1])[0]?.[0];
  const topCat = categories.find((c) => c.slug === topCatSlug);
  const trendingInCat = topCatSlug
    ? products
        .filter((p) => p.category === topCatSlug && !exclude.includes(p.id))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 8)
    : getTrending(8, { exclude });

  return (
    <div className="space-y-2">
      {contextSeed && (
        <AiSuggestions
          seeds={[contextSeed, ...profile.seeds.slice(0, 2)]}
          limit={8}
          title={`Because you're viewing ${contextSeed.name}`}
          subtitle="Curated by our recommendation engine using your browsing patterns and product similarity."
        />
      )}

      {personalized.length > 0 && (
        <RailFromProducts
          icon={Sparkles}
          chip="Just for you"
          title="Picks based on your taste"
          subtitle={`Built from ${profile.seeds.length} item${profile.seeds.length === 1 ? "" : "s"} you've explored — refreshes as you browse.`}
          items={personalized}
        />
      )}

      {crossSell.length > 0 && (
        <RailFromProducts
          icon={ShoppingBag}
          chip="Complete your cart"
          title="Frequently bought together"
          subtitle="Pairs perfectly with what's in your cart right now."
          items={crossSell}
        />
      )}

      <RailFromProducts
        icon={topCat ? Heart : TrendingUp}
        chip={topCat ? `More in ${topCat.name}` : "Trending now"}
        title={topCat ? `You'll love these in ${topCat.name}` : "Trending across the mart"}
        subtitle={topCat ? "Top-rated picks in the aisle you shop most." : "What customers are loving this week."}
        items={trendingInCat}
      />
    </div>
  );
};

// Lightweight rail that re-uses AiSuggestions' visual shell with preset items.
const RailFromProducts = ({ chip, title, subtitle, items, icon: Icon }) => {
  if (!items?.length) return null;
  return (
    <AiSuggestions
      // Pass items via a synthetic seed list won't work — render directly:
      seeds={[]}
      limit={0}
      title={title}
      subtitle={subtitle}
      _override={{ items, chip, Icon }}
    />
  );
};

export default PersonalizedRails;
