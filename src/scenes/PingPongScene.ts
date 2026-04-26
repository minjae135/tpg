import Phaser from 'phaser';

export class PingPongScene extends Phaser.Scene {
    private paddle1!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private paddle2!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private ball!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    
    private p1Score = 0;
    private p2Score = 0;
    private scoreText!: Phaser.GameObjects.Text;
    
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private wasd!: { W: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key };

    constructor() {
        super('PingPongScene');
    }

    create() {
        // 배경선 (네트)
        this.add.graphics()
            .lineStyle(2, 0xffffff, 0.5)
            .lineBetween(400, 0, 400, 600);

        // 점수 텍스트
        this.scoreText = this.add.text(400, 50, '0 : 0', {
            fontSize: '48px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // 패들 생성 (흰색 사각형 이미지 대신 그래픽 사용)
        this.paddle1 = this.createPaddle(30, 300);
        this.paddle2 = this.createPaddle(770, 300);

        // 공 생성
        this.ball = this.createBall(400, 300);

        // 입력 설정
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.wasd = this.input.keyboard!.addKeys('W,S') as any;

        // 충돌 설정
        this.physics.add.collider(this.ball, this.paddle1, this.handlePaddleCollision, undefined, this);
        this.physics.add.collider(this.ball, this.paddle2, this.handlePaddleCollision, undefined, this);

        // ESC 키로 메뉴 복귀
        this.input.keyboard?.on('keydown-ESC', () => {
            this.scene.start('MenuScene');
        });

        this.resetBall();
    }

    private createPaddle(x: number, y: number) {
        // 그래픽으로 패들 모양 생성 후 텍스처로 변환
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0xffffff);
        graphics.fillRect(0, 0, 20, 100);
        graphics.generateTexture(`paddle_${x}`, 20, 100);

        const paddle = this.physics.add.sprite(x, y, `paddle_${x}`);
        paddle.setImmovable(true);
        paddle.setCollideWorldBounds(true);
        return paddle;
    }

    private createBall(x: number, y: number) {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(10, 10, 10);
        graphics.generateTexture('ball', 20, 20);

        const ball = this.physics.add.sprite(x, y, 'ball');
        ball.setCollideWorldBounds(true);
        ball.setBounce(1, 1);
        
        // 상하단 벽 충돌 감지 (좌우는 점수 계산을 위해 통과하거나 직접 처리)
        (ball.body as Phaser.Physics.Arcade.Body).onWorldBounds = true;
        this.physics.world.on('worldbounds', (body: Phaser.Physics.Arcade.Body) => {
            if (body.gameObject === this.ball) {
                // 상하단 충돌은 반사되지만, 좌우단 충돌은 점수 처리
                const xPos = this.ball.x;
                if (xPos <= 10) {
                    this.p2Score++;
                    this.updateScore();
                    this.resetBall();
                } else if (xPos >= 790) {
                    this.p1Score++;
                    this.updateScore();
                    this.resetBall();
                }
            }
        });

        return ball;
    }

    private handlePaddleCollision() {
        // 패들에 닿을 때마다 속도 10% 증가
        const velocity = this.ball.body.velocity;
        this.ball.setVelocity(velocity.x * 1.1, velocity.y * 1.1);
    }

    private resetBall() {
        this.ball.setPosition(400, 300);
        const startX = Math.random() > 0.5 ? 300 : -300;
        const startY = (Math.random() - 0.5) * 400;
        this.ball.setVelocity(startX, startY);
    }

    private updateScore() {
        this.scoreText.setText(`${this.p1Score} : ${this.p2Score}`);
    }

    update() {
        // Player 1 조작 (W, S)
        if (this.wasd.W.isDown) {
            this.paddle1.setVelocityY(-400);
        } else if (this.wasd.S.isDown) {
            this.paddle1.setVelocityY(400);
        } else {
            this.paddle1.setVelocityY(0);
        }

        // Player 2 조작 (Up, Down)
        if (this.cursors.up.isDown) {
            this.paddle2.setVelocityY(-400);
        } else if (this.cursors.down.isDown) {
            this.paddle2.setVelocityY(400);
        } else {
            this.paddle2.setVelocityY(0);
        }
    }
}
