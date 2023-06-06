package edu.ucsb.cs156.courses.services;

 import java.io.Reader;
 import java.util.List;
 import edu.ucsb.cs156.courses.entities.Grade;

 public interface CSVToGradeHistoryService {
     List<Grade> parse(Reader reader) throws Exception;
 }