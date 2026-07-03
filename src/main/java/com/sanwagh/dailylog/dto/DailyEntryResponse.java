package com.sanwagh.dailylog.dto;

import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DailyEntryResponse {
    private UUID id;
    private LocalDate date;
    private int ruminationRating;
    private boolean practiceCompleted;
}
