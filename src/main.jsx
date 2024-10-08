import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import { Provider } from 'react-redux'
import { store } from './store/store.js'
import { BrowserRouter } from 'react-router-dom'
createRoot(document.getElementById('root')).render(
<Provider store={store}>
    <BrowserRouter> 
      <App />
    </BrowserRouter>
  </Provider>,

)



// LIMITATIONS
// # The image loading takes some time to render this can be improved
// # error handling is not the best , it can be more comprehensive
// # Even Though the website is quite responsive, it can user Interface is mobile screens can be improved.
// # The code is not modular, all of the website is displayed in a single component but due to time constraints single components is used.
// # In the details section if any field is empty in the api response for a Product , the value of that field is empty in the UI as well 
// (above point is not such a critical limitation but nevertheless the UI/UX will improve if this limitation is resolved)