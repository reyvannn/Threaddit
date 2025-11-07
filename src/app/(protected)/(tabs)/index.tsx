/*
This file is used to define the home screen of the app.
It will be displayed when the user navigates to the home screen.

View is used to render a view component, which is a container for other components.
Text is used to render a text component, which is used to display text on the screen.
 */

import {View, Text, Image, StyleSheet, FlatList, ActivityIndicator} from "react-native";
import PostListItem from "@/src/features/posts/PostListItem";
import React from "react";
import {Tables} from "@/src/types/database.types";
import {useQuery} from "@tanstack/react-query";
import {fetchPosts} from "@/src/features/posts/api";

const separator = () =>
    <View style={{
        height: StyleSheet.hairlineWidth*5,
        backgroundColor: "#f1f1f1",
    }}/>

export default function HomeScreen() {
    const {data:posts, isLoading, error} = useQuery({
        queryKey: ['posts'],
        queryFn: () =>  fetchPosts()
    });

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large"/>
            </View>
        )
    }

    return (
        <View style={{flex: 1}}>
            <FlatList
                ItemSeparatorComponent={separator}
                data={posts}
                renderItem={({item}) => <PostListItem post={item}/>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
})