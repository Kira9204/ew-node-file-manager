import React from 'react';
import { FileStatInfo } from '../../../reducer';
import { generateDownloadURL } from '../../../service';
import { ContentTop, LinkSpan } from '../../../styles';
import { Link } from '../styles';
import { formatFileSize, formatMTime } from '../utils';

const FileDownloadPage: React.FC<{ file: FileStatInfo; history: any }> = ({
  file,
  history
}) => {
  const downloadURL = generateDownloadURL(history.location.pathname);

  return (
    <ContentTop>
      <h2>$D3FF file explorer</h2>
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
