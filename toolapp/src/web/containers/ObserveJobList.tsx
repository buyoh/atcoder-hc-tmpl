import React from 'react';
import { connect } from 'react-redux';
import { ReduxStoreState, ReduxStoreDispatch } from '../stores/stores';
import { updateJobListAsync, updateTaskListAsync } from '../stores/App/slices';
import { IConnectionHandlerToClient } from '../../interface/Web';
import {
  subscribeWebSocketHandler,
  unsubscribeWebSocketHandler,
} from '../libs/WebsocketFactory';

// ------------------------------------

type Props = {};

type State = {};

type StateProps = {
  selectedJobId: string | null;
};

type DispatchProps = {
  updateJobList: () => void;
  updateTasks: (jobId: string) => void;
};

type CombinedProps = Props & StateProps & DispatchProps;

function mapStateToProps(state: ReduxStoreState): StateProps {
  return {
    selectedJobId: state.app.selectedJobId,
  };
}

function mapDispatchToProps(dispatch: ReduxStoreDispatch): DispatchProps {
  return {
    updateJobList: () => {
      dispatch(updateJobListAsync());
    },
    updateTasks: (jobId: string) => {
      dispatch(updateTaskListAsync({jobId, changeJobId: false}));
    }
  };
}

// ------------------------------------

// TODO: Rename
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
    if (this.props.selectedJobId === jobId) {
      this.props.updateTasks(jobId);
    }
  }

  componentDidMount(): void {
    subscribeWebSocketHandler(this);
    // First load
    this.props.updateJobList();
    if (this.props.selectedJobId !== null) {
      this.props.updateTasks(this.props.selectedJobId);
    }
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
