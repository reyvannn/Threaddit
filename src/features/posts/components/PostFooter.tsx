import {Pressable, Text, View} from "react-native";
import {postStyles as styles} from "@/src/features/posts/styles";
import {Feather, MaterialCommunityIcons} from "@expo/vector-icons";
import {Post} from "@/src/features/posts/types";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {upsertUpvote} from "@/src/features/upvotes/api";
import {useAuth} from "@clerk/clerk-expo";

type Props = {
    post: Post & {
        nr_of_comments?: number, // fetching not implemented yet
    },
}

export default function PostFooter({post}: Props) {
    const {userId} = useAuth();
    const queryClient = useQueryClient();
    const {mutate,} = useMutation({
        mutationFn: async (value: 1 | -1 | 0) => {
            if (!post) {
                throw new Error("Post not found");
            }
            return upsertUpvote(post.id, value, userId!)
        },
        onError: (error) => {
            console.log(error);
            throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["post", post.id]});
            queryClient.invalidateQueries({queryKey: ["posts"]});
        }
    })

    const userUpvoteValue = post.user_vote?.[0]?.value ?? 0;
    const upvoteMutateValue = userUpvoteValue <= 0 ? 1 : 0;
    const downvoteMutateValue = userUpvoteValue >= 0 ? -1 : 0;

    return (
        <View style={{flexDirection: "row", gap: 12}}>
            {/* Combine the upvote and downvote icons under a single item with rounded corners */}
            <View style={[styles.roundedIcon, {overflow: "visible"}]}>
                <Pressable style={{borderRadius: 15}} onPress={() => mutate(upvoteMutateValue)}>
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
                                color={
                                    userUpvoteValue > 0 ? "red" :
                                        hovered ? "red" : "black"
                                }
                            />
                        </View>
                    )}
                </Pressable>
                <Pressable
                    onPress={(e) => {
                        e?.stopPropagation()
                    }}
                >
                    <Text style={{cursor: "auto"}}>{post.upvotes[0].sum || 0}</Text>
                </Pressable>
                <Pressable style={{borderRadius: 15}} onPress={() => mutate(downvoteMutateValue)}>
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
                                color={
                                    userUpvoteValue < 0 ? "#6a5ccc" :
                                        hovered ? "#6a5ccc" : "black"
                                }
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
};