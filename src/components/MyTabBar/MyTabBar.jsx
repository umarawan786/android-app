import React from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useLinkBuilder } from "@react-navigation/native";

import { theme } from "../../constants/theme";
import Icon from "../../icons";

export function MyTabBar({ state, descriptors, navigation, ...rest }) {
  const { buildHref } = useLinkBuilder();

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.name}
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={route.name}
            label={label}
            bgColor={rest.backgroundColor}
            fgColor={rest.foregroundColor}
          />
        );
      })}
    </View>
  );
}

function TabBarButton(props) {
  const { isFocused, label } = props;

  const scale = useSharedValue(0);

  React.useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0, { duration: 350 });
  }, [scale, isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.5]);
    const top = interpolate(scale.value, [0, 1], [0, 8]);

    return {
      transform: [{ scale: scaleValue }],
      top,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0]);

    return {
      // styles
      opacity,
    };
  });

  return (
    <Pressable
      {...props}
      style={[
        styles.tabBarButton,
        {
          backgroundColor: isFocused
            ? props.bgColor || theme.colors.mint
            : props.fgColor || theme.colors.white,
        },
      ]}
    >
      <Animated.View style={[animatedIconStyle]}>
        <Icon
          name={label.toLowerCase()}
          fill={isFocused ? theme.colors.white : theme.colors.black}
        />
      </Animated.View>

      <Animated.Text style={[animatedTextStyle]}>{label}</Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
  },
  tabBarButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    borderRadius: 12,
    paddingVertical: 15,
  },
});
