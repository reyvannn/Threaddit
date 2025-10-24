/*
This file is used to define the layout of the app.
It will encapsulate every page inside the app directory (with expo-router).

Slot is used to render the content of the current screen.
 */

import {Slot, Stack} from "expo-router";

export default function RootLayout() {
    return (
        <Slot />
    )
}