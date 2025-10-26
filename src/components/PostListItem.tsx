import {View, Text, Image, StyleSheet} from "react-native";
import {formatDistanceToNowStrict} from "date-fns";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import posts from '../../assets/data/posts.json'
import {Post} from "../types";

type PostListItemProps = {
    post: Post
}

export default function PostListItem({post}: PostListItemProps) {
    return (
        <View>
            <View style={{paddingHorizontal: 15, paddingVertical: 10, gap:5}}>
                {/*{POST HEADER}*/}
                <View style={{flexDirection: "row", gap: 10}}>
                    <Image source={{uri: post.group.image}} style={styles.imageRoundSmall}/>
                    <Text style={{fontWeight: "bold"}}>{post.group.name}</Text>
                    <Text style={{color: "grey"}}>{formatDistanceToNowStrict(new Date(post.created_at))}</Text>
                    <View style={{marginLeft: "auto"}}>
                        <Text style={styles.joinButtonText}>Join</Text>
                    </View>
                </View>

                {/*CONTENT*/}
                <View style={{gap: 5}}>
                    <Text style={styles.titleText}>{post.title}</Text>
                    {post.image && <Image source={{uri: post.image}} style={styles.imageHalfRoundLarge}/>}
                    {!post.image && post.description && <Text numberOfLines={4}>{post.description}</Text>}
                </View>

                {/*FOOTER*/}
                <View style={{flexDirection: "row"}}>
                    <MaterialCommunityIcons name="arrow-up-bold-outline" size={19} color="black"/>
                    <Text>{post.upvotes}</Text>
                    <MaterialCommunityIcons name="arrow-down-bold-outline" size={19} color="black"/>
                    <MaterialCommunityIcons name="comment-outline" size={19} color="black"/>
                    <Text>{post.nr_of_comments}</Text>
                    <View style={{flexDirection:"row", marginLeft:"auto"}}>
                        <MaterialCommunityIcons name="trophy-outline" size={19} color="black"/>
                        <MaterialCommunityIcons name="share-outline" size={19} color="black"/>
                    </View>
                </View>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    centeredContainer: {
        // --- KEY TO CENTERING ---
        maxWidth: 800, // Limit the maximum width of the content
        width: '100%',               // Ensure it fills up to the maxWidth
        marginHorizontal: 'auto',    // Centers the block within its parent (the screen)
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
        fontWeight: "500", fontSize: 17, letterSpacing: 0.5,
    }
})