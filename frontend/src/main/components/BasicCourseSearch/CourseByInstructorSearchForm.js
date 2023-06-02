import { useState } from "react";
import { Form, Button, Container, Row, Col, FormCheck } from "react-bootstrap";
import { quarterRange } from "main/utils/quarterUtilities";
import { useSystemInfo } from "main/utils/systemInfo";
import SingleQuarterDropdown from "../Quarters/SingleQuarterDropdown";

const CourseByInstructorSearchForm = ({ fetchJSON }) => {

  const { data: systemInfo } = useSystemInfo();

  // Note that we need to distinguish between the first and last
  // quarters of the quarter range shown in the dropdowns, vs. 
  // the selected start and end quarters for the search.
  // The first and last quarters of the range are determined by
  // quarterRangeFirst and quarterRangeLast, which are set in
  // systemInfo.json.  The selected start and end quarters are
  // initialized from localStorage; both default to the first
  // quarter in the range


  const quarterRangeFirst = systemInfo.startQtrYYYYQ || "20211";
  const quarterRangeLast = systemInfo.endQtrYYYYQ || "20214";

  const quarters = quarterRange(quarterRangeFirst, quarterRangeLast);

  const localStorageInstructor = localStorage.getItem("CourseByInstructorSearch.Instructor");
  const localStorageFunctionCode = localStorage.getItem("CourseByInstructorSearch.FunctionCode");

  const initialInstructor = localStorageInstructor || "";
  const initialFunctionCode = localStorageFunctionCode || "";

  const [startQuarter, setStartQuarter] = useState(quarters[0].yyyyq);
  const [endQuarter, setEndQuarter] = useState(quarters[0].yyyyq);
  const [instructor, setInstructor] = useState(initialInstructor);
  const [checkbox, setCheckbox] = useState(initialFunctionCode === "Teaching and in charge");
  const [FunctionCode] = useState(initialFunctionCode);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchJSON(event, { startQuarter, endQuarter, instructor, FunctionCode });
  };

  const handleInstructorOnChange = (event) => {
    setInstructor(event.target.value);
    localStorage.setItem("CourseByInstructorSearch.Instructor", event.target.value);
  };

  const handleCheckboxOnChange = () => {
    setCheckbox(!checkbox);
    FunctionCode !== "Teaching and in charge" ? localStorage.setItem("CourseByInstructorSearch.FunctionCode", "Teaching and in charge") : localStorage.setItem("CourseByInstructorSearch.FunctionCode", "");
  };

  const testid = "CourseByInstructorSearchForm";

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
          <Form.Group controlId="CourseByInstructorSearch.Checkbox">
            <FormCheck data-testid={`${testid}-checkbox`} label="Lectures Only" onChange={handleCheckboxOnChange} checked={checkbox}></FormCheck>
          </Form.Group>
        </Row>
        <Row data-testid={`${testid}-data-row`} style={{ paddingTop: 10, paddingBottom: 10 }}>
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