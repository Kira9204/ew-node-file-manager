import React from 'react';
import { loadPathData } from './service';
import FileTable from './components/file-table';
import { useHistory } from 'react-router';
import ContentTop from './components/ComponentTop';
import { TITLE_STR, useRootReducerProvider } from './index';

const App: React.FC = () => {
  const { state, dispatch } = useRootReducerProvider();
  const history = useHistory();

  React.useEffect(() => {
    console.log('Pathname', history.location.pathname);
    loadPathData(history.location.pathname, dispatch);
    window.document.title = TITLE_STR + ': ' + history.location.pathname;
  }, [dispatch, history.location]);

  /* This page is only useful if you don't want to manage files from the page atm
  if (
    state.pathData &&
    history.location.pathname !== '/' &&
    state.pathData.files.length === 1 &&
    !state.pathData.files[0].isDirectory
  ) {
    return (
      <FileDownloadPage file={state.pathData.files[0]} history={history} />
    );
  }
   */

  return (
    <div>
      <ContentTop />
      {state.statusCode === 200 && state.pathData && (
        <FileTable pathData={state.pathData} location={state.fsLocation} />
      )}
    </div>
  );
};

export default App;
