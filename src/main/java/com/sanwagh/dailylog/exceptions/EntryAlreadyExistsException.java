package com.sanwagh.dailylog.exceptions;

public class EntryAlreadyExistsException extends RuntimeException {

    public EntryAlreadyExistsException(String message)
    {
        super(message);
    }
}
