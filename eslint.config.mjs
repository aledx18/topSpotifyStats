import nextVitals from 'eslint-config-next/core-web-vitals'
import neostandard from 'neostandard'

const eslintConfig = [
  ...nextVitals,
  ...neostandard({ ts: true }),
  {
    rules: {
      '@stylistic/space-before-function-paren': 'off',
      '@stylistic/jsx-closing-bracket-location': 'off',
      '@stylistic/jsx-curly-newline': 'off'
    }
  },
  {
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts']
  }
]

export default eslintConfig
