import { invoke } from '@forge/bridge';
import ForgeReconciler, { Text } from '@forge/react';
import React, { StrictMode, useEffect, useState } from 'react';

const App = () => {
  const [data, setData] = useState('');

  useEffect(() => {
    invoke<string>('getText', { example: 'my-invoke-variable' }).then(setData);
  }, []);

  return (
    <>
      <Text>Hello world!</Text>
      <Text>{data ? data : 'Loading...'}</Text>
    </>
  );
};

ForgeReconciler.render(
  <StrictMode>
    <App />
  </StrictMode>
);
