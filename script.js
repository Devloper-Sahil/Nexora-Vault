// ==========================================
// VROXIT GOD LEVEL PWA & NATIVE APP ENGINE
// ==========================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(() => console.log('Service Worker Registered Successfully!'))
      .catch((err) => console.log('Service Worker Failed:', err));
  });
}
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => console.log('Service Worker registered!', reg))
      .catch((err) => console.log('Service Worker failed:', err));
  });
}
let deferredPwaPrompt = null;
const isAppStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

window.addEventListener('DOMContentLoaded', () => {
    const installCard = document.getElementById('vroxitInstallCard');
    const installBtn = document.getElementById('godInstallBtn');
    const installDesc = document.getElementById('installDesc');

    if (isAppStandalone) {
        console.log("⚡ App is running in Native APK mode!");
    } else {
        console.log("🌐 App is running in Browser mode.");
    }

    // iOS Guide setup
    if (isIOS && !isAppStandalone) {
        if (installCard) installCard.style.display = 'block';
        if (installDesc) installDesc.innerText = "Tap Share (📤) -> 'Add to Home Screen'";
        if (installBtn) installBtn.innerText = "Guide";
    }

    // Disable pinch-zoom for native app feel
    document.addEventListener('gesturestart', (e) => e.preventDefault());
    
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) e.preventDefault();
        lastTouchEnd = now;
    }, false);
});

// Capture install prompt
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPwaPrompt = e;
    
    const installCard = document.getElementById('vroxitInstallCard');
    if (installCard && !isAppStandalone) {
        installCard.style.display = 'block';
    }
});

// Click handler for install button
document.addEventListener('click', async (e) => {
    if (e.target && e.target.id === 'godInstallBtn') {
        if (isIOS) {
            alert("iOS User: Safari browser ke share (📤) button par click karein aur phir 'Add to Home Screen' select karein.");
            return;
        }

        if (deferredPwaPrompt) {
            deferredPwaPrompt.prompt();
            const { outcome } = await deferredPwaPrompt.userChoice;
            
            if (outcome === 'accepted') {
                triggerSuccessFX();
            }
            deferredPwaPrompt = null;
            const installCard = document.getElementById('vroxitInstallCard');
            if (installCard) installCard.style.display = 'none';
        }
    }
});

window.addEventListener('appinstalled', () => {
    const installCard = document.getElementById('vroxitInstallCard');
    if (installCard) installCard.style.display = 'none';
    triggerSuccessFX();
    localStorage.setItem('vroxit_installed', 'true');
});

function triggerSuccessFX() {
    const notif = document.createElement('div');
    notif.style.cssText = "position:fixed; bottom:20px; right:20px; background:#00ffcc; color:#000; padding:12px 20px; font-weight:bold; border-radius:8px; z-index:9999; font-family:monospace; box-shadow: 0 0 15px rgba(0,255,204,0.5);";
    notif.innerText = "🚀 Vroxit OS Installed Successfully!";
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 4000);
}
```

---

### Step 3: `index.html` mein inka Connection Check Karein
Apni main `index.html` file ke **`<head>`** ke andar yeh link zaroor honi chahiye:
```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#0a0a0a">
```
Aur **`<body>`** ke andar jahan button dikhana hai wahan yeh HTML card ho:
```html
<div id="vroxitInstallCard" style="display: none; background: rgba(0, 255, 204, 0.05); border: 1px solid #00ffcc; padding: 15px; border-radius: 12px; margin: 20px 0; text-align: left; font-family: monospace;">
  <div style="display: flex; align-items: center; justify-content: space-between;">
    <div>
      <h3 style="color: #00ffcc; margin: 0 0 5px 0; font-size: 16px;">⚡ VROXIT SYSTEM OS</h3>
      <p id="installDesc" style="color: #ccc; font-size: 12px; margin: 0;">Install for offline access & speed.</p>
    </div>
    <button id="godInstallBtn" style="background: #00ffcc; color: #000; border: none; padding: 8px 15px; font-weight: bold; border-radius: 6px; cursor: pointer;">Install</button>
  </div>
</div>
```
Aur `<body>` ke bilkul last mein script file jude ho:
```html
<script src="/script.js"></script>
