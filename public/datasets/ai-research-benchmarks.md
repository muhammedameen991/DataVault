# Foundational AI Research Benchmarks & Datasets

A curated taxonomy of public evaluation benchmarks widely used across artificial intelligence, natural language processing, and multimodal reasoning.

## 1. General Knowledge & Multi-Subject Reasoning
- **MMLU (Massive Multitask Language Understanding)**
  - *Description*: 57 subjects spanning elementary math, US history, computer science, law, and medicine.
  - *Metric*: 5-shot accuracy (% correct).
  - *Reference*: Hendrycks et al., 2021.

- **GPQA (Google-Proof Q&A)**
  - *Description*: 448 high-difficulty graduate-level biology, physics, and chemistry questions written by domain experts.
  - *Metric*: Pass@1 accuracy.
  - *Reference*: Rein et al., 2023.

## 2. Mathematical Reasoning
- **GSM8K (Grade School Math 8K)**
  - *Description*: 8,500 diverse high quality linguistically varied grade school math word problems.
  - *Metric*: Strict exact match numerical accuracy.

- **MATH Benchmark**
  - *Description*: 12,500 challenging high school competition math problems formatted in LaTeX.
  - *Categories*: Algebra, Geometry, Number Theory, Calculus, Probability.

## 3. Code Generation & Execution
- **HumanEval**
  - *Description*: 164 hand-crafted Python programming problems with unit tests evaluating correctness.
  - *Metric*: Pass@1, Pass@10 with temperature sampling.

- **SWE-bench**
  - *Description*: Real-world software engineering GitHub pull requests and resolving actual issues in open-source repositories.
  - *Metric*: Pass rate on test suites.
