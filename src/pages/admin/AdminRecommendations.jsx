import {
  Sparkles,
  Database,
  Server,
  Cpu,
  GitBranch,
  ShieldCheck,
  Workflow,
} from "lucide-react";

const Section = ({ icon: Icon, title, children }) => (
  <section className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-4">
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="font-display text-2xl">{title}</h2>
    </div>
    <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
      {children}
    </div>
  </section>
);

const Code = ({ children }) => (
  <pre className="bg-muted/60 border border-border rounded-xl p-4 text-xs overflow-x-auto text-foreground">
    <code>{children}</code>
  </pre>
);

const Pill = ({ children }) => (
  <span className="text-[11px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
    {children}
  </span>
);

const AdminRecommendations = () => (
  <div className="space-y-8 max-w-5xl">
    <div>
      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
        Engineering docs
      </p>
      <h1 className="font-display text-4xl">
        Personalized recommendation engine
      </h1>
      <p className="text-muted-foreground mt-3 max-w-2xl">
        How Mart Afric surfaces "Picked for you" suggestions today, and the
        migration path to a Node.js / Express backend with a real ML pipeline.
      </p>
      <div className="flex flex-wrap gap-2 mt-4">
        <Pill>Client-side v1</Pill>
        <Pill>Edge ready</Pill>
        <Pill>Node.js migration plan</Pill>
      </div>
    </div>

    <Section icon={Sparkles} title="1. What it does today">
      <p>
        The storefront ranks every product against the items a shopper is
        currently viewing (Product Detail), has added to cart (Cart page), or
        against the catalog's top-rated items (Home page). The top N results
        render in the <em>Picked for you</em> slider.
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong>Product Detail</strong> — seeded by the active product.
        </li>
        <li>
          <strong>Cart</strong> — seeded by every item in the basket
          (multi-seed).
        </li>
        <li>
          <strong>Home</strong> — seeded by bestsellers as a "trending" feed.
        </li>
      </ul>
    </Section>

    <Section icon={Cpu} title="2. The scoring algorithm">
      <p>
        It's a deterministic content-based ranker. For each candidate product we
        compute a weighted score against each seed and sum them:
      </p>
      <Code>{`score(candidate, seed) =
    5  if same category
  + 2  if same origin
  + 2  if |Δprice| / seed.price ≤ 0.30
  + 1  if |Δprice| / seed.price ≤ 0.60
  + 1.5 × max(0, rating − 4)
  + min(keyword_overlap(tagline+desc+name), 5)`}</Code>
      <p>
        Multi-seed totals are normalized by <code>√n</code> to avoid biasing
        toward shoppers with large carts. Stop-words are stripped during
        tokenization so generic terms like "perfect" or "essential" don't
        pollute the overlap signal.
      </p>
      <p className="text-xs">
        Source: <code>src/lib/suggestions.js</code> · API:{" "}
        <code>getSuggestions(seeds, limit)</code>
      </p>
    </Section>

    <Section icon={Workflow} title="3. Data flow (current)">
      <Code>{`User views product
        │
        ▼
ProductDetail.jsx ──► getSuggestions([product], 8)
                              │
                              ▼
                  src/lib/suggestions.js  (pure JS, in-browser)
                              │
                              ▼
                  AiSuggestions.jsx  (carousel UI)`}</Code>
      <p>
        Everything runs in the browser. No network call, no cold start, no
        privacy concerns — but also no learning from real user behavior.
      </p>
    </Section>

    <Section icon={Server} title="4. Migration to Node.js backend">
      <p>
        When you're ready to graduate from heuristics to behavior-driven
        recommendations, here is the recommended architecture:
      </p>
      <Code>{`┌──────────────┐       ┌──────────────────────┐       ┌─────────────────┐
│  React app   │──────►│  Node.js / Express   │──────►│  PostgreSQL     │
│  (frontend)  │  HTTP │  /api/recommendations│  SQL  │  events, items  │
└──────────────┘       └──────────┬───────────┘       └─────────────────┘
                                  │
                                  ▼
                       ┌──────────────────────┐
                       │  Redis  (hot cache)  │
                       └──────────────────────┘
                                  │
                                  ▼
                       ┌──────────────────────┐
                       │  ML worker (Python)  │
                       │  trains nightly      │
                       └──────────────────────┘`}</Code>

      <h3 className="font-display text-lg text-foreground pt-2">
        4.1 Endpoints
      </h3>
      <Code>{`GET  /api/recommendations?userId=...&seed=ofada-rice&limit=8
POST /api/events    { userId, type: "view"|"add_to_cart"|"purchase", productId }
GET  /api/products/:id/similar?limit=8`}</Code>

      <h3 className="font-display text-lg text-foreground pt-2">
        4.2 Express skeleton
      </h3>
      <Code>{`// server/routes/recommendations.js
import { Router } from "express";
import { getSuggestionsFor } from "../services/recommender.js";
import { cache } from "../lib/redis.js";

const router = Router();

router.get("/recommendations", async (req, res) => {
  const { userId, seed, limit = 8 } = req.query;
  const key = \`rec:\${userId ?? "anon"}:\${seed ?? "home"}:\${limit}\`;

  const cached = await cache.get(key);
  if (cached) return res.json(JSON.parse(cached));

  const items = await getSuggestionsFor({ userId, seed, limit: +limit });
  await cache.setex(key, 300, JSON.stringify(items)); // 5-min TTL
  res.json(items);
});

export default router;`}</Code>

      <h3 className="font-display text-lg text-foreground pt-2">
        4.3 Recommender service
      </h3>
      <Code>{`// server/services/recommender.js
// Hybrid: content-based (today's algorithm) + collaborative filtering
export async function getSuggestionsFor({ userId, seed, limit }) {
  const [contentScores, cfScores] = await Promise.all([
    contentBased(seed),                  // ports src/lib/suggestions.js
    collaborativeFiltering(userId),      // "users who bought X also bought Y"
  ]);

  // Weighted blend — tune α with A/B tests
  const α = 0.4;
  const merged = blend(contentScores, cfScores, α);
  return merged.slice(0, limit);
}`}</Code>

      <h3 className="font-display text-lg text-foreground pt-2">
        4.4 Frontend swap
      </h3>
      <p>
        Only one file changes on the client. Replace the import in
        <code> AiSuggestions.jsx</code>:
      </p>
      <Code>{`// before
import { getSuggestions } from "@/lib/suggestions";
const items = getSuggestions(seeds, limit);

// after
const res = await fetch(
  \`/api/recommendations?seed=\${seeds[0].id}&limit=\${limit}\`
);
const items = await res.json();`}</Code>
      <p>Wrap it in TanStack Query for caching, retries and loading states.</p>
    </Section>

    <Section icon={Database} title="5. Database schema">
      <Code>{`-- events: every interaction the recommender learns from
CREATE TABLE events (
  id          BIGSERIAL PRIMARY KEY,
  user_id     UUID,
  product_id  TEXT NOT NULL,
  event_type  TEXT NOT NULL,   -- view | add_to_cart | purchase
  created_at  TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX ON events (user_id, created_at DESC);
CREATE INDEX ON events (product_id, event_type);

-- precomputed item-item similarity (refreshed nightly)
CREATE TABLE item_similarity (
  product_id   TEXT NOT NULL,
  similar_id   TEXT NOT NULL,
  score        REAL NOT NULL,
  PRIMARY KEY (product_id, similar_id)
);`}</Code>
    </Section>

    <Section icon={GitBranch} title="6. Rollout plan">
      <ol className="list-decimal pl-5 space-y-2">
        <li>
          <strong>Phase 0 (now)</strong> — client-side heuristic, no tracking.
        </li>
        <li>
          <strong>Phase 1</strong> — stand up Express + Postgres, port the
          algorithm, start logging <code>events</code>. No UI change.
        </li>
        <li>
          <strong>Phase 2</strong> — add Redis cache + popularity fallback for
          cold-start users.
        </li>
        <li>
          <strong>Phase 3</strong> — nightly Python job computes item-item
          similarity (cosine on co-purchase matrix).
        </li>
        <li>
          <strong>Phase 4</strong> — A/B test heuristic vs. hybrid; tune the
          blend weight α.
        </li>
        <li>
          <strong>Phase 5</strong> — personalize per user (matrix factorization
          / two-tower model).
        </li>
      </ol>
    </Section>

    <Section icon={ShieldCheck} title="7. Privacy & ops checklist">
      <ul className="list-disc pl-5 space-y-1">
        <li>
          Hash <code>user_id</code> server-side; never log raw emails into
          events.
        </li>
        <li>
          Respect "Do Not Track" — fall back to anonymous popularity feed.
        </li>
        <li>Cache TTL ≤ 5 min so price/stock changes propagate quickly.</li>
        <li>
          Always return a <em>non-empty</em> result — degrade to bestsellers on
          error.
        </li>
        <li>
          Instrument CTR on suggestion slots — that's the north-star metric.
        </li>
      </ul>
    </Section>
  </div>
);

export default AdminRecommendations;
