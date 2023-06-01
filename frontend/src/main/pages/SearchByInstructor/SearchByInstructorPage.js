import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CourseByInstructorSearchForm from 'main/components/BasicCourseSearch/CourseByInstructorSearchForm';

export default function SearchByInstructorPage() {
  return (
    <BasicLayout>
      <div className="pt-2">
        <h5>Welcome to the UCSB Course Search by Instructor!</h5>
      </div>
      <div><CourseByInstructorSearchForm></CourseByInstructorSearchForm></div>
    </BasicLayout>
  );
}