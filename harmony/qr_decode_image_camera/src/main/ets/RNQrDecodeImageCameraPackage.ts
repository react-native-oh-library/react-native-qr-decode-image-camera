import { RNPackage, TurboModulesFactory } from '@rnoh/react-native-openharmony/ts';
import type { TurboModule, TurboModuleContext } from '@rnoh/react-native-openharmony/ts';
import { TM } from '@rnoh/react-native-openharmony/generated/ts'
import { RNQrDecodeImageCameraTurboModule } from './RNQrDecodeImageCameraTurboModule';

class RNQrDecodeImageCameraTurboModuleFactory extends TurboModulesFactory {
  createTurboModule(name: string): TurboModule | null {
    if (this.hasTurboModule(name)) {
      return new RNQrDecodeImageCameraTurboModule(this.ctx);
    }
    return null;
  }

  hasTurboModule(name: string): boolean {
    return name === TM.QrDecodeImageCameraNativeModule.NAME;
  }
}

export class RNQrDecodeImageCameraPackage extends RNPackage {
  createTurboModulesFactory(ctx: TurboModuleContext): TurboModulesFactory {
    return new RNQrDecodeImageCameraTurboModuleFactory(ctx);
  }
}