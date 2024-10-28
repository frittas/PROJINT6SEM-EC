import React, { forwardRef, LegacyRef, useEffect, useState } from "react";
import { View, TextInput, TextInputProps } from "react-native";
import { themes } from "../../global/themes";
import { style } from "./styles";
import { FontAwesome } from "@expo/vector-icons";

type Props = TextInputProps & {
  icon?: string;
};

export const CustomInput = forwardRef(
  (props: Props, ref: LegacyRef<TextInput> | null) => {
    const { icon, ...rest } = props;

    return (
      <View style={style.container}>
        <TextInput
          style={style.input}
          placeholderTextColor={themes.colors.bgScreen}
          {...rest}
        ></TextInput>
        {icon && (
          <FontAwesome
            style={style.icon}
            name={icon as any}
            size={20}
          ></FontAwesome>
        )}
      </View>
    );
  }
);
