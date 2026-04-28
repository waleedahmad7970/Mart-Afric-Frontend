// Tracks user behavior on-device to power AI-style personalized suggestions.
// Signals captured:
//   - product views (recency-weighted)
//   - cart additions (stronger signal)
//   - category & origin affinities (derived)
//   - price band preference (derived)
//
// Stored in localStorage so it persists across sessions without a backend.

import { products } from "@/data/products";

const KEY = "Mart Afric-taste-v1";
const MAX_EVENTS = 80;

const load = () => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { events: [] };
    const parsed = JSON.parse(raw);
    return { events: Array.isArray(parsed.events) ? parsed.events : [] };
  } catch {
    return { events: [] };
  }
};

const save = (state) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore quota */
  }
};

/** Record a product interaction. type: "view" | "cart" | "purchase" */
export const trackInteraction = (productId, type = "view") => {
  if (!productId) return;
  const state = load();
  state.events.push({ id: productId, type, t: Date.now() });
  if (state.events.length > MAX_EVENTS) {
    state.events = state.events.slice(-MAX_EVENTS);
  }
  save(state);
};

export const clearTaste = () => save({ events: [] });

const WEIGHT = { view: 1, cart: 4, purchase: 6 };
const HALF_LIFE_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

const decay = (t) => {
  const age = Math.max(0, Date.now() - t);
  return Math.pow(0.5, age / HALF_LIFE_MS);
};

/**
 * Build a taste profile from stored events.
 * Returns weighted seed products + category/origin affinity maps + price band.
 */
export const getTasteProfile = () => {
  const { events } = load();
  if (!events.length) {
    return {
      seeds: [],
      categoryWeights: {},
      originWeights: {},
      avgPrice: null,
      hasSignal: false,
    };
  }

  const productScores = {};
  const categoryWeights = {};
  const originWeights = {};
  let priceSum = 0;
  let priceWeight = 0;

  events.forEach((e) => {
    const product = products.find((p) => p.id === e.id);
    if (!product) return;
    const w = (WEIGHT[e.type] || 1) * decay(e.t);
    productScores[product.id] = (productScores[product.id] || 0) + w;
    categoryWeights[product.category] =
      (categoryWeights[product.category] || 0) + w;
    if (product.origin) {
      originWeights[product.origin] = (originWeights[product.origin] || 0) + w;
    }
    priceSum += product.price * w;
    priceWeight += w;
  });

  const seeds = Object.entries(productScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id]) => products.find((p) => p.id === id))
    .filter(Boolean);

  return {
    seeds,
    categoryWeights,
    originWeights,
    avgPrice: priceWeight > 0 ? priceSum / priceWeight : null,
    hasSignal: seeds.length > 0,
  };
};

/** Top categories from the user's taste, ordered by affinity. */
export const getTopCategories = (limit = 3) => {
  const { categoryWeights } = getTasteProfile();
  return Object.entries(categoryWeights)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([slug]) => slug);
};
