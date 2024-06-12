
import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { TurboModuleRegistry } from 'react-native';


export interface Spec extends TurboModule {
    QRreader: () => Promise<any>;
}   
 
export default TurboModuleRegistry.get<Spec>('QrDecodeImageCameraNativeModule') as Spec | null;