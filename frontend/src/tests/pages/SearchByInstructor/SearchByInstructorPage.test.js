import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import SearchByInstructorPage from "main/pages/SearchByInstructor/SearchByInstructorPage";
import { oneSection } from "fixtures/sectionFixtures";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

describe("Search by Instructor Page tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
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

  test("calls UCSB section search API correctly with 1 section response", async () => {
    axiosMock
      .onGet("/api/public/coursebyinstructor")
      .reply(200, oneSection);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SearchByInstructorPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // Update the following section to use CourseByInstructorSearchForm
    const instructorInput = screen.getByLabelText("instructor");
    userEvent.type(instructorInput, "Conrad");

    const submitButton = screen.getByText("Submit");
    expect(submitButton).toBeInTheDocument();
    userEvent.click(submitButton);

    axiosMock.resetHistory();

    await waitFor(() => {
      expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1);
    });

    expect(axiosMock.history.get[0].params).toEqual({
      instructor: "Conrad",
    });

    expect(screen.getByText("Conrad")).toBeInTheDocument();
  });
});
