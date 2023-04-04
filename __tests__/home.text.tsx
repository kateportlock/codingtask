/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import { render, screen, waitFor } from '@testing-library/react';
import Home from '../pages/index';

jest.mock('axios');

describe('Home', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('displays SpaceX launches', async () => {
        const launches = [
            {
                id: '1',
                name: 'Test Launch 1',
                cores: [{ core: { serial: 'Test Serial 1' } }],
                date_utc: '2022-01-01T00:00:00Z',
                success: true,
                failures: [],
                payloads: [{ id: 'payload1', type: 'Test Type' }],
                links: {
                    patch: {
                        small: 'https://example.com/test.png',
                    },
                },
            },
            {
                id: '2',
                name: 'Test Launch 2',
                cores: [{ core: { serial: 'Test Serial 2' } }],
                date_utc: '2022-02-01T00:00:00Z',
                success: false,
                failures: [{ reason: 'Test Reason' }],
                payloads: [{ id: 'payload2', type: 'Test Type' }],
                links: {
                    patch: {
                        small: 'https://example.com/test2.png',
                    },
                },
            },
        ];

        (axios.post as jest.MockedFunction<typeof axios.post>).mockResolvedValueOnce({ status: 200, data: { docs: launches } });

        render(<Home />);

        expect(screen.getByText(/SpaceX Launches/i)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getAllByRole('heading')).toHaveLength(2);
            expect(screen.getAllByText(/Test Launch/i)).toHaveLength(2);
            expect(screen.getAllByText(/Test Serial/i)).toHaveLength(2);
            expect(screen.getAllByText(/2022/i)).toHaveLength(2);
            expect(screen.getByAltText(/Image of Test Launch 1/i)).toBeInTheDocument();
            expect(screen.getByAltText(/Image of Test Launch 2/i)).toBeInTheDocument();
            expect(screen.getByText(/Success/i)).toBeInTheDocument();
            expect(screen.getByText(/Failure/i)).toBeInTheDocument();
            expect(screen.getByText(/payload1/i)).toBeInTheDocument();
            expect(screen.getByText(/payload2/i)).toBeInTheDocument();
            expect(screen.getByText(/Test Reason/i)).toBeInTheDocument();
        });
    });
});
