// /(protected)/post/[id].tsx

import {Text, StyleSheet, FlatList, View, TextInput, Platform, ActivityIndicator, Pressable, Alert} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useLocalSearchParams, Stack, router} from "expo-router";
import PostListItem from "@/src/features/posts/PostListItem";
import CommentListItem from "@/src/features/comments/CommentListItem";
import React, {useCallback, useEffect, useMemo} from "react";
import {RoundedPressable} from "@/src/components/RoundedPressable";
import {UseMutateFunction, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {deletePost, fetchPostById} from "@/src/features/posts/api";
import {AntDesign, MaterialCommunityIcons} from "@expo/vector-icons";
import {useAuth} from "@clerk/clerk-expo";
import {fetchAndParseComments} from "@/src/features/comments/lib";
import {insertComment} from "@/src/features/comments/api";
import {containsComment} from "@/src/lib/utils";

export default function post() {

    /**
     * Fetch the post by id from the database and check if the user is the owner of the post.
     */
    const {id} = useLocalSearchParams<{ id: string; }>();
    const {userId} = useAuth()
    const {data:post, isLoading, error} = useQuery({
        queryKey: ["posts", id],
        queryFn: () => fetchPostById(id, userId ?? ""),
        staleTime: 10000
    })
    const isOwner = userId === post?.user_id

    /**
     * State variables for the comment text and reply text.
     */
    const [commentText, setCommentText] = React.useState<string>("");
    const [commentHeight, setCommentHeight] = React.useState(40);
    const MAX = 140;

    const [replyText, setReplyText] = React.useState<string>("");
    const [replyToId, setReplyToId] = React.useState<string | null>(null);

    const [scrollToId, setScrollToId] = React.useState<string | null>(null);

    /**
     * Fetch the comments for the post from the database.
     */
    const {data: comments, error:commentsError, isError} = useQuery({
        queryKey: ["comments", id],
        queryFn: () => fetchAndParseComments(id),
        staleTime: 10000,
    })

    if (isError) {
        console.error(commentsError)
    }

    const postComments = comments ?? []

    /**
     * Ref for the FlatList component.
     */
    const listRef = React.useRef<FlatList>(null);

    /**
     * Thin separator between comments.
     */
    const separator = React.memo(
        () =>
            <View style={{
                height: 8,
                backgroundColor: "#f1f1f1",
            }}/>
    )

    /**
     * Handle replying to a comment.
     */
    const handleReply = useCallback(
        (cmnt: any) => {
            setReplyToId(cmnt.id);
            setReplyText("");
        },
        [setReplyToId, setReplyText]
    );

    /**
     * Confirmation dialog for deleting the post and handle the deletion.
     */
    const queryClient = useQueryClient();
    const confirmDelete = React.useCallback(() => {
            if (Platform.OS === "web") {
                if (window.confirm("Delete this post?")) {
                    mutate()
                    return;
                }
            }
            Alert.alert(
                "Delete this post?",
                "This action cannot be undone.",
                [
                    {text: "Cancel", style: "cancel"},
                    {text: "Delete", style: "destructive", onPress: () => mutate() },
                ],
                {cancelable: true}
            )
            return
        },
        []
    )

    const {mutate, isPending:isDeleting} = useMutation({
        mutationFn: async () => {
            if (!post) {
                throw new Error("Post not found");
            }
            if (userId !== post.user_id) {
                throw new Error("You are not the owner of this post");
            }
            return deletePost(id)
        },
        onSuccess: (data) => {
            console.log(data);
            queryClient.invalidateQueries({
                queryKey: ['posts'],
            })
            router.back()
        },
        onError: (error) => {
            console.error(error);
            throw error;
        }
    })

    const {mutate: submitComment} = useMutation({
        mutationFn: async ({text, parentId}: {text: string, parentId: string | null}) => {
            if (!post) {
                throw new Error("Post not found");
            }
            if (!text || text.length === 0) {
                console.log("Comment cannot be empty: " + text)
                throw new Error("Comment cannot be empty");
            }
            return insertComment({
                comment: text,
                post_id: id,
                user_id: userId ?? undefined,
                parent_id: parentId,
            })
        },
        onSuccess: (data) => {
            console.log(data)
            queryClient.invalidateQueries({queryKey: ["comments", id]})

            // Scroll to the newly added comment if it's not the root comment
            if (data && data.id) {
                setScrollToId(data.id)
            }

            // Clear root input
            setCommentText("");
            setCommentHeight(40)
            // Clear reply input
            setReplyText("")
            setReplyToId(null)
        },
        onError: (error) => {
            console.error(error)
            Alert.alert("Error", error.message ?? "Failed to submit comment", undefined, {cancelable: true})
        }
    })

    useEffect(() => {
        if (scrollToId && postComments.length > 0) {
            // Find the index of the comment to scroll to
            const index = postComments.findIndex(
                (rootComment) => containsComment(rootComment, scrollToId)
            );
            if (index !== -1 && listRef.current) {
                // Use a small timeout to ensure the FlatList has time to render the new data
                setTimeout(() => {
                    listRef.current?.scrollToIndex({
                        index,
                        animated: true,
                        viewPosition: 0.5,
                    });
                }, 25)
                setScrollToId(null)
            }
        }
    }, [postComments, scrollToId, listRef]);

    /**
     * Static renderItem function for the FlatList component.
     */
    const renderItem = useCallback(
        ({item}: any) => {
            const isTarget = replyToId === item.id
            return <CommentListItem
                comment={item}
                onReply={handleReply}
                replyToId={replyToId}
                composerValue={isTarget ? replyText : undefined}
                onChangeComposer={isTarget ? setReplyText : undefined}
                onSubmit={submitComment}
            />
        },
        [replyToId, replyText, handleReply, setReplyText]
    );

    /**
     * Header for the FlatList component (includes the Post).
     */
    const header = useMemo(
        () => (
            <View style={styles.centeredContainer}>
                <PostListItem post={post!} isDetailedPost />
                <View style={{ height: 8, backgroundColor: "#f1f1f1" }} />
            </View>
        ),
        [post]
    );

    /**
     * Render the post page.
     */

    if (!post) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size={"large"}/>
            </View>
        )
    }

    if (error) {
        console.error(error)
        return (
            <View style={styles.loadingContainer}>
                <Text>Error loading the post</Text>
            </View>
        )
    }

    return (
        <>
            {isOwner &&
                <Stack.Screen
                    options={{
                        headerRight: () => (
                            <Pressable
                                onPress={confirmDelete}
                                disabled={isDeleting}
                            >
                                <MaterialCommunityIcons
                                    name={"delete-forever"}
                                    size={25}
                                    color={"white"}
                                    style={[
                                        {marginRight: 1},
                                        Platform.OS === "web" && {marginRight: 15}
                                    ]}
                                />
                            </Pressable>
                        ),
                    }}
                />
            }
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
                            onPress={() => submitComment({
                                text: commentText,
                                parentId: null
                            })}
                        />
                    </View>}
                </View>
            </SafeAreaView>
        </>
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
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
})