import * as React from 'react';
import * as _ from 'lodash';
import { AxiosResponse } from 'axios';

import { collections } from '../api.utils';
import config from '../config';


interface IState {
    collNames: string[];
}

export default class Collections extends React.Component<{}, IState> {
    constructor (props: {}) {
        super(props);
        this.state = { collNames: [] };
    }

    public componentDidMount() {
        collections()
        .then((response: AxiosResponse<any>) => {
            const names = _.map(response.data._embedded,
                                (coll: { _id: string }) => coll._id);
            this.setState({ collNames: names });
        });
    }

    public render() {
        const lis = _.map(this.state.collNames,
                          (name: string, i: number) => <li key={i}>{name}</li>);
        return (
            <div>
                <h2>All collections from the "{config.dbName}" database:</h2>
                <ul>
                    {lis}
                </ul>
            </div>
        );
    }
}
