// Live Markdown preview for the skill body editor. Pure client-side; the
// server only ever receives raw Markdown.
(function () {
  const textarea = document.getElementById('body');
  const preview = document.getElementById('preview');
  if (!textarea || !preview || !window.marked) return;

  function render() {
    const md = textarea.value;
    if (!md.trim()) {
      preview.innerHTML = '<em style="color: var(--text-faint);">Preview appears here as you type.</em>';
      return;
    }
    preview.innerHTML = window.marked.parse(md);
  }

  textarea.addEventListener('input', render);
  render();
})();
