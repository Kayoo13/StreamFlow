package com.streamflow.backend.dto;

public record SongResponse(
        Long id,
        String title,
        Integer durationSeconds,
        String audioUrl,
        String coverUrl,
        Long artistId,
        String artistName
) {
}