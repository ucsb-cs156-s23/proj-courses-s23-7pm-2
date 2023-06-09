import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import CourseByInstructorSearchForm from "main/components/BasicCourseSearch/CourseByInstructorSearchForm";

jest.mock("react-toastify", () => ({
  toast: jest.fn(),
}));

describe("CourseByInstructorSearchForm tests", () => {

  const axiosMock = new AxiosMockAdapter(axios);

  const queryClient = new QueryClient();
  const addToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error')
    console.error.mockImplementation(() => null);

    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, {
        ...systemInfoFixtures.showingNeither,
        "startQtrYYYYQ": "20201",
        "endQtrYYYYQ": "20214"
      });

    toast.mockReturnValue({
      addToast: addToast,
    });
  });


  test("has expected CSS properties", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseByInstructorSearchForm />
        </MemoryRouter>
      </QueryClientProvider>
    );
    expect(screen.getByTestId("CourseByInstructorSearchForm-data-row")).toBeInTheDocument();
    const row = screen.getByTestId("CourseByInstructorSearchForm-data-row");
    expect(row).toHaveAttribute("style", "padding-top: 10px; padding-bottom: 10px;");
  });

  test("gets values from local storage", async () => {
    jest.spyOn(Storage.prototype, 'getItem');
    Storage.prototype.getItem = jest.fn().mockImplementation((key) => {
      const items = {
        "CourseByInstructorSearch.StartQuarter": "20202", // accessed by SingleQuarterDropdown
        "CourseByInstructorSearch.EndQuarter": "20203", // accessed by SingleQuarterDropdown
        "CourseByInstructorSearch.Instructor": "CONRAD P T",
        "CourseByInstructorSearch.Checkbox": "true"
      }
      if (key in items) return items[key];
      throw new Error(`Unexpected key ${key}`);
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseByInstructorSearchForm />
        </MemoryRouter>
      </QueryClientProvider>
    );
    expect(localStorage.getItem).toBeCalledWith('CourseByInstructorSearch.StartQuarter')
    expect(localStorage.getItem).toBeCalledWith('CourseByInstructorSearch.EndQuarter')
    expect(localStorage.getItem).toBeCalledWith('CourseByInstructorSearch.Instructor')
    expect(localStorage.getItem).toBeCalledWith('CourseByInstructorSearch.Checkbox')

    await waitFor(() => {
      expect(screen.getByLabelText("Start Quarter").value).toBe("20202");
    });
    expect(screen.getByLabelText("End Quarter").value).toBe("20203");
    expect(screen.getByLabelText("Instructor (Try searching 'Conrad' or 'CONRAD P T')").value).toBe("CONRAD P T");
    expect(screen.getByTestId("CourseByInstructorSearchForm-checkbox").checked).toBe(true);


    const submitRow = screen.getByText("Submit").parentElement.parentElement;
    expect(submitRow).toHaveAttribute("style", "padding-top: 10px; padding-bottom: 10px;")


  });


  test("no values in local storage and no values from /api/systemInfo", async () => {
    jest.spyOn(Storage.prototype, 'getItem');
    Storage.prototype.getItem = jest.fn().mockImplementation((_key) => null);

    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, {
        "springH2ConsoleEnabled": false,
        "showSwaggerUILink": false,
        "startQtrYYYYQ": null, // use fallback value
        "endQtrYYYYQ": null  // use fallback value
      });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseByInstructorSearchForm />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByLabelText("End Quarter").value).toBe("20201");
    expect(screen.getByLabelText("Instructor (Try searching 'Conrad' or 'CONRAD P T')").value).toBe("");
    expect(screen.getByTestId("CourseByInstructorSearchForm-checkbox").checked).toBe(false);
  });

  test("when I select a start quarter, the state for start quarter changes", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseByInstructorSearchForm />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // wait for the option to exist; it takes a moment for them to load
    await waitFor(() => {
      expect(screen.getByTestId("CourseByInstructorSearch.StartQuarter-option-20202")).toBeInTheDocument();
    });

    expect(localStorage.getItem).toBeCalledWith('CourseByInstructorSearch.StartQuarter')
    expect(localStorage.getItem).toBeCalledWith('CourseByInstructorSearch.EndQuarter')
    expect(localStorage.getItem).toBeCalledWith('CourseByInstructorSearch.Instructor')
    expect(localStorage.getItem).toBeCalledWith('CourseByInstructorSearch.Checkbox')

    await waitFor(() => {
      expect(screen.getByLabelText("Start Quarter").value).toBe("20211");
    });

    expect(screen.getByTestId("CourseByInstructorSearch.StartQuarter-option-20202")).toBeInTheDocument();

    expect(screen.getByLabelText("End Quarter").value).toBe("20211");
    expect(screen.getByLabelText("Instructor (Try searching 'Conrad' or 'CONRAD P T')").value).toBe("");
    expect(screen.getByTestId("CourseByInstructorSearchForm-checkbox").checked).toBe(false);

    const selectStartQuarter = screen.getByLabelText("Start Quarter");
    userEvent.selectOptions(selectStartQuarter, "20202");
    expect(selectStartQuarter.value).toBe("20202");
  });

  test("when I select an end quarter, the state for end quarter changes", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseByInstructorSearchForm />
        </MemoryRouter>
      </QueryClientProvider>
    );
    const selectEndQuarter = screen.getByLabelText("End Quarter");
    userEvent.selectOptions(selectEndQuarter, "20204");
    expect(selectEndQuarter.value).toBe("20204");
  });

  test("when I select an instructor, the state for instructor changes", () => {
    jest.spyOn(Storage.prototype, 'setItem');
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseByInstructorSearchForm />
        </MemoryRouter>
      </QueryClientProvider>
    );
    const selectInstructor = screen.getByLabelText("Instructor (Try searching 'Conrad' or 'CONRAD P T')");
    userEvent.type(selectInstructor, "CONRAD P T");
    expect(selectInstructor.value).toBe("CONRAD P T");
    expect(localStorage.setItem).toBeCalledWith('CourseByInstructorSearch.Instructor', "CONRAD P T");
  });

  test("when I select the checkbox, the state for checkbox changes", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseByInstructorSearchForm />
        </MemoryRouter>
      </QueryClientProvider>
    );
    const selectCheckbox = screen.getByTestId("CourseByInstructorSearchForm-checkbox");
    userEvent.click(selectCheckbox);
    expect(selectCheckbox.checked).toBe(true);
    expect(localStorage.setItem).toBeCalledWith('CourseByInstructorSearch.Checkbox', "true");
  });

  test("when I click submit, the right stuff happens", async () => {
    const sampleReturnValue = { sampleKey: "sampleValue" };
    const fetchJSONSpy = jest.fn();

    fetchJSONSpy.mockResolvedValue(sampleReturnValue);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseByInstructorSearchForm fetchJSON={fetchJSONSpy} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const expectedFields = {
      startQuarter: "20211",
      endQuarter: "20214",
      instructor: "CONRAD P T",
      checkbox: true
    };

    const selectStartQuarter = screen.getByLabelText("Start Quarter");
    userEvent.selectOptions(selectStartQuarter, "20211");
    const selectEndQuarter = screen.getByLabelText("End Quarter");
    userEvent.selectOptions(selectEndQuarter, "20214");
    const selectInstructor = screen.getByLabelText("Instructor (Try searching 'Conrad' or 'CONRAD P T')");
    userEvent.type(selectInstructor, "CONRAD P T");
    const selectCheckbox = screen.getByTestId("CourseByInstructorSearchForm-checkbox");
    userEvent.click(selectCheckbox);
    const submitButton = screen.getByText("Submit");
    userEvent.click(submitButton);

    await waitFor(() => expect(fetchJSONSpy).toHaveBeenCalledTimes(1));

    expect(fetchJSONSpy).toHaveBeenCalledWith(
      expect.any(Object),
      expectedFields
    );
  });

  test("when I click submit when JSON is EMPTY, setCourse is not called!", async () => {
    const sampleReturnValue = { sampleKey: "sampleValue", total: 0 };
    const fetchJSONSpy = jest.fn();

    fetchJSONSpy.mockResolvedValue(sampleReturnValue);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseByInstructorSearchForm fetchJSON={fetchJSONSpy} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const selectStartQuarter = screen.getByLabelText("Start Quarter");
    userEvent.selectOptions(selectStartQuarter, "20204");
    const selectEndQuarter = screen.getByLabelText("End Quarter");
    userEvent.selectOptions(selectEndQuarter, "20204");
    const selectInstructor = screen.getByLabelText("Instructor (Try searching 'Conrad' or 'CONRAD P T')");
    userEvent.type(selectInstructor, "CONRAD P T");
    const submitButton = screen.getByText("Submit");
    userEvent.click(submitButton);
  });

  test("renders when fallback values are used", async () => {

    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, {
        "springH2ConsoleEnabled": false,
        "showSwaggerUILink": false,
        "startQtrYYYYQ": null, // use fallback value
        "endQtrYYYYQ": null  // use fallback value
      });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseByInstructorSearchForm />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // Check the first and last options 
    expect(await screen.findByTestId(/CourseByInstructorSearch.StartQuarter-option-20211/)).toHaveValue("20211")
    expect(await screen.findByTestId(/CourseByInstructorSearch.StartQuarter-option-20214/)).toHaveValue("20214")

  });

});
