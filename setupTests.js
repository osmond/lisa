import '@testing-library/jest-dom';

// Suppress React Router future flag warnings during tests
const originalWarn = console.warn;
const nativeFetch = global.fetch;
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
  if (!global.fetch) {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
    );
  }
});

beforeEach(() => {
  if (!global.fetch) {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
    );
  }
});

afterAll(() => {
  console.warn.mockRestore();
  if (nativeFetch) {
    global.fetch = nativeFetch;
  } else {
    delete global.fetch;
  }
});
