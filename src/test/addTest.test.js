import { describe, it, expect, vi, beforeEach } from 'vitest';
import { add } from './addTest.js';

describe('add function', () => {

    // Before each call
    beforeEach(() => {

        // Reset
        vi.clearAllMocks();

    });

    // Test
    it('adds two numbers correctly', () => {
        expect(add(2, 3)).toBe(5);
        expect(add(2, 3)).not.toBe(10);
    });

});