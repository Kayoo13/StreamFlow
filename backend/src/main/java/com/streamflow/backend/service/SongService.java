package com.streamflow.backend.service;

import com.streamflow.backend.dto.SongResponse;
import com.streamflow.backend.model.Song;
import com.streamflow.backend.repository.SongRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SongService {

    private final SongRepository songRepository;

    @Transactional(readOnly = true)
    public List<SongResponse> getAllSongs() {
        return songRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private SongResponse mapToResponse(Song song) {
        return new SongResponse(
                song.getId(),
                song.getTitle(),
                song.getDurationSeconds(),
                song.getAudioUrl(),
                song.getCoverUrl(),
                song.getArtist().getId(),
                song.getArtist().getName()
        );
    }
}