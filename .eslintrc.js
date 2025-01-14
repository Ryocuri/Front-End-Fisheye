module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
    'node': true,
    'jest': true,
  },
  'extends': [
    'eslint:recommended',
  ],
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
  },
  'rules': {
    // Erreurs de syntaxe et bonnes pratiques
    'no-console': ['warn'],  // Avertissement pour console.log
    'no-debugger': ['error'], // Interdit debugger
    'no-var': ['error'],  // Force l'utilisation de let/const
    'prefer-const': ['error'],  // Préfère const quand possible

    // Style de code
    'indent': ['error', 2],  // Indentation de 2 espaces
    'quotes': ['error', 'single'],  // Guillemets simples
    'semi': ['error', 'always'],  // Point-virgule obligatoire
    'comma-dangle': ['error', 'always-multiline'],  // Virgule finale dans les objets/arrays multilignes

    // Espaces et formatage
    'array-bracket-spacing': ['error', 'never'],  // Pas d'espace dans les crochets
    'object-curly-spacing': ['error', 'always'],  // Espaces dans les accolades
    'space-before-function-paren': ['error', {
      'anonymous': 'always',
      'named': 'never',
      'asyncArrow': 'always',
    }],

    // Variables et fonctions
    'no-unused-vars': ['error', {
      'argsIgnorePattern': '^_',
      'varsIgnorePattern': '^_',
    }],  // Variables non utilisées
    'no-use-before-define': ['error'],  // Utilisation avant définition

    // ES6+
    'arrow-spacing': ['error', { 'before': true, 'after': true }],  // Espaces autour des =>
    'arrow-parens': ['error', 'always'],  // Parenthèses pour les arrow functions
    'no-duplicate-imports': ['error'],  // Pas d'imports dupliqués

    // Complexité et maintenance
    'max-len': ['error', {
      'code': 100,
      'ignoreComments': true,
      'ignoreUrls': true,
    }],  // Longueur maximale des lignes
    'max-depth': ['error', 4],  // Profondeur maximale des blocs
    'complexity': ['error', 10],  // Complexité cyclomatique maximale

    // Débogage et performances
    'no-alert': ['error'],  // Interdit alert/confirm/prompt
    'no-eval': ['error'],  // Interdit eval()
    'no-implied-eval': ['error'],  // Interdit les eval() implicites
  },
};