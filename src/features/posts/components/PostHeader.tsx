import {Image, Pressable, Text, View} from "react-native";
import {formatDistanceToNowStrict} from "date-fns";
import {postStyles as styles} from "@/src/features/posts/styles";
import {Post} from "@/src/features/posts/types";

type Props = {
    post: Post,
    isDetailedPost?: boolean,
    imageStyle : {},
    fontSize: number,
}

export default function PostHeader({post, isDetailedPost, imageStyle, fontSize}: Props) {
    return (
        <View style={{flexDirection: "row", gap: 10, alignItems:"center"}}>
            <Pressable
                style={{flexDirection: "row", gap: 10, alignItems: "center"}}
                onPress={() => console.log("Group pressed")}
            >
                <Image source={{uri: post.group.image ?? undefined}} style={imageStyle}/>
                <View style={{justifyContent: "center"}}>
                    <Text style={{fontWeight: "bold", fontSize: fontSize}}>
                        {post.group.name}
                    </Text>
                    {
                        // If isDetailedPost is true, render the username
                        isDetailedPost &&
                        <View>
                            <Pressable
                                onPress={() => {
                                    console.log(`User ${post.user.name} is pressed`)
                                }}
                            >
                                <Text style={{fontSize: fontSize}}>
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
    )
}