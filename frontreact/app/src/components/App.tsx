import * as React from 'react';

import Collections from './Collections';
import Bars from './Bars';


interface IProps {
    name: string;
}

export default class App extends React.Component<IProps> {
    public render() {
        return (
            <div>
                <h1>This is our (pretty) frontend</h1>
                <hr />
                <Collections />
                <hr />
                <Bars />
            </div>
        );
    }
}
