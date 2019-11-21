import React from 'react';
import { FileStatInfo } from '../reducer';
import { generateDownloadURL } from '../service';
import { ContentTop, LinkSpan } from '../styles';
import { Link } from './file-table/styles';
import { formatFileSize, formatMTime } from './file-table/utils';
import { TITLE_STR } from '../index';

const FileDownloadPage: React.FC<{ file: FileStatInfo; history: any }> = ({
  file,
  history
}) => {
  const downloadURL = generateDownloadURL(history.location.pathname);

  return (
    <ContentTop>
      <h2>{TITLE_STR}</h2>
      <h4>
        Download file:{' '}
        <Link
          id="downloadLink"
          href={downloadURL}
          style={{ textDecoration: 'underline' }}
        >
          {file.name}
        </Link>
      </h4>
      <br />
      Size: {formatFileSize(file.size)}
      <br />
      Modified: {formatMTime(file.modifiedTimeUTC)}
      <p>
        <LinkSpan
          onClick={() => {
            history.replace('/');
          }}
        >
          Go home
        </LinkSpan>
      </p>
    </ContentTop>
  );
};

export default FileDownloadPage;
