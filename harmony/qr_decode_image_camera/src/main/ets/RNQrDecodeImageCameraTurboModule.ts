import { TurboModule } from '@rnoh/react-native-openharmony/ts';
import { TM } from '@rnoh/react-native-openharmony/generated/ts';
import window from '@ohos.window';
import picker from '@ohos.file.picker';
import { scanCore, scanBarcode, detectBarcode ,generateBarcode,customScan } from '@kit.ScanKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { BusinessError } from '@kit.BasicServicesKit';



export class RNQrDecodeImageCameraTurboModule extends TurboModule implements TM.QrDecodeImageCameraNativeModule.Spec {
  windowClass:window.Window| undefined = undefined;
  isKeepScreenOn: boolean = true;
  unisKeepScreenOn: boolean = false;


  constructor(ctx) {
    super(ctx);
  }


  QRreader() {

    return new Promise ((resovle,reject)=>{
      // 定义识码参数options
      let options: scanBarcode.ScanOptions = {
        scanTypes: [scanCore.ScanType.ALL],
        enableMultiMode: true,
        enableAlbum: true
      }
      // 通过picker拉起图库的图片
      let photoOption = new picker.PhotoSelectOptions();
      photoOption.MIMEType = picker.PhotoViewMIMETypes.IMAGE_TYPE;
      photoOption.maxSelectNumber = 1;
      let photoPicker = new picker.PhotoViewPicker();
      photoPicker.select(photoOption).then((result) => {
        // 定义识码参数inputImage，其中uri为picker选择图片
        let inputImage: detectBarcode.InputImage = { uri: result.photoUris[0] }
        // 调用图片识码接口
        detectBarcode.decode(inputImage, options).then((result: Array<scanBarcode.ScanResult>) => {
         console.log( '[Scan Sample]', `Succeeded in getting ScanResult by promise with options, result is ${JSON.stringify(result)}`,'click success');
          resovle(result)
        }).catch((error: BusinessError) => {
          console.log( '[Scan Sample]', `Failed to get ScanResult by promise with options. Code: ${error.code}, message: ${error.message}`,"click fail");
          reject(error)
        });
      })
    })


    }





  }









