/* eslint-disable no-undef */
import { isHour, isToday, decayCount, dayCount } from '../utils/dateFunctions';

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

test('is correct decay count', () => {
  expect(decayCount(Date.now())).toBe(0);
  expect(decayCount(Date.now() - 1000 * 60 * 60 * 24)).toBe(1);
  expect(decayCount(Date.now() - 1000 * 60 * 60 * 24 * 7)).toBe(7);
  expect(decayCount(undefined)).toBe(1);
  expect(decayCount(undefined)).not.toBe(0);
});

test('is correct day count', () => {
  expect(dayCount([Date.now()])).toBe(1);
  expect(dayCount([Date.now(), Date.now() - 1000 * 60 * 60 * 48])).toBe(2);
  expect(
    dayCount([
      1659424046508 - 1000 * 60 * 60 * 2,
      1659424046508 - 1000 * 60 * 60 * 1,
      1659424046508 - 1000 * 60 * 60 * 48,
    ])
  ).toBe(2);
  expect(dayCount([])).toBe(0);
});
