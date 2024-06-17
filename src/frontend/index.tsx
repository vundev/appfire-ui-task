import ForgeReconciler from '@forge/react';
import React, { StrictMode } from 'react';
import { IssueLinkTable } from './components/IssueLinkTable/IssueLinkTable';

const App = () => {
  return (
    <>
      <IssueLinkTable></IssueLinkTable>
    </>
  );
};

ForgeReconciler.render(
  <StrictMode>
    <App />
  </StrictMode>
);
