import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../LoginPage.tsx';

// Setting up Mock variables
const mockSignIn = jest.fn();
const mockNavigate = jest.fn();

jest.mock('@features/auth', () => ({
    userAuthUser: () ({
        signIn: mockSignIn, 
    })
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,

}));

// Groups related test types together, and resets the mock upon each test
describe('LoginPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();

    })

    // Test Use Case 1: Error - Invalid Email 
    it('shows error for non-@mtroyal.ca email', async () => {
        <MemoryRouter>
            <LoginPage/>
        </MemoryRouter>
    })

    // Grab email from screen
    fireEvent.change(screen.getLabelText(/email/i), {
        target: { value: 'student123@mtroyal.ca'},
    })
    // Grab password from screen
    fireEvent.change(screen.getLabelText(/password/i), {
        target: { value: 'mruExchangePassword'},
    })
    // To Click sign in button
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
        expect(
            screen.getByText(/Must be a valid @mtroyal.ca email/i)).toBeInTheDocument();
    })
})

