// /(protected)/_layout.tsx
import {useAuth} from "@clerk/clerk-expo";
import {Redirect, Stack} from "expo-router";

export default function AppLayout() {
    const {isSignedIn} = useAuth();

    if (!isSignedIn) {
        return <Redirect href={'/sign-in'}/>
    }

    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
        </Stack>
    )
};