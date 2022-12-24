import { ThemeProvider, CssBaseline } from "@mui/material"
import type { AppProps } from 'next/app'
import theme from "../src/styles/theme"
import createEmotionCache from "../src/styles/createEmotionCache";
import { CacheProvider } from "@emotion/react";
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import {EmotionCache} from "@emotion/utils/dist/declarations/types";
import {Provider} from "react-redux";
import {store} from "../src/redux/store"
import {RouteGuard} from "../src/components/RouteGuard";

const clientSideEmotionCache = createEmotionCache();

// Create a client
const queryClient = new QueryClient()

function MyApp({ Component, emotionCache = clientSideEmotionCache, pageProps }: AppProps & {emotionCache: EmotionCache}) {
  return (
      <Provider store={store}>
          <CacheProvider value={emotionCache}>
              <ThemeProvider theme={theme}>
                  <QueryClientProvider client={queryClient}>
                      <CssBaseline />
                      <RouteGuard>
                          <Component {...pageProps} />
                      </RouteGuard>
                  </QueryClientProvider>
              </ThemeProvider>
          </CacheProvider>
      </Provider>
  )
}

export default MyApp
