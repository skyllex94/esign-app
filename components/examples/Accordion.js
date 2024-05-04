import React, { useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import Accordion from "react-native-collapsible/Accordion";
import { Entypo } from "@expo/vector-icons";

export default function TemplatesLibrary() {
  const [activeSections, setActiveSections] = useState([]);
  const sections = [
    {
      title: "Native development",
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
      content: (
        <Text>
          See your changes as soon as you save. With the power of JavaScript,
          React Native lets you iterate at lightning speed.
        </Text>
      ),
    },
    {
      title: "Cross-platform",
      content: (
        <React.Fragment>
          <Text>
            React components wrap existing native code and interact with native
            APIs via React's declarative UI paradigm and JavaScript. This
            enables native app development for whole new teams of developers
          </Text>
          <View style={styles.seperator}></View>
          <Button title="See more..." />
        </React.Fragment>
      ),
    },
  ];

  function renderHeader(section, _, isActive) {
    return (
      <View
        className="flex-row items-center justify-between p-5 rounded-lg bg-slate-400"
        style={styles.accordHeader}
      >
        <Text className="">{section.title}</Text>

        <Entypo
          name={isActive ? "chevron-up" : "chevron-down"}
          size={24}
          color="black"
        />
      </View>
    );
  }

  function renderContent(section, _, isActive) {
    return <View style={styles.accordBody}>{section.content}</View>;
  }

  return (
    <Accordion
      align="bottom"
      sections={sections}
      activeSections={activeSections}
      renderHeader={renderHeader}
      renderContent={renderContent}
      onChange={(sections) => setActiveSections([...sections])}
      sectionContainerStyle={styles.accordContainer}
    />
  );
}

const styles = StyleSheet.create({
  accordContainer: {
    paddingBottom: 10,
  },

  accordBody: {
    padding: 12,
  },
  textSmall: {
    fontSize: 16,
  },
  seperator: {
    height: 12,
  },
});
