import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import userEvent from "@testing-library/user-event";

import SearchByInstructorPage from "main/pages/SearchByInstructor/SearchByInstructorPage";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

describe("SearchByInstructorPage tests", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.resetHistory();
        axiosMock
            .onGet("/api/currentUser")
            .reply(200, { user: "mockUser" });
    });

    const queryClient = new QueryClient();

    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SearchByInstructorPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("calls course by instructor search API correctly", async () => {
        axiosMock
            .onGet("/api/public/coursebyinstructor/search")
            .reply(200, { courses: [] });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SearchByInstructorPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const startQuarterInput = screen.getByLabelText("Start Quarter");
        userEvent.type(startQuarterInput, "20222");

        const endQuarterInput = screen.getByLabelText("End Quarter");
        userEvent.type(endQuarterInput, "20223");

        const instructorInput = screen.getByLabelText("Instructor");
        userEvent.type(instructorInput, "CONRAD P T");

        const submitButton = screen.getByText("Submit");
        userEvent.click(submitButton);

        await waitFor(() => {
            expect(axiosMock.history.get.length).toBe(1);
            expect(axiosMock.history.get[0].params).toEqual({
                startQtr: "20222",
                endQtr: "20223",
                instructor: "CONRAD P T",
            });
            expect(screen.getByText("No courses found")).toBeInTheDocument();
        });
    });
});
