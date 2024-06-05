import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  SafeAreaView,
  Text,
  View,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import { Context } from "../contexts/Global";
// PDF imports
import Pdf from "react-native-pdf";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

// BottomSheet
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
// UI and functions
import {
  FontAwesome,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  deleteInitials,
  deleteSignature,
  printDocument,
  selectImage,
  selectInitials,
  selectPrinter,
  selectSignature,
} from "./functions";

import Signature from "./PanResponders/Signature";
// PDF editing
import { SaveDocument } from "./SaveDocument";
import { StatusBar } from "expo-status-bar";
import { signatureRatio } from "../../constants/Utils";
import AddSignatureModal from "./AddSignatureModal";
import DateTime from "./PanResponders/DateTime";
import Initials from "./PanResponders/Initials";
import AddInitialsModal from "./Initials/AddInitialsModal";
import { showMessage } from "react-native-flash-message";
import ImageSelection from "./PanResponders/ImageSelection";
import AddTextModal from "./AddTextModal";
import TextField from "./PanResponders/TextField";
import Checkbox from "./PanResponders/Checkbox";
// Custom hook import
import useRevenueCat from "../../hooks/useRevenueCat";
import { coolDownAsync } from "expo-web-browser";

export default function DocumentEditor({ navigation, route }) {
  // Show current signatures
  const [showSignatures, setShowSignatures] = useState(false);
  // Input chosen signature into the pdf
  const [showSignaturePanResponder, setShowSignaturePanResponder] =
    useState(false);
  // Selected signature path
  const [selectedSignaturePath, setSelectedSignaturePath] = useState(null);
  // Signature list context
  const { signatureList, setSignatureList, initialsList, setInitialsList } =
    useContext(Context);

  // RevenueCat paywall import
  const { isProMember } = useRevenueCat();

  // Relative width and height of inputed element
  const [coordinateX, setCoordinateX] = useState(0);
  const [coordinateY, setCoordinateY] = useState(0);

  // PDF single page ratio
  const [pageRatio, setPageRatio] = useState(0);

  // PDF Editing states and variables
  const [pdfArrayBuffer, setPdfArrayBuffer] = useState(null);
  // The raw Base 64 data of the pdf file
  const [pdfBase64, setPdfBase64] = useState(null);
  // Signature's array buffer state
  const [signatureArrayBuffer, setSignatureArrayBuffer] = useState(null);

  // PDF page dimension states
  const [pdfHeight, setPdfHeight] = useState();
  const [pdfWidth, setPdfWidth] = useState();
  // Edited PDF file path
  const [editedPdfPath, setEditedPdfPath] = useState();
  // Current page of the pdf
  const [currPage, setCurrPage] = useState(1);
  // Size of the element/signature
  const [elementSizeWidth, setElementSizeWidth] = useState(80 * signatureRatio);
  const [elementSizeHeight, setElementSizeHeight] = useState(80);
  const [signaturePage, setSignaturePage] = useState();

  // Naming Modal
  const [isNamingModal, setIsNamingModal] = useState(false);

  // Add Signature Modal
  const [showSignatureModal, setShowSignatureModal] = useState(false);

  // Date states
  const [showDatePanResponder, setShowDatePanResponder] = useState(false);

  // Date coordinates of the pan responder
  const [date_x, setDate_x] = useState(0);
  const [date_y, setDate_y] = useState(0);

  const [dateSize, setDateSize] = useState(15);
  const [date] = useState(new Date().toLocaleDateString());

  useEffect(() => {
    editingPalette.current?.present();
  }, [editingPalette, navigation]);

  // Callbacks
  const showEditingPalette = useCallback(() => {
    editingPalette.current?.present();
  }, []);

  // Passed path name for the picked document
  const { pickedDocument } = route.params;
  const source = { uri: pickedDocument, cache: true };

  const displayWidth = Dimensions.get("window").width;
  const displayHeight = Dimensions.get("window").width * pageRatio;

  const [diffInDisplays, setDiffInDisplays] = useState();

  // Bottomsheet refs and values
  const editingPalette = useRef();
  const snapPoints = useMemo(() => ["16%"], []);

  const [selectedPrinter, setSelectedPrinter] = useState();

  // Initials states
  const [showInitials, setShowInitials] = useState(false);
  const [showInitialsList, setShowInitialsList] = useState(false);
  const [showInitialsModal, setShowInitialsModal] = useState(false);
  const [selectedInitialsPath, setSelectedInitialsPath] = useState(null);

  const [initialsX, setInitialsX] = useState(0);
  const [initialsY, setInitialsY] = useState(0);
  const [initialsWidthSize, setInitialsWidthSize] = useState(
    80 * signatureRatio
  );
  const [initialsHeightSize, setInitialsHeightSize] = useState(80);
  const [initialsArrayBuffer, setInitialsArrayBuffer] = useState(null);

  // Image import states
  const [showImageSelection, setShowImageSelection] = useState(false);
  const [imagePath, setImagePath] = useState();
  const [imageArrayBuffer, setImageArrayBuffer] = useState();
  const [imageX, setImageX] = useState(0);
  const [imageY, setImageY] = useState(0);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);

  // Text import states
  const [textList, setTextList] = useState([]);

  const [showTextModal, setShowTextModal] = useState(false);
  const [showTextList, setShowTextList] = useState(false);

  // Checkbox import states
  const [showCheckbox, setShowCheckbox] = useState(false);
  const [checkboxPositionX, setCheckboxPositionX] = useState(0);
  const [checkboxPositionY, setCheckboxPositionY] = useState(0);
  const [checkboxSize, setCheckboxSize] = useState(25);

  function showPaywall() {
    // editingPalette?.current.close();
    navigation.navigate("Paywall");
  }

  function toggleText(idx) {
    const updatedTextList = [...textList];
    updatedTextList[idx] = {
      ...updatedTextList[idx],
      visible: !updatedTextList[idx].visible,
    };

    setTextList(updatedTextList);
  }

  function showSignature() {
    try {
      if (showSignaturePanResponder && selectedSignaturePath)
        return (
          <Signature
            setShowSignaturePanResponder={setShowSignaturePanResponder}
            selectedSignaturePath={selectedSignaturePath}
            setCoordinateX={setCoordinateX}
            setCoordinateY={setCoordinateY}
            elementSizeWidth={elementSizeWidth}
            setElementSizeWidth={setElementSizeWidth}
            elementSizeHeight={elementSizeHeight}
            setElementSizeHeight={setElementSizeHeight}
          />
        );
    } catch (err) {
      showMessage({
        message: "Please try to insert object again.",
        description: err.toString(),
        type: "danger",
        duration: 4000,
      });
    }
  }

  return (
    <SafeAreaView className="flex-1">
      <StatusBar style="dark" />
      <View className="flex-row items-center justify-between m-2">
        <TouchableOpacity
          className="flex-row items-center p-1 mx-1 rounded-lg"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color="black" />
          <Text className="text-lg mx-1">Back</Text>
        </TouchableOpacity>

        <View className="flex-row items-center">
          <TouchableOpacity
            className={`flex-row items-center p-1 mx-1 bg-[#7851A9] rounded-lg`}
            onPress={() => setIsNamingModal(true)}
          >
            <MaterialIcons name="save-alt" size={24} color="white" />
            <Text className="mx-2 text-lg text-white">Save</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center p-1 mx-1 border-[1px] border-gray-500 rounded-lg"
            onPress={() => selectPrinter(setSelectedPrinter)}
          >
            <MaterialCommunityIcons
              name="printer-eye"
              size={24}
              color="black"
            />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center p-1 mx-1 border-[1px] border-gray-500 rounded-lg"
            onPress={() => printDocument(pickedDocument, selectedPrinter)}
          >
            <FontAwesome name="print" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-1 mt-10">
        <Pdf
          source={source}
          minScale={1.0}
          maxScale={1.0}
          scale={1.0}
          spacing={0}
          fitPolicy={0}
          enablePaging={true}
          style={{ width: displayWidth, height: displayHeight }}
          onLoadComplete={(pages, path, { height, width }) => {
            // Taking crucial metrics for saving the elements on the pdf
            console.log("pdf_height:", height, ":", "pdf_width:", width);
            console.log("pdf_ratio:", (height / width).toFixed(2));

            setPdfHeight(height);
            setPdfWidth(width);
            setPageRatio((height / width).toFixed(2));

            console.log(
              "display_height:",
              displayWidth * (height / width).toFixed(2),
              ":",
              "display_width:",
              displayWidth
            );

            console.log(
              "display_ratio:",
              (
                (displayWidth * (height / width).toFixed(2)) /
                displayWidth
              ).toFixed(2)
            );

            console.log("diff_in_displays:", (width / displayWidth).toFixed(2));
            setDiffInDisplays((width / displayWidth).toFixed(2));
          }}
          onPageChanged={(page, numOfPages) => {
            console.log("Current Page", page);
            setCurrPage(page);
          }}
          onPageSingleTap={(page, x, y) => {}}
          onError={(error) => {
            console.log(error);
          }}
          onPressLink={(uri) => {
            console.log(`Link pressed: ${uri}`);
          }}
        >
          {showSignaturePanResponder && showSignature()}
          {showDatePanResponder ? (
            <DateTime
              date={date}
              setDate_x={setDate_x}
              setDate_y={setDate_y}
              dateSize={dateSize}
              setDateSize={setDateSize}
              setShowDatePanResponder={setShowDatePanResponder}
            />
          ) : null}

          {showInitials && (
            <Initials
              setShowInitials={setShowInitials}
              selectedInitialsPath={selectedInitialsPath}
              setInitialsX={setInitialsX}
              setInitialsY={setInitialsY}
              initialsWidthSize={initialsWidthSize}
              setInitialsWidthSize={setInitialsWidthSize}
              initialsHeightSize={initialsHeightSize}
              setInitialsHeightSize={setInitialsHeightSize}
            />
          )}

          {showImageSelection && (
            <ImageSelection
              imagePath={imagePath}
              setImageX={setImageX}
              setImageY={setImageY}
              imageWidth={imageWidth}
              setImageWidth={setImageWidth}
              imageHeight={imageHeight}
              setImageHeight={setImageHeight}
              setShowImageSelection={setShowImageSelection}
            />
          )}

          {textList &&
            textList.map((item, idx) => (
              <TextField
                key={idx}
                index={idx}
                textInstance={item}
                textList={textList}
                setTextList={setTextList}
              />
            ))}

          {showCheckbox && (
            <Checkbox
              setShowCheckbox={setShowCheckbox}
              setCheckboxPositionX={setCheckboxPositionX}
              setCheckboxPositionY={setCheckboxPositionY}
              checkboxSize={checkboxSize}
              setCheckboxSize={setCheckboxSize}
            />
          )}
        </Pdf>
      </View>

      {isNamingModal && (
        <SaveDocument
          isNamingModal={isNamingModal}
          setIsNamingModal={setIsNamingModal}
          showSignaturePanResponder={showSignaturePanResponder}
          pickedDocument={pickedDocument}
          currPage={currPage}
          coordinateX={coordinateX}
          coordinateY={coordinateY}
          pageRatio={pageRatio}
          pdfWidth={pdfWidth}
          pdfHeight={pdfHeight}
          diffInDisplays={diffInDisplays}
          elementSizeWidth={elementSizeWidth}
          elementSizeHeight={elementSizeHeight}
          setEditedPdfPath={setEditedPdfPath}
          setPdfBase64={setPdfBase64}
          signatureArrayBuffer={signatureArrayBuffer}
          pdfArrayBuffer={pdfArrayBuffer}
          navigation={navigation}
          editingPalette={editingPalette}
          // Date props
          date={date}
          date_x={date_x}
          date_y={date_y}
          dateSize={dateSize}
          showDatePanResponder={showDatePanResponder}
          // Initials props
          showInitials={showInitials}
          initialsX={initialsX}
          initialsY={initialsY}
          initialsWidthSize={initialsWidthSize}
          initialsHeightSize={initialsHeightSize}
          initialsArrayBuffer={initialsArrayBuffer}
          // Image props
          showImageSelection={showImageSelection}
          imageX={imageX}
          imageY={imageY}
          imageWidth={imageWidth}
          imageHeight={imageHeight}
          imageArrayBuffer={imageArrayBuffer}
          // Text props
          textList={textList}
          // Checkbox props
          showCheckbox={showCheckbox}
          checkboxPositionX={checkboxPositionX}
          checkboxPositionY={checkboxPositionY}
          checkboxSize={checkboxSize}
        />
      )}

      {showSignatureModal && (
        <AddSignatureModal
          navigation={navigation}
          showSignatureModal={showSignatureModal}
          setShowSignatureModal={setShowSignatureModal}
        />
      )}

      {showInitialsModal && (
        <AddInitialsModal
          navigation={navigation}
          showInitialsModal={showInitialsModal}
          setShowInitialsModal={setShowInitialsModal}
        />
      )}

      {showTextModal && (
        <AddTextModal
          showTextModal={showTextModal}
          setShowTextModal={setShowTextModal}
          textList={textList}
          setTextList={setTextList}
        />
      )}

      <BottomSheetModal
        ref={editingPalette}
        index={0}
        snapPoints={snapPoints}
        enableHandlePanningGesture={false}
        enableDynamicSizing={false}
        backdropComponent={(props) => (
          <BottomSheetBackdrop {...props} enableTouchThrough={true} />
        )}
        enableOverDrag={false}
        enablePanDownToClose={false}
      >
        <View className="flex-row items-center justify-between px-3 pb-6">
          {showSignatures ? (
            <View className="flex-row mt-2">
              <View className="flex-row items-start mt-2">
                <TouchableOpacity
                  onPress={() => setShowSignatures((curr) => !curr)}
                  className="bg-slate-50 border-slate-400 border-solid border-2 rounded-lg p-4 mx-1"
                >
                  <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity
                  onPress={() => setShowSignatureModal(true)}
                  className="bg-slate-50 mt-2 border-slate-400 border-solid border-2 rounded-lg p-4 mx-1"
                >
                  <FontAwesome6 name="add" size={24} color="black" />
                </TouchableOpacity>

                <View className="flex-row items-start mt-2">
                  {signatureList.map((path, idx) => (
                    <View
                      key={idx}
                      className="flex-row items-start mx-1 bg-slate-50 border-slate-300 border-dashed border-2 rounded-lg"
                    >
                      <TouchableOpacity
                        onPress={() =>
                          selectSignature(
                            path,
                            setShowSignaturePanResponder,
                            selectedSignaturePath,
                            setSelectedSignaturePath,
                            setSignatureArrayBuffer
                          )
                        }
                        className="flex-row p-1"
                      >
                        <Image
                          key={path + idx}
                          className="h-12 w-20"
                          source={{ uri: path }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          deleteSignature(path, signatureList, setSignatureList)
                        }
                      >
                        <Ionicons name="close" size={20} color="black" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          ) : showInitialsList ? (
            <View className="flex-row mt-2">
              <View className="flex-row items-start mt-2">
                <TouchableOpacity
                  onPress={() => setShowInitialsList((curr) => !curr)}
                  className="bg-slate-50 border-slate-400 border-solid border-2 rounded-lg p-4 mx-1"
                >
                  <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity
                  onPress={() => setShowInitialsModal(true)}
                  className="bg-slate-50 mt-2 border-slate-400 border-solid border-2 rounded-lg p-4 mx-1"
                >
                  <FontAwesome6 name="add" size={24} color="black" />
                </TouchableOpacity>

                <View className="flex-row items-start mt-2">
                  {initialsList.map((path, idx) => (
                    <View
                      key={`initials_${idx}`}
                      className="flex-row items-start mx-1 bg-slate-50 border-slate-300 border-dashed border-2 rounded-lg"
                    >
                      <TouchableOpacity
                        onPress={() =>
                          selectInitials(
                            path,
                            setShowInitials,
                            selectedInitialsPath,
                            setSelectedInitialsPath,
                            setInitialsArrayBuffer
                          )
                        }
                        className="flex-row p-1"
                      >
                        <Image
                          key={path}
                          className="h-12 w-20"
                          source={{ uri: path }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          deleteInitials(path, initialsList, setInitialsList)
                        }
                      >
                        <Ionicons name="close" size={20} color="black" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          ) : showTextList ? (
            <View className="flex-row mt-2">
              <View className="flex-row items-start mt-2">
                <TouchableOpacity
                  onPress={() => setShowTextList((curr) => !curr)}
                  className="bg-slate-50 border-slate-400 border-solid border-2 rounded-lg p-4 mx-1"
                >
                  <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity
                  onPress={() => setShowTextModal(true)}
                  className="bg-slate-50 mt-2 border-slate-400 border-solid border-2 rounded-lg p-4 mx-1"
                >
                  <FontAwesome6 name="add" size={24} color="black" />
                </TouchableOpacity>

                <View className="flex-row mt-2">
                  {textList.map((item, idx) => (
                    <View
                      key={idx}
                      className="mx-1 bg-slate-50 border-slate-300 border-dashed border-2 rounded-lg"
                    >
                      <TouchableOpacity
                        onPress={() => toggleText(idx)}
                        className="justify-center p-2 h-14"
                      >
                        <Text>{item.text}</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row gap-2"
            >
              <View className="flex-row items-center justify-center">
                <TouchableOpacity
                  className="bg-gray-200 items-center justify-center rounded-full mt-3 py-3 px-10"
                  onPress={() => setShowSignatures((curr) => !curr)}
                >
                  <FontAwesome6 name="signature" size={24} color="black" />
                  <Text>Sign</Text>
                </TouchableOpacity>
              </View>

              <View className="flex-row items-center justify-center">
                <TouchableOpacity
                  className="bg-gray-200 items-center justify-center rounded-full mt-3 py-3 px-10"
                  onPress={() => setShowDatePanResponder((curr) => !curr)}
                >
                  <MaterialIcons name="date-range" size={24} color="black" />
                  <Text>Date</Text>
                </TouchableOpacity>
              </View>

              <View className="flex-row items-center justify-center">
                <TouchableOpacity
                  className="bg-gray-200 items-center justify-center rounded-full mt-3 py-3 px-10"
                  onPress={() =>
                    isProMember ? setShowInitialsList(true) : showPaywall()
                  }
                >
                  <MaterialIcons name="draw" size={24} color="black" />
                  <Text>Initials</Text>
                </TouchableOpacity>
              </View>

              <View className="flex-row items-center justify-center">
                <TouchableOpacity
                  className="bg-gray-200 items-center justify-center rounded-full mt-3 py-3 px-10"
                  onPress={() =>
                    isProMember ? setShowTextList(true) : showPaywall()
                  }
                >
                  <Ionicons name="text-sharp" size={24} color="black" />
                  <Text>Text</Text>
                </TouchableOpacity>
              </View>

              <View className="flex-row items-center justify-center">
                <TouchableOpacity
                  className="bg-gray-200 items-center justify-center rounded-full mt-3 py-3 px-10"
                  onPress={() =>
                    isProMember
                      ? selectImage(
                          setImagePath,
                          setImageArrayBuffer,
                          setShowImageSelection
                        )
                      : showPaywall()
                  }
                >
                  <Ionicons name="image" size={24} color="black" />
                  <Text>Image</Text>
                </TouchableOpacity>
              </View>

              <View className="flex-row items-center justify-center">
                <TouchableOpacity
                  className="bg-gray-200 items-center justify-center rounded-full mt-3 py-3 px-10"
                  onPress={() =>
                    isProMember
                      ? setShowCheckbox((curr) => !curr)
                      : showPaywall()
                  }
                >
                  <FontAwesome name="check-square-o" size={24} color="black" />
                  <Text>Check</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      </BottomSheetModal>
    </SafeAreaView>
  );
}
