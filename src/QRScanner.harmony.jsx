import React, { Component } from "react";
import PropTypes from "prop-types";

import {
  StyleSheet,
  View,
  Text,
  Vibration,
  PixelRatio
} from "react-native";
import QRScannerView from "./QRScannerView";
import { ComponentCamera } from "./Camera";


export default class QRScannerHarmony extends Component {

  constructor(props) {
    super(props);
    this.state = {
      scanning: false,
      barCodeSize: {},
      isActive:true
    };
  }

  static defaultProps = {
    onRead: () => { },
    renderTopView: () => { },
    renderBottomView: () => (
      <View style={{ flex: 1, backgroundColor: "#0000004D" }} />
    ),
    rectHeight: 200,
    rectWidth: 200,
    flashMode: false, // Flashlight mode
    finderX: 0, // Viewfinder X-axis offset
    finderY: 0, // Viewfinder Y-axis offset
    zoom: 0.2, // Zoom range 0 - 1
    translucent: false,
    isRepeatScan: false,
    cameraType: "back",
    notAuthorizedView: () => (
      <View style={styles.authorizationContainer}>
        <Text style={styles.notAuthorizedText}>Camera not authorized</Text>
      </View>
    ),
    vibrate: true,
  };

  render() {

    return (
      <View
        style={{
          flex: 1
        }}
      >
        <ComponentCamera
          isRepeatScan={this.props.isRepeatScan}
          zoom={this.props.zoom}
          torch={this.props.flashMode}
          onRead={this._handleBarCodeRead}
          isActive={this.state.isActive}
        />
        <View style={[styles.topButtonsContainer, this.props.topViewStyle]}>
          {this.props.renderTopView()}
        </View>
        <QRScannerView
          maskColor={this.props.maskColor}
          cornerColor={this.props.cornerColor}
          borderColor={this.props.borderColor}
          rectHeight={this.props.rectHeight}
          rectWidth={this.props.rectWidth}
          borderWidth={this.props.borderWidth}
          cornerBorderWidth={this.props.cornerBorderWidth}
          cornerBorderLength={this.props.cornerBorderLength}
          cornerOffsetSize={this.props.cornerOffsetSize}
          isCornerOffset={this.props.isCornerOffset}
          bottomHeight={this.props.bottomHeight}
          scanBarAnimateTime={this.props.scanBarAnimateTime}
          scanBarColor={this.props.scanBarColor}
          scanBarHeight={this.props.scanBarHeight}
          scanBarMargin={this.props.scanBarMargin}
          hintText={this.props.hintText}
          hintTextStyle={this.props.hintTextStyle}
          scanBarImage={this.props.scanBarImage}
          hintTextPosition={this.props.hintTextPosition}
          isShowScanBar={this.props.isShowScanBar}
          finderX={this.props.finderX}
          finderY={this.props.finderY}
          returnSize={this.barCodeSize}
        />
        <View
          style={[styles.bottomButtonsContainer, this.props.bottomViewStyle]}
        >
          {this.props.renderBottomView()}
        </View>

      </View>
    )

  }

  isShowCode = false;

  barCodeSize = size => this.setState({ barCodeSize: size });

  returnMax = (a, b) => (a > b ? a : b);

  returnMin = (a, b) => (a < b ? a : b);


  harmonyBarCode(e) {
    const { x, y, width, height } = this.state.barCodeSize;
    const xInPx = PixelRatio.getPixelSizeForLayoutSize(x);
    const yInPx = PixelRatio.getPixelSizeForLayoutSize(y);
    const widthInPx = PixelRatio.getPixelSizeForLayoutSize(width);
    const heightInPx = PixelRatio.getPixelSizeForLayoutSize(height);
    const findXInPx = PixelRatio.getPixelSizeForLayoutSize(this.props.finderX);
    const findYInPx = PixelRatio.getPixelSizeForLayoutSize(this.props.finderY);
    let x_px = Number(e.frame.x);
    let y_px = Number(e.frame.y);
    let width_px = e.frame.width;
    let height_px = e.frame.height;
    let viewMinX = Number(xInPx - findXInPx);
    let viewMinY = yInPx - findYInPx;
    let viewMaxX = xInPx + widthInPx - width_px - findXInPx;
    let viewMaxY = yInPx + heightInPx - height_px - findYInPx;
    if (x_px > viewMinX && y_px > viewMinY && x_px < viewMaxX && y_px < viewMaxY) {
    if (this.props.isRepeatScan) {
      this.setState({ isActive: true});
      Vibration.vibrate();
      this.props.onRead(e);
    } else {
      if (!this.isShowCode) {
        this.isShowCode = true;
        this.setState({ isActive: false});
        Vibration.vibrate();
        this.props.onRead(e);
      }
    }
    }
  }


  _handleBarCodeRead = e => {
    this.harmonyBarCode(e);
  };
}

const styles = StyleSheet.create({
  topButtonsContainer: {
    position: "absolute",
    height: 100,
    top: 0,
    left: 0,
    right: 0
  },
  bottomButtonsContainer: {
    position: "absolute",
    height: 100,
    bottom: 0,
    left: 0,
    right: 0
  },
  authorizationContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  notAuthorizedText: {
    textAlign: "center",
    fontSize: 16
  }
});

QRScannerHarmony.propTypes = {
  isRepeatScan: PropTypes.bool,
  onRead: PropTypes.func,
  maskColor: PropTypes.string,
  borderColor: PropTypes.string,
  cornerColor: PropTypes.string,
  borderWidth: PropTypes.number,
  cornerBorderWidth: PropTypes.number,
  cornerBorderLength: PropTypes.number,
  rectHeight: PropTypes.number,
  rectWidth: PropTypes.number,
  isCornerOffset: PropTypes.bool, //Whether the corners are offset
  cornerOffsetSize: PropTypes.number,
  bottomHeight: PropTypes.number,
  scanBarAnimateTime: PropTypes.number,
  scanBarColor: PropTypes.string,
  scanBarImage: PropTypes.any,
  scanBarHeight: PropTypes.number,
  scanBarMargin: PropTypes.number,
  hintText: PropTypes.string,
  hintTextStyle: PropTypes.object,
  hintTextPosition: PropTypes.number,
  renderTopView: PropTypes.func,
  renderBottomView: PropTypes.func,
  isShowScanBar: PropTypes.bool,
  topViewStyle: PropTypes.object,
  bottomViewStyle: PropTypes.object,
  flashMode: PropTypes.bool,
  finderX: PropTypes.number,
  finderY: PropTypes.number,
  zoom: PropTypes.number,
  translucent: PropTypes.bool,
  cameraType: PropTypes.string,
  vibrate: PropTypes.bool,
};
