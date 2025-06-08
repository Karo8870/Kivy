'use client';

import { MarkdownRenderer } from '@/components/markdown/markdown-renderer';

const content = `
**Kivy**, an acronym for **Kivy Is a Vector sYnthesizer**, represents a paradigm shift in how we interact with culinary processes. It is conceived as a sophisticated **hybrid hardware-software system** designed to serve as both a tangible kitchen assistant and a powerful AI engine dedicated to culinary intelligence. At its core, Kivy aims to transcend the traditional, often messy and inefficient, kitchen experience by transforming any standard countertop into a dynamic, interactive digital workspace.

The fundamental innovation lies in Kivy's ability to provide **hands-free, intuitive control** over a projected interface through precise gesture recognition. This eliminates the need for physical interaction with screens or devices, fostering a more hygienic and seamless cooking workflow. Complementing this physical interface, the project integrates an advanced **AI component**. This AI, powered by sophisticated **recipe embeddings**, learns deep representations of culinary data, enabling highly personalized recommendations, detailed nutritional insights, and creative assistance for chefs of all levels. By fusing tangible interaction with intelligent digital support, Kivy seeks to unlock new possibilities for efficiency, health-awareness, and culinary creativity in the modern kitchen.
`;

export default function IntroductionPage() {
  return <MarkdownRenderer content={content} />;
}
