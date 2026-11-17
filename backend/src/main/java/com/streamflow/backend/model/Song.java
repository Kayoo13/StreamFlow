package com.streamflow.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "songs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Song {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(name = "duration_seconds", nullable = false)
    private Integer durationSeconds;

    @Column(name = "audio_url", nullable = false)
    private String audioUrl;

    @Column(name = "cover_url")
    private String coverUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artist_id", nullable = false)
    private Artist artist;
}