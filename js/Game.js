import Konva from 'konva';

export default class Game {
  stage;
  objects = [];
  backgroundLayer;

  constructor(containerId) {
    this.stage = new Konva.Stage({
      container: containerId,
      width: 500,
      height: 500
    });
    this.backgroundLayer = new Konva.Layer();
  }

  addElementToBackground(element) {
    this.backgroundLayer.add(element);
  }

  redrawBackground() {
    this.backgroundLayer.draw();
  }
}
