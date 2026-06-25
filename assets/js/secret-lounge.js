const loungeCat = document.querySelector('.secret-lounge__cat-button');
const loungeBubble = document.querySelector('.secret-lounge__bubble');
let loungeBubbleTimer;

const showLoungeBubble = () => {
  if (!loungeCat || !loungeBubble) {
    return;
  }

  window.clearTimeout(loungeBubbleTimer);
  loungeBubble.classList.remove('is-visible');
  void loungeBubble.offsetWidth;

  window.requestAnimationFrame(() => {
    loungeBubble.classList.add('is-visible');
  });

  loungeBubbleTimer = window.setTimeout(() => {
    loungeBubble.classList.remove('is-visible');
  }, 2800);
};

loungeCat?.addEventListener('click', showLoungeBubble);
