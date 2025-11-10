// /_layout.tsx
/*
This file is used to define the layout of the app.
It will encapsulate every page inside the app directory (with expo-router).

Slot is used to render the content of the current screen.
 */

import {Slot, Stack} from "expo-router";
import {ClerkProvider} from "@clerk/clerk-expo";
import {tokenCache} from "@clerk/clerk-expo/token-cache";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {useReactQueryDevTools} from "@dev-plugins/react-query";

const queryClient = new QueryClient();
const PK = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
if (!PK) throw new Error("Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY");

export default function RootLayoutNav() {

    // useReactQueryDevTools(queryClient)

    return (
        <ClerkProvider tokenCache={tokenCache} publishableKey={PK}>
            <QueryClientProvider client={queryClient}>
                <Slot/>
            </QueryClientProvider>
        </ClerkProvider>
    )
};