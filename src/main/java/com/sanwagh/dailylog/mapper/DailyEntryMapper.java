package com.sanwagh.dailylog.mapper;

import com.sanwagh.dailylog.dto.DailyEntryRequest;
import com.sanwagh.dailylog.dto.DailyEntryResponse;
import com.sanwagh.dailylog.entity.DailyEntry;
import org.springframework.stereotype.Component;

@Component
public class DailyEntryMapper {

    // Convert the entity -> a response (to the client) for the client so that only the data thats needed is sent over.
    public DailyEntryResponse toResponse(DailyEntry entity)
    {
        return new DailyEntryResponse(
                entity.getId(),
                entity.getDate(),
                entity.getRuminationRating(),
                entity.isPracticeCompleted()
        );
    }

    // Convert the request (from the client) to entity
    public DailyEntry toEntity(DailyEntryRequest request)
    {
        DailyEntry entity = new DailyEntry();
        entity.setDate(request.getDate());
        entity.setRuminationRating(request.getRuminationRating());
        entity.setPracticeCompleted(request.isPracticeCompleted());

        return entity;
    }
}
