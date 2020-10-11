export default class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
  }

  onStart(event) {
    event.preventDefault();
    this.wrapper.addEventListener("mousemove", onMove);
  }

  onMove(event) {}

  onEnd(event) {
    // Retira o evento de movimentação do mouse
    this.wrapper.removeEventListener("mousemove", onMove);
  }

  addSlideEvents() {
    // MouseDown -> Evento onde exatamente ocorre um click
    this.wrapper.addEventListener("mousedown", this.onStart);
    // MouseUp -> Quando deixa de clicar o mouse, finalizando o evento
    this.wrapper.addEventListener("mousedown", this.onEnd);
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
