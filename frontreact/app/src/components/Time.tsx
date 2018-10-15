import * as React from 'react';


interface IState {
    date: Date;
}

export default class Time extends React.Component<{}, IState> {
    private timerID: NodeJS.Timeout;

    constructor (props: {}) {
        super(props);
        this.state = { date: new Date() };
    }

    public componentDidMount() {
        this.timerID = setInterval(() => this.tick(), 1000);
    }

    public componentWillUnmount() {
        clearInterval(this.timerID);
    }

    public render() {
        return <span>{this.state.date.toLocaleTimeString()}</span>;
    }

    private tick() {
        this.setState({ date: new Date() });
    }
}
