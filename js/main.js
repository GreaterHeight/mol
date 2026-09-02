/* MOL — Main JS */
document.addEventListener('DOMContentLoaded', () => {

  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });
  reveals.forEach(el => observer.observe(el));

  // Back to top
  const btt = document.getElementById('backToTop');
  if (btt) {
    window.addEventListener('scroll', () => { btt.style.opacity = window.scrollY > 600 ? '1' : '0'; btt.style.pointerEvents = window.scrollY > 600 ? 'auto' : 'none'; }, { passive: true });
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // Cookie banner
  const banner = document.getElementById('cookieBanner');
  const accept = document.getElementById('cookieAccept');
  const decline = document.getElementById('cookieDecline');
  if (banner) {
    if (!localStorage.getItem('mol_cookies')) banner.style.display = 'flex';
    [accept, decline].forEach(btn => btn && btn.addEventListener('click', () => { localStorage.setItem('mol_cookies', '1'); banner.style.display = 'none'; }));
  }

  // Form validation
  const form = document.querySelector('[data-validate]');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('[required]').forEach(field => {
        const group = field.closest('.form-group');
        const ok = field.type === 'checkbox' ? field.checked : field.value.trim() !== '';
        if (!ok) { group?.classList.add('error'); valid = false; } else { group?.classList.remove('error'); }
      });
      if (valid) {
        const success = form.querySelector('.form-success');
        if (success) { form.querySelectorAll('.form-group, button[type=submit]').forEach(el => el.style.display = 'none'); success.style.display = 'block'; }
      }
    });
    form.querySelectorAll('[required]').forEach(field => {
      field.addEventListener('input', () => field.closest('.form-group')?.classList.remove('error'));
    });
  }

  // Loan / Investment calculator
  function formatNaira(n) { return '₦' + Math.round(n).toLocaleString('en-NG'); }

  function calcLoan() {
    const p = parseFloat(document.getElementById('loanAmount')?.value) || 0;
    const r = parseFloat(document.getElementById('loanRate')?.value) / 100 / 12 || 0;
    const n = parseFloat(document.getElementById('loanTenor')?.value) * 12 || 0;
    const el = document.getElementById('loanResult');
    if (!el) return;
    if (p > 0 && r > 0 && n > 0) {
      const monthly = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
      el.innerHTML = `<div class="calc-result__label">Estimated Monthly Repayment</div><div class="calc-result__value">${formatNaira(monthly)}</div><div class="calc-result__note">Indicative only. Actual rates subject to credit assessment and prevailing CBN policy rate. [CBN LICENCE: PENDING — replace before launch]</div>`;
    } else {
      el.innerHTML = '';
    }
  }

  function calcInvest() {
    const p = parseFloat(document.getElementById('investAmount')?.value) || 0;
    const r = parseFloat(document.getElementById('investRate')?.value) / 100 || 0;
    const n = parseFloat(document.getElementById('investTenor')?.value) || 0;
    const el = document.getElementById('investResult');
    if (!el) return;
    if (p > 0 && r > 0 && n > 0) {
      const maturity = p * Math.pow(1 + r, n);
      const returns = maturity - p;
      el.innerHTML = `<div class="calc-result__label">Projected Maturity Value</div><div class="calc-result__value">${formatNaira(maturity)}</div><div class="calc-result__note">Projected returns: ${formatNaira(returns)}. Indicative only. Investment returns are not guaranteed. [Regulatory review required before publishing rates]</div>`;
    } else {
      el.innerHTML = '';
    }
  }

  // Calculator tabs
  document.querySelectorAll('.calc-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.calc-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById(tab.dataset.panel);
      if (panel) panel.classList.add('active');
    });
  });

  // Calculator inputs
  ['loanAmount','loanRate','loanTenor'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', calcLoan);
  });
  ['investAmount','investRate','investTenor'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', calcInvest);
  });

});
