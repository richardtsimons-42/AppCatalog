# Task 19: Vite Proxy and Final Polish

**Objective:** Configure Vite to proxy API requests to the backend, add basic global styles, and verify the build.

**Files:**
- Modify: `AppCatalog.Web/vite.config.ts`
- Modify: `AppCatalog.Web/src/index.css`

**Step 1: Update vite.config.ts**

Replace `AppCatalog.Web/vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
```

**Step 2: Update index.css with basic styles**

Replace `AppCatalog.Web/src/index.css`:

```css
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, sans-serif;
  background: #f5f5f5;
  color: #333;
  line-height: 1.6;
}

input {
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

input:focus {
  outline: none;
  border-color: #0078d4;
}

button {
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  padding: 8px 16px;
  font-size: 14px;
}

button:hover {
  background: #f0f0f0;
}

button[type="submit"] {
  background: #0078d4;
  color: white;
  border-color: #0078d4;
}

button[type="submit"]:hover {
  background: #006cbd;
}
```

**Step 3: Verify frontend build**

```bash
cd /c/Users/richa/AppData/Local/hermes/app-catalog/AppCatalog.Web
npm run build
```

**Step 4: Commit**

```bash
cd /c/Users/richa/AppData/Local/hermes/app-catalog
git add -A
git commit -m "feat(frontend): add Vite proxy, global styles, verify build"
```
