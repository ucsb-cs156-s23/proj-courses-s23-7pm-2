import { useState } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CourseByInstructorSearchForm from "main/components/BasicCourseSearch/CourseByInstructorSearchForm";
import BasicCourseTable from "main/components/Courses/BasicCourseTable";
import { useBackendMutation } from "main/utils/useBackend";

export default function SearchByInstructorPage() {
  const [courseJSON, setCourseJSON] = useState([]);

  const objectToAxiosParams = (query) => ({
    url: "/api/public/coursebyinstructor/search",
    params: {
      startQtr: query.startQuarter,
      endQtr: query.endQuarter,
      instructor: query.instructor,
    },
  });

  const onSuccess = (courses) => {
    setCourseJSON(courses.classes);
    console.log('Here is the log: ', courses);
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    []
  );

  async function fetchBasicCourseJSON(_event, query) {
    mutation.mutate(query);
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h5>Welcome to the UCSB Courses Description Search!</h5>
        <CourseByInstructorSearchForm fetchJSON={fetchBasicCourseJSON} />
        <BasicCourseTable courses={courseJSON} />
      </div>
    </BasicLayout>
  );
}
