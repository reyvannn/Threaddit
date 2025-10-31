// /(protected)/(tabs)/_layout.tsx
/**
This file is used to define the layout of the tabs at the bottom of the screen.

Tabs are used to navigate between different screens.

Tabs.Screen is used to define the screens that are displayed in the tabs.

The options property is used to define the title and icon of the tab.
title is the title of the tab (shown in the tab bar).
headerTitle is the title of the header (shown at the top of the screen).
headerTintColor is the color of the header title.
tabBarIcon is the icon of the tab (shown in the tab bar); import the icon from the icon library.
 */

import { Tabs } from "expo-router";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import {View} from "react-native";
import {useAuth} from "@clerk/clerk-expo";

export default function TabLayout() {
    const {signOut} = useAuth()
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: 'black',
                headerRight: () =>
                    <Ionicons
                        name="log-out"
                        size={28}
                        color={"black"}
                        style={[{"paddingRight":10},]}
                        onPress={() => signOut()}
                    />
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    headerTitle: 'Reddit',
                    title: 'Home',
                    headerTintColor: "#FF5700",
                    tabBarIcon: ({color}) => <AntDesign name="home" size={24} color={color}/>,
                    animation: "fade"
                }}
            />
            <Tabs.Screen
                name="communities"
                options={{
                    title: 'Communities',
                    tabBarIcon: ({color}) => <Feather name="users" size={24} color={color}/>,
                    animation: "fade"
                }}
            />
            <Tabs.Screen
                name="create"
                options={{
                    title: 'Create',
                    tabBarIcon: ({color}) => <AntDesign name="plus" size={24} color={color}/>,
                    animation: "fade",
                    headerShown: false,
                    tabBarStyle: {display: "none"}
                }}
            />
            <Tabs.Screen
                name="chat"
                options={{
                    title: 'Chat',
                    tabBarIcon: ({color}) => <Ionicons name="chatbubble-ellipses-outline" size={24} color={color}/>,
                    animation: "fade"
                }}
            />
            <Tabs.Screen
                name="inbox"
                options={{
                    title: 'Inbox',
                    tabBarIcon: ({color}) => <Feather name="bell" size={24} color={color}/>,
                    animation: "fade",
                }}
            />
        </Tabs>
    );
}