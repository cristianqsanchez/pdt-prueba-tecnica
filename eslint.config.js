import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  rules: {
    'style/jsx-quotes': ['warn', 'prefer-single'],
  },
})
