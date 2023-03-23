import useSWR from 'swr';

import fetcher from "../lib/fetcher";

const useProfiles = () => {
    const { data, error, isLoading, mutate } = useSWR('/api/profiles', fetcher);

    return { data, error, isLoading, mutate };
};

export default useProfiles;