package com.sanwagh.dailylog.dto;

import lombok.*;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DailyEntryRequest {
    private LocalDate date;
    private int ruminationRating;
    private boolean practiceCompleted;

}
