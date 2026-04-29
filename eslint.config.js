export default [
  {
    ignores: [
      'node_modules/',
      'dist/',
      'coverage/',
      '.git/',
      '*.d.ts',
      '*.d.cts',
      'examples/',
      'engineRequirements.js',
      '**/*.test.ts',
      '**/*.test.js',
      'src/**/*.test.ts'
    ]
  },
  {
    files: ['src/**/*.ts', 'src/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module'
    }
  }
];
