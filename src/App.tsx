import { Route, Routes } from 'react-router-dom';

import DocsPage from '@/pages/docs';
import IndexPage from '@/pages/index';

function App() {
  return (
    <>
      {process.env.NODE_ENV !== 'development' && (
        <script defer src="https://cloud.umami.is/script.js" data-website-id="a8815709-2029-4757-8ed5-73d504673629" />
      )}

      <Routes>
        <Route element={<IndexPage />} path="/" />
        <Route element={<DocsPage />} path="/docs" />
      </Routes>
    </>
  );
}

export default App;
