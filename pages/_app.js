import '../styles/globals.css'
import { inspect } from '@xstate/inspect';

if (typeof window !== 'undefined') {
  inspect({ iframe: false });
}

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
