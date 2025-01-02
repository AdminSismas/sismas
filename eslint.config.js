// @ts-check
import { configs } from '@eslint/js'
import { config, configs as _configs } from 'typescript-eslint'
import { configs as __configs, processInlineTemplates } from 'angular-eslint'

export default config(
  {
    files: ['**/*.ts'],
    extends: [
      configs.recommended,
      ..._configs.recommended,
      ..._configs.stylistic,
      ...__configs.tsRecommended
    ],
    processor: processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'vex',
          style: 'camelCase'
        }
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'vex',
          style: 'kebab-case'
        }
      ],
      semi: ['error', 'always'], // Agregar esta línea para los puntos y coma
    }
  },
  {
    files: ['**/*.html'],
    extends: [
      ...__configs.templateRecommended,
      ...__configs.templateAccessibility
    ],
    rules: {
      '@angular-eslint/template/click-events-have-key-events': 'off',
      '@angular-eslint/template/interactive-supports-focus': 'off'
    }
  }
);
