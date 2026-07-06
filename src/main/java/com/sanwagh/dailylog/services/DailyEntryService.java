package com.sanwagh.dailylog.services;

import com.sanwagh.dailylog.dto.DailyEntryRequest;
import com.sanwagh.dailylog.dto.DailyEntryResponse;
import com.sanwagh.dailylog.entity.DailyEntry;
import com.sanwagh.dailylog.exceptions.EntryAlreadyExistsException;
import com.sanwagh.dailylog.exceptions.EntryNotFoundException;
import com.sanwagh.dailylog.mapper.DailyEntryMapper;
import com.sanwagh.dailylog.repositories.DailyEntryRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class DailyEntryService {
    private final DailyEntryRepository dailyEntryRepository;
    private final DailyEntryMapper mapper;

    public DailyEntryResponse upsertEntity(DailyEntryRequest dailyEntryRequest) {
        // Check if date is present
        //Check is another entry at that date is present (use repository.findAllByDate(date);
        LocalDate date = LocalDate.now();

        //Check if entity exists already
        Optional<DailyEntry> presentEntry = dailyEntryRepository.findByDate(date);

        DailyEntry newEntry = null;

        if (presentEntry.isEmpty()) {
            newEntry = mapper.toEntity(dailyEntryRequest);
            newEntry.setDate(date); //set date to today as this will be null
        } else {
           throw new EntryAlreadyExistsException("Entity Already exists");
        }

        return mapper.toResponse(dailyEntryRepository.save(newEntry));
    }

    public DailyEntryResponse fetchEntryByDate(LocalDate date)
    {
        return mapper.toResponse(dailyEntryRepository.findByDate(date)
                .orElseThrow(() -> new EntryNotFoundException("Entity not found on date " + date)));
    }

    public List<DailyEntryResponse> fetchEntriesInRange(LocalDate startDate, LocalDate endDate)
    {
        return dailyEntryRepository.findByDateBetween(startDate, endDate)
                .stream()
                .map(mapper::toResponse)
                .toList();

    }

    public double getRollingAverage(LocalDate endDate)
    {
        List<DailyEntryResponse> getLastWeekEntries = fetchEntriesInRange(endDate.minusDays(6), endDate);

        if(getLastWeekEntries.isEmpty())
        {
            throw new EntryNotFoundException("Could not fetch last 7 days.");
        }

        return getLastWeekEntries.stream()
                .mapToInt(DailyEntryResponse::getRuminationRating)
                .average()
                .getAsDouble();
    }
}
