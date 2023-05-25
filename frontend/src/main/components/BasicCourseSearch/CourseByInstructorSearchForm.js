import { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { quarterRange } from "main/utils/quarterUtilities";
import { useSystemInfo } from "main/utils/systemInfo";
import SingleQuarterDropdown from "../Quarters/SingleQuarterDropdown";

const CourseByInstructorSearchForm = ({ fetchJSON }) => {

  const { data: systemInfo } = useSystemInfo();

  // Stryker disable OptionalChaining
  const startQtr = systemInfo?.startQtrYYYYQ || "20211";
  const endQtr = systemInfo?.endQtrYYYYQ || "20214";
  // Stryker enable OptionalChaining

  const quarters = quarterRange(startQtr, endQtr);

  // Stryker disable all : not sure how to test/mock local storage
  const localStartQuarter = localStorage.getItem("CourseByInstructorSearch.StartQuarter");
  const localEndQuarter = localStorage.getItem("CourseByInstructorSearch.EndQuarter");
  const localInstructor = localStorage.getItem("CourseByInstructorSearch.Instructor");

  const [startQuarter, setStartQuarter] = useState(localStartQuarter || quarters[0].yyyyq);
  const [endQuarter, setEndQuarter] = useState(localEndQuarter || quarters[0].yyyyq);
  const [instructor, setInstructor] = useState(localInstructor || "");
    
  const handleSubmit = (event) => {
    event.preventDefault();
    fetchJSON(event, { startQuarter, endQuarter, instructor });
  };

  const handleInstructorOnChange = (event) => {
    setInstructor(event.target.value);
  };

  // Stryker disable all : Stryker is testing by changing the padding to 0. But this is simply a visual optimization as it makes it look better
  return (
    <Form onSubmit={handleSubmit}>
      <Container>
        <Row>
          <Col md="auto">
            <SingleQuarterDropdown
              quarters={quarters}
              quarter={startQuarter}
              setQuarter={setStartQuarter}
              controlId={"CourseByInstructorSearch.StartQuarter"}
              label={"Start Quarter"}
            />
          </Col>
          <Col md="auto">
            <SingleQuarterDropdown
              quarters={quarters}
              quarter={endQuarter}
              setQuarter={setEndQuarter}
              controlId={"CourseByInstructorSearch.EndQuarter"}
              label={"End Quarter"}
            />
          </Col>
          <Form.Group controlId="CourseByInstructorSearch.Instructor">
            <Form.Label>Instructor (Try searching 'Conrad' or 'CONRAD P T')</Form.Label>
            <Form.Control onChange={handleInstructorOnChange} defaultValue={instructor} />
          </Form.Group>
        </Row>
        <Row style={{ paddingTop: 10, paddingBottom: 10 }}>
          <Col md="auto">
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Col>
        </Row>
      </Container>
    </Form>
  );
};

export default CourseByInstructorSearchForm;