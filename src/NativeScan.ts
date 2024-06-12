import type { ViewProps } from "react-native/Libraries/Components/View/ViewPropTypes";
import type { HostComponent } from "react-native";
import type {
  BubblingEventHandler, Float, Int32,
} from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from "react-native/Libraries/Utilities/codegenNativeComponent";

type OnReadEvent = Readonly<{
  result: string;
}>

export interface NativeProps extends ViewProps {
  text?: string,
  onRead?: BubblingEventHandler<OnReadEvent>,
  flashMode?:boolean | null,
  zoom?:Float,
}

export default codegenNativeComponent<NativeProps>("NativeScan") as HostComponent<NativeProps>;