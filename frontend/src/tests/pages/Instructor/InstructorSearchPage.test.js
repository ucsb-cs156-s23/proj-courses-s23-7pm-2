import { render} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import InstructorSearchPage from "main/pages/Instructor/InstructorSearchPage";


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