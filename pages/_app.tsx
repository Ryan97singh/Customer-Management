import { SessionProvider } from "next-auth/react";
import "../styles/global.css";
import "../globals.css";
import "../styles/_custom.scss";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}) {
	return (
		<SessionProvider session={session}>
			<ToastContainer />
			<Component {...pageProps} />
		</SessionProvider>
	);
}
