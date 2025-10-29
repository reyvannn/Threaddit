// /(protected)/post/[id].tsx

import {Text, View, StyleSheet, ScrollView} from "react-native";
import {useLocalSearchParams} from "expo-router";
import PostListItem from "@/src/components/PostListItem";
import posts from "@/assets/data/posts.json";

export default function DetailedPost() {
    const {id} = useLocalSearchParams();

    const detailedPost = posts.find(post => post.id === id);

    if (!detailedPost) {
        return <Text>Post not found</Text>;
    }

    return (
        <ScrollView contentContainerStyle={styles.centeredContainer}>
            <PostListItem post={detailedPost} isDetailedPost/>
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    centeredContainer: {
        maxWidth: 800,
        width: '100%',
        marginHorizontal: 'auto',
        backgroundColor: 'white',
    },
})