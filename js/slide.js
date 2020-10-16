export default class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
    this.dist = {
      finalPosition: 0,
      startX: 0,
      movement: 0
    }
  }

  // Adiciona o estilo CSS de movimentação, movendo o slide de acordo com o movimento
  // do mouse captado pelo dist.movement, com o método ONMOVE
  moveSlide(distX) {
    // Salvando a distância final para que o slide não comece toda hora do zero,
    // e sim da última posição após deixar de clicar o mouse
    this.dist.movePosition = distX;

    this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
  }

  updatePosition(clientX) {
    this.dist.movement = (this.dist.startX - clientX) * 1.6;
    return this.dist.finalPosition - this.dist.movement;
  }

  onStart(event) {
    let moveType;

    if(event.type === "mousedown") {
      event.preventDefault();
      // Capta o eixo X do clique do mouse na hora
      this.dist.startX = event.clientX;
      moveType = "mousemove";
    } else {
      this.dist.startX = event.changedTouches[0].clientX;
      moveType = "touchmove";
    }
    this.wrapper.addEventListener(moveType, this.onMove);
  }

  onMove(event) {
    const pointerPosition = (event.type === "mousemove") ? event.clientX : event.changedTouches[0].clientX;
    const finalPosition = this.updatePosition(pointerPosition);
    this.moveSlide(finalPosition);
  }

  onEnd(event) {
    const moveType = (event.type === "mouseup") ? "mousemove" : "touchmove";
    // Retira o evento de movimentação do mouse
    this.wrapper.removeEventListener("mousemove", this.onMove);
    // Ao finalizar o evento, salva a posição final do slide com o evento do mouse
    this.dist.finalPosition = this.dist.movePosition;
  }

  addSlideEvents() {
    // MouseDown -> Evento onde exatamente ocorre um click
    this.wrapper.addEventListener("mousedown", this.onStart);
    this.wrapper.addEventListener("touchstart", this.onStart);
    // MouseUp -> Quando deixa de clicar o mouse, finalizando o evento
    this.wrapper.addEventListener("mouseup", this.onEnd);
    this.wrapper.addEventListener("touchend", this.onEnd);
  }

  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  init() {
    this.bindEvents();
    this.addSlideEvents();
    return this;
  }
}
