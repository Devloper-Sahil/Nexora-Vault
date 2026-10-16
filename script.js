// ==========================================
// VROXIT GOD LEVEL PWA & NATIVE APP ENGINE
// ==========================================

let deferredPwaPrompt = null;

// 1. Check karo ki app browser mein hai ya Installed App (Standalone APK jaisa) mode mein
const isAppStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

// 2. Detect iOS (iPhone/iPad)
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

window.addEventListener('DOMContentLoaded', () => {
    const installCard = document.getElementById('vroxitInstallCard');
    const installBtn = document.getElementById('godInstallBtn');
    const installDesc = document.getElementById('installDesc');

    // Console logs for debugging
    if (isAppStandalone) {
        console.log("⚡ App is running in Native APK mode (Standalone)!");
    } else {
        console.log("🌐 App is running in Browser mode.");
    }

    // 3. UI Setup for iOS Devices (Kyuki iOS direct install prompt support nahi karta)
    if (isIOS && !isAppStandalone) {
        if (installCard) installCard.style.display = 'block';
        if (installDesc) installDesc.innerText = "Tap Share (📤) -> 'Add to Home Screen'";
        if (installBtn) installBtn.innerText = "Guide";
    }

    // 4. Mobile par pinch-zoom aur double-tap zoom rokne ka logic (App jaisi smooth feel ke liye)
    document.addEventListener('gesturestart', function (e) {
        e.preventDefault();
    });

    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (e) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
});

// 5. Catch browser install prompt event
window.addEventListener('beforeinstallprompt', (e) => {
    // Browser ke default banner ko roko
    e.preventDefault();
    deferredPwaPrompt = e;
    
    const installCard = document.getElementById('vroxitInstallCard');
    // Agar app pehle se installed nahi hai, toh custom install card show karo
    if (installCard && !isAppStandalone) {
        installCard.style.display = 'block';
    }
});

// 6. Global Install Button Click Handler (Jo HTML mein hai)
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
                console.log('User accepted the install prompt');
                triggerSuccessFX();
            } else {
                console.log('User dismissed the install prompt');
            }
            deferredPwaPrompt = null;
            
            const installCard = document.getElementById('vroxitInstallCard');
            if (installCard) installCard.style.display = 'none';
        }
    }
});

// 7. App successfully install hone par ye chalega
window.addEventListener('appinstalled', () => {
    const installCard = document.getElementById('vroxitInstallCard');
    if (installCard) installCard.style.display = 'none';
    
    triggerSuccessFX();
    localStorage.setItem('vroxit_installed', 'true');
});

// 8. Cyberpunk Success Pop-up Notification FX
function triggerSuccessFX() {
    const notif = document.createElement('div');
    notif.style.cssText = "position:fixed; bottom:20px; right:20px; background:#00ffcc; color:#000; padding:12px 20px; font-weight:bold; border-radius:8px; z-index:9999; font-family:monospace; box-shadow: 0 0 15px rgba(0,255,204,0.5);";
    notif.innerText = "🚀 Vroxit OS Installed Successfully!";
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 4000);
}
