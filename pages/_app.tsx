import { ThemeProvider, CssBaseline } from "@mui/material"
import type { AppProps } from 'next/app'
import theme from "../src/styles/theme"
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import {Provider} from "react-redux";
import {store} from "../src/redux/store"
import {RouteGuard} from "../src/components/RouteGuard";
import useScrollRestoration from "../src/utils/useScrollRestoration";

// Create a client
const queryClient = new QueryClient()

function MyApp({ Component, pageProps, router }: AppProps) {
    useScrollRestoration(router);
    return (
      <Provider store={store}>
          <ThemeProvider theme={theme}>
              <QueryClientProvider client={queryClient}>
                  <CssBaseline />
                  <RouteGuard>
                      <Component {...pageProps} />
                  </RouteGuard>
              </QueryClientProvider>
          </ThemeProvider>
      </Provider>
  )
}

export default MyApp
