'use client';

import { MarkdownRenderer } from '@/components/markdown/markdown-renderer';

const content = `### Encoder Architecture

The encoder is the "brain" of Kivy's AI, responsible for transforming raw recipe data into the dense $Z_{\\text{final}}$ embedding. It's a modular, hierarchical architecture designed to process different facets of a recipe (ingredients, name, nutritional values, steps) independently and then fuse them into a comprehensive representation.

1.  **Nutriment Block (for each ingredient):**
    This block processes the numerical and categorical information associated with each individual ingredient.
    *   **Input:** A per-ingredient nutriment vector $x_n \\in \\mathbb{R}^{d_n}$ (where $d_n=9$ representing attributes like calories, protein, fat, etc.) and a scalar quantity $q \\in \\mathbb{R}$ (e.g., amount in grams or cups).
    *   **Operation:** These are concatenated to form $x_{nut} = [x_n; q] \\in \\mathbb{R}^{d_n+1}$. This combined vector then passes through a feed-forward neural network (\`ReLU\` activation) with **Batch Normalization (BN)** for training stability and **Dropout** for regularization to prevent overfitting.
        $$ h_1 = \\text{ReLU}(\\text{BN}(W_1x_{nut} + b_1)) $$
        $$ h'_1 = \\text{Dropout}(h_1) $$
        $$ h_2 = \\text{ReLU}(W_2h'_1 + b_2) $$
        The output $h_2$ is a dense numerical representation for *one* ingredient's nutriment and quantity. This is defined as the $\\text{NutEnc}$ function.

2.  **Name Encoder Block (BERT):**
    This block processes the textual name of each ingredient.
    *   **Input:** The ingredient name as a sequence of tokens $x_{name} = (w_1, w_2, \\dots, w_L)$.
    *   **Operation:** A **pretrained BERT (Bidirectional Encoder Representations from Transformers) model** is used to encode the token sequence. BERT is powerful for understanding context and semantics in text. The output of the \`[CLS]\` (classification) token, representing the entire input sequence, is used.
        $$ e_{name} = \\text{BERT}_{[\\text{CLS}]}(x_{name}) \\in \\mathbb{R}^{d_{bert}} $$
        This high-dimensional BERT embedding is then projected to a lower dimension for efficiency and integration:
        $$ e^{\\text{proj}}_{\\text{name}} = W_p e_{name} + b_p $$

3.  **Fusion Block (Ingredient Level):**
    This block combines the numerical and textual representations for each individual ingredient.
    *   **Input:** The numerical nutriment representation $h_2$ (from Nutriment Block) and the projected BERT name encoding $e^{\\text{proj}}_{\\text{name}}$ (from Name Encoder Block).
    *   **Operation:** These are concatenated:
        $$ Z_{\\text{fuse}} = [h_2; e^{\\text{proj}}_{\\text{name}}] $$
        This fused vector then passes through another MLP with BN and Dropout to produce the final, rich embedding for a *single ingredient*:
        $$ f_1 = \\text{ReLU}(\\text{BN}_f(W_f Z_{\\text{fuse}} + b_f)) $$
        $$ f'_1 = \\text{Dropout}(f_1) $$
        $$ Z_{\\text{ingredient}} = \\text{ReLU}(W_o f'_1 + b_o) $$

4.  **Ingredient Set Aggregator (Transformer Encoder):**
    This block processes the *set* of all ingredients in a recipe, capturing their relationships.
    *   **Input:** A set of $N$ encoded ingredient vectors $\\{Z_{\\text{ingredient}}^{(i)}\\}_{i=1}^N$ for a given recipe.
    *   **Operation:** These are stacked as a sequence and fed into a **Transformer encoder**. Transformer encoders are excellent at modeling relationships within sequences (like sets of ingredients), understanding how different ingredients interact or co-occur in recipes.
        $$ Z_{\\text{trans}} = \\text{Transformer Encoder} \\left( \\left[Z_{\\text{ingredient}}^{(1)}, \\dots, Z_{\\text{ingredient}}^{(N)}\\right] \\right) $$
        The output $Z_{\\text{trans}} \\in \\mathbb{R}^{N \\times d_{\\text{trans}}}$ is a sequence of contextualized ingredient embeddings.

5.  **Set Pooling:**
    This block aggregates the contextualized ingredient representations into a single recipe-level summary of its ingredients.
    *   **Input:** The sequence of transformed ingredient vectors $Z_{\\text{trans}}$.
    *   **Operation:** A simple **mean pooling** operation is applied across the sequence dimension. This averages the features of all ingredients, creating a fixed-size representation for the entire ingredient list.
        $$ Z_{\\text{recipe}} = \\frac{1}{N} \\sum_{i=1}^N Z_{\\text{trans}}^{(i)} $$

6.  **Recipe Name Encoder:**
    Similar to the ingredient name encoder, but for the entire recipe title.
    *   **Input:** The recipe title as a sequence of tokens $x_{\\text{title}} = (w_1, \\dots, w_T)$.
    *   **Operation:** BERT is used to encode the title, and the \`[CLS]\` token's output is projected to a lower dimension.
        $$ e_{\\text{title}} = \\text{BERT}_{[\\text{CLS}]}(x_{\\text{title}}) \\in \\mathbb{R}^{d_{bert}} $$
        $$ Z_{\\text{title}} = W_t e_{\\text{title}} + b_t $$

7.  **Recipe Nutriments Encoder:**
    This block processes the overall nutritional values of the entire recipe (e.g., total calories, protein, etc.).
    *   **Input:** The recipe-level nutriments vector $x_{\\text{nutr,rec}} \\in \\mathbb{R}^{d_{\\text{nutr,rec}}}$.
    *   **Operation:** It passes through a feed-forward network with BN and ReLU activations to generate a dense representation.
        $$ h_{\\text{nutr,rec}} = \\text{ReLU}(\\text{BN}_r(W_r x_{\\text{nutr,rec}} + b_r)) $$
        $$ Z_{\\text{nutr,rec}} = \\text{ReLU}(W'_r h_{\\text{nutr,rec}} + b'_r) $$

8.  **Steps Encoder:**
    This block processes the cooking instructions for the recipe.
    *   **Input:** The recipe steps as a sequence of tokens $x_{\\text{steps}} = (w_1, \\dots, w_S)$.
    *   **Operation:** Similar to other text encoders, BERT (or another transformer) is used to capture the semantic and sequential information within the cooking steps. The \`[CLS]\` token's output is used and projected.
        $$ e_{\\text{steps}} = \\text{BERT}_{[\\text{CLS}]}(x_{\\text{steps}}) \\in \\mathbb{R}^{d_{bert}} $$
        $$ Z_{\\text{steps}} = W_s e_{\\text{steps}} + b_s $$

9.  **Final Fusion Block (Recipe Level):**
    This is the ultimate fusion layer, combining all the high-level representations of a recipe into one comprehensive embedding.
    *   **Input:** The individual high-level recipe representations: $Z_{\\text{recipe}}$ (from pooled ingredients), $Z_{\\text{title}}$ (from recipe name), $Z_{\\text{nutr,rec}}$ (from recipe nutriments), and $Z_{\\text{steps}}$ (from cooking steps).
    *   **Operation:** All these vectors are concatenated:
        $$ Z_{\\text{all}} = [Z_{\\text{recipe}}; Z_{\\text{title}}; Z_{\\text{nutr,rec}}; Z_{\\text{steps}}] $$
        This concatenated vector then passes through a final fusion MLP with BN and Dropout, producing the **final recipe embedding**, $Z_{\\text{final}}$:
        $$ f_{\\text{all},1} = \\text{ReLU}(\\text{BN}_a(W_a Z_{\\text{all}} + b_a)) $$
        $$ f'_{\\text{all},1} = \\text{Dropout}(f_{\\text{all},1}) $$
        $$ Z_{\\text{final}} = \\text{ReLU}(W_f f'_{\\text{all},1} + b_f) $$

The $Z_{\\text{final}}$ vector is the rich, dense recipe embedding that Kivy uses for all downstream AI tasks, serving as a compressed yet highly informative representation of the entire recipe.

`;

export default function IntroductionPage() {
  return <MarkdownRenderer content={content} />;
}
