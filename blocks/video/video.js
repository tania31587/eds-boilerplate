export default function decorate(block) {
  const link = block.querySelector('a');

  if (!link) return;

  const url = new URL(link.href);

  let videoId = '';

  if (url.hostname.includes('youtube.com')) {
    videoId = url.searchParams.get('v');
  }

  if (videoId) {
    const iframe = document.createElement('iframe');

    iframe.src = `https://www.youtube.com/embed/${videoId}`;
    iframe.title = 'YouTube video';
    iframe.width = '100%';
    iframe.height = '500';
    iframe.allowFullscreen = true;

    block.innerHTML = '';
    block.appendChild(iframe);
  }
}
