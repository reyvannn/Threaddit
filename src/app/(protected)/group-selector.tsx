// /app/(protected)/group-selector.tsx

import {
    View,
    Text,
    Platform,
    FlatList,
    KeyboardAvoidingView,
    Pressable,
    TextInput,
    StyleSheet,
    Image
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {AntDesign, EvilIcons, Ionicons} from "@expo/vector-icons";
import {router} from "expo-router";
import React, {useMemo} from "react";
import groups from "@/assets/data/groups.json";
import {useGroupStore} from "@/src/stores/group-store";

export default function GroupSelector() {
    const [searchValue, setSearchValue] = React.useState<string>("");
    const setSelectedGroup = useGroupStore((state) => state.setGroup)

    const filteredGroups = useMemo(() => {
        const search = searchValue.toLowerCase();
        return groups.filter((group) => group.name.toLowerCase().includes(search));
    }, [searchValue])

    const separator = () =>
        <View style={{
            height: StyleSheet.hairlineWidth*2,
            backgroundColor: "#f1f1f1",
        }}/>

    return (
        <SafeAreaView style={{flexDirection: "column", flex: 1, backgroundColor: "white"}}>
            <View style={{flexDirection: "row", alignItems: "center", padding: 10}}>
                <Pressable
                    style={{
                        position: 'absolute',
                        left: 0,
                        paddingHorizontal: 10,
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                    hitSlop={10}
                >
                    <AntDesign name="close" size={19} onPress={() => router.back()}/>
                </Pressable>
                <View style={{height: 32, flex: 1, alignItems: "center", paddingVertical: 3}} pointerEvents="none">
                    <Text style={{flex: 1, fontWeight: "bold", fontSize: 16}}>Post to</Text>
                </View>
            </View>
            <View style={[styles.input, {
                flexDirection: "row",
                alignItems: "center",
                alignSelf: "center",
                maxWidth: "95%",
                backgroundColor: "#f2f2f3",
            }]}>
                <TextInput
                    placeholder="Search for a community"
                    placeholderTextColor="#5B6C75"
                    style={{
                        flex: 1,
                        paddingVertical: 16,
                        marginLeft: -10,
                        marginRight: -40,
                        borderRadius: 10,
                        paddingLeft: 15,
                        paddingRight: 50
                    }}
                    value={searchValue}
                    onChangeText={setSearchValue}
                />
                {searchValue.length === 0 ? <EvilIcons name="search" size={30} color="#5B6C75" style={{marginLeft: "auto"}}/>
                    : <Pressable onPress={() => setSearchValue("")} hitSlop={8}>
                        <Ionicons name="close-circle-sharp" size={30} color="#616162" style={{marginLeft:"auto"}}/>
                    </Pressable>
                }
            </View>
            <FlatList
                data={filteredGroups}
                ItemSeparatorComponent={separator}
                renderItem={({item}) => (
                    <Pressable
                        style={{paddingVertical:5}}
                        onPress={() => {
                            setSelectedGroup(item)
                            router.back()
                        }}
                    >
                        <View style={{flexDirection: "row", gap: 10, marginHorizontal: 5, paddingHorizontal: 10}}>
                            <Image source={{uri: item.image}} style={styles.imageRoundMedium}/>
                            <View>
                                <Text style={{fontWeight:"600"}}>{item.name}</Text>
                                <View>
                                    {/*  This can fit another row of text  */}
                                </View>
                            </View>
                        </View>
                        <View>
                            {/*  This can fit the group's/community's description  */}
                        </View>
                    </Pressable>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    input: {
        width: "100%",
        maxWidth: "80%",
        minWidth: 320,
        height: 50,
        borderWidth: 1,
        borderColor: "lightgrey",
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: "white"
    },
    imageRoundMedium: {
        width: 36, height: 36, borderRadius: 18,
    },
})