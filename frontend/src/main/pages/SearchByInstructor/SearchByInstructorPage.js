import { useState } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CourseByInstructorSearchForm from "main/components/BasicCourseSearch/CourseByInstructorSearchForm";
import BasicCourseTable from "main/components/Courses/BasicCourseTable";
import { useBackendMutation } from "main/utils/useBackend";

export default function CourseDescriptionIndexPage() {
  const [courseJSON, setCourseJSON] = useState([]);

  const objectToAxiosParams = (query) => ({
    url: "/api/public/basicsearch",
    params: {
      qtr: query.quarter,
      dept: query.subject,
      level: query.level,
    },
  });

  const onSuccess = (courses) => {
    setCourseJSON(courses.classes);
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
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
