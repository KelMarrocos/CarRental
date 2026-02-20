/*
  React 18 Root API

  createRoot substitui o antigo ReactDOM.render
  e habilita recursos modernos como:

  ✅ Concurrent Rendering
  ✅ Melhor performance
  ✅ Transições mais suaves
*/
import { createRoot } from 'react-dom/client'

/*
  Estilos globais do projeto.

  Aqui vivem:
  - Tailwind
  - tokens de design
  - resets
  - fontes
*/
import './index.css'

/*
  Componente principal da aplicação.

  Idealmente o App deve conter apenas:

  👉 Providers
  👉 Layout base
  👉 Rotas

  Evite lógica pesada nele.
*/
import App from './App.jsx'

/*
  React Router

  BrowserRouter usa a History API do navegador
  para criar navegação sem reload.

  Perfeito para SPAs.

  ⚠️ No futuro, se precisar de:
  - loading automático de rotas
  - data fetching
  - layouts aninhados
  - error boundaries

  Considere migrar para:

  👉 createBrowserRouter (Data Router)
*/
import { BrowserRouter } from 'react-router-dom'


/*
  Inicialização da aplicação.

  Boa prática:
  manter este arquivo EXTREMAMENTE simples.

  Ele deve ser apenas o bootstrap do React.
*/
createRoot(document.getElementById('root')).render(

  /*
    Router envolve TODA a aplicação
    para permitir uso de:

    - useNavigate
    - Link
    - useParams
    - nested routes
  */
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
