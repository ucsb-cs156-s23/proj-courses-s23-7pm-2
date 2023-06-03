import { render} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import CourseByInstructorIndexPage from "main/pages/CourseByInstructor/CourseByInstructorIndexPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

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
    const axiosMock = new AxiosMockAdapter(axios);
    
    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
    test("renders without crashing", () => {
        render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <CourseByInstructorIndexPage />
            </MemoryRouter>
        </QueryClientProvider>
        );
    });
});