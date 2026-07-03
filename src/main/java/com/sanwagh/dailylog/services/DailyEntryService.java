package com.sanwagh.dailylog.services;

import com.sanwagh.dailylog.dto.DailyEntryRequest;
import com.sanwagh.dailylog.dto.DailyEntryResponse;
import com.sanwagh.dailylog.repositories.DailyEntryRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class DailyEntryService {
    private final DailyEntryRepository dailyEntryRepository;

    private DailyEntryResponse upsertEntity(DailyEntryRequest dailyEntryRequest)
    {
        // Check if date is present
        //Check is another entry at that date is present (use repository.findAllByDate(date);
    }


}
