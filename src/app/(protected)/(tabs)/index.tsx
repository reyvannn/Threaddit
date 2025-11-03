/*
This file is used to define the home screen of the app.
It will be displayed when the user navigates to the home screen.

View is used to render a view component, which is a container for other components.
Text is used to render a text component, which is used to display text on the screen.
 */

import {View, Text, Image, StyleSheet, FlatList} from "react-native";
import PostListItem from "@/src/components/PostListItem";
import React from "react";
import {supabase} from "@/src/lib/supabase";
import {Tables} from "@/src/types/database.types";

const separator = () =>
    <View style={{
        height: StyleSheet.hairlineWidth*5,
        backgroundColor: "#f1f1f1",
    }}/>

export type Post = Tables<"posts"> & {
    group: Tables<"groups">,
    user: Tables<"users">,
}

export default function HomeScreen() {
    const [posts, setPosts] = React.useState<Post[]>([]);

    React.useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        const {data, error} = await supabase.from('posts').select('*, group:groups(*), user:users!posts_user_id_fkey(*)').order('created_at', {ascending: false});
        if (error) {
            console.log(error);
            throw error;
        }
        setPosts(data);
    }

    return (
        <View style={{flex: 1}}>
            <FlatList
                ItemSeparatorComponent={ separator }
                data={posts}
                renderItem={({item}) => <PostListItem post={item}/>}
            />
        </View>
    );
};