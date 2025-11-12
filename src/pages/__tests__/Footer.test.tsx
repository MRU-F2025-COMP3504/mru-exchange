import { describe, it, expect} from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer.tsx'
import { MemoryRouter } from 'react-router-dom';

describe('Footer', () => {

    // Test: Checking if link text on page pushes the link to the do
    it('should render the Contact Us link', () => {
        render(
            <MemoryRouter>
                <Footer />
            </MemoryRouter>
        );

        const link = screen.getByRole('link', { name: /contact us/i })
        expect(link).not.toBeNull();
        expect(link.getAttribute('href')).toBe('/contact-us')
        expect(link.textContent).toContain('Contact Us');
    });
});