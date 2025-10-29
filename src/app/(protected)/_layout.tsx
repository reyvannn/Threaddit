// /(protected)/_layout.tsx
import {useAuth} from "@clerk/clerk-expo";
import {Redirect, Stack} from "expo-router";
import {useEffect, useState} from "react";
import {ActivityIndicator, View, StyleSheet} from "react-native";

export default function AppLayout() {
    const {isSignedIn, isLoaded} = useAuth();
    const [waitedTooLong, setWaitedTooLong] = useState(false)

    useEffect(() => {
        const timeout = setTimeout(() => {
                setWaitedTooLong(true);
            }, // Callback after delay (3 seconds)
            3000
        );

        return () => clearTimeout(timeout); // Cleanup function
    }, [] // Empty dependency array means this effect runs once on mount
    );

    if (!isLoaded && !waitedTooLong) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large"/>
            </View>
        )
    }

    if (!isSignedIn) {
        return <Redirect href={'/sign-in'}/>
    }

    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
        </Stack>
    )
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
})