import { RNOHContext, RNViewBase ,ViewBaseProps,Descriptor} from '@rnoh/react-native-openharmony';
import { RNC } from "@rnoh/react-native-openharmony/generated";
import { scanCore, scanBarcode, customScan } from '@kit.ScanKit';
// 导入功能涉及的权限申请、回调接口
import { router, promptAction, display } from '@kit.ArkUI';
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { common, abilityAccessCtrl } from '@kit.AbilityKit';
import { JSON } from '@kit.ArkTS';

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
  @State isShowBack: boolean = false
  @State isFlashLightEnable: boolean = false
  // 设置预览流高度，默认单位：vp
  @State cameraHeight: number = 640
  // 设置预览流宽度，默认单位：vp
  @State cameraWidth: number = 360
  @State cameraOffsetX: number = 0
  @State cameraOffsetY: number = 0
  @State zoomValue: number = 1
  @State setZoomValue: number = 1
  private mXComponentController: XComponentController = new XComponentController()
  private TAG: string = '[customScanPage]';
  private cleanUpCallbacks: (() => void)[] = [];
  private eventEmitter: RNC.NativeScan.EventEmitter | undefined = undefined
  async showScanResult(result: Array<scanBarcode.ScanResult>) {
    if (result.length > 0) {
      // 获取到扫描结果后暂停相机流
      customScan.stop().then(() => {
        hilog.info(0x0001, this.TAG, 'Succeeded in stopping customScan by promise!');
        this.isFlashLightEnable = false;
      }).catch((error: BusinessError) => {
        hilog.error(0x0001, this.TAG, `Failed to stop customScan by promise. Code: ${error.code}, message: ${error.message}`);
      })

      // // 使用toast显示出扫码结果
      // promptAction.showToast({
      //   message: JSON.stringify(result),
      //   duration: 5000
      // });
      this.onRead(JSON.stringify(result)) //返回结果
      this.isShowBack = true;
      this.isFlashLightEnable = false;


      try {
        customScan.release().then(() => {
         console.log('[Scan Sample]', 'release success!','click');
        }).catch((error: BusinessError) => {
          console.log( '[Scan Sample]', 'release failed business error: %{public}s', JSON.stringify(error),'click');
        });
      } catch (error) {
        console.log( '[Scan Sample]', 'release failed error: %{public}s', JSON.stringify(error),'click');
      }
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
    hilog.info(0x0001, this.TAG, 'reqPermissionsFromUser start');
    let context = getContext() as common.UIAbilityContext;
    let atManager = abilityAccessCtrl.createAtManager();
    let grantStatus = await atManager.requestPermissionsFromUser(context, ['ohos.permission.CAMERA']);
    return grantStatus.authResults;
  }

  // 申请相机权限
  async requestCameraPermission() {
    let grantStatus = await this.reqPermissionsFromUser();
    console.log(JSON.stringify(grantStatus),"click")
    for (let i = 0; i < grantStatus.length; i++) {
      if (grantStatus[i] === 0) {
        // 用户授权，可以继续访问目标操作
        console.log( this.TAG, 'Succeeded in getting permissions.');
        this.userGrant = true;

      }else{
        console.log('permissions fail  click')
      }
    }
  }

  setDisplay() {
    // 默认竖屏
    let displayClass = display.getDefaultDisplaySync();
    let width: number = px2vp(displayClass.width);
    let height: number = px2vp(displayClass.height);
    let maxLen: number = Math.max(width, height);
    let minLen: number = Math.min(width, height);
    const RATIO: number = 16 / 9;
    this.cameraHeight = maxLen;
    this.cameraWidth = maxLen / RATIO;
    this.cameraOffsetX = (minLen - this.cameraWidth) / 2;
  }
    //扫描结果
  onRead(result: string){
    this.eventEmitter!.emit("read",{result})
  }


  build() {
    Stack() {
     if(this.userGrant){
       XComponent({
         id: 'componentId',
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
             console.log( '[Scan Sample]', `start succeeded, ${JSON.stringify(scanResult)}`,'click');
             this.showScanResult(scanResult);
           }).catch((error: BusinessError) => {
             console.log( '[Scan Sample]', `start failed, code: ${error.code}, message: ${error.message}`,'click');
           });
           if(this.descriptor.props.zoom){
             customScan.setZoom(this.descriptor.props.zoom)
           }
         })
           // 预览流宽、高，默认单位vp，支持px、lpx、vp
         .height('100%')
         .width('100%')
         .position({ x: 0, y: 0 })
     }
    }
    .alignContent(Alignment.Bottom)
    .height('100%')
    .width('100%')
    .position({ x: 0, y: 0 })
  }
  aboutToAppear() {
    this.requestCameraPermission();
    this.setDisplay();
    this.eventEmitter = new RNC.NativeScan.EventEmitter(this.ctx.rnInstance, this.tag)
    this.descriptor = this.ctx.descriptorRegistry.getDescriptor<NativeScanDescriptor>(this.tag)
    //监听zoom
    console.log('click zoom',this.descriptor.props.zoom)
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




