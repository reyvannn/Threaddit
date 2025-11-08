// /app/(protected)/(tabs)/create.tsx

import {
    View,
    Text,
    Button,
    StyleSheet,
    Pressable,
    Image,
    TextInput,
    PixelRatio,
    Platform,
    KeyboardAvoidingView, ScrollView, Modal, BackHandler, TouchableWithoutFeedback, Alert
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {AntDesign} from "@expo/vector-icons";
import {Link, useNavigation, useRouter} from "expo-router";
import React from "react";
import {useGroupStore} from "@/src/stores/group-store";
import {RoundedPressable} from "@/src/components/RoundedPressable";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {insertPost} from "@/src/features/posts/api";
import {useUser} from "@clerk/clerk-expo";

export default function CreateScreen() {
    const {user} = useUser()
    const navigation = useNavigation()
    const router = useRouter();
    const [title, setTitle] = React.useState("");
    const [titleHeight, setTitleHeight] = React.useState(0);
    const [description, setDescription] = React.useState("");
    const [descriptionHeight, setDescriptionHeight] = React.useState(0);
    const selectedGroup = useGroupStore((state) => state.group)
    const setSelectedGroup = useGroupStore((state) => state.setGroup);

    const queryClient = useQueryClient();

    // Modal variables
    const [showModal, setShowModal] = React.useState(false);
    const pendingActionRef = React.useRef<null | (() => void)>(null);
    const isDirty = React.useMemo(() => {
        return title.trim().length > 0 || description.trim().length > 0 || selectedGroup !== null;
    }, [title, description, selectedGroup]);

    /*
     * Attempting to Leave FLOW:
     * User presses back navigation button -> Caught by React BackHandler or Expo Router Navigation -> show Modal -> Confirm or Cancel Discard
     * User presses close button on the header -> onPressClose -> attemptLeave -> show Modal -> Confirm or Cancel Discard
     */

    // modal shown only if its not dirty

    const attemptLeave = (action: () => void) => {
        if (!isDirty) {
            action();
        } else {
            pendingActionRef.current = action;
            setShowModal(true);
        }
    }

    const onPressClose = () => {
        attemptLeave(() => router.back())
    };

    const confirmDiscard = () => {
        setTitle("");
        setDescription("");
        setSelectedGroup(null);
        const fn = pendingActionRef.current;
        pendingActionRef.current = null;
        setShowModal(false);
        if (fn) fn();
    };

    const cancelDiscard = () => {
        pendingActionRef.current = null;
        setShowModal(false);
    };

    // intercept back navigations
    React.useEffect(() => {
        const sub = navigation.addListener('beforeRemove',
            (e: any) => {
                if (!isDirty) return;
                e.preventDefault(); // block leaving
                pendingActionRef.current = () => navigation.dispatch(e.data.action) // dispatch the original action
                setShowModal(true);
            });
        return sub;
    }, [navigation, isDirty])

    React.useEffect(() => {
        const onBackPress = () => {
            if (isDirty) {
                pendingActionRef.current = () => router.back();
                setShowModal(true);
                return true;
            }
            return false;
        };

        const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
        return () => subscription.remove();
    },[isDirty, router]);

    // END FLOW INTERCEPTION

    const {mutate, isPending} = useMutation({
        mutationFn: async () => {
            if (!selectedGroup) {
                throw new Error("Please select a community");
            }
            if (!title || title.trim().length === 0) {
                throw new Error("Please enter a title")
            }
            if (title.length > 300) {
                throw new Error("Title is too long")
            }
            if (description.length > 10000) {
                throw new Error("Description is too long")
            }
            if (description.length > 0 && !description.includes("\n")) {}
            return insertPost({
                title: title,
                description: description,
                group_id: selectedGroup.id,
                user_id: user!.id,
            })
        },
        onSuccess: (data) => {
            setDescription("")
            setTitle("")
            console.log(data)
            queryClient.invalidateQueries({
                queryKey: ['posts'],
            })
            router.back()
        },
        onError: (error) => {
            console.error(error)
            Alert.alert("Failed to post", error.message)
        }
    })

    const groupName = selectedGroup?.name.trim() ?? "";
    const displayGroupName = groupName
        ? (groupName.startsWith("r/") ? groupName : `r/${groupName}`)
        : 'r/Select a community';

    return (
        <SafeAreaView style={{backgroundColor: 'white', flex: 1, padding: 10, gap: 10}}>
            {/*  HEADER  */}
            <View style={{flexDirection: "row", alignItems: "center"}}>
                <Pressable
                    onPress={onPressClose}
                    hitSlop={10}
                >
                    <AntDesign
                        name="close"
                        size={19}
                        color={"black"}
                    />
                </Pressable>
                <View style={{marginLeft:"auto"}}>
                    <RoundedPressable
                        label={isPending ? "Posting..." : "Post"}
                        colors={{
                            bg: {default: "#007bff", hovered: "#0a2f6d", pressed:"#0e4498"},
                            text: {default:"white", hovered:"white", pressed:"white"}
                        }}
                        disabled={isPending}
                        onPress={mutate}
                    />
                </View>
            </View>
            {/*  COMMUNITY SELECTOR  */}
            <KeyboardAvoidingView
                behavior={(Platform.OS === 'ios' || Platform.OS === 'android') ? 'height' : undefined}
                style={{flex: 1}}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{paddingVertical: 10}}
                    keyboardShouldPersistTaps="always"
                >
                    <View style={{gap: 5, paddingHorizontal:1}}>
                        <Link href={"group-selector"}>
                            <View style={[styles.roundedIcon, {alignSelf: "flex-start"}]}>
                                <View style={{padding: 10, flexDirection: "row", alignItems: "center", gap: 10}}>
                                    <Image
                                        source={selectedGroup?.image ? {uri: selectedGroup.image} : require("@/assets/r_placeholder2.png")}
                                        style={styles.imageRoundSmall}/>
                                    <View style={{flexDirection: "row"}}>
                                        <Text style={{fontWeight:600, fontSize:16}}>{displayGroupName}</Text>
                                    </View>
                                </View>
                            </View>
                        </Link>
                        {/*  TITLE  */}
                        {(Platform.OS === "web" || Platform.OS === "windows") ?
                            <View>
                                <TextInput
                                    multiline
                                    onChangeText={(t) => {
                                        setTitle(t)
                                        if (t.length === 0) setTitleHeight(48);
                                    }}
                                    value={title}
                                    placeholder={"Title"}
                                    style={{
                                        minHeight: 48,
                                        maxHeight: 39 * 3,
                                        height: titleHeight,
                                        borderColor: "gray",
                                        borderWidth: 0,
                                        borderRadius: 10,
                                        paddingHorizontal: 10,
                                        color: title === "" ? "gray" : "black",
                                        fontWeight: "bold",
                                        fontSize: 14 * 2 * PixelRatio.getFontScale()
                                    }}
                                    onContentSizeChange={(e) => {
                                        const h = Math.ceil(e.nativeEvent.contentSize.height);
                                        setTitleHeight(Math.max(48, h));
                                    }}
                                    maxLength={300}
                                />
                            </View> :
                            <TextInput
                                placeholder='Title'
                                style={{fontSize: 20, fontWeight: 'bold', paddingVertical: 20}}
                                value={title}
                                onChangeText={(text) => setTitle(text)}
                                multiline
                                scrollEnabled={false}
                            />
                        }
                        {/* TAGS AND FLAIR SELECTOR */}
                        {/*<Pressable style={[styles.roundedIcon, {alignSelf: "flex-start"}]}>*/}
                        {/*    <View style={{padding: 10, flexDirection: "row", alignItems: "center", gap: 10}}>*/}
                        {/*        <Text style={{fontWeight: 600}}>Add tags & flair (optional)</Text>*/}
                        {/*    </View>*/}
                        {/*</Pressable>*/}
                        {/*  BODY TEXT  */}
                        {(Platform.OS === "web" || Platform.OS === "windows") ?
                            <View>
                                <TextInput
                                    multiline
                                    placeholder={"body text (optional)"}
                                    value={description}
                                    style={{
                                        height: descriptionHeight,
                                        maxHeight: 18.65 * 20, // 18.65 is px per line (font size), 20 is max lines
                                        borderColor: "black",
                                        borderWidth: 0,
                                        borderRadius: 10,
                                        paddingHorizontal: 10,
                                        color: description === "" ? "gray" : "black",
                                        paddingVertical: 5
                                    }}
                                    onChangeText={(t) => {
                                        setDescription(t)
                                        if (t.length === 0) setDescriptionHeight(28);
                                    }}
                                    onContentSizeChange={(e) => {
                                        const h = Math.ceil(e.nativeEvent.contentSize.height);
                                        setDescriptionHeight(Math.max(28, h));
                                    }}
                                    numberOfLines={20}
                                    maxLength={10000}
                                />
                            </View> :
                            <TextInput
                                placeholder="body text (optional)"
                                value={description}
                                onChangeText={(text) => setDescription(text)}
                                multiline
                                maxLength={10000}
                                scrollEnabled={false}
                            />
                        }
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/*  DISCARD MODAL  */}
            <Modal
                visible={showModal}
                transparent
                animationType={"fade"}
                onRequestClose={cancelDiscard}
            >
                <TouchableWithoutFeedback onPress={cancelDiscard}>
                    <View
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                            flex: 1,
                            padding: 10,
                            backgroundColor: "rgba(0,0,0,0.35)"
                        }}
                    >
                        <View style={[styles.centeredContainer, {
                            backgroundColor: "white",
                            paddingVertical: 10,
                            paddingHorizontal: 15,
                            gap: 10,
                            borderRadius: 5
                        }]}>
                            <Text>Discard post submission?</Text>
                            <View style={{flexDirection: "row", gap: 5, marginVertical: 5}}>
                                <Pressable
                                    style={[styles.roundedIcon, {
                                        backgroundColor: "#f2f3f4",
                                        flex: 1,
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }]}
                                    onPress={cancelDiscard}
                                >
                                    <Text style={{color: "#747578"}}>Cancel</Text>
                                </Pressable>
                                <Pressable
                                    style={[styles.roundedIcon, {
                                        marginLeft: "auto",
                                        backgroundColor: "#EA0028",
                                        flex: 1,
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }]}
                                    onPress={confirmDiscard}
                                >
                                    <Text style={{color: "white"}}>Discard</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
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
    postIcon: {
        paddingHorizontal: 12, marginLeft: "auto", backgroundColor: "#0a2f6d"
    },
    imageRoundSmall: {
        width: 24, height: 24, borderRadius: 12,
    },
    imageRoundMedium: {
        width: 36, height: 36, borderRadius: 18,
    },
    centeredContainer: {
        maxWidth: 800,
        width: '100%',
        marginHorizontal: 'auto',
        backgroundColor: 'white',
    },
});