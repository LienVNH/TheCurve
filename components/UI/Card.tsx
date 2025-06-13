import React, { ReactNode } from "react";
import { View } from "react-native";
import { globalStyles } from "../../theme/globalStyles";

type Props = {
  children: ReactNode;
};

export default function Card({ children }: Props) {
  return <View style={globalStyles.card}>{children}</View>;
}
