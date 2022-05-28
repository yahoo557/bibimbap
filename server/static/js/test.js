const fs = require('fs');
const path = require('path');
const THREE = require('three');
const program = require('commander');
const Canvas = require('canvas');
const { Blob, FileReader } = require('vblob');

// Patch global scope to imitate browser environment.
global.window = global;
global.Blob = Blob;
global.FileReader = FileReader;
global.THREE = THREE;
global.document = {
  createElement: (nodeName) => {
    if (nodeName !== 'canvas') throw new Error(`Cannot create node ${nodeName}`);
    const canvas = new Canvas(256, 256);
    // This isn't working — currently need to avoid toBlob(), so export to embedded .gltf not .glb.
    // canvas.toBlob = function () {
    //   return new Blob([this.toBuffer()]);
    // };
    return canvas;
  }
};