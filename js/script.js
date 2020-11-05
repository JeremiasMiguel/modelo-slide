import SlideNav from "./slide.js";

const slide = new SlideNav(".slide", ".slide-wrapper");

slide.init();
slide.addArrow(".prev", ".next");

// Adicionando um custom control, agora a navegação muda de bolinhas para imagens 
// equivalentes, já captando o index e fazendo com que a navegação inferior suma
slide.addControl(".custom-controls");
