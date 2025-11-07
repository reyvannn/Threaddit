// /features/posts/PostListItem.tsx

import {View, Text, Image, Pressable, useWindowDimensions, PixelRatio} from "react-native";
import {useRouter} from "expo-router";
import {postStyles as styles, getImageStyle, getFontSize} from "@/src/features/posts/styles";
import PostHeader from "@/src/features/posts/components/PostHeader";
import PostFooter from "@/src/features/posts/components/PostFooter";
import {Post} from "@/src/features/posts/types";
import {useCallback, useRef} from "react";

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
    const initialFontSize = 14 * PixelRatio.getFontScale();
    const fontSize = getFontSize({width, isDetailedPost, initialFontSize});
    const imageStyle = getImageStyle({width, isDetailedPost})

    const lockRef = useRef(false);
    const router = useRouter();
    const handlePressPost = useCallback(
        () => {
            if (lockRef.current) return;
            lockRef.current = true;
            console.log("Post pressed")
            router.push(`/post/${post.id}`)
            setTimeout(() => {lockRef.current = false;}, 2000)
        }
        , [router, post.id]
    )

    const postContent = (
        <View style={{paddingHorizontal: 15, paddingVertical: 10, gap: 10}}>
            {/*{POST HEADER}*/}
            <PostHeader post={post} imageStyle={imageStyle} fontSize={fontSize} isDetailedPost={isDetailedPost}/>

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
            <PostFooter post={post}/>
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