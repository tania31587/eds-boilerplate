export default function decorate(block) {
  block.classList.add('banner');

  const rows = [...block.children];

  if (rows.length >= 4) {
    rows[0].classList.add('banner-image');
    rows[1].classList.add('banner-title');
    rows[2].classList.add('banner-description');
    rows[3].classList.add('banner-cta');
  }

  const link = block.querySelector('a');
  if (link) {
    link.classList.add('banner-button');
  }
}
