import { describe, it, expect } from 'vitest';
import { isValidEmail, isValidStudentNumber, isValidContact } from '../DashboardAdmin';

describe('Validation Tests', () => {
  describe('Email Validation', () => {
    it('should validate correct student email', () => {
      expect(isValidEmail('218123456@tut4life.ac.za', 'student')).toBe(true);
    });
    it('should reject student email with incorrect domain', () => {
      expect(isValidEmail('218123456@gmail.com', 'student')).toBe(false);
    });
    it('should validate correct staff email with 6 digits', () => {
      expect(isValidEmail('123456@tut.ac.za', 'staff')).toBe(true);
    });
    it('should reject staff email with wrong domain', () => {
      expect(isValidEmail('john@tut4life.ac.za', 'staff')).toBe(false);
    });
  });

  describe('Student/Staff Number Validation', () => {
    it('should validate valid 9-digit student number', () => {
      expect(isValidStudentNumber('218123456', 'student')).toBe(true);
    });
    it('should reject invalid 8-digit student number', () => {
      expect(isValidStudentNumber('12345678', 'student')).toBe(false);
    });
    it('should validate valid 6-digit staff number', () => {
      expect(isValidStudentNumber('123456', 'staff')).toBe(true);
    });
    it('should reject invalid 5-digit staff number', () => {
      expect(isValidStudentNumber('12345', 'staff')).toBe(false);
    });
  });

  describe('Contact Number Validation', () => {
    it('should validate valid 0-prefixed SA number', () => {
      expect(isValidContact('0761981783')).toBe(true);
    });
    it('should validate valid +27-prefixed SA number', () => {
      expect(isValidContact('+27761981783')).toBe(true);
    });
    it('should reject invalid contact number with letters', () => {
      expect(isValidContact('+27abc981783')).toBe(false);
    });
    it('should reject contact number with disallowed special characters', () => {
      expect(isValidContact('076-198-1783')).toBe(false);
    });
    it('should reject number with invalid prefix', () => {
      expect(isValidContact('1234567890')).toBe(false);
    });
  });
});
