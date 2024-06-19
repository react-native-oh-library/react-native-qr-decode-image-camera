
import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { TurboModuleRegistry } from 'react-native';

interface IPath {
    uri:string;
}
export interface Spec extends TurboModule {
    QRreader: (path:IPath) => Promise<any>;
}   
 
export default TurboModuleRegistry.get<Spec>('QrDecodeImageCameraNativeModule') as Spec | null;