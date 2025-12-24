export function playSound(src: string, volume = 1, soundState: boolean) {
    const audio = new Audio(src);
    audio.volume = soundState ? volume : 0;
    audio.play().catch(err => {
        console.warn('Ошибка воспроизведения звука:', err);
    });
}