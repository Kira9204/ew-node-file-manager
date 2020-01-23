import React from 'react';
import { useHistory } from 'react-router';
import ListLoginPage from './ListLoginPage';
import {
  ContentTop as ContentTopStyle,
  LinkSpan,
  LoadingErrorIcon,
  LoadingSpinner,
  LoadingSpinnerText,
  LoadingWarningIcon
} from '../styles';
import { generateFileListingURL } from '../service';
import { useRootReducerProvider } from '../index';
import { TITLE_STR } from '../constants';

const ContentTop: React.FC = () => {
  const { state, dispatch } = useRootReducerProvider();
  const history = useHistory();
  const [showLoadingSpinner, setShowLoadingSpinner] = React.useState(false);

  //Delay the loading spinner
  React.useEffect(() => {
    setTimeout(() => {
      if (state.statusCode === 0) {
        setShowLoadingSpinner(true);
      } else {
        setShowLoadingSpinner(false);
      }
    }, 500);
  }, [showLoadingSpinner, state.statusCode]);


  if (state.statusCode === 401) {
    return <ListLoginPage state={state} dispatch={dispatch} />;
  }

  return (
    <ContentTopStyle>
      <h2>{TITLE_STR}</h2>
      <p>A private store for various files</p>
      {state.statusCode === 0 && (
        <div style={{ display: showLoadingSpinner ? 'block' : 'none' }}>
          <LoadingSpinner />
          <LoadingSpinnerText>
            GET {generateFileListingURL(state.fsLocation)}...
          </LoadingSpinnerText>
        </div>
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
    </ContentTopStyle>
  );
};

export default ContentTop;
