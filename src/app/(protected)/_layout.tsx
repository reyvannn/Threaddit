// /(protected)/_layout.tsx
import {useAuth, useClerk, useSession, useUser} from "@clerk/clerk-expo";
import {Redirect, Stack, useRouter} from "expo-router";
import {useEffect, useState} from "react";
import {ActivityIndicator, View, StyleSheet} from "react-native";
import {AntDesign} from "@expo/vector-icons";
import {createSupabaseClient, supabase} from "@/src/lib/supabase";

export default function AppLayout() {
    const {isSignedIn, isLoaded, getToken} = useAuth();
    const [waitedTooLong, setWaitedTooLong] = useState(false);
    const router = useRouter();

    // useEffect(() => {
    //     const timeout = setTimeout(() => {
    //             setWaitedTooLong(true);
    //         }, // Callback after delay (3 seconds). Sometimes necessary to prevent looping because of race conditions between going to the sign-in page and the homepage.
    //         3000
    //     );
    //
    //     return () => clearTimeout(timeout); // Cleanup function
    // }, [] // Empty dependency array means this effect runs once on mount
    // );

    // Create a supabase client after authentication is complete

    useEffect(() => {
        if (!supabase && isLoaded && isSignedIn) {
            createSupabaseClient({
                getToken: (() => getToken())
            });
        }
    }, [isLoaded, isSignedIn, getToken]);

    // wait and put a loading indicator if the app is still loading
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
            <Stack.Screen
                name="post/[id]"
                options={{
                    headerTitle: 'Post',
                    headerStyle: {backgroundColor: "#0a2f6d"},
                    headerTitleStyle: {color: 'white'},
                    headerTintColor: 'white',
                    animation: "slide_from_bottom",
                    headerBackButtonDisplayMode: "minimal",
                    headerLeft: () =>
                        <AntDesign name="close" size={20} style={{margin: 15}} color={"white"}
                                   onPress={() => router.back()}></AntDesign>
                }}/>
            <Stack.Screen name="group-selector" options={{headerShown: false}}/>
        </Stack>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
})