import React from "react";
import { Text } from "react-native";
import { globalStyles } from "../../theme/globalStyles";

type Props = {
  children: string;
};

export default function Title({ children }: Props) {
  return <Text style={globalStyles.titleL}>{children}</Text>;
}
