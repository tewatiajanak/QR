import { normalizeUrlInput } from './components/forms/URLForm';

test('adds https to bare domain URLs before preview update', () => {
  expect(normalizeUrlInput('google.com')).toBe('https://google.com');
  expect(normalizeUrlInput('https://example.com')).toBe('https://example.com');
  expect(normalizeUrlInput('www.example.com')).toBe('https://www.example.com');
  expect(normalizeUrlInput('')).toBe('');
});
