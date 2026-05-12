import { useEffect, useState } from "react";
import { TrendingUp, Sparkles, ShoppingBag } from "lucide-react";
import AiSuggestions from "@/components/AiSuggestions";
import productsApis from "../api/products/products-apis";
import aiSuggestionApis from "../api/ai-suggestion/ai-suggestion-apis";

const PersonalizedRails = ({ contextSeed = null }) => {
  const [bestSellers, setBestSellers] = useState([]);
  const [trending, setTrending] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const [bestRes] = await productsApis.getBestSellers();
      const [trendRes] = await productsApis.trendingProducts();
      const [featRes] = await productsApis.featuredProducts();
      if (contextSeed?.name) {
        const [smartSearch] = await aiSuggestionApis.smartSearch({
          query: contextSeed?.name,
        });
        setSearch(smartSearch?.data?.data);
      }

      setBestSellers(bestRes?.data?.data || []);
      setTrending(trendRes?.data?.data || []);
      setFeatured(featRes?.data?.data || []);

      setLoading(false);
    };

    load();
  }, [contextSeed?._id]);

  if (loading) {
    return <div className="animate-pulse h-40 bg-secondary/20 rounded-xl" />;
  }

  return (
    <div className="space-y-12 mt-16">
      {/* Trending */}
      <RailFromProducts
        icon={TrendingUp}
        title="Trending across the mart"
        items={trending}
      />

      {/* Best Sellers */}
      <RailFromProducts
        icon={Sparkles}
        title="Best Sellers"
        items={bestSellers}
      />

      {/* Featured */}
      <RailFromProducts
        icon={ShoppingBag}
        title="Featured Products"
        items={featured}
      />

      {/* Context AI (optional) */}
      {contextSeed && search?.length > 0 && (
        <AiSuggestions
          _override={{
            items: search,
            chip: "AI Match",
            Icon: Sparkles,
          }}
          title={`More like ${contextSeed?.name}`}
          subtitle="Based on AI product similarity"
        />
      )}
    </div>
  );
};

export default PersonalizedRails;
const RailFromProducts = ({ title, subtitle, items = [], icon: Icon }) => {
  if (!items.length) return null;

  return (
    <AiSuggestions
      seeds={[]}
      limit={0}
      title={title}
      subtitle={subtitle}
      _override={{
        items,
        chip: "Recommended",
        Icon,
      }}
    />
  );
};
