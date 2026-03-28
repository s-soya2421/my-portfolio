module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npx serve -s out -l 8080',
      startServerReadyPattern: 'Accepting connections',
      url: [
        'http://localhost:8080/',
        'http://localhost:8080/about',
        'http://localhost:8080/projects',
        'http://localhost:8080/blog',
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
