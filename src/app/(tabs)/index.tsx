/*
This file is used to define the home screen of the app.
It will be displayed when the user navigates to the home screen.

View is used to render a view component, which is a container for other components.
Text is used to render a text component, which is used to display text on the screen.
 */

import {View, Text, Image, StyleSheet, FlatList} from "react-native";
import posts from '../../../assets/data/posts.json'
import PostListItem from "../../components/PostListItem";

const separator = () =>
    <View style={{
        height: StyleSheet.hairlineWidth*2,
        backgroundColor: "#f1f1f1",
    }}/>

export default function HomeScreen() {
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