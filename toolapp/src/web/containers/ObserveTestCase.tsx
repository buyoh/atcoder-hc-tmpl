import React from 'react';
import { connect } from 'react-redux';
import { ReduxStoreState, ReduxStoreDispatch } from '../stores/stores';
import { updateHistoryAsync } from '../stores/App/slices';

// ------------------------------------

type Props = {};

type State = {};

type StateProps = {
  // testcases: { path: string; title: string }[];
};

type DispatchProps = {
  updateHistory: () => void;
};

type CombinedProps = Props & StateProps & DispatchProps;

function mapStateToProps(state: ReduxStoreState): StateProps {
  return {
    // testcases: state.app.testcases,
  };
}

function mapDispatchToProps(dispatch: ReduxStoreDispatch): DispatchProps {
  return {
    updateHistory: () => {
      dispatch(updateHistoryAsync());
    },
  };
}

// ------------------------------------

class ObserverTestCase extends React.Component<CombinedProps, State> {
  constructor(props: CombinedProps) {
    super(props);
    this.state = {};
    // TODO: Update history if needed
  }

  componentDidMount(): void {
    // First load
    this.props.updateHistory();
  }

  render(): JSX.Element {
    return <></>;
  }
}

// ------------------------------------

export default connect<StateProps, DispatchProps, Props, ReduxStoreState>(
  mapStateToProps,
  mapDispatchToProps
)(ObserverTestCase);
