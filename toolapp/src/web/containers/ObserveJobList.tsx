import React from 'react';
import { connect } from 'react-redux';
import { ReduxStoreState, ReduxStoreDispatch } from '../stores/stores';
import { updateJobListAsync } from '../stores/App/slices';
import { IConnectionHandlerToClient } from '../../interface/Web';
import {
  subscribeWebSocketHandler,
  unsubscribeWebSocketHandler,
} from '../libs/WebsocketFactory';

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
    },
  };
}

// ------------------------------------

class ObserveJobList
  extends React.Component<CombinedProps, State>
  implements IConnectionHandlerToClient
{
  constructor(props: CombinedProps) {
    super(props);
    this.state = {};
    // TODO: Update history if needed
  }

  // IConnectionHandlerToClient
  onJobListUpdated(): void {
    this.props.updateJobList();
  }
  // IConnectionHandlerToClient
  onTaskListUpdated(jobId: string): void {
    // TODO: implement and rename ObserveJobList
  }

  componentDidMount(): void {
    subscribeWebSocketHandler(this);
  }

  componentWillUnmount(): void {
    unsubscribeWebSocketHandler(this);
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
