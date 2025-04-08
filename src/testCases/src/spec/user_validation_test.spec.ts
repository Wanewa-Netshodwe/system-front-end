import { describe, it, expect } from 'vitest';
import { isValidSAPhoneNumber, isValidStudentNumber, isValidTUTEmail } from './utils/user_validation';

describe('TUT Email Validation', () => {
  it('should accept a valid TUT student email (9 digits + @tut4life.ac.za)', () => {
    expect(isValidTUTEmail('123456789@tut4life.ac.za')).toBe(true);
  });

  it('should accept a valid TUT staff email (6 digits + @tut.ac.za)', () => {
    expect(isValidTUTEmail('123456@tut.ac.za')).toBe(true);
  });

  it('should reject student email with wrong domain', () => {
    expect(isValidTUTEmail('123456789@gmail.com')).toBe(false);
  });

  it('should reject staff email with wrong domain', () => {
    expect(isValidTUTEmail('123456@hotmail.com')).toBe(false);
  });

  it('should reject student email with less or more than 9 digits', () => {
    expect(isValidTUTEmail('12345678@tut4life.ac.za')).toBe(false);
    expect(isValidTUTEmail('1234567890@tut4life.ac.za')).toBe(false);
  });

  it('should reject staff email with less or more than 6 digits', () => {
    expect(isValidTUTEmail('12345@tut.ac.za')).toBe(false);
    expect(isValidTUTEmail('1234567@tut.ac.za')).toBe(false);
  });
});

describe('South African Phone Number Validation', () => {
  it('should accept valid SA numbers starting with 06, 07 or 08 (standard format)', () => {
    expect(isValidSAPhoneNumber('0781234567')).toBe(true);
    expect(isValidSAPhoneNumber('0823456789')).toBe(true);
    expect(isValidSAPhoneNumber('0612345678')).toBe(true);
  });

  it('should accept valid SA numbers with +27 format', () => {
    expect(isValidSAPhoneNumber('+27821234567')).toBe(true);
    expect(isValidSAPhoneNumber('+27761981783')).toBe(true);
    expect(isValidSAPhoneNumber('+27612345678')).toBe(true);
  });

  it('should reject numbers not starting with 06, 07 or 08', () => {
    expect(isValidSAPhoneNumber('0212345678')).toBe(false);
    expect(isValidSAPhoneNumber('+27212345678')).toBe(false);
  });

  it('should reject numbers that are too short or too long', () => {
    expect(isValidSAPhoneNumber('0781234')).toBe(false);
    expect(isValidSAPhoneNumber('078123456789')).toBe(false);
    expect(isValidSAPhoneNumber('+278123456789')).toBe(false);
  });

  it('should reject improperly formatted +27 numbers', () => {
    expect(isValidSAPhoneNumber('+27081234567')).toBe(false);
    expect(isValidSAPhoneNumber('+27561234567')).toBe(false);
  });

  it('should reject non-numeric or special character input', () => {
    expect(isValidSAPhoneNumber('078-123-4567')).toBe(false);
    expect(isValidSAPhoneNumber('078 123 4567')).toBe(false);
    expect(isValidSAPhoneNumber('(078)1234567')).toBe(false);
    expect(isValidSAPhoneNumber('abc1234567')).toBe(false);
    expect(isValidSAPhoneNumber('07812345#7')).toBe(false);
    expect(isValidSAPhoneNumber('+27-761981783')).toBe(false);
  });
});



describe('TUT Student Number Validation', () => {
  it('should accept a 9-digit student number', () => {
    expect(isValidStudentNumber('221234567')).toBe(true);
  });

  it('should reject numbers that are not 9 digits', () => {
    expect(isValidStudentNumber('12345678')).toBe(false);    // 8 digits
    expect(isValidStudentNumber('1234567890')).toBe(false);  // 10 digits
  });

  it('should reject student numbers with letters', () => {
    expect(isValidStudentNumber('abc123456')).toBe(false);
    expect(isValidStudentNumber('12345abc9')).toBe(false);
  });

  it('should reject student numbers with spaces', () => {
    expect(isValidStudentNumber('22123 567')).toBe(false);
    expect(isValidStudentNumber(' 221234567')).toBe(false);
    expect(isValidStudentNumber('221234567 ')).toBe(false);
  });

  it('should reject student numbers with special characters', () => {
    expect(isValidStudentNumber('22123456#')).toBe(false);
    expect(isValidStudentNumber('221-34567')).toBe(false);
    expect(isValidStudentNumber('2212345@7')).toBe(false);
  });
});
