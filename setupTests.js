import '@testing-library/jest-dom';

// Suppress React Router future flag warnings during tests
const originalWarn = console.warn;
beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation((...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].startsWith('⚠️ React Router Future Flag Warning')
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  });
});

afterAll(() => {
  console.warn.mockRestore();
});
