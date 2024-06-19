import { TurboModule } from '@rnoh/react-native-openharmony/ts';
import { TM } from '@rnoh/react-native-openharmony/generated/ts';
import window from '@ohos.window';
import picker from '@ohos.file.picker';
import { scanCore, scanBarcode, detectBarcode ,generateBarcode,customScan } from '@kit.ScanKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { BusinessError } from '@kit.BasicServicesKit';

interface IPath {
  uri:string
}

export class RNQrDecodeImageCameraTurboModule extends TurboModule implements TM.QrDecodeImageCameraNativeModule.Spec {
  windowClass:window.Window| undefined = undefined;
  isKeepScreenOn: boolean = true;
  unisKeepScreenOn: boolean = false;

  constructor(ctx) {
    super(ctx);
  }


QRreader(path: TM.QrDecodeImageCameraNativeModule.IPath): Promise<unknown> {

    return new Promise ((resovle,reject)=>{
      // 定义识码参数options
      let options: scanBarcode.ScanOptions = {
        scanTypes: [scanCore.ScanType.ALL],
        enableMultiMode: true,
        enableAlbum: true
      }
      // 调用图片识码接口
      detectBarcode.decode(path, options).then((result: Array<scanBarcode.ScanResult>) => {
        console.log( '[Scan Sample]', `Succeeded in getting ScanResult by promise with options, result is ${JSON.stringify(result)}`,'click success');
        resovle(result)
      }).catch((error: BusinessError) => {
        console.log( '[Scan Sample]', `Failed to get ScanResult by promise with options. Code: ${error.code}, message: ${error.message}`,"click fail");
        reject(error)
      });
    })

}




  }






