// /components/IconButton.tsx
import * as React from 'react';
import { Pressable, ViewStyle, Platform } from 'react-native';

type IconButtonProps = {
    icon: (color: string) => React.ReactNode;   // render prop for the icon
    onPress?: () => void;
    onLongPress?: () => void;
    disabled?: boolean;
    style?: ViewStyle | ViewStyle[];
    delayLongPress?: number; // ms (default 350)
};

export function IconButton({
                               icon,
                               onPress,
                               onLongPress,
                               disabled,
                               style,
                               delayLongPress = 350,
                           }: IconButtonProps) {
    const [isLonging, setIsLonging] = React.useState(false);

    return (
        <Pressable
            disabled={disabled}
            // Nice Android ripple
            android_ripple={{ borderless: true }}
            delayLongPress={delayLongPress}
            onPress={onPress}
            onLongPress={() => {
                setIsLonging(true);
                onLongPress?.();
            }}
            onPressOut={() => setIsLonging(false)}
            style={({ pressed, hovered } : {pressed: boolean, hovered?: boolean}) => [
                // your base pill style
                {
                    minHeight: 32,
                    paddingHorizontal: 10,
                    borderRadius: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    // background by state:
                    // web hover -> light, tap/hold -> medium, longPress -> darker/accent
                    backgroundColor: isLonging
                        ? '#cfd7db'                       // long-press active
                        : pressed
                            ? '#dbe4e7'                       // tap/hold (pressed) on mobile & web
                            : hovered
                                ? '#eef2f4'                       // hover (web only)
                                : 'white',
                    // subtle feedback on press
                    transform: pressed ? [{ scale: 0.98 }] : [{scale:1}],
                    opacity: disabled ? 0.5 : 1,
                    overflow: 'hidden',
                },
                style,
            ]}
        >
            {({ pressed, hovered } : {pressed: boolean, hovered?: boolean}) =>
                icon(hovered || pressed || isLonging ? 'black' : 'gray')
            }
        </Pressable>
    );
}
