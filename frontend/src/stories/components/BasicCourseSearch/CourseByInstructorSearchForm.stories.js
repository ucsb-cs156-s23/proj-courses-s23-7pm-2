//TODO: Backend API?

import React from "react";

import CourseByInstructorSearchForm from "main/components/BasicCourseSearch/CourseByInstructorSearchForm";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";


export default {
  title: "components/BasicCourseSearch/CourseByInstructorSearch",
  component: CourseByInstructorSearchForm,
  parameters: {
    mockData: [
      {
        url: '/api/systemInfo',
        method: 'GET',
        status: 200,
        response: systemInfoFixtures.showingBothStartAndEndQtr
      },
    ],
  },
};

const Template = (args) => {
  return <CourseByInstructorSearchForm {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  submitText: "Create",
  fetchJSON: (_event, data) => {
    console.log("Submit was clicked, data=", data);
  }
};
