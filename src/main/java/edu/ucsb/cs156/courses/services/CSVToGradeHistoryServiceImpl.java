package edu.ucsb.cs156.courses.services;

 import edu.ucsb.cs156.courses.entities.Grade;
 import lombok.extern.slf4j.Slf4j;
 import org.springframework.stereotype.Service;

 import java.io.Reader;
 import java.util.ArrayList;
 import java.util.List;

 import java.io.FileReader;
 import com.opencsv.CSVReaderBuilder;
 import com.opencsv.CSVReader;

 @Slf4j
 @Service
 public class CSVToGradeHistoryServiceImpl implements CSVToGradeHistoryService {

     @Override
     public List<Grade> parse(Reader reader) throws Exception {
         List<Grade> gradeHistoryList = new ArrayList<Grade>();
         log.info("Parsing CSV file with grade history... ");
         CSVReader csvReader = new CSVReader(reader);
         List<String[]> myEntries = csvReader.readAll();
         for (String[] row : myEntries) {
             Grade grade =  Grade.builder()
             .quarter(row[0])
             .courseLevel(row[1])
             .courseName(row[2])
             .Instructor(row[3])
             .grade(row[4])
             .studentCount(Integer.parseInt(row[5]))
             .build();
             log.info("Parsed: " + grade.toString());
             gradeHistoryList.add(grade);
         }
         csvReader.close();
         return gradeHistoryList;
     }

 }