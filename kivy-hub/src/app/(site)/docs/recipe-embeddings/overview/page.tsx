'use client';

import { MarkdownRenderer } from '@/components/markdown/markdown-renderer';

const content = `### Overview of Recipe Embeddings

At its core, Kivy's AI uses a custom **autoencoder-based architecture** to learn these robust recipe embeddings. An autoencoder is a type of neural network that learns an efficient data encoding (a "code" or "embedding") by trying to reconstruct its input from that encoding. This forces the network to learn the most salient features of the data.

In Kivy's context, this means:
*   **Dense Vector Representations:** Instead of sparse, keyword-based representations, recipes are distilled into compact vectors (lists of numbers). These dense vectors can represent complex relationships and nuances that would be lost in traditional methods.
*   **Semantic Understanding:** The embeddings encode the meaning of recipes, allowing Kivy to understand, for instance, that "chicken breast" and "poultry fillet" are semantically similar, or that "tiramisu" belongs to the "dessert" category.
*   **Structural and Functional Aspects:** Beyond mere ingredients, the embeddings capture how ingredients relate (e.g., common pairings), typical preparation steps, nutritional profiles, and even cultural contexts.
*   **Enabling Advanced Features:** These rich embeddings are the foundation for Kivy's intelligent features, including highly personalized recipe recommendations, intelligent ingredient substitution suggestions (e.g., "what can I use instead of basil?"), precise nutritional analysis, and efficient recipe similarity search.
`;

export default function IntroductionPage() {
  return <MarkdownRenderer content={content} />;
}
