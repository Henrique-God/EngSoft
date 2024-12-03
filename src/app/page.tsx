import './globals.css';  // Ensure this file contains your custom CSS.

const HomePage = () => {
  return (
    <div className="container">
      <h1>Bem-vindo(a) ao nosso site!</h1>
      <p>Esta é a página inicial, onde você pode explorar diversos recursos para entender melhor o combate e monitoramento do Aedes aegypti.</p>

      <section>
        <h2>Wiki</h2>
        <p>
          Em nossa seção <strong>Wiki</strong>, você encontrará todos os conceitos relacionados ao Aedes aegypti e dengue explicados de forma acessível. É o lugar ideal para aprender sobre o ciclo do mosquito, como ele se propaga e o impacto dessas doenças na saúde pública. Navegue por temas organizados de maneira simples para uma leitura fluida e compreensível.
        </p>
      </section>

      <section>
        <h2>Estatísticas</h2>
        <p>
          A seção <strong>Estatísticas</strong> oferece mapas interativos, onde você pode visualizar dados sobre os casos de dengue além das informações do <strong>SISAWEB</strong> sobre a infestação do Aedes aegypti. Esses mapas são ferramentas poderosas para monitorar a distribuição e evolução das doenças, facilitando a análise e o planejamento de ações preventivas e corretivas.
        </p>
      </section>
    </div>
  );
};

export default HomePage;
