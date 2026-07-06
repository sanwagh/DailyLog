package com.sanwagh.dailylog.controller;

import com.sanwagh.dailylog.dto.DailyEntryRequest;
import com.sanwagh.dailylog.dto.DailyEntryResponse;
import com.sanwagh.dailylog.services.DailyEntryService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping(path = "/api/entry")
@AllArgsConstructor
public class DailyEntryController {

    private final DailyEntryService service;

    @PostMapping
    public ResponseEntity<DailyEntryResponse> createDailyEntry(@RequestBody @Valid DailyEntryRequest dailyEntryRequest)
    {
        DailyEntryResponse createEntry = service.upsertEntity(dailyEntryRequest);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(createEntry);
    }

    @GetMapping("/{date}")
    public ResponseEntity<DailyEntryResponse> getEntryOnDate(@PathVariable LocalDate date)
    {
        DailyEntryResponse response = service.fetchEntryByDate(date);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/range")
    public ResponseEntity<List<DailyEntryResponse>> getEntryBetweenDates(@RequestParam LocalDate startDate,
                                                                         @RequestParam LocalDate endDate)
    {
        List<DailyEntryResponse> response = service.fetchEntriesInRange(startDate, endDate);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/average")
    public ResponseEntity<Double> getRollingAverage(@RequestParam(required = false) LocalDate endDate)
    {
        LocalDate resolvedDate = (endDate != null) ? endDate : LocalDate.now();
        double average = service.getRollingAverage(resolvedDate);

        return ResponseEntity.ok(average);
    }
}
