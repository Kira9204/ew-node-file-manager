import React from 'react';
import {VERSION} from "../constants";

const AuthorText: React.FC<{marginTop: string}> = ({marginTop}) => {
    return (
        <div style={{marginTop}}>
            By Erik Welander (erik.welander@hotmail.com)
            <br />
            Version: {VERSION}
        </div>
    )
};

export default AuthorText;