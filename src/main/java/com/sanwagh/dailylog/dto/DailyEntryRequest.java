package com.sanwagh.dailylog.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.PastOrPresent;
import lombok.*;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DailyEntryRequest {

    @PastOrPresent
    private LocalDate date;

    @Min(1)
    @Max(10)
    private int ruminationRating;
    private boolean practiceCompleted;

}
