import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { View, Text, Linking } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrivacyPolicy({ navigation }) {
  return (
    <SafeAreaView>
      <ScrollView>
        <View className="flex-row items-center justify-between m-3">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>

          <Text className="font-light text-[18px]">Privacy Policy</Text>
          <Text className="border-slate-300 border-solid border-2 rounded-lg px-2 mx-1" />
        </View>

        <View className="content m-3 py-3 gap-y-2">
          <Text className="font-light">Effective Date: 5/12/2024</Text>
          <Text className="font-light">
            Zion Studios ("we", "us", or "our") operates the SimpleSign
            e-signature application (the "App"). This Privacy Policy outlines
            how we collect, use, and disclose personal information when you use
            our App. By accessing or using the App, you agree to the terms of
            this Privacy Policy.
          </Text>
          <Text className="font-light">1. Information We Collect</Text>
          <Text className="font-light">
            We collect this personal information to provide and improve the
            functionality of the App, customize your experience, communicate
            with you, process transactions, and comply with legal obligations.
            We only collect personal information that is necessary for these
            purposes and strive to minimize the amount of data we collect to
            respect your privacy.
          </Text>
          <Text className="font-light">
            - Personal Information: This includes information that can identify
            you as an individual, such as your name, email address.
          </Text>
          <Text className="font-light">
            - User Content: We will not be collecting any content, documents, or
            files that you upload, create, or share within the App, including
            electronic signatures and annotations. While such content may not
            always directly identify you, it may contain personal information
            depending on its nature.
          </Text>
          <Text className="font-light">
            - Feedback and Support: If you contact us for support or provide
            feedback about the App, we may collect information related to your
            inquiry or feedback, including your contact details and any other
            information you choose to provide.
          </Text>
          <Text className="font-light">
            - Usage Information: We may collect information about how you use
            the App, including your interactions with its features, the content
            you view, and the actions you take.
          </Text>
          <Text className="font-light">
            - Device Information: We may collect information about your device,
            including its type, operating system, and unique identifiers.
          </Text>
          <Text className="font-light">2. How We Use Your Information</Text>
          <Text className="font-light">
            We are dedicated to upholding the security and confidentiality of
            your data. SimpleSign operates on a no-account model, ensuring that
            no personal information is collected unnecessarily. Here's how we
            utilize the information we gather:
          </Text>
          <Text className="font-light">
            - Facilitating E-Signatures and Document Management: The information
            you provide is pivotal for facilitating electronic signatures,
            document uploads, and management within the App. We use this data
            solely for processing and securely storing documents, ensuring the
            integrity and confidentiality of your electronic signatures and
            documents.
          </Text>
          <Text className="font-light">
            - Communicating with You: We may use non-personal information to
            communicate with you regarding your document transactions or
            inquiries. This may include delivering transaction-related
            notifications or providing support assistance as needed.
          </Text>
          <Text className="font-light">
            - Improving App Functionality: We analyze usage patterns and
            feedback to identify areas for improvement and optimize the
            functionality of the App. This helps us enhance your user
            experience, streamline processes, and address any technical issues
            or security vulnerabilities proactively.
          </Text>
          <Text className="font-light">
            - Ensuring Security: Your security is paramount to us. We employ
            robust security measures to protect against unauthorized access,
            misuse, or alteration of your data. This includes monitoring for
            suspicious activities, conducting security audits, and implementing
            encryption protocols to safeguard your information.
          </Text>
          <Text className="font-light">
            - Complying with Legal Obligations: We may use information collected
            to comply with applicable laws, regulations, or legal processes.
            This may include responding to legal requests, investigating
            potential violations of our terms of service, or fulfilling our
            legal obligations in jurisdictions where we operate.
          </Text>
          <Text className="font-light">
            We respect your privacy and adhere to strict data protection
            principles. Rest assured that we do not collect personal information
            for any other purposes beyond facilitating document transactions and
            ensuring the security and functionality of the App. If you have any
            questions or concerns about how we use your information, please
            don't hesitate to contact us. Your trust is vital to us, and we are
            committed to maintaining the highest standards of privacy and
            security.
          </Text>
          <Text className="font-light">3. How We Share Your Information</Text>
          <Text className="font-light">
            - We are committed to protecting your privacy, and we do not share
            your information with any entities. Your privacy and data security
            are our top priorities. We do not engage in any data sharing
            practices with third parties for any purposes, including marketing
            or advertising.
          </Text>
          <Text className="font-light">
            - Our dedication to maintaining the confidentiality and security of
            your information means that you can trust us to handle your data
            responsibly. We adhere to strict privacy principles, ensuring that
            your information remains confidential and secure at all times.
          </Text>
          <Text className="font-light">
            - If you have any questions or concerns about our data sharing
            practices, please don't hesitate to contact us. Your trust is
            paramount to us, and we are here to address any inquiries you may
            have regarding the handling of your information.
          </Text>
          <Text className="font-light">4. Data Security</Text>
          <Text className="font-light">
            We take data security seriously and employ stringent measures to
            ensure the protection of your information. All signatures and
            documents are stored locally and securely within the app, and they
            are not transmitted or sent anywhere external to the app's
            environment.
          </Text>
          <Text className="font-light">
            Our commitment to safeguarding your data means that we implement
            robust encryption protocols and security measures to prevent
            unauthorized access, misuse, or alteration of your information. Your
            signatures and documents remain securely stored within the app,
            accessible only to you and authorized users.
          </Text>
          <Text className="font-light">
            While we take every precaution to ensure the security of your data,
            it's important to note that no method of transmission over the
            internet or electronic storage is entirely foolproof. However, by
            storing your signatures and documents locally within the app, we
            minimize the risk of unauthorized access and enhance the
            confidentiality of your information.
          </Text>
          <Text className="font-light">5. Your Choices</Text>
          <Text className="font-light">
            You can choose not to provide certain personal information, although
            this may limit your ability to use certain features of the App. You
            can also opt-out of receiving promotional communications from us by
            following the instructions provided in such communications.
          </Text>

          <Text className="font-light">6. Changes to this Privacy Policy</Text>
          <Text className="font-light">
            At SimpleSign, we are committed to transparency and keeping you
            informed about how we handle your personal information. As we
            continue to evolve and improve our services, we may need to update
            or modify this Privacy Policy from time to time. It is your
            responsibility to regularly check this Privacy Policy for any
            updates.
          </Text>
          <Text className="font-light">
            - No Notification of Changes: Please note that we will not be
            providing individual notices for changes to this Privacy Policy. It
            is your responsibility to periodically review this Privacy Policy to
            stay informed about any updates.
          </Text>
          <Text className="font-light">
            - Your Continued Use: By continuing to use the App after the
            effective date of any changes to this Privacy Policy, you
            acknowledge and agree to the updated terms. Your continued use of
            the App constitutes acceptance of the revised Privacy Policy.
          </Text>
          <Text className="font-light">
            - Understanding Your Rights: We understand that privacy is important
            to you, and we respect your right to control your personal
            information. If you do not agree with any changes to this Privacy
            Policy, you may choose to discontinue your use of the App.
          </Text>
          <Text className="font-light">
            - Providing Feedback: We value your feedback and encourage you to
            reach out to us if you have any questions, concerns, or suggestions
            regarding this Privacy Policy or our data practices. Your input
            helps us improve our services and better meet your needs.
          </Text>
          <Text className="font-light">
            - Effective Date: This Privacy Policy is effective as of the date
            indicated at the top of the document. Any changes or updates to the
            Privacy Policy will become effective immediately upon posting.
          </Text>
          <Text className="font-light">7. Contact Us</Text>
          <Text className="font-light">
            We value open communication and are here to assist you with any
            questions, concerns, or feedback you may have. Please feel free to
            reach out to us using the following contact information:
          </Text>
          <Text className="font-light">
            - Email: You can contact us via email at{" "}
            <Text
              className="text-blue-700"
              onPress={() =>
                Linking.openURL("mailto:zionstudiosapps@gmail.com")
              }
            >
              zionstudiosapps@gmail.com
            </Text>
            . Our dedicated support team is available to assist you with any
            inquiries or issues you may encounter while using the SimpleSign
            e-signature App. Whether you have questions about our services, need
            technical support, or wish to provide feedback, we are here to help.
          </Text>
          <Text className="font-light">Conclusion</Text>
          <Text className="font-light">
            This Privacy Policy aims to transparently explain how we collect,
            use, and protect your personal information when you use the
            SimpleSign e-signature App. Your privacy is important to us, and we
            are committed to safeguarding your information and providing you
            with choices and control over your data. Thank you for using
            SimpleSign.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
