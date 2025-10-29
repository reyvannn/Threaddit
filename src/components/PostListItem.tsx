import {View, Text, Image, StyleSheet, Pressable} from "react-native";
import {formatDistanceToNowStrict} from "date-fns";
import {Feather, MaterialCommunityIcons} from "@expo/vector-icons";
import {Post} from "@/src/types";

type PostListItemProps = {
    post: Post
}

export default function PostListItem({post}: PostListItemProps) {
    console.log("PostListItem render:", post.id);
    return (
        <Pressable
            style={({pressed, hovered}: { pressed: boolean, hovered?: boolean }) => [
                styles.centeredContainer,
                hovered && {backgroundColor: "#f9f9f9"}
            ]}
            onPress={() => console.log("Post pressed")}
        >
            <View style={{paddingHorizontal: 15, paddingVertical: 10, gap: 10}}>
                {/*{POST HEADER}*/}
                <View style={{flexDirection: "row", gap: 10}}>
                    <Pressable
                        style={{flexDirection: "row", gap: 10}}
                        onPress={() => console.log("Group pressed")}
                    >
                        <Image source={{uri: post.group.image}} style={styles.imageRoundSmall}/>
                        <Text style={{fontWeight: "bold"}}>{post.group.name}</Text>
                    </Pressable>
                    <Text style={{color: "grey"}}>{formatDistanceToNowStrict(new Date(post.created_at))}</Text>
                    <Pressable
                        style={{marginLeft: "auto"}}
                        onPress={() => console.log("Join group pressed")}
                    >
                        <Text style={styles.joinButtonText}>Join</Text>
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
                    {!post.image && post.description && <Text numberOfLines={4}>{post.description}</Text>}
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
                        <Text style={{cursor: "auto"}}>{post.upvotes}</Text>
                        <Pressable style={{borderRadius: 15}} onPress={() => console.log("Upvote pressed")}>
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
    joinButtonText: {
        backgroundColor: "#0d469b",
        color: "white",
        paddingVertical: 2,
        paddingHorizontal: 7,
        borderRadius: 10,
        fontWeight: "bold",
    },
    imageRoundSmall: {
        width: 20, height: 20, borderRadius: 10,
    },
    imageHalfRoundLarge: {
        width: "100%", aspectRatio: 4 / 3, borderRadius: 15
    },
    titleText:{
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
        padding:5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:15
    },
})