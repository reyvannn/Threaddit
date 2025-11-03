// /components/PostListItem.tsx

import {View, Text, Image, StyleSheet, Pressable, useWindowDimensions, PixelRatio} from "react-native";
import {formatDistanceToNowStrict} from "date-fns";
import {Feather, MaterialCommunityIcons} from "@expo/vector-icons";
// import {Post} from "@/src/types/types";
import {Post} from "@/src/app/(protected)/(tabs)";
import {useRouter} from "expo-router";

type PostListItemProps = {
    post: Post & {
        nr_of_comments?: number, // fetching not implemented yet
        upvotes?: number, // fetching not implemented yet
    }
    isDetailedPost?: boolean;
};

export default function PostListItem({post, isDetailedPost}: PostListItemProps) {
    console.log("PostListItem render:", post.id);

    const {width} = useWindowDimensions();
    const imageStyle = width >= 800 && isDetailedPost ? styles.imageRoundMedium: styles.imageRoundSmall;
    const fontSize = 14 * PixelRatio.getFontScale();
    const fontSizeDetailedPost = width < 800 ? fontSize * 0.9 : fontSize;
    const router = useRouter();
    const handlePressPost = () => {
        console.log("Post pressed")
        router.push(`/post/${post.id}`)
    }

    const postContent = (
        <View style={{paddingHorizontal: 15, paddingVertical: 10, gap: 10}}>
            {/*{POST HEADER}*/}
            <View style={{flexDirection: "row", gap: 10, alignItems:"center"}}>
                <Pressable
                    style={{flexDirection: "row", gap: 10, alignItems: "center"}}
                    onPress={() => console.log("Group pressed")}
                >
                    <Image source={{uri: post.group.image ?? undefined}} style={imageStyle}/>
                    <View style={{justifyContent: "center"}}>
                        <Text style={{fontWeight: "bold", fontSize: isDetailedPost ? fontSizeDetailedPost : fontSize}}>
                            {post.group.name}
                        </Text>
                        {
                            // If isDetailedPost is true, render the username
                            isDetailedPost &&
                            <View>
                                <Text>•</Text>
                                <Pressable
                                    onPress={() => {
                                        console.log(`User ${post.user.name} is pressed`)
                                    }}
                                >
                                    <Text style={{fontSize: isDetailedPost ? fontSizeDetailedPost : fontSize}}>
                                        {post.user.name}
                                    </Text>
                                </Pressable>
                            </View>
                        }
                    </View>
                </Pressable>
                <Text style={{color: "grey"}}>{post.created_at ? formatDistanceToNowStrict(new Date(post.created_at)) : "—"}</Text>
                <Pressable
                    style={[styles.roundedIcon, styles.postIcon]}
                    onPress={() => console.log("Join group pressed")}
                >
                    <Text style={{fontWeight:"bold", color:"white"}}>Join</Text>
                </Pressable>
            </View>

            {/*CONTENT*/}
            <View style={{gap: 5}}>
                <Text style={styles.titleText}>{post.title}</Text>
                {post.image &&
                    <Pressable
                        onPress={() => console.log("Image pressed")}
                    >
                        <Image source={{uri: post.image}} style={styles.imageHalfRoundLarge}/>
                    </Pressable>
                }
                {(isDetailedPost || (!post.image && post.description)) && (
                    <Text numberOfLines={isDetailedPost ? undefined : 4}>
                        {post.description}
                    </Text>
                )}

            </View>

            {/*FOOTER*/}
            <View style={{flexDirection: "row", gap: 12}}>
                {/* Combine the upvote and downvote icons under a single item with rounded corners */}
                <View style={[styles.roundedIcon, {overflow: "visible"}]}>
                    <Pressable style={{borderRadius: 15}} onPress={() => console.log("Upvote pressed")}>
                        {({pressed, hovered}: { pressed: boolean, hovered?: boolean }) => (
                            <View
                                style={[
                                    styles.voteButton,
                                    hovered && {backgroundColor: "#dbe4e7"},
                                ]}
                            >
                                <MaterialCommunityIcons
                                    name="arrow-up-bold-outline"
                                    size={19}
                                    color={hovered ? "red" : "black"}
                                />
                            </View>
                        )}
                    </Pressable>
                    <Pressable
                        onPress={(e) => {
                            e?.stopPropagation()
                        }}
                    >
                        <Text style={{cursor: "auto"}}>{post.upvotes}</Text>
                    </Pressable>
                    <Pressable style={{borderRadius: 15}} onPress={() => console.log("Downvote pressed")}>
                        {({pressed, hovered}: { pressed: boolean, hovered?: boolean }) => (
                            <View
                                style={[
                                    styles.voteButton,
                                    hovered && {backgroundColor: "#dbe4e7"},
                                ]}
                            >
                                <MaterialCommunityIcons
                                    name="arrow-down-bold-outline"
                                    size={19}
                                    color={hovered ? "#6a5ccc" : "black"}
                                />
                            </View>
                        )}
                    </Pressable>
                </View>
                <Pressable
                    style={({pressed, hovered}: { pressed: boolean, hovered?: boolean }) => [
                        styles.roundedIcon,
                        hovered && styles.roundedIconHover,
                        {paddingHorizontal: 10}
                    ]}
                    onPress={() => console.log("Comment pressed")}
                >
                    <MaterialCommunityIcons name="comment-outline" size={19} color="black"/>
                    <Text>{post.nr_of_comments}</Text>
                </Pressable>
                <Pressable
                    style={({pressed, hovered}: { pressed: boolean, hovered?: boolean }) => [
                        styles.roundedIcon,
                        hovered && styles.roundedIconHover,
                        {paddingHorizontal: 10}
                    ]}
                    onPress={() => console.log("Award pressed")}
                >
                    <Feather name="award" size={19} color="black"/>
                </Pressable>
                <Pressable
                    style={({pressed, hovered}: { pressed: boolean, hovered?: boolean }) => [
                        styles.roundedIcon,
                        hovered && styles.roundedIconHover,
                        {paddingHorizontal: 10}
                    ]}
                    onPress={() => console.log("Share pressed")}
                >
                    <MaterialCommunityIcons name="share-outline" size={19} color="black"/>
                    <Text>Share</Text>
                </Pressable>
            </View>
        </View>
    );

    if (isDetailedPost) {
        return postContent
    }

    return (
        <Pressable
            style={({pressed, hovered}: { pressed: boolean, hovered?: boolean }) => [
                styles.centeredContainer,
                hovered && {backgroundColor: "#f9f9f9"}
            ]}
            onPress={handlePressPost}
        >
            {postContent}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    centeredContainer: {
        maxWidth: 800,
        width: '100%',
        marginHorizontal: 'auto',
        backgroundColor: 'white',
    },
    imageRoundSmall: {
        width: 24, height: 24, borderRadius: 12,
    },
    imageRoundMedium: {
        width: 36, height: 36, borderRadius: 18,
    },
    imageHalfRoundLarge: {
        width: "100%", aspectRatio: 4 / 3, borderRadius: 15
    },
    titleText: {
        fontWeight: "500", fontSize: 18, letterSpacing: 0.5,
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
    postIcon: {
        paddingHorizontal:12, marginLeft:"auto", backgroundColor:"#0a2f6d"
    }
});