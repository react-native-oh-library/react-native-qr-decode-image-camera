/*
 * Copyright (c) 2024 Huawei Device Co., Ltd. All rights reserved
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file.
 */
 
import { RNOHContext ,ViewBaseProps,Descriptor} from '@rnoh/react-native-openharmony';
import { RNC } from "@rnoh/react-native-openharmony/generated";
import { scanCore, scanBarcode, customScan } from '@kit.ScanKit';
import {  BusinessError } from '@kit.BasicServicesKit';
import { common, abilityAccessCtrl } from '@kit.AbilityKit';
import { JSON } from '@kit.ArkTS';
import  Logger  from "./Logger"
interface NativeScanProps extends ViewBaseProps {
  text: string,
  flashMode: boolean,
  onRead:(result:string) => void,
  zoom:number
}
export type  NativeScanDescriptor = Descriptor<"NativeScan", NativeScanProps>
  @Component
  export struct NativeScan {
  public static readonly NAME = RNC.NativeScan.NAME
  public ctx!: RNOHContext
  public tag: number = 0
  @State  @Watch("changeProps") descriptor: NativeScanDescriptor = {} as NativeScanDescriptor //监听闪光灯
  @State userGrant: boolean = false
  @State surfaceId: string = ''
  @State isFlashLightEnable: boolean = false
  // 设置预览流高度，默认单位：vp
  @State cameraHeight: number = 200
  // 设置预览流宽度，默认单位：vp
  @State cameraWidth: number = 200


  private mXComponentController: XComponentController = new XComponentController()
  private TAG: string = '[customScanPage]';
  private cleanUpCallbacks: (() => void)[] = [];
  private eventEmitter: RNC.NativeScan.EventEmitter | undefined = undefined
  async showScanResult(result: Array<scanBarcode.ScanResult>) {
    if (result.length > 0) {
      // 获取到扫描结果后暂停相机流
      customScan.stop().then(() => {
        Logger.info( this.TAG, 'Succeeded in stopping customScan by promise!');
      }).catch((error: BusinessError) => {
        Logger.error( this.TAG, `Failed to stop customScan by promise. Code: ${error.code}, message: ${error.message}`);
      })
      this.onRead(JSON.stringify(result)) //返回结果
    }
  }

  changeProps(){
    //监听闪光灯
    if(this.descriptor.props.flashMode === true){
      customScan.openFlashLight();
    }else if (this.descriptor.props.flashMode === false){
      customScan.closeFlashLight();
    }
  }

  async reqPermissionsFromUser(): Promise<number[]> {
    let context = getContext() as common.UIAbilityContext;
    let atManager = abilityAccessCtrl.createAtManager();
    let grantStatus = await atManager.requestPermissionsFromUser(context, ['ohos.permission.CAMERA']);
    return grantStatus.authResults;
  }

  // 申请相机权限
  async requestCameraPermission() {
    let grantStatus = await this.reqPermissionsFromUser();
    for (let i = 0; i < grantStatus.length; i++) {
      if (grantStatus[i] === 0) {
        // 用户授权，可以继续访问目标操作
        this.userGrant = true;

      }else{
        Logger.info('permissions fail')
      }
    }
  }

    //扫描结果
  onRead(result: string){
    this.eventEmitter!.emit("read",{result})
  }


  build() {

     if(this.userGrant){
       XComponent({
         id: 'component-nativeScan',
         type: 'surface',
         controller: this.mXComponentController
       })
         .onLoad( async () => {
           let options: scanBarcode.ScanOptions = {
             scanTypes: [scanCore.ScanType.ALL],
             enableMultiMode: true,
             enableAlbum: true
           }

           // 自定义初始化接口
           customScan.init(options);
           // 获取XComponent的surfaceId
           let surfaceId: string = this.mXComponentController.getXComponentSurfaceId();
           // 设置ViewControl相应字段
           let viewControl: customScan.ViewControl = {
             width: this.cameraWidth,
             height: this.cameraHeight,
             surfaceId: surfaceId
           };
           customScan.start(viewControl).then((scanResult: Array<scanBarcode.ScanResult>) => {
             console.log("click``````````")
             Logger.info( '[Scan Sample]', `start succeeded, ${JSON.stringify(scanResult)}`,'click');
             this.showScanResult(scanResult);
           }).catch((error: BusinessError) => {
             Logger.info( '[Scan Sample]', `start failed, code: ${error.code}, message: ${error.message}`,'click');
           });
           if(this.descriptor.props.zoom){
             customScan.setZoom(this.descriptor.props.zoom)
           }
         })
     }

  }
  aboutToAppear() {
    this.requestCameraPermission();
    this.eventEmitter = new RNC.NativeScan.EventEmitter(this.ctx.rnInstance, this.tag)
    this.descriptor = this.ctx.descriptorRegistry.getDescriptor<NativeScanDescriptor>(this.tag)
    this.cleanUpCallbacks.push(this.ctx.descriptorRegistry.subscribeToDescriptorChanges(this.tag,
      (newDescriptor) => {
        this.descriptor = (newDescriptor as NativeScanDescriptor)
      }
    ))
    this.cleanUpCallbacks.push(this.ctx.componentCommandReceiver.registerCommandCallback(this.tag, (commandName) => {

    }))
  }

  aboutToDisappear() {
    this.cleanUpCallbacks.forEach(cb => cb())
  }


}




