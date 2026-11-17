package com.streamflow.backend.config;

import com.streamflow.backend.model.Artist;
import com.streamflow.backend.model.Song;
import com.streamflow.backend.repository.ArtistRepository;
import com.streamflow.backend.repository.SongRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ArtistRepository artistRepository;
    private final SongRepository songRepository;

    @Override
    public void run(String... args) {
        if (artistRepository.count() > 0) {
            return;
        }

        Artist daftPunk = Artist.builder()
                .name("Daft Punk")
                .bio("French electronic music duo formed in 1993 in Paris.")
                .imageUrl("https://placehold.co/400x400?text=Daft+Punk")
                .build();

        Artist theWeeknd = Artist.builder()
                .name("The Weeknd")
                .bio("Canadian singer, songwriter, and record producer.")
                .imageUrl("https://placehold.co/400x400?text=The+Weeknd")
                .build();

        artistRepository.saveAll(List.of(daftPunk, theWeeknd));

        Song song1 = Song.builder()
                .title("Get Lucky")
                .durationSeconds(248)
                .audioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3")
                .coverUrl("https://placehold.co/300x300?text=Get+Lucky")
                .artist(daftPunk)
                .build();

        Song song2 = Song.builder()
                .title("Instant Crush")
                .durationSeconds(337)
                .audioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3")
                .coverUrl("https://placehold.co/300x300?text=Instant+Crush")
                .artist(daftPunk)
                .build();

        Song song3 = Song.builder()
                .title("Blinding Lights")
                .durationSeconds(200)
                .audioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3")
                .coverUrl("https://placehold.co/300x300?text=Blinding+Lights")
                .artist(theWeeknd)
                .build();

        songRepository.saveAll(List.of(song1, song2, song3));
    }
}