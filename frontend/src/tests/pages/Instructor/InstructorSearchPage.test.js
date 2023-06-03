import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import InstructorSearchPage from "main/pages/Instructor/InstructorSearchPage";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { threeSections } from "fixtures/sectionFixtures";
import { allTheSubjects } from "fixtures/subjectFixtures";
import userEvent from "@testing-library/user-event";


const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

describe("InstructorSearchPage tests", () => {
    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <InstructorSearchPage />
            </MemoryRouter>
        </QueryClientProvider>
        );
    });
});