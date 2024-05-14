import React, { useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import {
  Entypo,
  FontAwesome,
  FontAwesome5,
  Fontisto,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import resolveAssetSource from "react-native/Libraries/Image/resolveAssetSource";
import { ScrollView } from "react-native-gesture-handler";

export default function TemplatesLibrary({ navigation }) {
  const [sections, setSections] = useState([
    {
      title: "Contracts",
      isOpen: false,
      icon: <FontAwesome5 name="file-signature" size={18} color="#1e293b" />,
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
        {
          name: "Contract Addendum",
          file: require("../../assets/templates/contracts/Contract-Addendum.pdf"),
          path: resolveAssetSource(
            require("../../assets/templates/contracts/Contract-Addendum.pdf")
          ).uri,
        },
      ],
    },
    {
      title: "Real Estate Templates",
      isOpen: false,
      icon: <FontAwesome5 name="house-damage" size={18} color="#1e293b" />,
      templates: [
        {
          name: "Rental Agreement",
          file: require("../../assets/templates/real_estate/Basic-Rental-Agreement.pdf"),
          path: resolveAssetSource(
            require("../../assets/templates/real_estate/Basic-Rental-Agreement.pdf")
          ).uri,
        },
        {
          name: "Home Repair Contract",
          file: require("../../assets/templates/real_estate/Home-Repair-Contract.pdf"),
          path: resolveAssetSource(
            require("../../assets/templates/real_estate/Home-Repair-Contract.pdf")
          ).uri,
        },
      ],
    },
    {
      title: "Legal Templates",
      isOpen: false,
      icon: <FontAwesome name="legal" size={18} color="#1e293b" />,
      templates: [
        {
          name: "Licensing Agreement",
          file: require("../../assets/templates/legal/Licensing-Agreement.pdf"),
          path: resolveAssetSource(
            require("../../assets/templates/legal/Licensing-Agreement.pdf")
          ).uri,
        },
        {
          name: "Last Will Testament",
          file: require("../../assets/templates/legal/Last-Will-Testament.pdf"),
          path: resolveAssetSource(
            require("../../assets/templates/legal/Last-Will-Testament.pdf")
          ).uri,
        },
      ],
    },
    {
      title: "Business Templates",
      isOpen: false,
      icon: <Ionicons name="business" size={18} color="#1e293b" />,
      templates: [
        {
          name: "Operating Agreement",
          file: require("../../assets/templates/business/Operating-Agreement.pdf"),
          path: resolveAssetSource(
            require("../../assets/templates/business/Operating-Agreement.pdf")
          ).uri,
        },
        {
          name: "Founders' Agreement",
          file: require("../../assets/templates/business/Founders-Agreement.pdf"),
          path: resolveAssetSource(
            require("../../assets/templates/business/Founders-Agreement.pdf")
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
        {
          name: "Termination Letter",
          file: require("../../assets/templates/business/Termination-Letter.pdf"),
          path: resolveAssetSource(
            require("../../assets/templates/business/Termination-Letter.pdf")
          ).uri,
        },
        {
          name: "Business Partnership Agreement",
          file: require("../../assets/templates/business/Business-Partnership-Agreement.pdf"),
          path: resolveAssetSource(
            require("../../assets/templates/business/Business-Partnership-Agreement.pdf")
          ).uri,
        },
        {
          name: "Non-Disclosure Agreement",
          file: require("../../assets/templates/business/Non-Disclosure-Agreement.pdf"),
          path: resolveAssetSource(
            require("../../assets/templates/business/Non-Disclosure-Agreement.pdf")
          ).uri,
        },
        {
          name: "Service Proposal",
          file: require("../../assets/templates/business/Service-Proposal.pdf"),
          path: resolveAssetSource(
            require("../../assets/templates/business/Service-Proposal.pdf")
          ).uri,
        },
        {
          name: "Marketing Agreement",
          file: require("../../assets/templates/business/Marketing-Agreement.pdf"),
          path: resolveAssetSource(
            require("../../assets/templates/business/Marketing-Agreement.pdf")
          ).uri,
        },
      ],
    },

    {
      title: "Personal Document Templates",
      isOpen: false,
      icon: <Fontisto name="persons" size={18} color="#1e293b" />,
      templates: [
        {
          name: "Divorce Settlement",
          file: require("../../assets/templates/personal/Divorce-Settlement-Agreement.pdf"),
          path: resolveAssetSource(
            require("../../assets/templates/personal/Divorce-Settlement-Agreement.pdf")
          ).uri,
        },
        {
          name: "Vehicle Purchase Agreement",
          file: require("../../assets/templates/personal/Vehicle-Purchase-Agreement.pdf"),
          path: resolveAssetSource(
            require("../../assets/templates/personal/Vehicle-Purchase-Agreement.pdf")
          ).uri,
        },
      ],
    },
    {
      title: "Non-Profit Templates",
      isOpen: false,
      icon: <MaterialCommunityIcons name="charity" size={18} color="#1e293b" />,
      templates: [
        {
          name: "Donation Letter",
          file: require("../../assets/templates/non-profit/Donation-Letter.pdf"),
          path: resolveAssetSource(
            require("../../assets/templates/non-profit/Donation-Letter.pdf")
          ).uri,
        },
        {
          name: "Volunteer Agreement",
          file: require("../../assets/templates/non-profit/Volunteer-Agreement.pdf"),
          path: resolveAssetSource(
            require("../../assets/templates/non-profit/Volunteer-Agreement.pdf")
          ).uri,
        },
      ],
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
    navigation.navigate("TemplatePreview", { template });
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {sections.map((section, idx) => (
        <React.Fragment key={idx}>
          <TouchableOpacity
            onPress={() => toggleSection(idx)}
            className="flex-row items-center justify-between bg-white rounded-lg p-3 my-1"
          >
            <View className="flex-row items-center gap-x-3">
              <Text>{section.icon}</Text>
              <Text className=" text-slate-800">{section.title}</Text>
            </View>

            <View className="px-2">
              <Entypo name="chevron-thin-down" size={13} color="#1e293b" />
            </View>
          </TouchableOpacity>

          <View>
            {section.isOpen && (
              <View className="items-start justify-start bg-white my-1 rounded-lg">
                {section?.templates &&
                  section.templates.map((template, index) => (
                    <TouchableOpacity
                      key={`template-${index}`}
                      onPress={() => openTemplate(template)}
                      className={`flex-row py-1 w-full ${
                        section.templates.length - 1 !== index &&
                        "border-b-[0.5px] border-slate-200"
                      }`}
                    >
                      <View className="flex-row items-center gap-2 px-8 py-2">
                        <Ionicons
                          name="document-text-outline"
                          size={20}
                          color="#1e293b"
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
