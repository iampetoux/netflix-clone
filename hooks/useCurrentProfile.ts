import useSWR from 'swr';

import fetcher from "../lib/fetcher";
import { useRouter } from 'next/router';

const useCurrentProfile = () => {
  const router = useRouter();
  const profileId = typeof window !== 'undefined' ? sessionStorage.getItem('profile') : null;

  if (typeof window !== 'undefined' && !profileId) {
    router.push('/profiles');
  }

  const {
    data,
    error,
    isLoading,
    mutate
  } = useSWR('/api/currentProfile', () => fetcher(`/api/profile/${profileId}`));

  return {data, error, isLoading, mutate};
};

export default useCurrentProfile;