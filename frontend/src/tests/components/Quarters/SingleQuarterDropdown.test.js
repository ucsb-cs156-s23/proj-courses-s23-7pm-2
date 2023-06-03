import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from 'react';

import SingleQuarterDropdown from "main/components/Quarters/SingleQuarterDropdown"
import { quarterRange } from 'main/utils/quarterUtilities';

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: jest.fn()
}))

describe("SingleQuarterSelector tests", () => {
    beforeEach(() => {
        useState.mockImplementation(jest.requireActual('react').useState);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const quarter = jest.fn();
    const setQuarter = jest.fn();

    test("correctly renders a single quarter (no local storage, only one item to select)", async () => {

        // Mock condition that local storage returns null for any key
        jest.spyOn(Storage.prototype, 'getItem');
        Storage.prototype.getItem = jest.fn().mockImplementation(() => null);

        render(<SingleQuarterDropdown
            quarters={quarterRange("20211", "20211")}
            quarter={quarter}
            setQuarter={setQuarter}
            controlId="sqd1"
        />);
        await screen.findByText("W21");
        expect(screen.getAllByRole('option').length).toBe(1);
        expect(screen.getByLabelText("Quarter")).toHaveValue("20211");
    });

    test("correctly renders four quarters (no local storage, so first item selected)", async () => {

        // Mock condition that local storage returns null for any key
        jest.spyOn(Storage.prototype, 'getItem');
        Storage.prototype.getItem = jest.fn().mockImplementation(() => null);

        render(<SingleQuarterDropdown
            quarters={quarterRange("20213", "20222")}
            quarter={quarter}
            setQuarter={setQuarter}
            controlId="sqd1"
        />);
        await screen.findByText("M21");
        expect(screen.getByText("F21")).toBeInTheDocument();
        expect(screen.getByText("W22")).toBeInTheDocument();
        expect(screen.getByText("S22")).toBeInTheDocument();
        expect(screen.getAllByRole('option').length).toBe(4);
        expect(screen.getByLabelText("Quarter")).toHaveValue("20213"); // M21
    });

    test("correctly selects the correct item from localstorage", async () => {

        // Mock condition that local storage maps key sqd1 to 20221 (W22)
        jest.spyOn(Storage.prototype, 'getItem');
        Storage.prototype.getItem = jest.fn().mockImplementation((key) => {
            const items = { "sqd1": "20221" }
            if (key in items) { return items[key]; }
            throw new Error(`Unexpected key ${key}`);
        });

        render(<SingleQuarterDropdown
            quarters={quarterRange("20213", "20222")}
            quarter={quarter}
            setQuarter={setQuarter}
            controlId="sqd1"
        />);
        await screen.findByText("M21");
        expect(screen.getByText("F21")).toBeInTheDocument();
        expect(screen.getByText("W22")).toBeInTheDocument();
        expect(screen.getByText("S22")).toBeInTheDocument();
        expect(screen.getAllByRole('option').length).toBe(4);
        expect(screen.getByLabelText("Quarter")).toHaveValue("20221"); // W22
    });

    test("User selecting a new item has intended effect", async () => {

        // Mock condition that local storage maps key sqd1 to 20221 (W22)
        jest.spyOn(Storage.prototype, 'getItem');
        Storage.prototype.getItem = jest.fn().mockImplementation((key) => {
            const items = { "sqd1": "20221" }
            if (key in items) { return items[key]; }
            throw new Error(`Unexpected key ${key}`);
        });

        render(<SingleQuarterDropdown
            quarters={quarterRange("20213", "20222")}
            quarter={quarter}
            setQuarter={setQuarter}
            controlId="sqd1"
        />);
        await screen.findByText("M21");
        expect(screen.getByText("F21")).toBeInTheDocument();
        expect(screen.getByText("W22")).toBeInTheDocument();
        expect(screen.getByText("S22")).toBeInTheDocument();
        expect(screen.getAllByRole('option').length).toBe(4);
        expect(screen.getByLabelText("Quarter")).toHaveValue("20221"); // W22

        // User selects F21
        const selectQuarter = screen.getByLabelText("Quarter")
        userEvent.selectOptions(selectQuarter, "20214");
        await (waitFor(
            () => expect(setQuarter).toBeCalledWith("20214")
        ));
        expect(screen.getByLabelText("Quarter")).toHaveValue("20214");
    });

    test("if I pass a non-null onChange, it gets called when the value changes", async () => {
        const onChange = jest.fn();
        render(
            <SingleQuarterDropdown
                quarters={quarterRange("20211", "20222")}
                quarter={quarter}
                setQuarter={setQuarter}
                controlId="sqd1"
                label="Select Quarter"
                onChange={onChange}
            />
        );

        expect(await screen.findByLabelText("Select Quarter")).toBeInTheDocument();
        const selectQuarter = screen.getByLabelText("Select Quarter")
        userEvent.selectOptions(selectQuarter, "20213");
        await waitFor(() => expect(setQuarter).toBeCalledWith("20213"));
        await waitFor(() => expect(onChange).toBeCalledTimes(1));

        // x.mock.calls[0][0] is the first argument of the first call to the jest.fn() mock x
        const event = onChange.mock.calls[0][0];
        expect(event.target.value).toBe("20213");
    });
});
