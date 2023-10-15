import React from 'react';
import { connect } from 'react-redux';
import { ReduxStoreState, ReduxStoreDispatch } from '../stores/stores';
import { updateTaskListAsync } from '../stores/App/slices';

// ------------------------------------

type Props = {};

type State = {};

type StateProps = {
  jobs: { id: string, createdAt: Date }[];
  selectedJobId: string | null;
};

type DispatchProps = {
  selectJob: (jobId: string) => void;
};

type CombinedProps = Props & StateProps & DispatchProps;

function mapStateToProps(state: ReduxStoreState): StateProps {
  return {
    jobs: state.app.jobs.map((job) => ({ id: job.id, createdAt: new Date(job.createdAtISO) })),
    selectedJobId: state.app.selectedJobId,
  };
}

function mapDispatchToProps(dispatch: ReduxStoreDispatch): DispatchProps {
  return {
    selectJob: (jobId: string) => {
      dispatch(updateTaskListAsync({ jobId, changeJobId: true }));
    },
  };
}

// ------------------------------------

class JobList extends React.Component<CombinedProps, State> {
  constructor(props: CombinedProps) {
    super(props);
    this.state = {};
  }

  handleJobClick(jobId: string): void {
    this.props.selectJob(jobId);
  }

  render(): JSX.Element {
    // TODO: Locale???
    return (
      <ul className="menu bg-base-200 w-56 rounded-box">
        {this.props.jobs.map((job) => {
          return (
            <li key={job.id}>
              <a
                onClick={this.handleJobClick.bind(this, job.id)}
                className={this.props.selectedJobId === job.id ? 'active' : ''}
              >
                {job.id.substr(0, 6)} <br />{job.createdAt.toLocaleString('ja-JP')}
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
)(JobList);
