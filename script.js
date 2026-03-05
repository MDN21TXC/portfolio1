// Year update
const yearSpan = document.getElementById("year");
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

const themeKey = "site-theme";
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const savedTheme = localStorage.getItem(themeKey);
const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
document.documentElement.setAttribute("data-theme", initialTheme);

// Initialize everything after DOM is ready
window.addEventListener("DOMContentLoaded", () => {
  // Initialize AOS
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100
    });
  }

  // Replace Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  // Theme Toggle
  const toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem(themeKey, next);
    });
  }

  // Back to Top Logic
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Tech Stack Toggle Logic (Improved)
  const techGrid = document.querySelector('.tech-grid');
  if (techGrid) {
    techGrid.addEventListener('click', (e) => {
      const item = e.target.closest('.tech-item');
      if (!item) return;

      const isActive = item.classList.contains('active');
      
      // Close all others in this grid
      const allItems = techGrid.querySelectorAll('.tech-item');
      allItems.forEach(i => i.classList.remove('active'));
      
      // Toggle current
      if (!isActive) {
        item.classList.add('active');
      }
    });
  }

  // Interests Toggle Logic (Improved)
  const interestsContainer = document.querySelector('.interests-container');
  if (interestsContainer) {
    interestsContainer.addEventListener('click', (e) => {
      const dropdown = e.target.closest('.interest-dropdown');
      if (!dropdown) return;

      const isActive = dropdown.classList.contains('active');
      
      // Close all others in this container
      const allDropdowns = interestsContainer.querySelectorAll('.interest-dropdown');
      allDropdowns.forEach(d => d.classList.remove('active'));
      
      // Toggle current
      if (!isActive) {
        dropdown.classList.add('active');
      }
    });
  }

  // Enhanced Background Motion (Mouse + Scroll)
  const blobs = document.querySelectorAll('.blob:not(.cursor-blob)');
  const cursorBlob = document.querySelector('.cursor-blob');
  
  let mouseX = 0;
  let mouseY = 0;
  let scrollY = window.scrollY;
  
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    if (cursorBlob) {
      cursorBlob.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    }
    
    const moveX = (mouseX / window.innerWidth - 0.5) * 60;
    const moveY = (mouseY / window.innerHeight - 0.5) * 60;
    
    blobs.forEach((blob, index) => {
      const factor = (index + 1) * 0.8;
      const currentScroll = window.scrollY * 0.1;
      blob.style.transform = `translate(${moveX * factor}px, ${moveY * factor + currentScroll}px)`;
    });
  });

  window.addEventListener('scroll', () => {
    const deltaScroll = window.scrollY - scrollY;
    scrollY = window.scrollY;
    
    blobs.forEach((blob, index) => {
      const factor = (index + 1) * 0.2;
      const scale = 1 + Math.abs(deltaScroll) * 0.005;
      const currentTransform = blob.style.transform;
      blob.style.transform = `${currentTransform} translateY(${deltaScroll * factor}px) scale(${scale})`;
      
      setTimeout(() => {
        blob.style.transform = currentTransform;
      }, 150);
    });
  });

  // Intersection Observer for active nav links
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav a");

  if (sections.length && navLinks.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) => {
              link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
            });
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0.01 }
    );
    sections.forEach((s) => observer.observe(s));
  }

  // Contact Form Handling
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = new FormData(contactForm);
      
      formStatus.textContent = "Sending...";
      formStatus.className = "form-status-message loading";

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          formStatus.textContent = "Thanks! Your message has been sent.";
          formStatus.className = "form-status-message success";
          contactForm.reset();
        } else {
          const errorData = await response.json();
          formStatus.textContent = errorData.errors ? errorData.errors.map(err => err.message).join(", ") : "Oops! There was a problem.";
          formStatus.className = "form-status-message error";
        }
      } catch (error) {
        formStatus.textContent = "Oops! There was a problem sending your message.";
        formStatus.className = "form-status-message error";
      }
    });
  }
});
