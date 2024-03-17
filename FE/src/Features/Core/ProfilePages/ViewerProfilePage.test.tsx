import React from "react";
import { render, screen, fireEvent, waitFor, prettyDOM } from "@testing-library/react";
import ProfilePagesLayout from "./ProfilePagesRoutes";
import '@testing-library/jest-dom';
import { BrowserRouter, MemoryRouter, Routes, Route } from "react-router-dom";
import { createMemoryHistory } from "history";

test('avatar header renders correctly', () => {
    render(
        <BrowserRouter>
            <ProfilePagesLayout />
        </BrowserRouter>
    );
    const avatarHeader = screen.getByRole('avatarHeader');
    expect(avatarHeader).toBeInTheDocument();

    const sectionsBar = screen.getByRole('sectionsBar');
    expect(sectionsBar).toBeInTheDocument();

    const overviewButton = screen.getByRole('overviewButton');
    expect(overviewButton).toBeInTheDocument();

    const postsButton = screen.getByRole('postsButton');
    expect(postsButton).toBeInTheDocument();

    const commentsButton = screen.getByRole('commentsButton');
    expect(commentsButton).toBeInTheDocument();

    const sortmenu = screen.getByRole('sortmenu');
    expect(sortmenu).toBeInTheDocument();

    const displaymenu = screen.getByRole('displaymenu');
    expect(displaymenu).toBeInTheDocument();

    const card = screen.getByRole('card');
    expect(card).toBeInTheDocument();
});

describe('profile sections navigation correctly', () => {

    test('navigates to all sections pages when overview button is clicked', async () => {
        render(
            <MemoryRouter initialEntries={['/user']}>
                <Routes>
                    <Route path="/user/*" element={<ProfilePagesLayout />} />
                </Routes>
            </MemoryRouter>
        );

        const overviewButton = await screen.findByRole('overviewButton');
        fireEvent.click(overviewButton);

        await waitFor(() => {
            expect(screen.getByRole('overviewtab')).toBeInTheDocument();
        });

        const postsButton = await screen.findByRole('postsButton');
        fireEvent.click(postsButton);

        await waitFor(() => {
            expect(screen.getByRole('poststab')).toBeInTheDocument();
        });

        const commentsButton = await screen.findByRole('commentsButton');
        fireEvent.click(commentsButton);

        await waitFor(() => {
            expect(screen.getByRole('commentstab')).toBeInTheDocument();
        });
    });
});