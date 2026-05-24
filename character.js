class Character {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.damage = 0; // 0-100
        this.bruises = [];
        this.tears = [];
        this.headTilt = 0;
        this.flinching = false;
        this.flinchTime = 0;
        
        this.centerX = canvas.width / 2;
        this.centerY = canvas.height / 2;
        
        this.animate();
    }

    update() {
        // Update head tilt
        this.headTilt *= 0.95;
        
        // Update flinch
        if (this.flinching) {
            this.flinchTime--;
            if (this.flinchTime <= 0) {
                this.flinching = false;
            }
        }
        
        // Update bruises
        this.bruises = this.bruises.filter(b => {
            b.opacity -= 0.02;
            return b.opacity > 0;
        });
        
        // Update tears
        this.tears = this.tears.filter(t => {
            t.y += 2;
            t.opacity -= 0.02;
            return t.opacity > 0 && t.y < this.canvas.height;
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.update();
        
        // Draw body
        this.drawBody();
        
        // Draw head
        this.drawHead();
        
        // Draw bruises
        this.drawBruises();
        
        // Draw tears
        this.drawTears();
    }

    drawBody() {
        const x = this.centerX;
        const y = this.centerY + 80;
        
        this.ctx.save();
        this.ctx.translate(x, this.centerY);
        this.ctx.rotate(this.headTilt * 0.3);
        this.ctx.translate(-x, -this.centerY);
        
        // Torso
        this.ctx.fillStyle = '#e8a6c4';
        this.ctx.fillRect(x - 30, y - 20, 60, 80);
        
        // Arms
        this.ctx.fillStyle = '#f0b8d0';
        this.ctx.fillRect(x - 50, y - 10, 20, 60);
        this.ctx.fillRect(x + 30, y - 10, 20, 60);
        
        this.ctx.restore();
    }

    drawHead() {
        const x = this.centerX;
        const y = this.centerY - 50;
        
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(this.headTilt);
        this.ctx.translate(-x, -y);
        
        // Head circle
        this.ctx.fillStyle = '#f5c9d8';
        this.ctx.beginPath();
        this.ctx.arc(x, y, 45, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Hair
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.beginPath();
        this.ctx.ellipse(x, y - 40, 50, 35, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Face details
        this.drawFace(x, y);
        
        this.ctx.restore();
    }

    drawFace(x, y) {
        // Eyes
        this.drawEyes(x, y);
        
        // Mouth
        this.drawMouth(x, y);
    }

    getExpression() {
        if (this.damage < 30) return 'normal';
        if (this.damage < 70) return 'sad';
        return 'hurt';
    }

    drawEyes(x, y) {
        const expression = this.getExpression();
        const eyeY = y - 10;
        const leftEyeX = x - 15;
        const rightEyeX = x + 15;
        
        // Eye whites
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(leftEyeX, eyeY, 8, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(rightEyeX, eyeY, 8, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Pupils
        this.ctx.fillStyle = '#000000';
        if (expression === 'sad' || expression === 'hurt') {
            // Sad eyes looking down
            this.ctx.beginPath();
            this.ctx.arc(leftEyeX, eyeY + 3, 5, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(rightEyeX, eyeY + 3, 5, 0, Math.PI * 2);
            this.ctx.fill();
        } else {
            // Normal eyes
            this.ctx.beginPath();
            this.ctx.arc(leftEyeX, eyeY, 5, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(rightEyeX, eyeY, 5, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Eyebrows
        this.ctx.strokeStyle = '#2c3e50';
        this.ctx.lineWidth = 2;
        
        if (expression === 'sad') {
            // Sad eyebrows
            this.ctx.beginPath();
            this.ctx.moveTo(leftEyeX - 10, eyeY - 12);
            this.ctx.lineTo(leftEyeX + 10, eyeY - 8);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(rightEyeX - 10, eyeY - 8);
            this.ctx.lineTo(rightEyeX + 10, eyeY - 12);
            this.ctx.stroke();
        } else if (expression === 'hurt') {
            // Angry/hurt eyebrows
            this.ctx.beginPath();
            this.ctx.moveTo(leftEyeX - 10, eyeY - 8);
            this.ctx.lineTo(leftEyeX + 10, eyeY - 12);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(rightEyeX - 10, eyeY - 12);
            this.ctx.lineTo(rightEyeX + 10, eyeY - 8);
            this.ctx.stroke();
        } else {
            // Normal eyebrows
            this.ctx.beginPath();
            this.ctx.moveTo(leftEyeX - 10, eyeY - 12);
            this.ctx.lineTo(leftEyeX + 10, eyeY - 12);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(rightEyeX - 10, eyeY - 12);
            this.ctx.lineTo(rightEyeX + 10, eyeY - 12);
            this.ctx.stroke();
        }
    }

    drawMouth(x, y) {
        const expression = this.getExpression();
        
        this.ctx.strokeStyle = '#d97c8c';
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
        
        if (expression === 'sad' || expression === 'hurt') {
            // Sad mouth
            this.ctx.beginPath();
            this.ctx.arc(x, y + 15, 12, 0, Math.PI);
            this.ctx.stroke();
        } else {
            // Happy/normal mouth
            this.ctx.beginPath();
            this.ctx.arc(x, y + 18, 10, Math.PI, 0);
            this.ctx.stroke();
        }
    }

    drawBruises() {
        this.bruises.forEach(bruise => {
            this.ctx.fillStyle = `rgba(150, 80, 100, ${bruise.opacity})`;
            this.ctx.beginPath();
            this.ctx.ellipse(bruise.x, bruise.y, bruise.width, bruise.height, bruise.rotation, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    drawTears() {
        this.tears.forEach(tear => {
            this.ctx.fillStyle = `rgba(173, 216, 230, ${tear.opacity})`;
            this.ctx.beginPath();
            this.ctx.ellipse(tear.x, tear.y, 3, 6, 0, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    addBruise() {
        const bruiseRadius = 20 + Math.random() * 15;
        this.bruises.push({
            x: this.centerX + (Math.random() - 0.5) * 60,
            y: this.centerY - 50 + (Math.random() - 0.5) * 80,
            width: bruiseRadius * (0.6 + Math.random() * 0.4),
            height: bruiseRadius * (0.7 + Math.random() * 0.4),
            rotation: Math.random() * Math.PI,
            opacity: 0.6
        });
    }

    addTear() {
        // Left eye tear
        this.tears.push({
            x: this.centerX - 15,
            y: this.centerY - 60,
            opacity: 1
        });
        
        // Right eye tear
        this.tears.push({
            x: this.centerX + 15,
            y: this.centerY - 60,
            opacity: 1
        });
    }

    takeDamage() {
        this.damage = Math.min(100, this.damage + 10);
        
        // Add visual feedback
        this.addBruise();
        this.flinching = true;
        this.flinchTime = 5;
        this.headTilt = (Math.random() - 0.5) * 0.3;
        
        // Add tears when sad
        if (this.damage > 30) {
            this.addTear();
        }
    }

    getDamagePercent() {
        return this.damage;
    }

    reset() {
        this.damage = 0;
        this.bruises = [];
        this.tears = [];
        this.headTilt = 0;
        this.flinching = false;
    }

    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}