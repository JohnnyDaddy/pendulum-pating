const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;
class Pendulum {
    constructor({ centerX, centerY, radiusX, radiusY, shrinkRate, twistAngle, shrinkAcceleration, minimumRadiusX, minimumRadiusY, angle, angularVelocity, currentTwist, strokeColor }) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.radiusX = radiusX;
        this.radiusY = radiusY;
        this.shrinkRate = shrinkRate;
        this.twistAngle = twistAngle;
        this.shrinkAcceleration = shrinkAcceleration;
        this.minimumRadiusX = minimumRadiusX;
        this.minimumRadiusY = minimumRadiusY;
        this.angle = angle; // 초기 각도
        this.angularVelocity = angularVelocity; // 각속도
        this.prevX = this.getX(); // 이전 X 좌표
        this.prevY = this.getY(); // 이전 Y 좌표
        this.currentTwist = currentTwist; // 현재 비틀어진 각도
        this.strokeColor = strokeColor;
    }

    update() {
        this.updateAngle();
        this.updateTwist();
        this.updateShrinkRate();
        this.updateRadii();
        this.draw();
    }

    updateAngle() {
        this.angle += this.angularVelocity;
    }

    updateTwist() {
        this.currentTwist += this.twistAngle / (2 * Math.PI / this.angularVelocity);
    }

    updateShrinkRate() {
        this.shrinkRate += this.shrinkAcceleration;
    }

    updateRadii() {
        this.radiusX = Math.max(this.minimumRadiusX, this.radiusX - this.shrinkRate);
        this.radiusY = Math.max(this.minimumRadiusY, this.radiusY - this.shrinkRate);
    }

    draw() {
        const currentX = this.getX();
        const currentY = this.getY();

        ctx.beginPath();
        ctx.moveTo(this.prevX, this.prevY);
        ctx.lineTo(currentX, currentY);
        ctx.strokeStyle = this.strokeColor;
        ctx.stroke();

        this.prevX = currentX;
        this.prevY = currentY;
    }

    getX() {
        return this.centerX + this.radiusX * Math.cos(this.angle) * Math.cos(this.currentTwist) - this.radiusY * Math.sin(this.angle) * Math.sin(this.currentTwist); // 현재 X 좌표 계산
    }

    getY() {
        return this.centerY + this.radiusX * Math.cos(this.angle) * Math.sin(this.currentTwist) + this.radiusY * Math.sin(this.angle) * Math.cos(this.currentTwist); // 현재 Y 좌표 계산
    }
}

const pendulums = [
    new Pendulum({ centerX: canvas.width / 2, centerY: canvas.height / 2, radiusX: 420, radiusY: 200, shrinkRate: 0.015, twistAngle: 0.06, shrinkAcceleration: 0.000002, minimumRadiusX: 10, minimumRadiusY: 10, angle: 0, angularVelocity: 0.05, currentTwist: 0, strokeColor: 'white' }),
    new Pendulum({ centerX: 500, centerY: 200, radiusX: 300, radiusY: 150, shrinkRate: 0.02, twistAngle: 0.05, shrinkAcceleration: 0.000003, minimumRadiusX: 20, minimumRadiusY: 20, angle: 30, angularVelocity: 0.04, currentTwist: 30, strokeColor: 'yellow' }),
    new Pendulum({ centerX: 200 / 2, centerY: 400, radiusX: 500, radiusY: 250, shrinkRate: 0.03, twistAngle: 0.07, shrinkAcceleration: 0.0000025, minimumRadiusX: 100, minimumRadiusY: 100, angle: 30, angularVelocity: 0.06, currentTwist: 60, strokeColor: 'orange' }),
];

function animate() {    
    pendulums.forEach(pendulum => pendulum.update());
    requestAnimationFrame(animate);
}

animate();

document.getElementById('downloadBtn').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'pendulum.jpg';
    link.href = canvas.toDataURL('image/jpeg');
    link.click();
});