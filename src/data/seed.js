export const seedUsers = [
  { id: "u1", name: "Amara Okafor", email: "amara@sahel.com", role: "admin", joined: "2024-03-12" },
  { id: "u2", name: "Kwame Mensah", email: "kwame@example.com", role: "customer", joined: "2024-08-04" },
  { id: "u3", name: "Zainab Bello", email: "zainab@example.com", role: "customer", joined: "2025-01-22" },
  { id: "u4", name: "Tunde Adeyemi", email: "tunde@example.com", role: "customer", joined: "2025-04-09" },
];

export const seedOrders = [
  {
    id: "ORD-10293",
    customer: "Kwame Mensah",
    email: "kwame@example.com",
    date: "2026-04-18",
    status: "Delivered",
    total: 64.5,
    items: [
      { id: "suya-spice", name: "Suya Pepper Blend", qty: 2, price: 12 },
      { id: "ofada-rice", name: "Ofada Heritage Rice", qty: 1, price: 18.5 },
      { id: "hibiscus", name: "Dried Hibiscus", qty: 1, price: 9.5 },
    ],
  },
  {
    id: "ORD-10294",
    customer: "Zainab Bello",
    email: "zainab@example.com",
    date: "2026-04-19",
    status: "Shipped",
    total: 42.0,
    items: [
      { id: "palm-oil", name: "Cold-Pressed Palm Oil", qty: 1, price: 22 },
      { id: "egusi", name: "Egusi Melon Seeds", qty: 1, price: 14 },
      { id: "scotch-bonnet", name: "Scotch Bonnet Peppers", qty: 1, price: 6.5 },
    ],
  },
  {
    id: "ORD-10295",
    customer: "Tunde Adeyemi",
    email: "tunde@example.com",
    date: "2026-04-20",
    status: "Processing",
    total: 29.0,
    items: [
      { id: "plantain", name: "Ripe Plantains", qty: 2, price: 7 },
      { id: "yam", name: "White Yam Tuber", qty: 1, price: 11 },
    ],
  },
  {
    id: "ORD-10296",
    customer: "Kwame Mensah",
    email: "kwame@example.com",
    date: "2026-04-21",
    status: "Pending",
    total: 18.5,
    items: [{ id: "ofada-rice", name: "Ofada Heritage Rice", qty: 1, price: 18.5 }],
  },
];
