import { View, Text, SafeAreaView } from "react-native";
import React, { useRef } from "react";
// Signature Imports
// import SignatureCapture from "react-native-signature-capture";

import SignatureScreen from "react-native-signature-canvas";

export default function DrawSign({ text, onOK }) {
  const ref = useRef();

  // Called after ref.current.readSignature() reads a non-empty base64 string
  const handleOK = (signature) => {
    console.log(signature);
    onOK(signature); // Callback from Component props
  };

  // Called after ref.current.readSignature() reads an empty string
  const handleEmpty = () => {
    console.log("Empty");
  };

  // Called after ref.current.clearSignature()
  const handleClear = () => {
    console.log("clear success!");
  };

  // Called after end of stroke
  const handleEnd = () => {
    ref.current.readSignature();
  };

  // Called after ref.current.getData()
  const handleData = (data) => {
    console.log(data);
  };

  return (
    <SignatureScreen
      className="flex-1"
      ref={ref}
      // onEnd={handleEnd}
      // onOK={handleOK}
      // onEmpty={handleEmpty}
      onClear={handleClear}
      onGetData={handleData}
      autoClear={true}
      descriptionText={text}
      bgHeight={300}
      minWidth={0.5}
      maxWidth={4}
    />
  );
}

{
  /*

 <SignatureCapture
          style={{ width: 535, height: 314 }}
          viewMode={"portrait"}
          confirmText="Here we Are"
          showNativeButtons={true}
        />

*/
}
