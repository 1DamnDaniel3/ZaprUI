export function playSound(src: string, volume = 1) {
    const audio = new Audio(src);
    audio.volume = volume;
    audio.play().catch(err => {
        console.warn('Ошибка воспроизведения звука:', err);
    });
}