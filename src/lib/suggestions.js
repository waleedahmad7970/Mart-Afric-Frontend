import { products } from "@/data/products";

// Lightweight, deterministic "AI-style" recommender.
// Scores every product against a set of seed products and returns top-N.
//
// Signals:
//  - same category   (+5)
//  - same origin     (+2)
//  - similar price   (within 30% → +2, within 60% → +1)
//  - high rating     (rating - 4) * 1.5
//  - keyword overlap in tagline/description (+1 per shared meaningful word)
//
// This gives personalized, varied results without needing a backend.

const STOP_WORDS = new Set([
  "the","a","an","and","or","of","for","with","in","on","to","is","at","by",
  "from","as","it","its","this","that","be","are","into","over","under",
  "perfect","essential","best","ever","you","your","our","their","west",
  "african","africa","make","makes","made","use","used"
]);

const tokenize = (text = "") =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w));

const keywordsFor = (p) =>
  new Set([...tokenize(p.tagline), ...tokenize(p.description), ...tokenize(p.name)]);

const scorePair = (candidate, seed, seedKeywords) => {
  let score = 0;
  if (candidate.category === seed.category) score += 5;
  if (candidate.origin === seed.origin) score += 2;

  const priceRatio = Math.abs(candidate.price - seed.price) / Math.max(seed.price, 1);
  if (priceRatio <= 0.3) score += 2;
  else if (priceRatio <= 0.6) score += 1;

  score += Math.max(0, (candidate.rating - 4)) * 1.5;

  const candKeywords = keywordsFor(candidate);
  let overlap = 0;
  candKeywords.forEach((w) => {
    if (seedKeywords.has(w)) overlap += 1;
  });
  score += Math.min(overlap, 5);

  return score;
};

/**
 * Return AI-style recommended products based on one or more seeds.
 * @param {Array} seeds - product objects the user has shown interest in
 * @param {number} limit - max number of suggestions
 * @param {Object} options - { exclude: string[] of product ids to exclude }
 */
export const getSuggestions = (seeds = [], limit = 4, options = {}) => {
  const exclude = new Set(options.exclude || []);

  if (!seeds.length) {
    return [...products]
      .filter((p) => !exclude.has(p.id))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  const seedIds = new Set(seeds.map((s) => s.id));
  const seedKeywordSets = seeds.map(keywordsFor);

  const scored = products
    .filter((p) => !seedIds.has(p.id) && !exclude.has(p.id))
    .map((candidate) => {
      let total = 0;
      seeds.forEach((seed, i) => {
        total += scorePair(candidate, seed, seedKeywordSets[i]);
      });
      total = total / Math.sqrt(seeds.length);
      return { product: candidate, score: total };
    })
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.product);
};

/**
 * Profile-aware suggestions. Uses category/origin/price affinity even when
 * seed signal is weak.
 */
export const getProfileSuggestions = (profile, limit = 8, options = {}) => {
  const exclude = new Set(options.exclude || []);
  const { categoryWeights = {}, originWeights = {}, avgPrice, seeds = [] } = profile || {};
  const seedIds = new Set(seeds.map((s) => s.id));
  const seedKeywordSets = seeds.map(keywordsFor);

  const maxCat = Math.max(1, ...Object.values(categoryWeights));
  const maxOri = Math.max(1, ...Object.values(originWeights));

  const scored = products
    .filter((p) => !seedIds.has(p.id) && !exclude.has(p.id))
    .map((candidate) => {
      let score = 0;
      score += ((categoryWeights[candidate.category] || 0) / maxCat) * 6;
      if (candidate.origin) {
        score += ((originWeights[candidate.origin] || 0) / maxOri) * 2;
      }
      if (avgPrice) {
        const ratio = Math.abs(candidate.price - avgPrice) / Math.max(avgPrice, 1);
        if (ratio <= 0.3) score += 2;
        else if (ratio <= 0.6) score += 1;
      }
      score += Math.max(0, candidate.rating - 4) * 1.2;

      seeds.forEach((seed, i) => {
        score += scorePair(candidate, seed, seedKeywordSets[i]) * 0.4;
      });

      // Tiny tiebreaker so identical scores don't always land on same items
      score += (candidate.stock % 7) * 0.01;
      return { product: candidate, score };
    })
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.product);
};

/** Cross-sell: items that pair well with what's currently in the cart. */
export const getFrequentlyBoughtTogether = (cartItems = [], limit = 4) => {
  if (!cartItems.length) return [];
  const seeds = cartItems
    .map((i) => products.find((p) => p.id === i.id))
    .filter(Boolean);
  return getSuggestions(seeds, limit, { exclude: cartItems.map((i) => i.id) });
};

/** Trending = best rated overall, with light recency bias from stock churn. */
export const getTrending = (limit = 8, options = {}) => {
  const exclude = new Set(options.exclude || []);
  return [...products]
    .filter((p) => !exclude.has(p.id))
    .sort((a, b) => b.rating - a.rating || b.stock - a.stock)
    .slice(0, limit);
};
