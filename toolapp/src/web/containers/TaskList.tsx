import React from 'react';
import { connect } from 'react-redux';
import { ReduxStoreState, ReduxStoreDispatch } from '../stores/stores';
import { ITask } from '../../interface/Web';

// ------------------------------------

type Props = {};

type State = {};

type StateProps = {
  tasks: ITask[];
};

type DispatchProps = {};

type CombinedProps = Props & StateProps & DispatchProps;

function mapStateToProps(state: ReduxStoreState): StateProps {
  return {
    tasks: state.app.tasksOfSelectedJobs,
  };
}

function mapDispatchToProps(dispatch: ReduxStoreDispatch): DispatchProps {
  return {};
}

// ------------------------------------

class TaskList extends React.Component<CombinedProps, State> {
  constructor(props: CombinedProps) {
    super(props);
    this.state = {};
  }

  render(): JSX.Element {
    return (
      <ul className="menu bg-base-200 w-56 rounded-box">
        {this.props.tasks.map((task) => {
          return (
            <li key={task.id}>
              <a>
                {task.inputFilePath}: {task.score}
              </a>
            </li>
          );
        })}
      </ul>
    );
  }
}

// ------------------------------------

export default connect<StateProps, DispatchProps, Props, ReduxStoreState>(
  mapStateToProps,
  mapDispatchToProps
)(TaskList);
