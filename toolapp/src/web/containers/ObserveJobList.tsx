import React from 'react';
import { connect } from 'react-redux';
import { ReduxStoreState, ReduxStoreDispatch } from '../stores/stores';
import { updateJobListAsync } from '../stores/App/slices';

// ------------------------------------

type Props = {};

type State = {};

type StateProps = {
  // testcases: { path: string; title: string }[];
};

type DispatchProps = {
  updateJobList: () => void;
};

type CombinedProps = Props & StateProps & DispatchProps;

function mapStateToProps(state: ReduxStoreState): StateProps {
  return {
    // testcases: state.app.testcases,
  };
}

function mapDispatchToProps(dispatch: ReduxStoreDispatch): DispatchProps {
  return {
    updateJobList: () => {
      dispatch(updateJobListAsync());
    }
  };
}

// ------------------------------------

class ObserveJobList extends React.Component<CombinedProps, State> {

  private timer : number | null = null;
  constructor(props: CombinedProps) {
    super(props);
    this.state = {};
    // TODO: Update history if needed
  }

  componentDidMount(): void {
    // TODO: Websocket
    this.timer = window.setInterval(() => {
      this.props.updateJobList();
    }, 5000);
  }

  componentWillUnmount(): void {
    if (this.timer !== null) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  }

  render(): JSX.Element {
    return <></>;
  }
}

// ------------------------------------

export default connect<StateProps, DispatchProps, Props, ReduxStoreState>(
  mapStateToProps,
  mapDispatchToProps
)(ObserveJobList);
