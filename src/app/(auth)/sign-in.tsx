// /(auth)/sign-in.tsx

import { styles } from '@/src/features/auth/styles'
import { useSignIn } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {Alert, Text, TextInput, TouchableOpacity, View} from 'react-native'

function SignInScreen() {
    const router = useRouter()
    // [useSignIn hook](/docs/hooks/use-sign-in) from Clerk SDK to handle sign-in logic
    const { signIn, isLoaded, setActive } = useSignIn()
    const [credentials, setCredentials] = useState('')
    const [password, setPassword] = useState('')
    const [pendingVerification, setPendingVerification] = useState(false)

    const onSignInPress = async () => {
        if (!isLoaded || !setActive) return

        setPendingVerification(true)
        try {
            // signIn.create() method from Clerk SDK to handle sign-in logic
            const signInAttempt = await signIn.create({
                identifier: credentials,
                password,
            })

            if (signInAttempt.status === 'complete') {
                await setActive({
                    session: signInAttempt.createdSessionId,
                })
                // Navigate to protected screen once the session is created
                router.replace('/')
            } else {
                console.log(JSON.stringify(signInAttempt, null, 2));
                Alert.alert("Error", "Sign in failed. Please check your credentials and try again.", undefined, { cancelable: true })
            }
        } catch (err: any) {
            console.log(JSON.stringify(err, null, 2));
            Alert.alert("Error", err.message, undefined, { cancelable: true })
        } finally {
            setPendingVerification(false)
        }
    }

    return (
        <View>
            <View style={styles.formContainer}>
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>Sign In</Text>
                    <Text style={styles.subtitle}>Enter your credentials to access your account</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email address or username</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your email address or username"
                            value={credentials}
                            onChangeText={(text) => setCredentials(text)}
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your password"
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={onSignInPress}
                        activeOpacity={0.8}
                        disabled={!isLoaded || pendingVerification}
                    >
                        <Text
                            style={styles.buttonText}>{!isLoaded || pendingVerification ? "Loading..." : "Sign in"}</Text>
                    </TouchableOpacity>

                    {/* Link to sign-up screen */}
                    <TouchableOpacity
                        style={styles.textButton}
                        onPress={() => router.push('/sign-up')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.textButtonText}>Don&apos;t have an account? Sign up.</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={[styles.headerContainer, {marginTop: 15, marginBottom:10}]}>
                <Text style={styles.title}>Demo</Text>
                <Text style={styles.subtitle}>Use the following credentials to access the demo account</Text>
                <Text style={[styles.subtitle, {color: "black"}]}>Username: demo</Text>
                <Text style={[styles.subtitle, {color: "black"}]}>Password: demo</Text>
            </View>
        </View>
    );
}

export default SignInScreen