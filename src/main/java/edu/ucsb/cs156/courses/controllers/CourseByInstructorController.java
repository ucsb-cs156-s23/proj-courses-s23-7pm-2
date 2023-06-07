package edu.ucsb.cs156.courses.controllers;

import java.util.List;

import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.documents.ConvertedSection;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@Slf4j
@RequestMapping("/api/public/coursebyinstructor")
public class CourseByInstructorController {

    private ObjectMapper mapper = new ObjectMapper();

	@Autowired
	ConvertedSectionCollection convertedSectionCollection;

	@ApiOperation(value = "Get a list of courses by instructor over time")
	@GetMapping(value = "/search", produces = "application/json")
	public ResponseEntity<String> search(
		@ApiParam(name = "startQtr", type = "String", value = "Start quarter in YYYYQ format", example = "20221", required = true) @RequestParam String startQtr,
		@ApiParam(name = "endQtr", type = "String", value = "End quarter in YYYYQ format", example = "20222", required = true) @RequestParam String endQtr,
		@ApiParam(name = "instructor", type = "String", value = "Instructor name", example = "CONRAD P T", required = true) @RequestParam String instructor,
		@ApiParam(name = "lectureOnly", type = "boolean", value = "Lectures only", example = "true", required = true) @RequestParam boolean lectureOnly
	) throws JsonProcessingException {
		List<ConvertedSection> courseResults;
		if (lectureOnly) {
			courseResults = convertedSectionCollection.findByQuarterRangeAndInstructor(
				startQtr,
				endQtr,
				"^"+instructor.toUpperCase(),
				"^(Teaching and in charge)");
		} else {
			courseResults = convertedSectionCollection.findByQuarterRangeAndInstructor(
				startQtr,
				endQtr,
				"^"+instructor.toUpperCase(),
				"^.*");
		}
		String body = mapper.writeValueAsString(courseResults);
		log.info("body={}", body);
		return ResponseEntity.ok().body(body);
	}
}
