import React from "react";
import { useHistory } from "react-router"
import {TableHeadArrowUpIcon} from "../../styles";
import { cleanUrl, pushNewHistoryLocation } from '../../../../service';

const LocationOneUp: React.FC<{
  location: string;
}> = ({ location }) => {
  const history = useHistory();
  const cleanLocation = cleanUrl(location);
  let splitted = cleanLocation.split('/').slice(1); //First element will be empty string
  splitted = splitted.filter((e) => e !== '');
  if (splitted.length === 0) {
    return <TableHeadArrowUpIcon className="fas fa-arrow-up" />;
  }

  let path = '';
  for (let i = 0; i < splitted.length - 1; i++) {
    path += '/' + splitted[i];
  }
  return (
    <TableHeadArrowUpIcon
      className="fas fa-arrow-up"
      onClick={() => pushNewHistoryLocation(cleanUrl(path), history)}
    />
  );
};

export default LocationOneUp
