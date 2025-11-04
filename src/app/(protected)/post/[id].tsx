// /(protected)/post/[id].tsx

import {Text, StyleSheet, FlatList, View, TextInput, Platform, Pressable} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useLocalSearchParams} from "expo-router";
import PostListItem from "@/src/components/PostListItem";
import posts from "@/assets/data/posts.json";
import comments from "@/assets/data/comments.json"
import CommentListItem from "@/src/components/CommentListItem";
import React, {useCallback, useMemo} from "react";
import {IconButton} from "@/src/components/IconButton";
import {RoundedPressable} from "@/src/components/RoundedPressable";

export default function DetailedPost() {
    const {id} = useLocalSearchParams();
    const [commentText, setCommentText] = React.useState<string>("");
    const [commentHeight, setCommentHeight] = React.useState(40);
    const MAX = 140;

    const [replyText, setReplyText] = React.useState<string>("");
    const [replyToId, setReplyToId] = React.useState<string | null>(null);

    const listRef = React.useRef<FlatList>(null);

    const detailedPost = useMemo(
        () => posts.find(post => post.id === id),
        [id]
    )
    const postComments = useMemo(
        () => comments.filter(comment => comment.post_id === id),
        [id]
    )

    const separator = React.memo(
        () =>
            <View style={{
                height: 8,
                backgroundColor: "#f1f1f1",
            }}/>
    )

    const handleReply = useCallback(
        (cmnt: any) => {
            setReplyToId(cmnt.id);
            setReplyText("");
        },
        [setReplyToId, setReplyText]
    );

    const renderItem = useCallback(
        ({item}: any) => {
            const isTarget = replyToId === item.id
            return <CommentListItem
                comment={item}
                onReply={handleReply}
                replyToId={replyToId}
                composerValue={isTarget ? replyText : undefined}
                onChangeComposer={isTarget ? setReplyText : undefined}
            />
        },
        [replyToId, replyText, handleReply, setReplyText]
    );

    const header = useMemo(
        () => (
            <View style={styles.centeredContainer}>
                {/*@ts-ignore*/}
                <PostListItem post={detailedPost!} isDetailedPost />
                <View style={{ height: 8, backgroundColor: "#f1f1f1" }} />
            </View>
        ),
        [detailedPost]
    );

    if (!detailedPost) {
        return <Text>Post not found</Text>;
    }


    return (
        <SafeAreaView style={{flex: 1}} edges={["bottom"]}>
            <FlatList
                ref={listRef}
                data={postComments}
                ItemSeparatorComponent={separator}
                renderItem={renderItem}
                ListHeaderComponent={header}
                keyExtractor={(cmnt) => cmnt.id}
                style={{width: '100%', flex: 1}}
            />
            <View style={[{alignSelf: 'center', position: "relative", width: "100%", maxWidth: 816}]}>
                <TextInput
                    multiline
                    placeholder="Share your thoughts"
                    style={
                        [{maxHeight: MAX, height: commentHeight},
                            Platform.OS === 'web'
                                ? ({
                                    backgroundColor: "#e6ebee",
                                    marginVertical: 5,
                                    paddingHorizontal: 10,
                                    borderRadius: 5,
                                    marginRight: 15,
                                })
                                : ({
                                    backgroundColor: "#e6ebee",
                                    marginVertical: 5,
                                    paddingHorizontal: 10,
                                    borderRadius: 5,
                                    marginHorizontal: 5,
                                    marginBottom: 0
                                }),
                        ]
                    }
                    value={commentText}
                    onChangeText={(text) => {
                        setCommentText(text)
                        if (text.length == 0) {
                            setCommentHeight(32)
                        }
                    }}
                    onContentSizeChange={(e) => {
                        setCommentHeight(e.nativeEvent.contentSize.height)
                    }}
                />
                {commentText.length > 0 && <View
                    style={
                        [
                            {
                                flexDirection: "row",
                                marginVertical: 5,
                                justifyContent: "flex-end",
                                gap: 15,
                                paddingRight: 10
                            },
                            Platform.OS === "web" && {marginRight: 15}
                        ]
                    }
                >
                    <RoundedPressable
                        label={"Cancel"}
                        colors={{
                            bg: {default: '#e9ecef', pressed: "#c0c5c7", hovered: "#e2e7e8"},
                            text: {default: "black"}
                        }}
                        onPress={() => {
                            setCommentText("")
                            setCommentHeight(40)
                        }}
                    />
                    <RoundedPressable
                        label={"Submit"}
                        colors={{
                            bg: {default: '#0745ab', pressed: "#002d71", hovered: "#003585"},
                            text: {default: "white", hovered: "white", pressed: "white"}
                        }}
                        onPress={() => console.log("Submit pressed")}
                    />
                </View>}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    centeredContainer: {
        maxWidth: 800,
        width: '100%',
        marginHorizontal: 'auto',
        backgroundColor: 'white',
    },
    roundedIcon: {
        flexDirection: "row",
        backgroundColor: "#e6e6e6",
        borderRadius: 20,
        gap: 5,
        minHeight: 32,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
})