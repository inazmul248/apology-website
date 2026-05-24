// ==================== CINEMATIC SPEECH DATA ====================
const speeches = [
    {
        title: "Part 1: The Responsibility",
        text: "Roja, I am sorry. I know every fault is mine. I did everything, and every mistake was created by me. I have been trying to find a way to say sorry to you for the last 2-3 months because I feel so much guilt. If I can't say this to you, I will never be able to forgive myself for the rest of my life. I know I did so many foul things and I hurt you so deeply. I know you are a girl with the softest heart, but I made you into a hard-hearted person because of my actions. I hate myself for changing the beautiful person you are."
    },
    {
        title: "Part 2: The Human Plea",
        text: "Every single human from Adam to now makes mistakes but people get a chance to fix what they broke. I am begging for that one chance. I want to live with you for my whole life. If I made the biggest mistake, please forgive me this one last time. If I ever do anything wrong again, or if I make a mistake without realizing it—instantly tell me. Teach me, guide me, and show me how to be better for you. I promise I will listen and learn."
    },
    {
        title: "Part 3: The Promise",
        text: "One last time I am Sorry Roja. If you never reply, I will be waiting for you. Please forgive me. I am so sorry. 💔 I will stand here in the silence, holding onto the memory of us, hoping that the echo of my sincerity reaches your heart. You mean everything to me, and I will spend the rest of my life trying to make things right."
    }
];

// ==================== GLOBAL VARIABLES ====================
let currentSpeechIndex = 0;
let character = null;
let canForgive = false;
let slapCount = 0;

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize character
    const canvas = document.getElementById('characterCanvas');
    character = new Character(canvas);
    
    // Load initial speech
    loadSpeech(0);
    
    // Setup keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Play background music
    tryPlayBackgroundMusic();
    
    // Create stars for victory screen
    createVictoryStars();
});

// ==================== SPEECH MANAGEMENT ====================
function loadSpeech(index) {
    if (index < 0 || index >= speeches.length) return;
    
    currentSpeechIndex = index;
    const speech = speeches[index];
    
    // Animate title change
    const titleElement = document.getElementById('speechTitle');
    titleElement.style.animation = 'none';
    setTimeout(() => {
        titleElement.textContent = speech.title;
        titleElement.style.animation = 'titleSlideIn 0.6s ease 0s forwards';
    }, 10);
    
    // Animate text change
    const textElement = document.getElementById('speechContent');
    textElement.style.animation = 'none';
    textElement.innerHTML = '';
    
    setTimeout(() => {
        textElement.innerHTML = `<p>${speech.text}</p>`;
        textElement.style.animation = 'textReveal 1s ease 0s forwards';
    }, 10);
    
    document.getElementById('currentPart').textContent = index + 1;
    
    // Update progress bar
    const progress = ((index + 1) / speeches.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    
    // Update button states
    document.getElementById('prevBtn').disabled = index === 0;
    document.getElementById('nextBtn').disabled = index === speeches.length - 1;
}

function nextSpeech() {
    if (currentSpeechIndex < speeches.length - 1) {
        loadSpeech(currentSpeechIndex + 1);
    }
}

function previousSpeech() {
    if (currentSpeechIndex > 0) {
        loadSpeech(currentSpeechIndex - 1);
    }
}

// ==================== SLAP FUNCTIONALITY ====================
function slapCharacter() {
    if (!character) return;
    
    slapCount++;
    
    // Play slap sound with variation
    playSound('slapSound');
    
    // Deal damage
    character.takeDamage();
    
    // Update UI
    updateDamageUI();
    
    // Screen shake effect
    screenShake();
    
    // Update slap count
    document.getElementById('slapCount').textContent = slapCount;
    
    // Check if forgive button should be enabled
    if (character.getDamagePercent() >= 50 && !canForgive) {
        canForgive = true;
        document.getElementById('forgiveBtn').disabled = false;
        
        // Unlock animation
        unlockForgiveButton();
    }
}

function updateDamageUI() {
    const damagePercent = character.getDamagePercent();
    document.getElementById('damagePercent').textContent = Math.round(damagePercent) + '%';
    
    const damageFill = document.getElementById('damageFill');
    damageFill.style.width = damagePercent + '%';
    
    // Add pulsing effect at certain damage levels
    if (damagePercent >= 75) {
        damageFill.style.animation = 'damagePulse 0.5s ease';
    }
}

// Screen shake effect
function screenShake() {
    const container = document.querySelector('.container');
    container.style.animation = 'none';
    
    setTimeout(() => {
        container.style.animation = 'shake 0.3s ease';
    }, 10);
}

// Add shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-8px); }
        75% { transform: translateX(8px); }
    }
    
    @keyframes damagePulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
    }
`;
document.head.appendChild(style);

// ==================== FORGIVE FUNCTIONALITY ====================
function forgiveCharacter() {
    if (!canForgive) return;
    
    // Play forgive sound
    playSound('forgiveSound');
    
    // Create heart particles
    createHeartParticles();
    
    // Show victory screen
    setTimeout(() => {
        document.getElementById('victoryScreen').classList.add('show');
    }, 300);
}

function createHeartParticles() {
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart-particle';
            heart.textContent = '💗';
            
            const startX = Math.random() * window.innerWidth;
            const startY = window.innerHeight / 2;
            
            heart.style.left = startX + 'px';
            heart.style.top = startY + 'px';
            
            document.body.appendChild(heart);
            
            setTimeout(() => heart.remove(), 2500);
        }, i * 30);
    }
}

// ==================== KEYBOARD SHORTCUTS ====================
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            slapCharacter();
        } else if (e.code === 'ArrowRight') {
            e.preventDefault();
            nextSpeech();
        } else if (e.code === 'ArrowLeft') {
            e.preventDefault();
            previousSpeech();
        } else if (e.code === 'Enter') {
            e.preventDefault();
            if (canForgive) forgiveCharacter();
        }
    });
}

// ==================== AUDIO HANDLING ====================
function playSound(elementId) {
    try {
        const audio = document.getElementById(elementId);
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(err => console.log('Audio play prevented'));
        }
    } catch (err) {
        console.log('Audio error:', err);
    }
}

function tryPlayBackgroundMusic() {
    try {
        const bgMusic = document.getElementById('backgroundMusic');
        if (bgMusic) {
            bgMusic.volume = 0.3;
            bgMusic.play().catch(err => console.log('Auto-play prevented'));
        }
    } catch (err) {
        console.log('Background music error:', err);
    }
}

// ==================== UNLOCK FORGIVE BUTTON ANIMATION ====================
function unlockForgiveButton() {
    const btn = document.getElementById('forgiveBtn');
    btn.style.animation = 'none';
    
    setTimeout(() => {
        btn.style.animation = 'unlockPulse 0.6s ease';
        
        // Add glow effect
        const glowStyle = document.createElement('style');
        glowStyle.textContent = `
            @keyframes unlockPulse {
                0% {
                    transform: scale(1);
                    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
                }
                50% {
                    transform: scale(1.08);
                    box-shadow: 0 15px 50px rgba(102, 126, 234, 0.8);
                }
                100% {
                    transform: scale(1);
                    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.5);
                }
            }
        `;
        document.head.appendChild(glowStyle);
    }, 10);
}

// ==================== CANVAS INTERACTION ====================
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('characterCanvas');
    
    canvas.addEventListener('click', () => {
        slapCharacter();
    });
    
    // Touch support for mobile
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        slapCharacter();
    });
});

// ==================== CREATE VICTORY STARS ====================
function createVictoryStars() {
    const starsContainer = document.querySelector('.victory-stars');
    
    for (let i = 0; i < 30; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = 2 + Math.random() * 2;
        const delay = Math.random() * 2;
        
        star.style.left = x + '%';
        star.style.top = y + '%';
        star.style.animationDelay = delay + 's';
        star.style.animationDuration = duration + 's';
        
        starsContainer.appendChild(star);
    }
}

// ==================== ADD DRAMATIC MUSIC CUE ====================
function addDramaticEffect() {
    // Add screen flash
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        z-index: 999;
        animation: dramaticFlash 0.3s ease;
        pointer-events: none;
    `;
    
    const flashStyle = document.createElement('style');
    flashStyle.textContent = `
        @keyframes dramaticFlash {
            0% { opacity: 0.5; }
            50% { opacity: 0.8; }
            100% { opacity: 0; }
        }
    `;
    document.head.appendChild(flashStyle);
    document.body.appendChild(flash);
    
    setTimeout(() => flash.remove(), 300);
}
