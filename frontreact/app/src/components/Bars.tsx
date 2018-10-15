import * as React from 'react';
import { AxiosResponse } from 'axios';
import * as _ from 'lodash';

import '../style/Bars.css';

import Bar, { IBar } from './Bar';
import { bars } from '../api.utils';


interface IState {
    bars: IBar[];
}

export default class Bars extends React.Component<{}, IState> {
    constructor (props: {}) {
        super(props);
        this.state = { bars: [] };
    }

    public componentDidMount() {
        bars()
        .then((response: AxiosResponse<any>) => {
            const res: IBar[] = _(response.data._embedded)
                .filter((elt: any) => (  _.has(elt, "properties.name")
                                      && _.has(elt, "properties.address")))
                .map((elt: any) => ({ name: elt.properties.name,
                                      address: elt.properties.address }))
                .value();
            this.setState({ bars: res });
        });
    }

    public render() {
        const res: JSX.Element[] =
            _.map(this.state.bars, (bar: IBar, i: number) =>
                <Bar key={i} name={bar.name} address={bar.address} />);
        return (
            <div className="Bars">
                <h2>A more detailed look at the "bar" collection:</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {res}
                    </tbody>
                </table>
            </div>
        );
    }
}
