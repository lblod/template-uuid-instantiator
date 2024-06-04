import instantiateUuids from '../src';
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

beforeEach(() => {
  const mockUuid = require('uuid') as { v4: jest.Mock<string, []> }; // "as" is TypeScript you can ignore
  mockUuid.v4
    .mockImplementationOnce(() => 'uuid-1')
    .mockImplementationOnce(() => 'uuid-2');
});

afterEach(() => {
  jest.resetAllMocks();
});

test('uuid algorithm conversion works', () => {
  const example = `<div resource="https//example.org/--ref-<uuid>-123">`;
  const result = instantiateUuids(example);
  expect(result).toBe(`<div resource="https//example.org/uuid-1">`);
});

test('memoization works', () => {
  const example = `
        <div resource="https//example.org/--ref-<uuid>-123">
        <div resource="https//example.org/--ref-<uuid>-123">
        <div resource="https//example.org/--ref-<uuid>-321">
    `;
  const expectation = `
        <div resource="https//example.org/uuid-1">
        <div resource="https//example.org/uuid-1">
        <div resource="https//example.org/uuid-2">
    `;
  const result = instantiateUuids(example);
  expect(result).toBe(expectation);
});

test('algorithm defaults to uuid', () => {
  const example = `<div resource="https//example.org/--ref-<not-a-valid-algo>-123">`;
  const result = instantiateUuids(example);
  expect(result).toBe(`<div resource="https//example.org/uuid-1">`);
});