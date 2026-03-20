# 📚 Phos: Sua estante, sua história.

> **Status do Projeto:** 🌕 Finalizado (Sprint de 7 Dias)

Phos (do grego, *luz*) é uma plataforma web para leitores brasileiros que une a organização do Goodreads e Skoob à estética minimalista do Letterboxd. O projeto foca em oferecer uma experiência visual para o registro de leituras, transformando dados em boas memórias.

- *Projeto desenvolvido para fins acadêmicos e de portfólio sob o handle @codebyfernanda.*

---

## 🚀 Tecnologias Utilizadas

Este projeto foi construído para fixação de fundamentos de desenvolvimento web:

* **Frontend:** HTML5, CSS3 (Flexbox & Grid)
* **Lógica:** JavaScript Vanilla (Manipulação de DOM e Fetch API)
* **Dados:** Integração com **Google Books API** & Persistência via **LocalStorage**

## 🛠️ Funcionalidades Principais

* **Busca Inteligente:** Integração em tempo real com a API global do Google Books.
* **Gerenciamento de Estante (CRUD):** Adição de livros com persistência local e gestão de status (*Lido, Lendo e Na Lista*).
* **Diário de Críticas:** Sistema de *rating* por estrelas e resenhas textuais personalizadas.

## 🎨 Design e Identidade Visual

A interface foi projetada para equilibrar o foco do "Azul Noturno" com o conforto do "Creme de Papel", remetendo às páginas de livros físicos e priorizando a legibilidade. Você pode acessar a Paleta de Cores, e outras imagens utilizadas ao longo do desenvolvimento do projeto, na pasta `assets`. 

| Elemento | Cor | Hex |
| :--- | :--- | :--- |
| **Primária** | Azul Noturno | `#1A1A40` |
| **Fundo** | Creme de Papel | `#FFFDF9` |
| **Destaque** | Amarelo Ouro | `#EBC04B` |

---

## ✅ Checklist de Implementação

- [X] **Interface:** Header com busca integrada e Footer institucional.
- [X] **Login:** Card de acesso centralizado com validação funcional.
- [X] **API:** Conexão robusta para extração de capas e metadados literários.
- [X] **Responsividade:** Adaptação completa para dispositivos mobile e desktop.
- [X] **Acessibilidade:** Design de alto contraste para garantir leitura fluida e inclusiva.

## 📅 Cronograma de Desenvolvimento (Sprints)

Trabalho estruturado em sprints para simular o fluxo de entrega de um ambiente ágil:

- [x] **Dia 1:** Estrutura base, Landing Page e Lógica de Login.
- [X] **Dia 2:** Integração com Google Books API e renderização de cards.
- [X] **Dia 3:** Implementação do CRUD com LocalStorage.
- [X] **Dia 4:** Sistema de Review & Rating (Estrelas).
- [X] **Dia 5:** Filtros por categoria.
- [X] **Dia 6:** Refinamento de UI/UX e Responsividade.
- [X] **Dia 7:** Documentação final e Deploy.

---

## 🤖 Limitações Encontradas & Trabalhos Futuros

Nesta versão do Phos, a persistência de dados é restrita ao localStorage do navegador, tornando as informações vulneráveis à limpeza de cache. Além disso, a API gratuita do Google Books apresentou restrições técnicas, como o retorno de obras sem capa ou com metadados incompletos. Devido ao escopo, os recursos de rede social foram adiados, priorizando a experiência de diário individual. 

Para trabalhos futuros, sugiro a implementação de um back-end com banco de dados em nuvem, funcionalidades de exportação do portfólio de leitura e a integração de interações sociais entre os usuários. Para facilitar a visualização do projeto, subi algumas capturas de tela na pasta `screenshots`, acesse. 

## 📸 Screenshot

*A imagem a seguir mostra a primeira tela (home), onde está localizado o login da aplicação.*

<img width="1919" height="909" alt="Phos-screenshot" src="https://github.com/user-attachments/assets/0eae6ac0-35d8-4f50-adc4-3befb880f281" />

---

## 👩🏻‍💻 Sobre Mim

Me chamo **Fernanda Bastos**, sou jornalista com mais de 6 anos de experiência (EXAME, TMDQA!) em transição para a tecnologia. Atualmente graduanda em **Análise e Desenvolvimento de Sistemas na Universidade Mackenzie**. Acredito que a tecnologia é uma ferramenta poderosa para gerar conexões (e códigos) com sentido.

📫 **Vamos nos conectar?**

* [LinkedIn](https://www.linkedin.com/in/hellofernandabastos/)
* [E-mail](mailto:hellofernandabastos@gmail.com)
