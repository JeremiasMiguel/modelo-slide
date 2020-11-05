import debounce from "./debounce.js";

export class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
    this.dist = {
      finalPosition: 0,
      startX: 0,
      movement: 0
    }
    this.activeClass = "active";
  }

  // Otimiza transição no slide
  transition(active) {
    this.slide.style.transition = active ? "transform .3s" : "";
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

    this.transition(false);
  }

  onMove(event) {
    const pointerPosition = (event.type === "mousemove") ? event.clientX : event.changedTouches[0].clientX;
    const finalPosition = this.updatePosition(pointerPosition);
    this.moveSlide(finalPosition);
  }

  onEnd(event) {
    const moveType = (event.type === "mouseup") ? "mousemove" : "touchmove";
    // Retira o evento de movimentação do mouse
    this.wrapper.removeEventListener(moveType, this.onMove);
    // Ao finalizar o evento, salva a posição final do slide com o evento do mouse
    this.dist.finalPosition = this.dist.movePosition;
    // Muda o slide quando finalizar a rolagem
    this.changeSlideOnEnd();

    this.transition(true);
  }

  changeSlideOnEnd() {
    // Verifica o movimento do mouse, se é negativo, irá para o slide anterior, se for positivo,
    // irá para o próximo
    if(this.dist.movement > 120 && this.index.next !== undefined) {
      this.activeNextSlide();
    } else if(this.dist.movement < -120 && this.index.prev !== undefined) {
      this.activePrevSlide();
    }
    // Se não for nenhum dos dois ativa o atual
    else {
      this.changeSlide(this.index.active);
    }
  }

  addSlideEvents() {
    // MouseDown -> Evento onde exatamente ocorre um click
    this.wrapper.addEventListener("mousedown", this.onStart);
    this.wrapper.addEventListener("touchstart", this.onStart);
    // MouseUp -> Quando deixa de clicar o mouse, finalizando o evento
    this.wrapper.addEventListener("mouseup", this.onEnd);
    this.wrapper.addEventListener("touchend", this.onEnd);
  }

  // SLIDE CONFIG

  slidePosition(slide) {
    const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
    // Valor exato para deixar a imagem do elemento do slide no centro
    return -(slide.offsetLeft - margin);
  }

  slidesConfig() {
    this.slideArray = [...this.slide.children].map((element) => {
      const position = this.slidePosition(element);
      return {
        position,
        element
      }
    })
  }

  // Verifica os elementos vizinhos do index ativo
  slidesIndexNav(index) {
    // Verifica tamanho total
    const last = this.slideArray.length - 1;

    this.index = {
      // Se o index for zero, o anterior é undefined
      prev: index ? index - 1 : undefined,
      active: index,
      // Se o elemento for o último, não há um depis, sendo definido assim como undefined
      next: index === last ? undefined : index + 1,
    }
  }

  changeSlide(index) {
    const activeSlide = this.slideArray[index]
    this.moveSlide(activeSlide.position);
    this.slidesIndexNav(index);
    this.dist.finalPosition = activeSlide.position;

    this.changeActiveClass();
  }

  // Adiciona a classe ativo na imagem atual
  changeActiveClass() {
    this.slideArray.forEach((item) => {
      item.element.classList.remove(this.activeClass);
    })
    this.slideArray[this.index.active].element.classList.add(this.activeClass);
  }

  activePrevSlide() {
    if(this.index.prev !== undefined) {
      this.changeSlide(this.index.prev);
    }
  }

  activeNextSlide() {
    if(this.index.next !== undefined) {
      this.changeSlide(this.index.next);
    }
  }

  // Evento para atualizar as dimensões dos slide e seus movimentos, quando houver
  // redimensionamento, de desktop para mobile e vice versa
  onResize() {
    setTimeout(() => {
      this.slidesConfig();
      this.changeSlide(this.index.active);
    }, 1000);
  }

  addResizeEvent() {
    window.addEventListener("resize", this.onResize);
  }

  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);

    // Debounce para o evento não disparar diversas vezes
    this.onResize = debounce(this.onResize.bind(this), 200);

    this.activePrevSlide = this.activePrevSlide.bind(this);
    this.activeNextSlide = this.activeNextSlide.bind(this);
  }

  init() {
    this.bindEvents();
    this.transition(true);
    this.addSlideEvents();
    this.slidesConfig();
    this.addResizeEvent();
    this.changeSlide(0);
    return this;
  }
}

// Classe extendida que conterá a navegação de anterior e próximo
export class SlideNav extends Slide {
  // Adiciona setas de anterior e próximo
  addArrow(prev, next) {
    this.prevElement = document.querySelector(prev);
    this.nextElement = document.querySelector(next);

    this.addArrowEvent();
  }

  addArrowEvent() {
    this.prevElement.addEventListener("click", this.activePrevSlide);
    this.nextElement.addEventListener("click", this.activeNextSlide);
  }
}
