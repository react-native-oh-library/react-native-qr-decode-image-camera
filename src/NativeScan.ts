/*
 * Copyright (c) 2024 Huawei Device Co., Ltd. All rights reserved
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file.
 */

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