/* eslint-disable no-undef */
import '@testing-library/jest-dom';
import { sum } from '../testing/sum';

//to test that jest works
test('adds 1 + 2 to equal 3', () => {
  expect(sum(2, 2)).not.toBe(3);
});

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
