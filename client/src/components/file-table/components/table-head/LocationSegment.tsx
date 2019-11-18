import React from "react";
import { useHistory } from "react-router"
import {LinkSpan} from "../../styles";
import {pushNewHistoryLocation} from "../../../../service";

const LocationSegment: React.FC<{
  location: string;
}> = ({ location }) => {
  const history = useHistory();
  const splitted = location.split('/');
  let elements = [
    <span key={0}>
      <LinkSpan onClick={() => history.push('/')}>Home</LinkSpan>/
    </span>
  ];
  splitted.forEach((splitEL, index) => {
    if (splitEL === '') {
      return;
    }
    let path = '';
    for (let i = 0; i < index; i++) {
      path += '/' + splitted[i];
    }
    elements.push(
      <span key={path}>
        <LinkSpan onClick={() => pushNewHistoryLocation(path, history)}>{splitEL}</LinkSpan>/
      </span>
    );
  });

  return <>File path: /{elements}</>;
};

export default LocationSegment;
