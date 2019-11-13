import React from 'react';
import {
  ContentTop,
  LinkSpan,
  LoadingErrorIcon,
  LoadingSpinner,
  LoadingSpinnerText,
  LoadingWarningIcon
} from './styles';
import {
  generateFileListingURL,
  loadPathData
} from './service';
import FileTable from './components/file-table';
import { ApplicationState, initialApplicationState, reducer } from './reducer';
import { useHistory } from 'react-router';
import FileDownloadPage from "./components/file-table/components/FileDownloadPage";

const ContentTopComponent: React.FC<{ state: ApplicationState }> = ({
  state
}) => {
  const history = useHistory();
  return (
    <ContentTop>
      <h2>$D3FF file explorer</h2>
      <p>A private store for various files</p>
      {state.statusCode === 0 && (
        <>
          <LoadingSpinner />
          <LoadingSpinnerText>
            GET {generateFileListingURL(state.fsLocation)}...
          </LoadingSpinnerText>
        </>
      )}
      {[404, 403].includes(state.statusCode) && (
        <>
          <LoadingWarningIcon /> <br />
          {state.statusMessage} <br />
          <LinkSpan onClick={() => history.push('/')}>Go home</LinkSpan>
        </>
      )}
      {![0, 404, 403, 200].includes(state.statusCode) && (
        <>
          <LoadingErrorIcon /> <br />
          {state.statusMessage} <br />
          <LinkSpan onClick={() => history.push('/')}>Go home</LinkSpan>
        </>
      )}
    </ContentTop>
  );
};

const App: React.FC = () => {
  const [state, dispatch] = React.useReducer(reducer, initialApplicationState);
  const history = useHistory();
  React.useEffect(() => {
    console.log('Pathname', history.location.pathname);
    loadPathData(history.location.pathname, dispatch);
  }, [history.location]);

  if (
    state.pathData &&
    state.pathData.files.length === 1 &&
    !state.pathData.files[0].isDirectory
  ) {
    return (
      <FileDownloadPage file={state.pathData.files[0]} history={history}/>
    );
  }

  return (
    <div>
      <ContentTopComponent state={state} />
      {state.statusCode === 200 && state.pathData && (
        <FileTable pathData={state.pathData} location={state.fsLocation} />
      )}
    </div>
  );
};

export default App;
