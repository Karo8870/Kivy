'use client';

import { MarkdownRenderer } from '@/components/markdown/markdown-renderer';

const content = `### Math Behind It: Homography

Homography is a fundamental concept in computer vision that allows Kivy to bridge the gap between the camera's captured image and the projector's displayed output. It's the mathematical bedrock for transforming the raw 2D coordinates of a detected hand (from the camera's perspective) into the exact 2D coordinates on the projected interactive surface. This transformation is essential for creating a seamless and accurate hands-free interaction experience.

#### Homography Overview

A homography describes a **projective transformation** between two planes. In the context of Kivy, these are the plane perceived by the camera (where the user's finger is detected) and the plane on which the projector displays (e.g., the kitchen countertop). Assuming these physical planes are largely flat and static, a homography provides a robust way to map points between them.

This transformation is represented by a non-singular $3 \\times 3$ matrix $H$ which operates on **homogeneous coordinates**. Homogeneous coordinates are a way to represent 2D points $(x,y)$ in 3D space as $(x,y,1)$ or $(x,y,w)$ where $w$ is a scaling factor. This allows for affine transformations (like scaling, rotation, translation) and projective transformations (like perspective) to be represented as simple matrix multiplications.

The mapping from an input point $P = (x, y)$ in the camera's space to an output point $P' = (x', y')$ in the projector's space is given by:

$$ \\begin{pmatrix} x' \\\\ y' \\\\ w' \\end{pmatrix} = H \\begin{pmatrix} x \\\\ y \\\\ 1 \\end{pmatrix} $$

where:
*   $(x, y)$ are the input coordinates detected by the camera.
*   $(x', y')$ are the transformed output coordinates that correspond to the projector's display.
*   $w'$ is a scaling factor for the homogeneous coordinates, and the actual Cartesian coordinates are obtained by dividing by $w'$: $x'' = x'/w'$ and $y'' = y'/w'$.
*   $H$ is the $3 \\times 3$ homography matrix.

#### Homography Matrix Structure

The homography matrix $H$ is a $3 \\times 3$ matrix with nine elements:

$$ H = \\begin{pmatrix} h_{11} & h_{12} & h_{13} \\\\ h_{21} & h_{22} & h_{23} \\\\ h_{31} & h_{32} & h_{33} \\end{pmatrix} $$

A homography has **8 degrees of freedom**. This is because, in projective geometry, a scaling factor applied to the entire matrix does not change the transformation (i.e., $kH$ results in the same mapping as $H$ for any non-zero $k$). To resolve this scale ambiguity and ensure a unique solution, we typically normalize one of the elements, often setting $h_{33} = 1$. This leaves 8 unknown variables to solve for.

#### Constructing the System of Equations

To solve for the 8 unknown elements of $H$, we need at least **4 pairs of corresponding points**. Each pair consists of a known input point $(x_i, y_i)$ from the camera's perspective and its corresponding known output point $(x'_i, y'_i)$ on the projector's surface. These points are gathered during the calibration phase.

From the homogeneous coordinate equation, we can write the explicit relations for $x'$ and $y'$:

$$ x'_i = \\frac{h_{11}x_i + h_{12}y_i + h_{13}}{h_{31}x_i + h_{32}y_i + h_{33}} $$
$$ y'_i = \\frac{h_{21}x_i + h_{22}y_i + h_{23}}{h_{31}x_i + h_{32}y_i + h_{33}} $$

To convert these non-linear equations into a linear system that can be solved, we multiply both sides by their respective denominators:

$$ x'_i(h_{31}x_i + h_{32}y_i + h_{33}) = h_{11}x_i + h_{12}y_i + h_{13} $$
$$ y'_i(h_{31}x_i + h_{32}y_i + h_{33}) = h_{21}x_i + h_{22}y_i + h_{23} $$

Now, we rearrange these equations to group the unknown $h$ coefficients. For each point $(x_i, y_i) \\leftrightarrow (x'_i, y'_i)$, we derive two linear equations. Assuming $h_{33} = 1$ for normalization, these become:

$$ -x_i h_{11} - y_i h_{12} - 1 h_{13} + (x'_i x_i) h_{31} + (x'_i y_i) h_{32} + x'_i h_{33} = 0 $$
$$ -x_i h_{21} - y_i h_{22} - 1 h_{23} + (y'_i x_i) h_{31} + (y'_i y_i) h_{32} + y'_i h_{33} = 0 $$

Each pair of corresponding points yields two rows for a large matrix $A$. If we define the vector of homography parameters as $h = [h_{11}, h_{12}, h_{13}, h_{21}, h_{22}, h_{23}, h_{31}, h_{32}, h_{33}]^T$, then for each point pair $(x_i, y_i) \\leftrightarrow (x'_i, y'_i)$, the two rows $A_i$ added to the system matrix $A$ are:

$$ A_i = \\begin{pmatrix} -x_i & -y_i & -1 & 0 & 0 & 0 & x'_ix_i & x'_iy_i & x'_i \\\\ 0 & 0 & 0 & -x_i & -y_i & -1 & y'_ix_i & y'_iy_i & y'_i \\end{pmatrix} $$

Since we need 8 independent linear equations for the 8 unknowns (after fixing $h_{33}=1$), 4 pairs of points provide $4 \\times 2 = 8$ equations, which is the minimum required to solve for $H$. More points (e.g., 5 or more) can be used to form an overdetermined system, which can then be solved using least squares methods for a more robust solution, especially in the presence of noise.

#### Solving the System using Singular Value Decomposition (SVD)

The combined system of equations for all $N$ point pairs forms a homogeneous linear system:

$$ A h = 0 $$

For a non-trivial solution (i.e., $h \\neq 0$), the matrix $A$ must be rank-deficient. The **Singular Value Decomposition (SVD)** is the preferred method for solving such homogeneous systems. SVD decomposes a matrix $A$ into three matrices:

$$ A = U \\Sigma V^T $$

where:
*   $U$ is an $m \\times m$ orthogonal matrix (where $m$ is the number of equations, e.g., $2N$).
*   $\\Sigma$ is an $m \\times n$ diagonal matrix (where $n$ is the number of unknowns, e.g., 9), containing the singular values.
*   $V^T$ is an $n \\times n$ orthogonal matrix.

The solution vector $h$ that minimizes $||Ah||_2^2$ (and thus approximately solves $Ah=0$) is the **last column of the matrix $V$**, corresponding to the smallest singular value in $\\Sigma$. This column represents the null space of $A$. After obtaining this $h$ vector, its elements are reshaped back into the $3 \\times 3$ homography matrix $H$. If $h_{33}$ was not explicitly set to 1 during setup, the entire matrix $H$ is then scaled such that its $h_{33}$ element becomes 1.

#### Application: Hand-to-Projector Mapping

In the Kivy calibration process, this mathematical framework is directly applied:

1.  **User Interaction:** The user physically touches 4 (or more) designated points projected by Kivy onto the kitchen surface.
2.  **Camera Capture:** The integrated video camera simultaneously captures the exact 2D pixel coordinates $(x_i, y_i)$ of the user's index fingertip as it touches each projected point.
3.  **Known Projector Points:** Kivy's system already knows the precise 2D projector coordinates $(x'_i, y'_i)$ for these same calibration points.
4.  **Homography Computation:** With these pairs of corresponding points, Kivy constructs the matrix $A$ and solves the $Ah=0$ system using SVD to compute the optimal homography matrix $H$.
5.  **Real-Time Mapping:** Once $H$ is computed, Kivy can continuously receive real-time fingertip positions $(x, y)$ from the camera. For any new detected hand position, Kivy applies the transformation $P' = HP$ to instantly and accurately map the camera-space coordinates to the projector's output space, enabling precise, hands-free interaction with the projected interface.
`;

export default function IntroductionPage() {
  return <MarkdownRenderer content={content} />;
}
