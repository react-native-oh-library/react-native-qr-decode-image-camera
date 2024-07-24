import { TurboModule } from '@rnoh/react-native-openharmony/ts';
import { TM } from '@rnoh/react-native-openharmony/generated/ts';
import window from '@ohos.window';
import { scanCore, scanBarcode, detectBarcode  } from '@kit.ScanKit';
import { BusinessError } from '@kit.BasicServicesKit';
import Logger from "./Logger"

export class RNQrDecodeImageCameraTurboModule extends TurboModule implements TM.QrDecodeImageCameraNativeModule.Spec {

  constructor(ctx) {
    super(ctx);
  }

QRreader(path: TM.QrDecodeImageCameraNativeModule.IPath): Promise<unknown> {

    return new Promise ((resolve,reject)=>{
      // 定义识码参数options
      let options: scanBarcode.ScanOptions = {
        scanTypes: [scanCore.ScanType.ALL],
        enableMultiMode: true,
        enableAlbum: true
      }
      // 调用图片识码接口
      detectBarcode.decode(path, options).then((result: Array<scanBarcode.ScanResult>) => {
        Logger.info( '[Scan Sample]', `Succeeded in getting ScanResult by promise with options, result is ${JSON.stringify(result)}`,'click success');
        resolve(result)
      }).catch((error: BusinessError) => {
        Logger.info( '[Scan Sample]', `Failed to get ScanResult by promise with options. Code: ${error.code}, message: ${error.message}`,"click fail");
        reject(error)
      });
    })
}

  }






