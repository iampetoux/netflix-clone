import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import React from "react";
import useCurrentUser from "../hooks/useCurrentUser";
import { useRouter } from "next/router";
import useProfiles from "../hooks/useProfiles";

const images = [
  '/images/default-blue.png',
  '/images/default-red.png',
  '/images/default-slate.png',
  '/images/default-green.png'
]

interface UserCardProps {
  name: string;
  image: string;
}

const UserCard: React.FC<UserCardProps> = ({name, image}) => {
  const imgSrc = image ? image : images[1];

  return (
      <div className="group flex-row w-44 mx-auto">
        <div
            className="w-44 h-44 rounded-md flex items-center justify-center border-2 border-transparent group-hover:cursor-pointer group-hover:border-white overflow-hidden">
          <img draggable={false} className="w-max h-max object-contain" src={imgSrc} alt=""/>
        </div>
        <div className="mt-4 text-gray-400 text-2xl text-center group-hover:text-white">{name}</div>
      </div>
  );
}

const Profiles = () => {
  const router = useRouter();
  const {data: currentUser} = useCurrentUser();
  const {data: profiles} = useProfiles();

  const selectProfile = (id: string) => {
    sessionStorage.setItem('profile', id);
    router.push('/');
  };

  return (
      <div className="flex items-center h-full justify-center">
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-6xl text-white text-center">Qui regarde Netflix?</h1>
          <div className="flex items-start justify-center gap-8 mt-10">
            {profiles?.map((profile, key) => (
                <div onClick={() => selectProfile(profile?.id)} key={key}>
                  <UserCard name={profile?.name}
                            image={profile?.image}/>
                </div>
            ))}
          </div>
        </div>
      </div>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}

export default Profiles;