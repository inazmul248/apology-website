// ==================== SPEECH DATA ====================
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

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize character
    const canvas = document.getElementById('characterCanvas');
    character = new Character(canvas);
    
    // Load initial speech
    loadSpeech(0);
    
    // Setup keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Setup audio (optional)
    tryPlayBackgroundMusic();
});

// ==================== SPEECH MANAGEMENT ====================
function loadSpeech(index) {
    if (index < 0 || index >= speeches.length) return;
    
    currentSpeechIndex = index;
    const speech = speeches[index];
    
    document.getElementById('speechTitle').textContent = speech.title;
    document.getElementById('speechContent').textContent = speech.text;
    document.getElementById('currentPart').textContent = index + 1;
    
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
    
    // Play slap sound
    playSound('slapSound');
    
    // Deal damage
    character.takeDamage();
    
    // Update UI
    updateDamageUI();
    
    // Check if forgive button should be enabled
    if (character.getDamagePercent() >= 50 && !canForgive) {
        canForgive = true;
        document.getElementById('forgiveBtn').disabled = false;
        
        // Add visual feedback
        document.getElementById('forgiveBtn').style.animation = 'pulse 0.5s ease';
        setTimeout(() => {
            document.getElementById('forgiveBtn').style.animation = '';
        }, 500);
    }
}

function updateDamageUI() {
    const damagePercent = character.getDamagePercent();
    document.getElementById('damagePercent').textContent = Math.round(damagePercent);
    document.getElementById('damageFill').style.width = damagePercent + '%';
}

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
    }, 500);
}

function createHeartParticles() {
    const particleCount = 30;
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
            
            setTimeout(() => heart.remove(), 2000);
        }, i * 50);
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
            audio.play().catch(err => console.log('Audio play failed:', err));
        }
    } catch (err) {
        console.log('Audio error:', err);
    }
}

function tryPlayBackgroundMusic() {
    try {
        const bgMusic = document.getElementById('backgroundMusic');
        if (bgMusic && bgMusic.src) {
            bgMusic.volume = 0.3;
            bgMusic.play().catch(err => console.log('Background music auto-play prevented'));
        }
    } catch (err) {
        console.log('Background music error:', err);
    }
}

// ==================== CANVAS CLICK EVENT ====================
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

// ==================== ADD PULSE ANIMATION ====================
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);