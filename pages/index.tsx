import Head from "next/head";
import styles from "../styles/Home.module.css";
import LoginButton from "../component/login-btn";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
	const { data: session } = useSession();
	const router = useRouter();
	useEffect(() => {
		if (session) {
			router.push("/dashboard");
		}
	}, [session]);
	if (session) {
		return null;
	}
	return (
		<div className={styles.container}>
			<Head>
				<title>Customer Management and Invoice Tracking</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main>
				<div className='mt-5 flex items-center justify-center flex-col'>
					<h1 className='text-3xl font-bold text-center'>
						Customer Management and Invoice Tracking
					</h1>
					<div className='h-80'>
						<img
							src='assets/crm.jpg'
							className='h-full w-full object-contain'
						/>
					</div>
					<button
						type='button'
						className='login-with-google-btn'
						onClickCapture={() => {
							signIn();
						}}
					>
						Sign in with Google
					</button>
				</div>
			</main>
		</div>
	);
}
