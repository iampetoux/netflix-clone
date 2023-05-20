import {getSession, signOut} from 'next-auth/react';
import {NextPageContext} from "next";
import useCurrentUser from "../hooks/useCurrentUser";
import Navbar from "../components/Navbar/Navbar";
import Billboard from "../components/Billboard/Billboard";
import InfoModal from "../components/InfoModal/InfoModal";
import useFavorites from "../hooks/useFavorites";
import useInfoModalStore from "../hooks/useInfoModalStore";
import MovieList from "../components/MovieList/MovieList";
import useMovieList from "../hooks/useMovieList";

export default function Home() {
    const { data: user } = useCurrentUser();
    const { data: movies = [] } = useMovieList();
    const { data: favorites = [] } = useFavorites();
    const {isOpen, closeModal} = useInfoModalStore();
    return (
        <>
            <InfoModal visible={isOpen} onClose={closeModal} />
            <Navbar />
            <Billboard />
            <div className="pb-40">
                <MovieList title="En ce moment sur Nextflix" data={movies} />
                <MovieList title="Ma liste" data={favorites} />
            </div>
        </>
    )
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
