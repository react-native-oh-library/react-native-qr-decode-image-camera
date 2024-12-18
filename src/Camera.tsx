/*
 * Copyright (c) 2024 Huawei Device Co., Ltd. All rights reserved
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file.
 */

import React, { useState, useEffect } from 'react';
import {
  PixelRatio
} from "react-native";
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera'
export const ComponentCamera = (props) => {
  const CODE_TYPES = [
    'code-128',
    'code-39',
    'code-93',
    'codabar',
    'ean-13',
    'ean-8',
    'itf',
    'upc-e',
    'upc-a',
    'qr',
    'pdf-417',
    'aztec',
    'data-matrix'
  ]
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();

  if (!hasPermission) {
    requestPermission();
  }

  const codeScanner =   {  
      codeTypes: CODE_TYPES,
      onCodeScanned: (codes) => {
        // console.log(`Scanned ${codes.length} codes:`, codes)
        const value = codes[0]
        if (value) {
          props.onRead(value)
        } else {
          if (value == null) return
        }
      }
  }  


  return (
    <Camera
      isActive={props.isActive}
      preview={true}
      device={device}
      codeScanner={codeScanner}
      torch={props.torch ? "on" : "off"}
    /> 
  )
}