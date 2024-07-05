import { render, screen, fireEvent, cleanup, getByRole } from '@testing-library/react';
import { useContext, createContext, useState } from 'react';
import '@testing-library/jest-dom';
import Sortmenu from './sortmenu';
import React = require('react');
import { BrowserRouter, Route, Routes } from 'react-router-dom';

let mockSetselected;

beforeEach(() => {
    let state = "New";
    mockSetselected = jest.fn((val) => {state = val});

    const Testcontext = createContext({setselected: mockSetselected});


    render(
        <Testcontext.Provider value={{setselected: mockSetselected}}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Sortmenu context={Testcontext}/>} />
                </Routes>
            </BrowserRouter>
        </Testcontext.Provider>
    )});
    

afterEach(() => {
    cleanup();
});

describe('sortmenu elements render', () => {

    test('PostDisplayMenu header renders', () => {
        const header = screen.getByRole('dropDownButton');
        expect(header).toBeInTheDocument();
        expect(header).toHaveTextContent('New');
    });

    test('PostDisplayMenu menu renders', async () => {
        fireEvent.click(screen.getByRole('dropDownButton'));

        const menu = await screen.getByRole('menuBodyHeader');
        expect(menu).toBeInTheDocument();
    });

    test('PostDisplayMenu menu items render', async () => {
        fireEvent.click(screen.getByRole('dropDownButton'));

        const items = await screen.getAllByRole('menuitem');
        expect(items).toHaveLength(4);
    });
});

describe('sortmenu functionality', () => {

    test('sortmenu menu hot call setDisplay', async () => {

        fireEvent.click(screen.getByRole('dropDownButton'));
        const items = await screen.getAllByRole('menuitem');

        fireEvent.click(items[0]);
        expect(mockSetselected).toHaveBeenCalledTimes(1);
      });

    test('PostDisplayMenu menu new call setDisplay', async () => {

        fireEvent.click(screen.getByRole('dropDownButton'));
        const items2 = await screen.getAllByRole('menuitem');

        fireEvent.click(items2[1]);
        expect(mockSetselected).toHaveBeenCalledTimes(1);
    });

    test('PostDisplayMenu menu top call setDisplay', async () => {

        fireEvent.click(screen.getByRole('dropDownButton'));
        const items2 = await screen.getAllByRole('menuitem');

        fireEvent.click(items2[2]);
        expect(mockSetselected).toHaveBeenCalledTimes(1);
    });

    test('sortmenu closes on item click', async () => {

        fireEvent.click(screen.getByRole('dropDownButton'));
        fireEvent.click(screen.getByRole('dropDownButton'));
        const menu = await screen.queryByRole('menuBodyHeader');
        expect(menu).not.toBeInTheDocument();
    });

    test('sortmenu menu hot call setDisplay with correct value', async () => {

        fireEvent.click(screen.getByRole('dropDownButton'));
        const items1 = await screen.getAllByRole('menuitem');

        fireEvent.click(items1[1]);
        expect(mockSetselected).toHaveBeenCalledWith('Hot');
    });

    test('sortmenu menu new call setDisplay with correct value', async () => {

        fireEvent.click(screen.getByRole('dropDownButton'));
        const items2 = await screen.getAllByRole('menuitem');

        fireEvent.click(items2[2]);
        expect(mockSetselected).toHaveBeenCalledWith('New');
    });

    test('sortmenu menu top call setDisplay with correct value', async () => {

        fireEvent.click(screen.getByRole('dropDownButton'));
        const items3 = await screen.getAllByRole('menuitem');

        fireEvent.click(items3[3]);
        expect(mockSetselected).toHaveBeenCalledWith('Top');
    });

});

describe('sortmenu style select applies correctly', () => {

    test('sortmenu style hot select applies correctly', async () => {

        fireEvent.click(screen.getByRole('dropDownButton'));
        const items = await screen.getAllByRole('menuitem');

        fireEvent.click(items[0]);
        fireEvent.click(screen.getByRole('dropDownButton'));
        expect(items[0]).toHaveClass('bg-gray-200');
    });

    test('sortmenu style new select applies correctly', async () => {

        fireEvent.click(screen.getByRole('dropDownButton'));
        const items2 = await screen.getAllByRole('menuitem');

        fireEvent.click(items2[1]);
        fireEvent.click(screen.getByRole('dropDownButton'));
        expect(items2[1]).toHaveClass('bg-gray-200');
    });

    test('sortmenu style top select applies correctly', async () => {

        fireEvent.click(screen.getByRole('dropDownButton'));
        const items3 = await screen.getAllByRole('menuitem');

        fireEvent.click(items3[2]);
        fireEvent.click(screen.getByRole('dropDownButton'));
        expect(items3[2]).toHaveClass('bg-gray-200');
    });
});