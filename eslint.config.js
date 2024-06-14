import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.eslintRecommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
);
