document.addEventListener('DOMContentLoaded', () => {

  // ── Hamburger menu (all pages) ──
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  // ── Homepage only ──
  const heroPhotoZone = document.getElementById('heroPhotoZone');
  const heroPhotoInput = document.getElementById('hero-photo-input');
  const heroPhotoImg = document.getElementById('heroPhotoImg');
  const photoCaption = document.getElementById('photoCaption');

  if (heroPhotoZone) {
    heroPhotoZone.addEventListener('click', () => heroPhotoInput.click());
    heroPhotoInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        heroPhotoImg.src = ev.target.result;
        heroPhotoImg.style.display = 'block';
        photoCaption.style.display = 'block';
        heroPhotoZone.style.display = 'none';
      };
      reader.readAsDataURL(file);
    });
  }

  const overlay = document.getElementById('overlay');
  if (overlay) {
    const openModalBtn = document.getElementById('openModalBtn');
    const heroCtaBtn = document.getElementById('heroCtaBtn');
    const modalClose = document.getElementById('modalClose');

    if (openModalBtn) openModalBtn.addEventListener('click', () => overlay.classList.add('open'));
    if (heroCtaBtn) heroCtaBtn.addEventListener('click', () => overlay.classList.add('open'));
    if (modalClose) modalClose.addEventListener('click', closeModal);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

    function resetForm() {
      document.getElementById('modalForm').style.display = 'block';
      document.getElementById('modalSuccess').style.display = 'none';
      document.querySelector('input[placeholder="First & last"]').value = '';
      document.querySelector('input[placeholder="Best way to reach you"]').value = '';
      document.querySelector('textarea').value = '';
      document.getElementById('dzPreview').src = '';
      document.getElementById('dzPreview').style.display = 'none';
      document.getElementById('dzInner').style.display = 'block';
      document.getElementById('dropZone').classList.remove('filled');
      const submitBtn = document.getElementById('submitBtn');
      submitBtn.textContent = 'Send for Review';
      submitBtn.disabled = false;
    }

    function closeModal() {
      overlay.classList.remove('open');
      setTimeout(resetForm, 400);
    }

    const dropZone = document.getElementById('dropZone');
    const modalFileInput = document.getElementById('modal-file-input');
    const dzPreview = document.getElementById('dzPreview');
    const dzSwap = document.getElementById('dzSwap');
    const dzInner = document.getElementById('dzInner');

    function loadImage(file) {
      if (!file || !file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = e => {
        dzPreview.src = e.target.result;
        dzPreview.style.display = 'block';
        dzInner.style.display = 'none';
        dropZone.classList.add('filled');
      };
      reader.readAsDataURL(file);
    }

    dropZone.addEventListener('click', () => modalFileInput.click());
    modalFileInput.addEventListener('change', e => loadImage(e.target.files[0]));
    dzSwap.addEventListener('click', e => { e.stopPropagation(); modalFileInput.click(); });
    dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag'));
    dropZone.addEventListener('drop', e => {
      e.preventDefault(); dropZone.classList.remove('drag');
      loadImage(e.dataTransfer.files[0]);
    });

    document.getElementById('submitBtn').addEventListener('click', async () => {
      const name = document.querySelector('input[placeholder="First & last"]').value;
      const contact = document.querySelector('input[placeholder="Best way to reach you"]').value;
      const description = document.querySelector('textarea').value;
      const photo = document.getElementById('dzPreview').src;

      if (!name || !contact) {
        alert('Please fill in your name and contact info.');
        return;
      }

      const submitBtn = document.getElementById('submitBtn');
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      try {
        const response = await fetch('https://formspree.io/f/mzdypodv', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name,
            contact: contact,
            description: description,
            photo: photo.startsWith('data:') ? 'Photo attached (base64)' : 'No photo uploaded'
          })
        });

        if (response.ok) {
          document.getElementById('modalForm').style.display = 'none';
          document.getElementById('modalSuccess').style.display = 'block';
        } else {
          alert('Something went wrong. Please try again.');
          submitBtn.textContent = 'Send for Review';
          submitBtn.disabled = false;
        }
      } catch (err) {
        alert('Something went wrong. Please try again.');
        submitBtn.textContent = 'Send for Review';
        submitBtn.disabled = false;
      }
    });

    document.getElementById('doneBtn').addEventListener('click', () => {
      closeModal();
      setTimeout(() => {
        document.getElementById('modalForm').style.display = 'block';
        document.getElementById('modalSuccess').style.display = 'none';
        document.querySelector('input[placeholder="First & last"]').value = '';
        document.querySelector('input[placeholder="Best way to reach you"]').value = '';
        document.querySelector('textarea').value = '';
        document.getElementById('dzPreview').src = '';
        document.getElementById('dzPreview').style.display = 'none';
        document.getElementById('dzInner').style.display = 'block';
        document.getElementById('dropZone').classList.remove('filled');
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.textContent = 'Send for Review';
        submitBtn.disabled = false;
      }, 400);
    });
  }

});
