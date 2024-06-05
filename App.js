import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Platform} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState, useRef } from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import DomToImage from 'dom-to-image';

import ImageViewer from './components/ImageViewer';
import Button from './components/Button';
import IconButton from './components/IconButton';
import CircleButton from './components/CircleButton';
import EmojiPicker from './components/EmojiPicker';
import EmojiList from './components/EmojiList';
import EmojiSticker from './components/EmojiSticker';

const PlaceholderImage = require('./assets/images/background-image.png');

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAppOptions, setShowAppOptions] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pickedEmoji, setPickedEmoji] = useState(null);
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const imageRef = useRef();
  const onReset = () => {
    setShowAppOptions(false);
  };
  const onAddSticker = () => {
    setIsModalVisible(true);
  }
  const onModalClose = () => {
    setIsModalVisible(false);
  }
  const onSaveImageAsync = async () => {
    if (Platform.OS !== 'web'){
      try{
        const localUri = await captureRef(imageRef, {
          format: 'png',
          height: 440,
          quality: 1,
        });
  
        await MediaLibrary.saveToLibraryAsync(localUri);
        if (localUri){
          alert('Image saved to gallery!');
        }
      }
      catch (e){
        console.log(e);
      }
    }
    else{
      try {
        const dataUrl = await DomToImage.toJpeg(imageRef.current, {
          quality: 0.95,
          width: 320,
          height: 440,
      });

      let link = document.createElement('a');
      link.download = 'sticker-smash-image.jpeg';
      link.href = dataUrl;
      link.click();
    } catch (e){
      console.log(e);
    }
  }
}
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.cancelled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    }
    else{
      alert('You did not select an image.');
    }
  }

  if (status === null){
    requestPermission();
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style = {styles.imagecontainer}>
        <View ref={imageRef} collapsable={false}>
          <ImageViewer PlaceholderImageSource={PlaceholderImage} selectedImage={selectedImage}/>
          {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji}/>}
        </View>
      </View>
    {showAppOptions ? (
      <View style={styles.optionsContainer}>
        <View style={styles.optionsRow}>
          <IconButton icon="refresh" label="Reset" onPress={onReset}/>
          <CircleButton onPress={onAddSticker}/>
          <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync}/>
        </View>
      </View> 
      ) : (
        <View style={styles.footerContainer}>
          <Button label="Choose a Photo" theme="primary" onPress={pickImageAsync}/>
          <Button label="Use this Photo" onPress={() => setShowAppOptions(true)}/>
        </View>
      )}
      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose}/>
      </EmojiPicker>
      <StatusBar style="light" />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imagecontainer: {
    flex: 1,
    paddingTop: 80,
  },
  footerContainer: {
    flex: 1/3,
    alignItems: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection:  'row',
  },
});
