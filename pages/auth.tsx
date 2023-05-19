import axios from "axios";
import {useCallback, useState} from "react";
import Input from "../components/Input/Input";
import { getSession, signIn } from 'next-auth/react';
import { FcGoogle }from "react-icons/fc";
import { NextPageContext } from 'next';

export async function getServerSideProps(context: NextPageContext) {
    const session = await getSession(context);

    if (session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    return {
        props: {}
    }
}

const Auth = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [variant, setVariant] = useState('login');

    const toggleVariant = useCallback(() => {
        setVariant((currentVariant) => currentVariant === 'login' ? 'register' : 'login')
    }, []);

    const login = useCallback(async () => {
        try {
            await signIn('credentials', {
                email,
                password,
                callbackUrl: '/profiles',
            });
        } catch (error) {
            console.log(error);
        }
    }, [email, password]);

    const register = useCallback(async () => {
        try {
            await axios.post('/api/register', {
                email,
                name,
                password,
            });

            login()
        } catch (error) {
            console.log(error);
        }
    }, [email, name, password, login]);

    return (
        <div className="relative h-full w-full bg-[url('/images/hero.png')] bg-no-repeat bg-center bg-fixed bg-cover">
            <div className="bg-black w-full h-full lg:bg-opacity-50">
                <nav className="px-12 py-5">
                    <img src="/images/logo.png" alt="Logo" className="h-12"/>
                </nav>
                <div className="flex justify-center">
                    <div
                        className="bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-wd-md rounded-md w-full">
                        <h2 className="text-white text-4xl mb-8 font-semibold">
                            {variant === 'login' ? 'Connexion' : 'Inscription'}
                        </h2>
                        <div className="flex flex-col gap-4">
                            { variant === 'register' && (
                                <>
                                    <Input label="Prénom et nom de famille" onChange={(e: any) => setName(e.target.value)} id="name" value={name} />
                                </>
                            )}
                            <Input label="Adresse Email" onChange={(e: any) => setEmail(e.target.value)} id="email" type="email" value={email} />
                            <Input label="Mot de passe" onChange={(e: any) => setPassword(e.target.value)} id="password" type="password" value={password} />
                        </div>
                        <button onClick={variant === 'login' ? login : register} className="bg-red-600 py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition">{variant === 'login' ? 'Connexion' : 'Inscription'}</button>
                        <div className="flex flex-row items-center gap-4 mt-8 justify-center">
                            <div onClick={() => signIn('google', { callbackUrl: '/profiles' })} className="py-2 px-4 bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition">
                                <span className="mr-2">Connexion avec</span>
                                <FcGoogle size={32} />
                            </div>
                        </div>
                        <p className="text-neutral-500 mt-12">
                            {variant === 'login' ? 'Première fois que vous utilisez Netflix?' : 'Vous avez déjà un compte?'}
                            <span onClick={toggleVariant} className="text-white ml-1 hover:underline cursor-pointer">{variant === 'login' ? 'Créez un compte' : 'Connectez-vous'}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Auth;