import {Text} from "react-native";
import {Link} from "expo-router";

export default function HomeScreen() {
    return (
        <Text>
            <Link href={"about"}>
                Hello, World Expo Router!
            </Link>
        </Text>
    )
}