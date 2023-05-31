package edu.ucsb.cs156.courses.repositories;

import edu.ucsb.cs156.courses.entities.Grade;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface GradeRepository extends CrudRepository<Grade, Long> {
}