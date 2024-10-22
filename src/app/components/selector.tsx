import styles from './selector.module.css'
export default function Selector(props: {img: string, text: string}){

    return (
        <div className={styles.wrapper}>
            <img src={props.img} className={styles.images}/>
            <p>{props.text}</p>
        </div>
    )

}