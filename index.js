import QRscanner from './src/QRScanner'
import { NativeModules } from 'react-native';
import {Platform,TurboModuleRegistry} from "react-native"
var getQr =TurboModuleRegistry ? 
TurboModuleRegistry.get('QrDecodeImageCameraNativeModule') : NativeModules.QRScanReader;
const QRreader = (fileUrl)=>{
  if (Platform.OS == 'harmony') {
    return  getQr.QRreader()
   }else{
  var QRScanReader = NativeModules.QRScanReader;
  return QRScanReader.readerQR(fileUrl);      
   }
}


export {QRscanner, QRreader}