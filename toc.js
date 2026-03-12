(() => {
  const tocLinks = Array.from(document.querySelectorAll('.policy-toc a[href^="#"]'));
  if (!tocLinks.length) return;

  const linkById = new Map();
  tocLinks.forEach((link) => {
    const targetId = decodeURIComponent(link.getAttribute('href').slice(1));
    if (targetId) linkById.set(targetId, link);
  });

  const sections = Array.from(linkById.keys())
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (!sections.length) return;

  const setActive = (id) => {
    tocLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  let currentId = null;
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (!visible.length) return;
      const nextId = visible[0].target.id;
      if (nextId && nextId !== currentId) {
        currentId = nextId;
        setActive(nextId);
      }
    },
    {
      rootMargin: '0px 0px -60% 0px',
      threshold: [0.1, 0.25, 0.5],
    }
  );

  sections.forEach((section) => observer.observe(section));

  window.addEventListener('hashchange', () => {
    const hashId = decodeURIComponent(window.location.hash.replace('#', ''));
    if (hashId && linkById.has(hashId)) setActive(hashId);
  });

  const initialId = decodeURIComponent(window.location.hash.replace('#', ''));
  if (initialId && linkById.has(initialId)) {
    setActive(initialId);
  } else if (sections[0]) {
    setActive(sections[0].id);
  }
})();
