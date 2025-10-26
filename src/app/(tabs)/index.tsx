/*
This file is used to define the home screen of the app.
It will be displayed when the user navigates to the home screen.

View is used to render a view component, which is a container for other components.
Text is used to render a text component, which is used to display text on the screen.
 */

import {View, Text, Image, StyleSheet} from "react-native";
import {formatDistanceToNowStrict} from "date-fns";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import posts from '../../../assets/data/posts.json'
import PostListItem from "../../components/PostListItem";

export default function HomeScreen() {
    return (
        <View>
            <PostListItem post={posts[0]}></PostListItem>
            <PostListItem post={posts[1]}></PostListItem>
            <PostListItem post={posts[2]}></PostListItem>
            <PostListItem post={posts[3]}></PostListItem>
        </View>
    );
};