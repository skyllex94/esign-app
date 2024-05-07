{
  loadScannedDocs ? (
    filteredScanList.length > 0 ? (
      filteredScanList.map((doc, idx) =>
        doc.path.includes(".pdf") ? (
          <TouchableOpacity
            onPress={
              isEditDocument
                ? () => {
                    setIsEditDocument(false);
                    navigation.navigate("DocumentEditor", {
                      pickedDocument: doc.path,
                    });
                  }
                : () =>
                    navigation.navigate("DocumentScanPreview", {
                      doc,
                    })
            }
            className={`h-40 w-[30%] bg-white border-[0.5px] border-gray-300 rounded-lg`}
            key={idx}
          >
            <View className="flex-1 items-center justify-center rounded-lg pt-5">
              <MaterialIcons name="picture-as-pdf" size={44} color="black" />
            </View>

            <View className="flex-2 items-center gap-1 my-1">
              <Text className="text-gray-800">
                {truncate(removeExtension(doc.name), 30)}
              </Text>

              <View>
                <Text className="text-gray-400">
                  {new Date(doc.created * 1000).toLocaleDateString()}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("DocumentScanDetails", { doc })
              }
              className="absolute right-0 m-2"
            >
              <Feather name="more-horizontal" size={24} color="#b7b7b7" />
            </TouchableOpacity>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setScanPath(doc.path);
              updateList(
                doc.path,
                setScanPath,
                setScanList,
                setFilteredScanList
              );
            }}
            className={`h-40 w-[30%] bg-white border-[0.5px] border-gray-300 rounded-lg`}
            key={idx}
          >
            <View className="flex-1 items-center justify-center rounded-lg pt-5">
              <MaterialCommunityIcons name="folder" size={50} color="black" />
            </View>

            <View className="flex-2 items-center gap-1 my-1">
              <Text className="text-gray-800">
                {truncate(removeExtension(doc.name), 30)}
              </Text>

              <View>
                <Text className="text-gray-400">
                  {new Date(doc.created * 1000).toLocaleDateString()}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("FolderScanDetails", { doc })}
              className="absolute right-0 m-2"
            >
              <Feather name="more-horizontal" size={24} color="#b7b7b7" />
            </TouchableOpacity>
          </TouchableOpacity>
        )
      )
    ) : (
      <View className="flex-1 pt-8 items-center justify-center">
        <LottieView
          autoPlay
          speed={0.5}
          ref={astronautRef}
          style={{ width: 250, height: 130 }}
          source={require("../../assets/lottie/scan_astronaut.json")}
        />
        <Text className="text-gray-500 mt-2">
          {scanList.length > 0
            ? "Nothing Found"
            : docList.length > 0
            ? "No Documents Here"
            : "No Documents Here, Either"}
        </Text>
      </View>
    )
  ) : (
    <View className="flex-1 mt-6 items-center justify-center">
      <ActivityIndicator size={"small"} />
    </View>
  );
}
