import { compareValues } from "main/utils/sortHelper";
import React, { useState } from "react";
import { Form } from "react-bootstrap";

const SingleProfessorDropdown = ({
  professors,
  professor,
  setProfessor,
  controlId,
  onChange = null,
  label = "Professor",
}) => {
  const localSearchProfessor = localStorage.getItem(controlId);

  const [professorState, setProfessorState] = useState(
    // Stryker disable next-line all : not sure how to test/mock local storage
    localSearchProfessor || professor
  );

  const handleProfessorOnChange = (event) => {
    localStorage.setItem(controlId, event.target.value);
    setProfessorState(event.target.value);
    setProfessor(event.target.value);
    if (onChange != null) {
      onChange(event);
    }
  };

  professors.sort(compareValues("lastName")); // Replace "professors" with the actual array of professor objects

  return (
    <Form.Group controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        as="select"
        value={professorState}
        onChange={handleProfessorOnChange}
      >
        {professors.map(function (prof) { // Replace "professors" with the actual array of professor objects
          const key = `${controlId}-option-${prof.id}`; // Adjust the key based on the professor object properties
          return (
            <option key={key} data-testid={key} value={prof.id}> {/* Adjust the value based on the professor object properties */}
              {prof.lastName}, {prof.firstName} {/* Adjust the professor object properties */}
            </option>
          );
        })}
      </Form.Control>
    </Form.Group>
  );
};

export default SingleProfessorDropdown;
