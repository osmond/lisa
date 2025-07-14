import '@testing-library/jest-dom';

const originalWarn = console.warn;

beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation((...args) => {
    if (args.some(arg => typeof arg === 'string' && arg.includes('React Router Future Flag Warning'))) {
      return;
    }
    originalWarn(...args);
  });
});

afterAll(() => {
  console.warn.mockRestore();
});
