'use client';

import { MarkdownRenderer } from '@/components/markdown/markdown-renderer';

const content = `### Training Objectives

To ensure that the learned recipe embeddings ($Z_{\\text{final}}$) are genuinely rich, versatile, and useful for a wide range of culinary applications, Kivy employs a **multi-task training strategy**. This means the model is simultaneously optimized for several different objectives, forcing the embeddings to capture diverse aspects of the recipe data.

1.  **Autoencoder Objective ($L_{\\text{AE}}$):**
    *   **Purpose:** This is the primary objective of the autoencoder: to encourage the embedding to capture the most essential and reconstructible information from the original recipe.
    *   **Mechanism:** The encoder $E$ maps the raw input recipe data ($X_{\\text{raw}}$) to the compact $Z_{\\text{final}}$ embedding. A decoder $D$ then attempts to reconstruct the original raw features (or a comprehensive summary of them) from this $Z_{\\text{final}}$ embedding. The difference between the reconstructed output and the original input is minimized.
    *   **Loss Function:** The loss is typically the **Mean Squared Error (MSE)** between the original raw features $X_{\\text{raw}}$ and their reconstruction $D(Z_{\\text{final}})$:
        $$ L_{\\text{AE}} = ||D(Z_{\\text{final}}) - X_{\\text{raw}}||_2^2 $$
        The $|| \\cdot ||_2^2$ denotes the squared L2 norm (Euclidean distance squared), which measures the difference between the two vectors. A lower loss indicates a more accurate reconstruction, implying that $Z_{\\text{final}}$ has effectively captured the input information.
    *   **Benchmarks:** The project demonstrates good reconstruction performance:
        | Split      | MSE (Reconstruction) | MAE (Reconstruction) |
        | :--------- | :------------------- | :------------------- |
        | Train      | 0.088                | 0.170                |
        | Validation | 0.092                | 0.174                |
        | Test       | 0.101                | 0.181                |
        These low MSE and MAE values suggest that the autoencoder is successfully learning a compact $Z_{\\text{final}}$ embedding that retains a high degree of information from the original complex recipe data.

2.  **Nutriment Prediction Objective ($L_{\\text{nutr}}$):**
    *   **Purpose:** To enable Kivy to predict detailed recipe-level nutritional information directly from the learned embeddings, crucial for health-aware meal planning and dietary adjustments.
    *   **Mechanism:** A dedicated regressor head $R$ is attached to the $Z_{\\text{final}}$ embedding. This head is trained to predict target nutriments (e.g., total calories, protein, fat, carbohydrates) for the entire recipe. Let $y_{\\text{nutr,target}} \\in \\mathbb{R}^{d_{\\text{nutr,rec}}}$ be the ground truth nutritional values for a recipe, and $\\hat{y}_{\\text{nutr}} = R(Z_{\\text{final}})$ be the predicted values.
    *   **Loss Function:** The loss is again typically the **Mean Squared Error** between the predicted and actual nutriment values:
        $$ L_{\\text{nutr}} = ||\\hat{y}_{\\text{nutr}} - y_{\\text{nutr,target}}||_2^2 $$
        Minimizing this loss ensures that the $Z_{\\text{final}}$ embeddings are rich enough to encode fine-grained nutritional details, allowing Kivy to infer complex health-related data solely from the recipe's learned representation.

3.  **Tag and Category Classification Objective ($L_{\\text{tags}}$ and $L_{\\text{cat}}$):**
    *   **Purpose:** To enable Kivy to accurately classify recipes by their associated tags (e.g., "vegan", "gluten-free") and general categories (e.g., "dessert", "main course"), facilitating organized browsing and targeted recommendations.
    *   **Mechanism:**
        *   **Tag Prediction (Multi-label):** Recipes can have multiple tags simultaneously. For $T$ possible tags, a **sigmoid output layer** is used, where each neuron predicts the probability that a specific tag applies to the recipe, independently of other tags. The loss function is **Binary Cross-Entropy (BCE)**, calculated for each tag and then summed or averaged:
            $$ L_{\\text{tags}} = -\\frac{1}{T} \\sum_{t=1}^T (y_t \\log \\hat{y}_t + (1 - y_t) \\log(1 - \\hat{y}_t)) $$
            Here, $y_t \\in \\{0, 1\\}$ is the ground truth (1 if tag $t$ applies, 0 otherwise), and $\\hat{y}_t \\in [0, 1]$ is the predicted probability for tag $t$. This penalizes discrepancies between predicted probabilities and actual tag presence.
        *   **Category Prediction (Multi-class):** Recipes typically belong to only one main category. For $C$ possible categories, a **softmax output layer** is used. Softmax converts raw scores into probabilities that sum to 1 across all categories, representing the likelihood of the recipe belonging to each category. The loss function is **Categorical Cross-Entropy**:
            $$ L_{\\text{cat}} = -\\sum_{c=1}^C y_c \\log \\hat{y}_c $$
            where $y_c \\in \\{0,1\\}$ is the one-hot encoded ground truth vector (1 for the correct category, 0 otherwise), and $\\hat{y}_c \\in [0,1]$ is the predicted probability for category $c$. This loss drives the model to correctly identify the single dominant category for a recipe.

By training with these multiple objectives simultaneously, the autoencoder learns a more robust, versatile, and semantically rich $Z_{\\text{final}}$ embedding that is useful for a wide range of downstream tasks, rather than being specialized for just one.

`;

export default function IntroductionPage() {
  return <MarkdownRenderer content={content} />;
}
