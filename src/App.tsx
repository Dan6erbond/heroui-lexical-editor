import { Route, Routes } from 'react-router-dom';

import DocsPage from '@/pages/docs';
import IndexPage from '@/pages/index';

function App() {
  return (
    <>
      <Routes>
        <Route element={<IndexPage />} path="/" />
        <Route element={<DocsPage />} path="/docs" />
      </Routes>
    </>
  );
}

export default App;
