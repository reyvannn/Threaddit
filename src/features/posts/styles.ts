import {PixelRatio, StyleSheet, StyleSheetProperties} from "react-native";

export const postStyles = StyleSheet.create({
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

export const getImageStyle = ({width, isDetailedPost}: {
    width: number,
    isDetailedPost: boolean | undefined
}) => width >= 800 && isDetailedPost ? postStyles.imageRoundMedium : postStyles.imageRoundSmall;

export const getFontSize = ({width, isDetailedPost, initialFontSize}: {
    width: number,
    isDetailedPost: boolean | undefined,
    initialFontSize: number
}) => {
    const fontSizeDetailedPost = width < 800 ? initialFontSize * 0.9 : initialFontSize;
    return isDetailedPost ? fontSizeDetailedPost : initialFontSize;
};