import Selector from '../../components/selector'
import styles from './page.module.css'
export default function Page() {
  const items: {title: string, imgSrc: string}[] = [
    {title: "Wiki", imgSrc: "../../assets/forum-image.png"},
    {title: "Fórum", imgSrc: "https://placehold.jp/150x150.png"},
    {title: "Login", imgSrc: "https://placehold.jp/150x150.png"},
    {title: "Como me prevenir", imgSrc: "https://placehold.jp/150x150.png"},
    {title: "Faça uma denúncia", imgSrc: "https://placehold.jp/150x150.png"}
  ] 
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.mainTitle}>Situação Atual</h1>
      <img className={styles.mainImage} src="https://placehold.jp/150x150.png" alt="Graficos"/>
      <div className={styles.bottom}>
        <h1 className={styles.secondTitle}>Pesquise Também</h1>
        <div className={styles.imageWrapper}>
          {items.map((item, index)=>{
            return (
                <Selector key={index} text={item.title} img={item.imgSrc}></Selector>
            )
          })}
        </div>
      </div>
    </div>
    )
}