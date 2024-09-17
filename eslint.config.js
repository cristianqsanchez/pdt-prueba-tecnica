import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  rules: {
    'style/jsx-quotes': ['warn', 'prefer-single'],
    'ts/consistent-type-definitions': ['warn', 'type'],
    'style/brace-style': ['off'],
    'antfu/top-level-function': ['off'],
  },
})
