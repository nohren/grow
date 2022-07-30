/* eslint-disable no-undef */
import { isHour, isToday } from '../utils/dateFunctions';

test('is it the correct hour', () => {
  expect(isHour(new Date().getHours())).toBe(true);
  expect(isHour(new Date().getHours() - 1)).toBe(false);
  expect(isHour(undefined)).toBe(false);
});

test('is the correct day', () => {
  expect(isToday(Date.now())).toBe(true);
  expect(isToday(Date.now() - 1000 * 60 * 60 * 24)).toBe(false);
  expect(isToday(undefined)).toBe(false);
});
