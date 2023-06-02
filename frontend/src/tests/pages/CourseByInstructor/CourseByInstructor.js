import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import userEvent from "@testing-library/user-event";
import { threeSections } from "fixtures/sectionFixtures";

import CourseByInstructor from "main/pages/CourseByInstructor/CourseByInstructor";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

describe("CourseByInstructor tests", () => {
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
                  <CourseByInstructor />
              </MemoryRouter>
          </QueryClientProvider>
      );
  });

  test("calls course by instructor search API correctly", async () => {
    axiosMock
        .onGet("/api/public/coursebyinstructor/search")
        .reply(200, threeSections);

    render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <CourseByInstructor />
            </MemoryRouter>
        </QueryClientProvider>
    );

    const startQuarterInput = screen.getByLabelText("Start Quarter");
    userEvent.selectOptions(startQuarterInput, "20222");

    const endQuarterInput = screen.getByLabelText("End Quarter");
    userEvent.selectOptions(endQuarterInput, "20222");

    const instructorInput = screen.getByLabelText("Instructor (Try searching 'MIRZA D' or 'CONRAD P T')");
    userEvent.type(instructorInput, "CONRAD P T");

    const submitButton = screen.getByText("Submit");
    expect(submitButton).toBeInTheDocument();
    userEvent.click(submitButton);

    
    

    axiosMock.resetHistory();
    

    await waitFor(() => {
      expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1);
    });

    expect(axiosMock.history.get[0].params).toEqual({
      startQtr: "20222",
      endQtr: "20222",
      instructor: "CONRAD P T",
    });    
    expect(screen.getByText("ECE 1A")).toBeInTheDocument();
  });
});
