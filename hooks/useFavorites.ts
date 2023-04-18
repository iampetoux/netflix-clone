import useSwr from 'swr'
import fetcher from '../lib/fetcher';
import useCurrentProfile from './useCurrentProfile';
import { useEffect, useState } from 'react';

const useMovies = () => {
    const [canFetch, setCanFetch] = useState(false);
    const { data: profile } = useCurrentProfile();

    useEffect(() => {
        if (profile) {
            setCanFetch(true);
        }
    }, [profile]);


    const { data, error, isLoading, mutate } = useSwr(canFetch ? `/api/favorites/${profile?.id}` : null, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });
    return {
        data,
        error,
        isLoading,
        mutate
    }
};

export default useMovies;