'use client';

import { MarkdownRenderer } from '@/components/markdown/markdown-renderer';

const content = `
### Data Acquisition and Preprocessing

To train such a complex autoencoder, Kivy relies on a massive and meticulously prepared dataset. The project integrates data from several key sources, totaling over **2.5 million recipes**:

*   **Food.com Recipes (approx. 500,000):** This serves as a foundational dataset, offering richly detailed recipes. Each entry includes a vast array of attributes: \`name\`, \`cooking_time\`, \`prep_time\`, \`description\`, \`images\`, \`category\`, \`tags\`, \`calories\`, \`cholesterol\`, \`sodium\`, \`carbohydrates\`, \`fiber\`, \`sugar\`, \`protein\`, \`servings\`, \`steps\`, \`ingredients\`, and \`serving_size\`. This comprehensive detail is invaluable for nutritional analysis, recipe generation, and training AI models with a holistic view of food.
*   **RecipeNLG Dataset (approx. 2 million):** This large dataset significantly scales Kivy's training corpus. While primarily providing \`name\`, \`ingredients\`, and \`steps\`, its sheer volume is critical for natural language processing (NLP) tasks related to recipe generation and comprehension. Kivy enhances this dataset by using its curated Food.com data to **impute missing nutritional data, categories, and tags** where possible, enriching its semantic content.
*   **Open Food Facts:** A collaborative, open-source database of food products from around the world. This dataset is crucial for obtaining granular nutritional information and identifying allergens for purchased ingredients, allowing Kivy to perform precise ingredient-level nutritional calculations and allergy-aware meal planning.
*   **USDA Food Data Central:** A comprehensive nutritional database, specifically the \`Foundation Foods\` category. This source provides detailed, standardized nutritional data for unprocessed or minimally processed foods, complementing \`Open Food Facts\` by offering high-quality, scientifically analyzed data on basic food items.

**Preprocessing and Filtering:**
The raw data from these sources is subjected to rigorous preprocessing to ensure quality, consistency, and reduce sparsity:

1.  **Tag, Category, and Ingredient Filtering:** Any tag, category, or ingredient appearing fewer than five times across the entire corpus is filtered out. This drastically reduces the vocabulary size from over 450,000 unique ingredient types to approximately 20,000 standardized ingredients, making the models more manageable and robust.
2.  **Semantic Similarity-Based Imputation:** For removed or rare ingredients, tags, and categories, Kivy employs a sophisticated imputation strategy. Instead of simply discarding information, it uses **pretrained language models** to find the most semantically similar frequent equivalents. For example, a rare type of "heirloom tomato" might be replaced with "tomato," ensuring that the core meaning is preserved while standardizing the vocabulary. This maintains data richness while reducing sparsity.
3.  **Feature Selection:** For training the core embedding model, Kivy focuses on the most semantically informative features: \`Name\` (recipe title), \`Steps\` (cooking instructions), \`Ingredients\`, \`Nutritional Information\`, \`Tags\`, and \`General Category\`.
`;

export default function IntroductionPage() {
  return <MarkdownRenderer content={content} />;
}
