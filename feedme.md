



Here's a comprehensive guide for working with a backend imported as a submodule:

1. Key Things to Watch Out For:

```bash
# Common Pitfalls:
1. Git Submodule Syncing
- Always pull both repos
- Changes need to be committed in both places

2. Environment Variables
- Keep .env files separate for frontend and backend
- Never commit .env files (they're in .gitignore)

3. Port Conflicts
- Backend runs on port 9090
- Frontend typically runs on 19000 (Expo)
```

2. Development Workflow Best Practices:

```bash
# 1. Starting Development
cd project-soundswipe        # Main repo
cd project-api-soundswipe    # Backend submodule
npm install                  # Install backend dependencies
npm run dev                  # Start backend server

# In a new terminal:
cd ..                       # Back to main repo
cd mobile-app              # Frontend directory
npm install                # Install frontend dependencies
npx expo start            # Start frontend

# 2. Making Changes
git checkout -b feature-name  # Create new branch
# Make changes
git add .
git commit -m "Description"
git push origin feature-name
```

3. Documentation for New Developers:
```markdown:project-api-soundswipe/docs/DEVELOPMENT.md
# Development Guide

## Setup
1. Clone the main repository:
```bash
git clone https://github.com/dartmouth-cs52-25w/project-soundswipe.git
git submodule init
git submodule update
```

2. Environment Setup:
```bash
# Backend (.env in project-api-soundswipe/)
MONGODB_URI=your_mongodb_uri
PORT=9090
NODE_ENV=development

# Frontend (.env in mobile-app/)
EXPO_PUBLIC_API_URL=http://localhost:9090/api/v1
```

3. Development Tools:
```javascript:project-api-soundswipe/src/utils/logger.js
// Add logging utility
const logger = {
  debug: (msg) => console.log(`[DEBUG] ${msg}`),
  error: (msg) => console.error(`[ERROR] ${msg}`),
  api: (msg) => console.log(`[API] ${msg}`),
};

module.exports = logger;
```

4. API Testing:
```javascript:project-api-soundswipe/src/routes/test.js
// Add test endpoint
router.get('/test', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'API is working',
    timestamp: new Date()
  });
});
```

5. Common Issues and Solutions:
```markdown:project-api-soundswipe/docs/TROUBLESHOOTING.md
# Common Issues

1. "Cannot find module" errors
- Run `npm install` in both root and backend directories

2. Connection refused errors
- Check if backend is running (port 9090)
- Verify API_URL in frontend .env

3. Git submodule issues
- Run `git submodule update --init --recursive`
```
