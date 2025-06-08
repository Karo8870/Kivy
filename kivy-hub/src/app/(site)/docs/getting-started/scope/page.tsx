'use client';

import { MarkdownRenderer } from '@/components/markdown/markdown-renderer';

const content = `
### Scope

The overarching scope of the Kivy project is to establish an **integrated ecosystem** designed to fundamentally optimize the entire kitchen experience through advanced technological assistance. This optimization spans two critical levels: the **physical interface** (how users interact with the kitchen) and the **culinary information processing** (how recipes and food data are understood and utilized).

Kivy is specifically engineered to:

*   **Facilitate Rapid, Intuitive, and Hygienic Access:** By projecting an interactive interface directly onto kitchen surfaces and enabling hands-free gesture control, Kivy aims to provide instant and clean access to essential tools and information without needing to touch devices. This means users can start timers, convert measurements, or browse recipes with a simple wave of their hand, promoting better hygiene and efficiency.
*   **Personalize and Improve Culinary Decisions:** Beyond mere access, Kivy's AI component focuses on understanding and analyzing culinary data intelligently. By leveraging sophisticated recipe embeddings, the system can offer tailored recommendations, suggest intelligent substitutions, provide real-time nutritional breakdowns, and help users make more informed choices aligned with their health goals and taste preferences. This intelligent analysis empowers users to explore new recipes, adapt existing ones creatively, and optimize their cooking for both flavor and wellness.
`;

export default function IntroductionPage() {
  return <MarkdownRenderer content={content} />;
}
