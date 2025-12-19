import s from './ElementLoader.module.scss';

export function ElementLoader() {
    const style = {
        width: String(Math.random() * 40 + 128) + 'px'
    }
    return (
        <div className={s.wrapper} style={style}>
            <div className={s.loader}></div>
        </div>
    )
}