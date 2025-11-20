// /features/comments/CommentListItem.tsx

import {Comment} from "@/src/types/types";
import {View, Text, Image, StyleSheet, Pressable, TextInput, Platform} from "react-native";
import {formatDistanceToNowStrict} from "date-fns";
import {Feather, MaterialCommunityIcons, Octicons} from "@expo/vector-icons";
import {IconButton} from "@/src/components/IconButton";
import {RoundedPressable} from "@/src/components/RoundedPressable";
import React, {memo} from "react";
import {UseMutateFunction} from "@tanstack/react-query";

type CommentListItemProps = {
    comment: Comment;
    onReply?: (cmnt: Comment) => void;
    replyToId?: string | null;
    composerValue?: string;
    onChangeComposer?: (value: string) => void;
    onSubmit?: any;
    depth?: number;
};

const defaultImage = require("@/assets/r_placeholder2.png")

function CommentListItem({ comment, onReply, replyToId, composerValue, onChangeComposer, onSubmit, depth = 0 }: CommentListItemProps) {
    const MAX = 140;
    const [replyHeight, setReplyHeight] = React.useState(40);
    const [showReplies, setShowReplies] = React.useState(false);
    const [text, setText] = React.useState<string>(composerValue ?? "");

    // Sync the local state with the composerValue parent prop if it changes
    React.useEffect(() => {
        if (composerValue !== undefined) {
            setText(composerValue);
        } else {
            setText("");
        }
    }, [composerValue]);

    const image = comment.user.image ?? defaultImage // DEFAULT IMAGE

    const isReplyTarget = replyToId === comment.id;
    const hasReplies = comment.replies?.length > 0;

    // Test if any change in the post page causes the comment to be rendered again
    // console.log(`Comment: ${comment.id} is rendered`)

    return (
        <View style={[styles.centeredContainer, { // No margin or padding right to avoid multiple gaps when recursion happens
            paddingLeft: 15,
            gap: 5,
            paddingTop: 5,
        }]}>
            {/* HEADER */}
            <View style={{flexDirection: "row", alignItems: "center", gap: 5}}>
                <Image
                    source={
                        typeof image === 'string' ? {uri: image} : image
                    }
                    style={styles.imageRoundMedium}
                />
                <Text style={{fontWeight: 600, color: "#5b6c75"}}>{comment.user.name}</Text>
                <Text style={{color: "grey"}}>{formatDistanceToNowStrict(new Date(comment.created_at))}</Text>
            </View>

            {/* COMMENT BODY */}
            <View>
                <Text>{comment.comment}</Text>
            </View>

            {/* FOOTER */}
            <View style={{
                paddingRight: 15,
                flexDirection: "row",
                alignItems: "center",
                paddingBottom: 5,
                justifyContent: "flex-end",
            }}>
                <IconButton
                    icon={(color) => <Feather name="more-vertical" size={19} color={color}/>}
                    onPress={() => console.log('More pressed')}
                    onLongPress={() => console.log('More long-pressed')}
                />

                {/* Reply */}
                <IconButton
                    icon={(color) => <Octicons name="reply" size={19} color={color}/>}
                    onPress={() => onReply?.(comment)}
                    onLongPress={() => console.log('Reply long-pressed')}
                />

                {/* Award */}
                <IconButton
                    icon={(color) => <Feather name="award" size={19} color={color}/>}
                    onPress={() => console.log('Comment Award pressed')}
                    onLongPress={() => console.log('Comment Award long-pressed')}
                />

                {/* Upvote */}
                <View style={[styles.roundedIcon, {backgroundColor: "white", gap: 0, paddingHorizontal: 0}]}>
                    <IconButton
                        icon={(color) => <MaterialCommunityIcons name="arrow-up-bold-outline" size={19} color={color}/>}
                        onPress={() => console.log('Upvote pressed')}
                        onLongPress={() => console.log('Upvote long-pressed')}
                    />
                    <Text style={{color: "gray"}}>{comment.upvotes}</Text>
                    <IconButton icon={(color) => <MaterialCommunityIcons name="arrow-down-bold-outline" size={19}
                                                                         color={color}/>}
                                onPress={() => console.log('Downvote pressed')}
                                onLongPress={() => console.log('Downvote long-pressed')}
                    />
                </View>
            </View>

            {isReplyTarget && (
                <View style={{marginTop: 8, paddingRight: 15}}>
                    <TextInput
                        autoFocus
                        multiline
                        placeholder={`Reply to ${comment.user.name}`}
                        style={{
                            backgroundColor: "#e6ebee",
                            marginVertical: 5,
                            paddingHorizontal: 10,
                            borderRadius: 5,
                            maxHeight: MAX,
                            height: replyHeight,
                        }}
                        value={text}
                        onChangeText={(newText) => {
                            setText(newText);
                            onChangeComposer?.(newText)
                            if (newText.length == 0) {
                                setReplyHeight(40)
                            }
                        }}
                        onContentSizeChange={(e) => {
                            setReplyHeight(e.nativeEvent.contentSize.height)
                        }}
                    />
                    {text.length > 0 && <View
                        style={
                            [
                                {flexDirection:"row", marginVertical:5, justifyContent:"flex-end", gap:15, paddingRight:10},
                                Platform.OS === "web" && {marginRight:15}
                            ]
                        }
                    >
                        <RoundedPressable
                            label={"Cancel"}
                            colors={{
                                bg: {default: '#e9ecef', pressed: "#c0c5c7", hovered: "#e2e7e8"},
                                text: {default:"black"}
                            }}
                            onPress={() => {
                                setText("")
                                if (onChangeComposer) {
                                    onChangeComposer("")
                                }
                                setReplyHeight(40)
                            }}
                        />
                        <RoundedPressable
                            label={"Submit"}
                            colors={{
                                bg: {default: '#0745ab', pressed: "#002d71", hovered: "#003585"},
                                text: {default:"white", hovered:"white", pressed:"white"}
                            }}
                            // onPress={() => console.log("Submit pressed")}
                            onPress={() => {
                                if (onSubmit) {
                                    console.log("Submitting comment:", text)
                                    onSubmit({
                                        text: text,
                                        parentId: comment.id,
                                    })
                                    setShowReplies(true)
                                }
                            }}
                        />
                    </View>}
                </View>
            )}

            {hasReplies ? (
                depth === 0 ? (
                    // Root comment: show toggle bar
                    !showReplies ? (
                        <Pressable
                            onPress={() => setShowReplies(true)}
                            accessibilityRole="button"
                            style={styles.showRepliesBar}
                        >
                            <View style={styles.threadConnector} />
                            <Text style={styles.showRepliesText}>
                                Show Replies
                            </Text>
                        </Pressable>
                    ) : (
                        <View style={styles.replyThread}>
                            {comment.replies!.map((reply) => (
                                <CommentListItem
                                    key={reply.id}
                                    comment={reply}
                                    onReply={onReply}
                                    replyToId={replyToId}
                                    composerValue={composerValue}
                                    onChangeComposer={onChangeComposer}
                                    onSubmit={onSubmit}
                                    depth={depth + 1}                 // pass depth down
                                />
                            ))}
                            <Pressable
                                onPress={() => setShowReplies(false)}
                                accessibilityRole="button"
                                style={[styles.showRepliesBar, { marginTop: 6 }]}
                            >
                                <View style={styles.threadConnector} />
                                <Text style={styles.showRepliesText}>Hide Replies</Text>
                            </Pressable>
                        </View>
                    )
                ) : (
                    // Nested comment: keep existing behavior (always render children)
                    <View style={styles.replyThread}>
                        {comment.replies!.map((reply) => (
                            <CommentListItem
                                key={reply.id}
                                comment={reply}
                                onReply={onReply}
                                replyToId={replyToId}
                                composerValue={composerValue}
                                onChangeComposer={onChangeComposer}
                                onSubmit={onSubmit}
                                depth={depth + 1}
                            />
                        ))}
                    </View>
                )
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    imageRoundMedium: {
        width: 36, height: 36, borderRadius: 18,
    },
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
    roundedIconHover: {
        backgroundColor: "#dbe4e8",
        borderColor: "#dbe4e8",
    },
    voteButton: {
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15
    },
    replyThread: {
        borderLeftWidth: StyleSheet.hairlineWidth,
        borderLeftColor: "#dbe4e8",
        width: "100%",
    },
    showRepliesBar: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 6,
        paddingHorizontal: 10,
        // keep it subtle so it matches your UI
    },
    threadConnector: {
        width: 12,
        height: 1,
        backgroundColor: "#dbe4e8",
        marginRight: 8,
    },
    showRepliesText: {
        color: "#5b6c75",
        fontWeight: "600",
    },
})

export default memo(CommentListItem)