import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import Accordion from "react-native-collapsible/Accordion";
import { Entypo } from "@expo/vector-icons";

export default function TemplatesLibrary() {
  const sections = [
    {
      title: "Native development",
      isOpen: false,
      content: (
        <Text>
          React Native lets you create truly native apps and doesn't compromise
          your users' experiences. It provides a core set of platform agnostic
          native components
        </Text>
      ),
    },
    {
      title: "Fast refresh",
      isOpen: false,
      content: (
        <Text>
          See your changes as soon as you save. With the power of JavaScript,
          React Native lets you iterate at lightning speed.
        </Text>
      ),
    },
    {
      title: "Cross-platform",
      isOpen: false,
      content: (
        <React.Fragment>
          <Text>
            React components wrap existing native code and interact with native
            APIs via React's declarative UI paradigm and JavaScript. This
            enables native app development for whole new teams of developers
          </Text>
          <View></View>
          <Button title="See more..." />
        </React.Fragment>
      ),
    },
  ];

  function showHideGroup(section) {
    console.log("section", section);
  }

  return (
    <View className="">
      {sections.map((section, idx) => (
        <TouchableOpacity
          key={idx}
          onPress={() => showHideGroup(section)}
          className="flex-row items-center justify-between bg-white rounded-lg p-5 my-2"
        >
          <Text className="">{section.title}</Text>

          <Entypo
            name={section.isOpen ? "chevron-up" : "chevron-down"}
            size={24}
            color="black"
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}
