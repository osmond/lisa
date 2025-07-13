const fs = require('fs');

test('BrowserRouter uses VITE_BASE_PATH', () => {
  const contents = fs.readFileSync('src/main.jsx', 'utf8');
  expect(contents).toContain('basename={import.meta.env.VITE_BASE_PATH}');
});
