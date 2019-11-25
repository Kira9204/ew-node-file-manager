import React from 'react';
import { useHistory } from 'react-router';
import { LinkSpan } from '../../styles';
import { cleanUrl, pushNewHistoryLocation } from '../../../../service';
const LocationSegment: React.FC<{
  location: string;
}> = ({ location }) => {
  const history = useHistory();
  const cleanLocation = cleanUrl(location);
  const splitted = cleanLocation.split('/').slice(1); //First element will be empty string
  let elements = [
    <span key={0}>
      <LinkSpan onClick={() => pushNewHistoryLocation('/', history)}>
        Home
      </LinkSpan>
      /
    </span>
  ];
  for (let si = 0; si < splitted.length; si++) {
    let path = '';
    for (let i = -1; i < si; i++) {
      path += '/' + splitted[i+1];
    }
    elements.push(
      <span key={path}>
        <LinkSpan onClick={() => pushNewHistoryLocation(cleanUrl(path), history)}>
          {splitted[si]}
        </LinkSpan>
        /
      </span>
    );
  }
  return <>File path: /{elements}</>;
};

export default LocationSegment;
