import {Pressable, Text, View} from "react-native";
import {postStyles as styles} from "@/src/features/posts/styles";
import {Feather, MaterialCommunityIcons} from "@expo/vector-icons";
import {Post} from "@/src/features/posts/types";

type Props = {
    post: Post & {
        nr_of_comments?: number, // fetching not implemented yet
        upvotes?: number, // fetching not implemented yet
    },
}

export default function PostFooter({post} : Props) {
    return (
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
    )
}