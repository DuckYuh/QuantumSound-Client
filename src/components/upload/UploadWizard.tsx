'use client';

import { useState } from 'react';
import TrackList from './TrackList';
import AlbumForm from './AlbumForm';
import { CreateAlbum } from '@/types/album';
import { TrackFormData } from '@/types/track';
import { toast } from 'sonner';
import { trackService } from '@/services/track.service';
import { albumService } from '@/services/album.service';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/providers/AuthProvider';

export default function UploadWizard() {
    const [uploading, setUploading] = useState(false);
    const [step, setStep] = useState<1 | 2>(1);
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const [album, setAlbum] = useState<CreateAlbum>({
        title: "",
        type: "SINGLE",
        description: "",
    });
    const [tracks, setTracks] = useState<TrackFormData[]>([
        {
            title: "",
            description: "",
            visibility: "PUBLIC",
            audio: null,
            genres: [],
            tags: [],
        },
    ]);

    const handleUpload = async () => {
        setUploading(true);
        try {
            const albumRes = await albumService.createAlbum({
                title: album.title,
                type: album.type,
                description: album.description,
                coverImage: album.coverImage,
            });

            const albumId = albumRes.data.id;

            for (const track of tracks) {
                await trackService.uploadTrack(
                    {
                        title: track.title,
                        description: track.description,
                        visibility: track.visibility,
                        albumId,
                        genres: track.genres,
                        tags: track.tags,
                    },
                    track.audio!
                );
            }
            queryClient.invalidateQueries({ 
                queryKey: ["user-albums", user?.username] 
            });
            toast.success("Upload successful");
            resetWizard();
        } catch (error) {
            toast.error("Upload failed");
        } finally {
            setUploading(false);
        }
    }

    const resetWizard = () => {
        setStep(1);

        setAlbum({
            title: "",
            type: "SINGLE",
            description: "",
        });

        setTracks([
            {
                title: "",
                description: "",
                visibility: "PUBLIC",
                audio: null,
                genres: [],
                tags: [],
            },
        ]);
    }

    return (
        <>
            <div>
                {step === 1 && (
                    <AlbumForm
                        album={album}
                        setAlbum={setAlbum}
                        onNext={() => setStep(2)}
                    />
                )}

                {step === 2 && (
                    <TrackList
                        album={album}
                        tracks={tracks}
                        setTracks={setTracks}
                        onBack={() => setStep(1)}
                        onUpload={handleUpload}
                        upLoading={uploading}
                    />
                )}
            </div>
        </>
    );
}