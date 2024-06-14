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
  const example = `<div resource="https://example.org/--ref-uuid4-bd17cfee-d836-42d1-be3c-9bb1bc276e20">`;
  const result = instantiateUuids(example);
  expect(result).toBe(`<div resource="https://example.org/uuid-1">`);
});

test('memoization works', () => {
  const example = `
        <div resource="https://example.org/--ref-uuid4-bd17cfee-d836-42d1-be3c-9bb1bc276e20">
        <div resource="https://example.org/--ref-uuid4-bd17cfee-d836-42d1-be3c-9bb1bc276e20">
        <div resource="https://example.org/--ref-uuid4-99e2d904-93b5-4d8a-aa5d-5ab6408226b6">
    `;
  const expectation = `
        <div resource="https://example.org/uuid-1">
        <div resource="https://example.org/uuid-1">
        <div resource="https://example.org/uuid-2">
    `;
  const result = instantiateUuids(example);
  expect(result).toBe(expectation);
});

test('algorithm defaults to uuid', () => {
  const example = `<div resource="https://example.org/--ref-notAValidAlgo-bd17cfee-d836-42d1-be3c-9bb1bc276e20">`;
  const result = instantiateUuids(example);
  expect(result).toBe(`<div resource="https://example.org/uuid-1">`);
});

test('works with single quotes', () => {
  const example = `<div resource='https://example.org/--ref-uuid4-bd17cfee-d836-42d1-be3c-9bb1bc276e20'>`;
  const result = instantiateUuids(example);
  expect(result).toBe(`<div resource="https://example.org/uuid-1">`);
});

test('memoization with different algorithm ignores it', () => {
  const example = `
    <div resource='https://example.org/--ref-uuid4-bd17cfee-d836-42d1-be3c-9bb1bc276e20'>
    <div resource='https://example.org/--ref-notAValidAlgo-bd17cfee-d836-42d1-be3c-9bb1bc276e20'>
  `;
  const result = instantiateUuids(example);
  expect(result).toBe(`
    <div resource="https://example.org/uuid-1">
    <div resource="https://example.org/uuid-1">
  `);
});
