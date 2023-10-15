import React from 'react';
import { connect } from 'react-redux';
import { ReduxStoreState, ReduxStoreDispatch } from '../stores/stores';
import { updateTestCasesAsync } from '../stores/App/slices';

// ------------------------------------

type Props = {};

type State = {};

type StateProps = {
  testCaseGroups: { id: string }[];
};

type DispatchProps = {
  loadTestCaseGroups: () => void;
};

type CombinedProps = Props & StateProps & DispatchProps;

function mapStateToProps(state: ReduxStoreState): StateProps {
  return {
    testCaseGroups: state.app.testCaseGroups.map((testCaseGroup) => {
      return {
        id: testCaseGroup.id,
      };
    }),
  };
}

function mapDispatchToProps(dispatch: ReduxStoreDispatch): DispatchProps {
  return {
    loadTestCaseGroups: () => {
      dispatch(updateTestCasesAsync());
    },
  };
}

// ------------------------------------

class TestCaseGroupList extends React.Component<CombinedProps, State> {

  timer = -1;

  constructor(props: CombinedProps) {
    super(props);
    this.state = {};
  }

  componentDidMount(): void {
    this.props.loadTestCaseGroups();
    this.timer = window.setInterval(() => {
      this.props.loadTestCaseGroups();
    }, 2000);
  }

  componentWillUnmount(): void {
    if (this.timer !== -1) {
      window.clearInterval(this.timer);
      this.timer = -1;
    }
  }

  render(): JSX.Element {
    return (
      <ul className="menu bg-base-200 w-56 rounded-box">
        {this.props.testCaseGroups.map((testCaseGroup) => {
          return (
            <li key={testCaseGroup.id}>
              <a>{testCaseGroup.id}</a>
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
)(TestCaseGroupList);
