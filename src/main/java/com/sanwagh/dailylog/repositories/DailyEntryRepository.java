package com.sanwagh.dailylog.repositories;

import com.sanwagh.dailylog.entity.DailyEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DailyEntryRepository extends JpaRepository<DailyEntry, UUID> {
    Optional<DailyEntry> findByDate(LocalDate date);
    List<DailyEntry> findByDateBetween(LocalDate startDate, LocalDate endDate);
}
