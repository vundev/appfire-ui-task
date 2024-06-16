import { invoke } from '@forge/bridge';
import ForgeReconciler, { Text } from '@forge/react';
import React, { StrictMode, useEffect, useState } from 'react';
import { IssueLinkTable } from './components/IssueLinkTable/IssueLinkTable';
import { LinkedBug } from '../model/LinkedBug';

const App = () => {
  const [data, setData] = useState('');

  useEffect(() => {
    console.log('choku6')
    // invoke<string>('getText', { example: 'my-invoke-variable' }).then(setData);
    // invoke<string>('getText2', { id: 'id' }).then(setData);
    // invoke<any>('getComments', { issueId: 'SDP-1' })
    //   .then((data) => console.log(data));
    // invoke<LinkedBug[]>('getLinkedBugsByIssueId', { issueKey: 'SDP-1' })
    //   .then((data) => console.log(data));
  }, []);

  return (
    <>
      <Text>Hello world!</Text>
      <Text>{data ? data : 'Loading...'}</Text>
      <IssueLinkTable></IssueLinkTable>
    </>
  );
};

ForgeReconciler.render(
  <StrictMode>
    <App />
  </StrictMode>
);
