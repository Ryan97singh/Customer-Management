import { SessionProvider } from "next-auth/react";
import "../styles/global.css";
import "../globals.css";
import "../styles/_custom.scss";

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}) {
	return (
		<SessionProvider session={session}>
			<Component {...pageProps} />
		</SessionProvider>
	);
}
