/*
  React 18 Root API

  A função createRoot substitui o antigo ReactDOM.render
  e ativa os recursos modernos do React 18, incluindo:

  - Concurrent Rendering
  - Melhor gerenciamento de atualização
  - Transições mais suaves
  - Melhor performance geral

  Este é o ponto de entrada da aplicação React.
*/
import { createRoot } from 'react-dom/client'

/*
  Estilos globais do projeto.

  Este arquivo normalmente contém:

  - Configuração do Tailwind CSS
  - Tokens de design (cores, espaçamentos, tipografia)
  - Reset ou normalize CSS
  - Importação de fontes globais

  Deve centralizar toda a base visual da aplicação.
*/
import './index.css'

/*
  Componente principal da aplicação.

  O App deve ser responsável apenas por:

  - Providers globais
  - Layout base
  - Definição de rotas

  Evite concentrar lógica pesada ou regras de negócio aqui.
  O ideal é delegar responsabilidades para páginas e serviços.
*/
import App from './App.jsx'

/*
  React Router

  BrowserRouter utiliza a History API do navegador
  para permitir navegação sem recarregamento da página,
  característica fundamental em aplicações SPA.

  Ele habilita o uso de:

  - <Link />
  - useNavigate()
  - useParams()
  - Rotas aninhadas

  Para aplicações mais complexas, pode-se considerar
  a utilização do Data Router (createBrowserRouter),
  que oferece suporte nativo a:

  - Data loading por rota
  - Error boundaries
  - Nested layouts
  - Controle avançado de carregamento
*/
import { BrowserRouter } from 'react-router-dom'

/*
  Provider global da aplicação.

  Responsável por expor estado compartilhado,
  contexto global e lógica transversal da aplicação.

  Exemplo de responsabilidades:
  - Usuário autenticado
  - Configurações globais
  - Carrinho
  - Tema
*/
import { AppProvider } from './context/AppContext.jsx'

/*
  Inicialização da aplicação.

  Este arquivo deve permanecer o mais simples possível.
  Sua única responsabilidade é fazer o bootstrap do React.

  Não adicione lógica de negócio aqui.
*/
createRoot(document.getElementById('root')).render(

  /*
    BrowserRouter envolve toda a aplicação
    para permitir navegação SPA em todos os componentes.

    AppProvider encapsula o estado global.

    App representa a estrutura principal da aplicação.
  */
  <BrowserRouter>
    <AppProvider>
      <App />
    </AppProvider>
  </BrowserRouter>,
)