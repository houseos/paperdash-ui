import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
	{
		ignores: ['.svelte-kit/**', 'build/**', 'node_modules/**', 'package-lock.json']
	},
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	...svelte.configs['flat/recommended'],
	{
		files: ['**/*.{js,ts,svelte}'],
		languageOptions: {
			globals: { ...globals.browser, ...globals.node }
		},
		rules: {
			'@typescript-eslint/no-explicit-any': 'off'
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: tseslint.parser
			}
		}
	},
	{
		files: ['src/lib/components/widget/widgets/text-widget.svelte'],
		rules: { 'svelte/no-at-html-tags': 'off' }
	},
	prettier
);
