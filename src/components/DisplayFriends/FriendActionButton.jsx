import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import Icon from "../../icons";
import { scaleFontSize } from "../../helpers/common";

export const FriendActionButton = ({
  onPress,
  text,
  iconName,
  isLoading = false,
  theme,
}) => (
  <Pressable
    style={[styles.buttonContainer, { backgroundColor: theme.background }]}
    onPress={onPress}
    disabled={isLoading}
  >
    {isLoading ? (
      <ActivityIndicator
        style={styles.activityIndicatorStyle}
        size={"small"}
        color={theme.foreground}
      />
    ) : (
      <>
        <Text style={[styles.buttonText, { color: theme.foreground }]}>
          {text}
        </Text>
        <Icon name={iconName} size={15} fill={theme.foreground} />
      </>
    )}
  </Pressable>
);

const styles = StyleSheet.create({
  buttonContainer: {
    width: 80,
    height: 25,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonText: {
    fontFamily: "Poppins-Regular",
    fontSize: scaleFontSize(10),
  },
  activityIndicatorStyle: {
    flex: 1,
  },
});
