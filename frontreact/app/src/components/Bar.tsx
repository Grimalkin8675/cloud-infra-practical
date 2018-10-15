import * as React from 'react';


export interface IBar {
    name: string;
    address: string;
}

export default class Bar extends React.Component<IBar> {
    public render() {
        return (
            <tr>
                <td>{this.props.name}</td>
                <td>{this.props.address}</td>
            </tr>
        );
    }
}
