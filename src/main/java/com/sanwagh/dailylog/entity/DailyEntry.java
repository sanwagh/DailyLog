package com.sanwagh.dailylog.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name ="daily_entries")
@NoArgsConstructor
@Getter
@Setter
public class DailyEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "date", nullable = false, unique = true)
    private LocalDate date;


    private int ruminationRating;
    private boolean practiceCompleted;

}
