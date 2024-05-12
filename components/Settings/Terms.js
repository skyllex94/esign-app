import { View, Text, TouchableOpacity, Linking } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import useRevenueCat from "../../hooks/useRevenueCat";

export default function Terms({ navigation }) {
  const esignName = "SimpleSign";

  const { currentOffering } = useRevenueCat();

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="flex-row items-center justify-between m-3">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            // className="border-slate-300 border-solid border-2 rounded-lg p-2.5 mx-1"
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>

          <Text className="font-light text-[18px]">Terms & Conditions</Text>
          <Text className="border-slate-300 border-solid border-2 rounded-lg px-2 mx-1" />
        </View>

        <View className="content m-3 py-3 gap-y-2">
          <Text className="font-light">
            1. ACCEPTANCE OF TERMS AND CONDITIONS
          </Text>
          <Text className="font-light">
            These Terms and Conditions govern your ("Customer" or "you") use of{" "}
            {esignName}'s On-demand Electronic Signature Service (the "Hosted
            Services"), as accessed through a Service Plan by depositing any
            document into the app's data storage, you accept these Terms and
            Conditions (including your corresponding Service Plan, the{" "}
            {esignName} Terms of Use, and all policies and guidelines referenced
            and hereby incorporated into these Terms and Conditions) and any
            modifications that may be made to the Terms and Conditions from time
            to time. If you do not agree to these Terms and Conditions, you
            should not use the Hosted Services. These Terms and Conditions
            constitute an agreement between you and Zion Studios LLC ("
            {esignName}," "we," "us," and "our"). Please read them carefully and
            print a copy for your future reference.
          </Text>
          <Text className="font-light">
            2. MODIFICATION OF TERMS AND CONDITIONS
          </Text>
          <Text className="font-light">
            We reserve the right to modify these Terms and Conditions at any
            time and in any manner at our sole discretion by: (a) posting a
            revision on this Site; or (b) sending information regarding the
            amendment to the email address you provide to us. You are
            Responsible for regularly reviewing this site to obtain timely
            Notice of any amendments. You shall be deemed to have accepted such
            Amendments by continuing to use the hosted services for more than 20
            Days after such amendments have been posted or information regarding
            Such amendments has been sent to you. You agree that we shall not be
            liable to you or to any third party for any modification of the
            Terms and Conditions.
          </Text>
          <Text className="font-light">3. DEFINITIONS</Text>
          <Text className="font-light">
            “Customer Data” means Personal Data and all other data and
            information concerning Customer or Customer’s personnel or business
            clients: (a) provided by or on behalf of Customer to {esignName}; or
            (b) obtained by {esignName} based on the use or Processing of data
            or information provided by or on behalf of Customer to {esignName}.
          </Text>
          <Text className="font-light">
            “Process” and similar terms mean to perform any operation or set of
            operations upon Customer Data, whether or not by automatic means,
            such as collection, recording, organization, storage, adaptation or
            alteration, retrieval, accessing, consultation, use, disclosure by
            transmission, dissemination or otherwise making available, alignment
            or combination, blocking, erasure or destruction.
          </Text>
          <Text className="font-light">
            “System” refers to the software systems and programs, communication
            and network facilities, and hardware and equipment used by{" "}
            {esignName} or its agents to provide the Hosted Services.
          </Text>
          <Text className="font-light">
            4. RESPONSIBILITY FOR CONTENT OF COMMUNICATIONS
          </Text>
          <Text className="font-light">
            Customer agrees that it will not use or permit the use of the Hosted
            Services to send unsolicited mass mailings outside its organization,
            it being understood that the term “unsolicited mass mailings”
            includes all statutory and other common definitions, including all
            Commercial Electronic Marketing Messages as defined in the U.S. CAN
            SPAM Act. Customer agrees that it is solely responsible for the
            nature and content of all materials, works, data, statements, and
            other visual, graphical, written, or audible communications of any
            nature submitted by any Authorized User or otherwise Processed
            through its Account. Customer further agrees not to knowingly use
            the Hosted Services: (a) to communicate any message or material that
            is defamatory, harassing, libelous, threatening or obscene; (b) in a
            way that violates or infringes upon the intellectual property rights
            or the privacy or publicity rights of any person or entity or that
            may otherwise be unlawful or give rise to civil or criminal
            liability (other than contractual liability of the parties under
            eContracts Processed through the Hosted Services); or (c) in any
            manner that is likely to damage, disable, overburden, or impair the
            System or the Hosted Services or interfere in any way with the use
            or enjoyment of the Hosted Services by others; or (d) in any way
            that constitutes or encourages conduct that could constitute a
            criminal offense. Although {esignName} does not actively monitor the
            content Processed through the Hosted Services, {esignName} may at
            any time and without prior notice suspend any use of the Hosted
            Services and/or remove or disable any content as to which{" "}
            {esignName} is made aware of a reason for concern as to such use or
            content. {esignName} agrees to exert reasonable commercial efforts
            to provide Customer with notice of any such suspension or
            disablement before its implementation, or promptly thereafter.
          </Text>
          <Text className="font-light">5. PRICING FOR THE SERVICE</Text>
          <Text className="font-light">
            The prices, features, and options of the Hosted Services available
            for an Account depend on the Service Plan selected by Customer.
            Customer may also purchase optional services on a periodic or
            per-use basis. {esignName} may add or change the prices, features or
            options available with a Service Plan without notice. Customer's
            usage under a Service Plan is measured based on the actual number of
            Seats as described in the Service Plan on the Site. Once a per-Seat
            Service Plan is established, the right of the named Authorized User
            to access and use the Hosted Services is not transferable; any
            additional or different named Authorized Users must purchase
            per-Seat Service Plans to send Envelopes. Extra seats, users and/or
            per use fees will be charged as set forth in Customer's Service Plan
            if allowed by such Service Plan. If a Services Plan defines a
            monthly Envelope Allowance (i.e. # Envelopes per month allowed to be
            sent), all Envelopes sent in excess of the Envelope Allowance will
            incur a per-Envelope charge. Any unused Envelope Allowances will
            expire and not carry over from one billing period to another under a
            Service Plan. Customer’s Account will be deemed to have consumed an
            Envelope at the time the Envelope is sent by Customer, regardless of
            whether Envelopes were received by recipients, or whether recipients
            have performed any actions upon any eContract in the Envelope. For
            Service Plans that specify the Envelope Allowance is “Unlimited,”
            Customer is allowed to send a reasonable number of Envelopes from
            the number of Seats purchased. If {esignName} suspects that the
            number of Envelopes sent from a particular Seat or a group of Seats
            is abusive and/or unduly burdensome, {esignName} will promptly
            notify Customer, discuss the use-case scenario with Customer and any
            continued monitoring, additional discussions and/or information
            required to make a final determination on the course of action based
            on such information. In the event Customer exceeds, in {esignName}’s
            sole discretion, reasonable use restrictions under a Service Plan,
            {esignName} reserves the right to transfer Customer into a
            higher-tier Service Plan without notice. If you misrepresent your
            eligibility for any Service Plan, you agree to pay us the additional
            amount you would have been charged under the most favorable pricing
            structure for which you are eligible. {esignName} may discontinue a
            Service Plan at any time, and with prior notice to you, may migrate
            your Account to a similar Service Plan that may carry a different
            fee. You agree to allow us to charge your credit card for the fees
            associated with a substitute Service Plan, even if those fees are
            higher than those you agreed to when you registered your Account.
          </Text>
          <Text className="font-light">6. CUSTOMER SUPPORT</Text>
          <Text className="font-light">
            SimpleSign will provide customer support to customer by reaching out
            on our customer service email:{" "}
            <Text
              className="text-blue-700"
              onPress={() =>
                Linking.openURL("mailto:zionstudiosapps@gmail.com")
              }
            >
              zionstudiosapps@gmail.com
            </Text>
          </Text>

          <Text className="font-light">7. STORAGE</Text>
          <Text className="font-light">
            {esignName} will store your documents inside the app's data storage
            by the Customer. The data is not visible and not transferable
            outside the app itself. Any saving to the local system is a
            responsibility of the Customer and should be taken with the chance
            of data and documents being able to leak outside the intended scope.
            Customer may retrieve and store copies of documents for storage
            outside of the System at any time during the Term of the Service
            Plan when Customer is in good financial standing under these Terms
            and Conditions, and may delete or purge the documents from the
            System at its own discretion. {esignName} assumes no liability or
            responsibility for a party's failure or inability to electronically
            sign any document. Transaction Data associated with documents will
            be retained on the app itself and is not transferrable by switching
            mobile phones.
          </Text>
          <Text className="font-light">8. BUSINESS AGREEMENT BENEFITS</Text>
          <Text className="font-light">
            You may receive or be eligible for certain pricing structures,
            discounts, features, promotions, and other benefits (collectively,
            "Benefits") through a business or government customer's agreement
            with us (a "Business Agreement"). Any and all such Benefits are
            provided to you solely as a result of the corresponding Business
            Agreement and such Benefits may be modified or terminated without
            notice. If you use the Hosted Services where a business or
            government entity pays your charges or is otherwise liable for the
            charges, you authorize us to share your account information with
            that entity and/or its authorized agents. If you are enrolled in a
            Service Plan or receive certain Benefits tied to a Business
            Agreement with us, but you are liable for your own charges, then you
            authorize us to share enough account information with that entity
            and its authorized agents to verify your continuing eligibility for
            those Benefits and the Service Plan.
          </Text>
          <Text className="font-light">9. FEES AND PAYMENT TERMS</Text>
          <Text className="font-light">
            The Service Plan rates, charges, and other conditions for use are
            set forth in the Site and through the Paywall. Customer will pay
            {esignName} the applicable charges for the Services Plan as set
            forth on the Site/Paywall. Charges for pre-paid Service Plans will
            be billed to Customer in advance. Charges for per use purchases and
            standard Service Plan charges will be billed in arrears. You must
            promptly notify us of any change in your invoicing address or
            changes related to the credit card used for payment. By completing
            your registration for the Services Plan, you authorize {esignName}{" "}
            or its agent to bill your credit card the applicable Service Plan
            charges, any and all applicable taxes, and any other charges you may
            incur in connection with your use of the Hosted Services, all of
            which will be charged to your credit card. Each time you use the
            Hosted Services, or allow or cause the Hosted Services to be used,
            you reaffirm that we are authorized to charge your credit card. You
            may terminate your Account and revoke your credit card authorization
            as set forth in the Term and Termination. We will provide you with
            one invoice in a format we choose, which may change from time to
            time, for all Hosted Services associated with each Account and any
            charges of a third party on whose behalf we bill. Payment of all
            charges is due and will be charged to your credit card upon your
            receipt of an invoice. Billing cycle end dates may change from time
            to time. When a billing cycle covers less than or more than a full
            month, we may make reasonable adjustments and/or prorations. If your
            Account is a qualified business account and is approved by us in
            writing for corporate billing, charges will be accumulated,
            identified by Account identification number, and invoiced on a
            monthly basis. You agree that we may (at our option) accumulate
            charges incurred during your monthly billing cycle and submit them
            as one or more aggregate charges during or at the end of each cycle,
            and that we may delay obtaining authorization from your credit card
            issuer until submission of the accumulated charge(s). This means
            that accumulated charges may appear on the statement you receive
            from your credit card issuer.
          </Text>

          <Text className="font-light">10. SUBSCRIPTION PLANS</Text>
          <Text className="font-light">
            We have several plans to choose from with their current pricing
            associated to them:
          </Text>
          <Text className="font-light">
            Weekly Plan - This is a plan which will be charged on a weekly basis
            ({currentOffering?.weekly?.product?.priceString}) to the Customer
            for offering full functionality for the given period of time,
            specified with an introductory, or without an introductory offer
            contingent on being the primary time any Service Plan is getting
            used.
          </Text>

          <Text className="font-light">
            Monthly Plan - This is a plan which will be charged on a monthly
            basis ({currentOffering?.monthly?.product?.priceString}) to the
            Customer for offering full functionality for the given period of
            time, specified with an introductory, or without an introductory
            offer contingent on being the primary time any Service Plan is
            getting used.
          </Text>

          <Text className="font-light">
            Yearly Plan - This is a plan which will be charged on a yearly basis
            ({currentOffering?.annual?.product?.priceString}) to the Customer
            for offering full functionality for the given period of time,
            specified with an introductory, or without an introductory offer
            contingent on being the primary time any Service Plan is getting
            used.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
