// /components/RoundedPressable.tsx
import * as React from 'react';
import {
    Pressable,
    Text,
    StyleSheet,
    Platform,
    type ViewStyle,
    type TextStyle,
    type PressableStateCallbackType,
} from 'react-native';

type StateColors = {
    default: string;
    hovered?: string;
    pressed?: string;
    disabled?: string;
};

type RoundedPressableProps = {
    label: string;
    onPress?: () => void;
    onLongPress?: () => void;
    disabled?: boolean;
    style?: ViewStyle | ViewStyle[];
    textStyle?: TextStyle | TextStyle[];
    delayLongPress?: number;
    colors?: {
        bg?: StateColors;
        text?: StateColors;
    };
    androidRippleColor?: string;
};

const DEFAULT_COLORS = {
    bg: {
        default: '#e6e6e6',
        hovered: '#eef2f4',
        pressed: '#dbe4e7',
        disabled: '#f2f4f5',
    },
    text: {
        default: '#222222',
        hovered: '#161616',
        pressed: '#000000',
        disabled: '#8a8a8a',
    },
};

function resolveColor(set: StateColors, disabled: boolean, s: (PressableStateCallbackType|any)) {
    if (disabled) return set.disabled ?? set.default;
    if (s.pressed) return set.pressed ?? set.default;
    if (s.hovered) return set.hovered ?? set.default;
    return set.default;
}

export function RoundedPressable({
                                     label,
                                     onPress,
                                     onLongPress,
                                     disabled,
                                     style,
                                     textStyle,
                                     delayLongPress = 350,
                                     colors,
                                     androidRippleColor,
                                 }: RoundedPressableProps) {
    const bg = { ...DEFAULT_COLORS.bg, ...(colors?.bg ?? {}) };
    const txt = { ...DEFAULT_COLORS.text, ...(colors?.text ?? {}) };

    return (
        <Pressable
            disabled={!!disabled}
            delayLongPress={delayLongPress}
            onPress={onPress}
            onLongPress={onLongPress}
            android_ripple={
                Platform.OS === 'android'
                    ? { color: androidRippleColor ?? 'rgba(0,0,0,0.08)', borderless: false }
                    : undefined
            }
            style={(s) => [
                styles.roundedIcon,
                {
                    backgroundColor: resolveColor(bg, !!disabled, s),
                    opacity: disabled ? 0.6 : 1,
                    transform: s.pressed ? [{ scale: 0.98 }] : [{ scale: 1 }],
                },
                style,
            ]}
        >
            {(s) => (
                <Text
                    style={[
                        styles.label,
                        { color: resolveColor(txt, !!disabled, s) },
                        textStyle,
                    ]}
                >
                    {label}
                </Text>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    roundedIcon: {
        flexDirection: 'row',
        backgroundColor: '#e6e6e6',
        borderRadius: 20,
        gap: 5,
        minHeight: 32,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
    },
});
