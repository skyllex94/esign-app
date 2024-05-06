import React, { useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import resolveAssetSource from "react-native/Libraries/Image/resolveAssetSource";
import { ScrollView } from "react-native-gesture-handler";

export default function TemplatesLibrary({ navigation }) {
  const [sections, setSections] = useState([
    {
      title: "Contracts",
      isOpen: false,
      templates: [
        {
          name: "Employment Contract",
          file: require("../../assets/templates/contracts/Employment-Contract.pdf"),
          path: resolveAssetSource(
            require("../../assets/templates/contracts/Employment-Contract.pdf")
          ).uri,
        },
        {
          name: "Vendor Contract",
          file: require("../../assets/templates/contracts/Vendor-Contract.pdf"),
          path: resolveAssetSource(
            require("../../assets/templates/contracts/Vendor-Contract.pdf")
          ).uri,
        },
        {
          name: "Freelance Contract Agreement",
          file: require("../../assets/templates/contracts/Freelance-Contract.pdf"),
          path: resolveAssetSource(
            require("../../assets/templates/contracts/Freelance-Contract.pdf")
          ).uri,
        },
        {
          name: "Interior Design Contract",
          file: require("../../assets/templates/contracts/Interior-Design-Contract.pdf"),
          path: resolveAssetSource(
            require("../../assets/templates/contracts/Interior-Design-Contract.pdf")
          ).uri,
        },
      ],
    },
    {
      title: "Real Estate Templates",
      isOpen: false,
      templates: [],
    },
    {
      title: "Legal Templates",
      isOpen: false,
      templates: [
        {
          name: "Licensing Agreement",
          file: require("../../assets/templates/legal/Licensing-Agreement.pdf"),
          path: resolveAssetSource(
            require("../../assets/templates/legal/Licensing-Agreement.pdf")
          ).uri,
        },
      ],
    },
    {
      title: "Business Templates",
      isOpen: false,
      templates: [
        {
          name: "Operating Agreement",
          file: require("../../assets/templates/business/Operating-Agreement.pdf"),
          path: resolveAssetSource(
            require("../../assets/templates/business/Operating-Agreement.pdf")
          ).uri,
        },
        {
          name: "Profit-Sharing Agreement",
          file: require("../../assets/templates/business/Profit-Sharing-Agreement.pdf"),
          path: resolveAssetSource(
            require("../../assets/templates/business/Profit-Sharing-Agreement.pdf")
          ).uri,
        },
        {
          name: "Equipment Rental Agreement",
          file: require("../../assets/templates/business/Equipment-Rental-Agreement.pdf"),
          path: resolveAssetSource(
            require("../../assets/templates/business/Equipment-Rental-Agreement.pdf")
          ).uri,
        },
      ],
    },
    {
      title: "Insurance Templates",
      isOpen: false,
      templates: [],
    },
    {
      title: "Personal Document Templates",
      isOpen: false,
      templates: [],
    },
    {
      title: "Non-Profit Templates",
      isOpen: false,
      templates: [],
    },
  ]);

  const toggleSection = (index) => {
    setSections((prevSections) => {
      const updatedSections = [...prevSections];
      updatedSections[index] = {
        ...updatedSections[index],
        isOpen: !updatedSections[index].isOpen,
      };
      return updatedSections;
    });
  };

  function openTemplate(template) {
    console.log("template:", template);

    navigation.navigate("TemplatePreview", { template });
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {sections.map((section, idx) => (
        <React.Fragment key={idx}>
          <TouchableOpacity
            onPress={() => toggleSection(idx)}
            className="flex-row items-center justify-between bg-white rounded-lg p-5 my-2"
          >
            <Text className="">{section.title}</Text>

            <Entypo
              name={section.isOpen ? "chevron-up" : "chevron-down"}
              size={24}
              color="black"
            />
          </TouchableOpacity>

          <View>
            {section.isOpen && (
              <View className="items-start justify-start bg-white my-1 rounded-lg">
                {section?.templates &&
                  section.templates.map((template, index) => (
                    <TouchableOpacity
                      key={`template-${index}`}
                      onPress={() => openTemplate(template)}
                      className={`flex-row py-2 w-full ${
                        section.templates.length - 1 !== idx &&
                        "border-b-[0.5px] border-slate-200"
                      }`}
                    >
                      <View className="flex-row items-center gap-2 px-8 py-4">
                        <MaterialCommunityIcons
                          name="file-document-outline"
                          size={24}
                          color="black"
                        />
                        <Text>{template.name}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
              </View>
            )}
          </View>
        </React.Fragment>
      ))}
    </ScrollView>
  );
}
