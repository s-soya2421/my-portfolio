module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npx serve -s out',
      startServerReadyPattern: 'Accepting connections',
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/about',
        'http://localhost:3000/projects',
        'http://localhost:3000/blog',
      ],
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
