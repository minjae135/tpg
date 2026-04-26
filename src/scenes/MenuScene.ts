import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        this.add.text(400, 100, '2인용 게임 모음', {
            fontSize: '48px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const games = [
            { id: 'PingPongScene', name: '핑퐁 (Ping Pong)' },
        ];

        games.forEach((game, index) => {
            const gameText = this.add.text(400, 250 + (index * 60), game.name, {
                fontSize: '32px',
                color: '#ffff00'
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

            gameText.on('pointerover', () => {
                gameText.setStyle({ color: '#ffffff' });
            });

            gameText.on('pointerout', () => {
                gameText.setStyle({ color: '#ffff00' });
            });

            gameText.on('pointerdown', () => {
                this.scene.start(game.id);
            });
        });

        this.add.text(400, 500, '원하는 게임을 클릭하세요', {
            fontSize: '18px',
            color: '#aaaaaa'
        }).setOrigin(0.5);
    }
}
